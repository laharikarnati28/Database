package com.vehicleservice.service;

import com.vehicleservice.dto.BookingDto;
import com.vehicleservice.dto.BookingRequest;
import com.vehicleservice.entity.*;
import com.vehicleservice.exception.BadRequestException;
import com.vehicleservice.exception.InvalidStatusTransitionException;
import com.vehicleservice.exception.ResourceNotFoundException;
import com.vehicleservice.exception.UnauthorizedException;
import com.vehicleservice.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Service
@Transactional(readOnly = true)
public class BookingService {

    private final BookingRepository bookingRepository;
    private final UserRepository userRepository;
    private final VehicleRepository vehicleRepository;
    private final ServiceRepository serviceRepository;
    private final TechnicianRepository technicianRepository;
    private final JobCardRepository jobCardRepository;

    public BookingService(BookingRepository bookingRepository,
                          UserRepository userRepository,
                          VehicleRepository vehicleRepository,
                          ServiceRepository serviceRepository,
                          TechnicianRepository technicianRepository,
                          JobCardRepository jobCardRepository) {
        this.bookingRepository = bookingRepository;
        this.userRepository = userRepository;
        this.vehicleRepository = vehicleRepository;
        this.serviceRepository = serviceRepository;
        this.technicianRepository = technicianRepository;
        this.jobCardRepository = jobCardRepository;
    }

    public List<BookingDto> getAllBookings() {
        return bookingRepository.findAllOrderByCreatedAtDesc().stream()
                .map(BookingDto::new)
                .toList();
    }

    public List<BookingDto> getBookingsByUserId(Long userId) {
        return bookingRepository.findByUser_UserIdOrderByBookingDateDescBookingTimeDesc(userId).stream()
                .map(BookingDto::new)
                .toList();
    }

    public BookingDto getBookingById(Long bookingId, Long currentUserId, boolean isAdmin, boolean isTech) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with ID: " + bookingId));

        if (!isAdmin && !isTech && !booking.getUser().getUserId().equals(currentUserId)) {
            throw new UnauthorizedException("You are not authorized to view this booking");
        }

        return new BookingDto(booking);
    }

    @Transactional
    public BookingDto createBooking(BookingRequest request, Long currentUserId, boolean isAdmin) {
        // Validate date
        if (request.getBookingDate().isBefore(LocalDate.now())) {
            throw new BadRequestException("Booking date cannot be in the past: " + request.getBookingDate());
        }

        // Validate vehicle
        Vehicle vehicle = vehicleRepository.findById(request.getVehicleId())
                .orElseThrow(() -> new ResourceNotFoundException("Vehicle not found with ID: " + request.getVehicleId()));

        Long customerId = (isAdmin && request.getUserId() != null) ? request.getUserId() : currentUserId;
        User customer = userRepository.findById(customerId)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found with ID: " + customerId));

        // Validate vehicle ownership
        if (!isAdmin && !vehicle.getUser().getUserId().equals(customer.getUserId())) {
            throw new UnauthorizedException("You cannot book a service for a vehicle that does not belong to you");
        }

        // Validate service
        VehicleService serviceItem = serviceRepository.findById(request.getServiceId())
                .orElseThrow(() -> new ResourceNotFoundException("Service item not found with ID: " + request.getServiceId()));

        if (serviceItem.getIsActive() != null && !serviceItem.getIsActive()) {
            throw new BadRequestException("Selected service is currently inactive");
        }

        // Backend determines canonical price strictly from database record
        BigDecimal authoritativePrice = serviceItem.getPrice();

        Booking booking = new Booking(
                customer,
                vehicle,
                serviceItem,
                request.getBookingDate(),
                request.getBookingTime(),
                request.getProblemDescription(),
                authoritativePrice
        );

        Booking saved = bookingRepository.save(booking);
        return new BookingDto(saved);
    }

    @Transactional
    public BookingDto updateStatus(Long bookingId, BookingStatus newStatus) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with ID: " + bookingId));

        BookingStatus current = booking.getStatus();
        if (!current.canTransitionTo(newStatus)) {
            throw new InvalidStatusTransitionException(
                    "Invalid status transition from " + current + " to " + newStatus
            );
        }

        booking.setStatus(newStatus);

        // If completed or cancelled, make technician available again
        if (newStatus == BookingStatus.COMPLETED || newStatus == BookingStatus.CANCELLED) {
            if (booking.getTechnician() != null) {
                Technician tech = booking.getTechnician();
                tech.setAvailable(true);
                technicianRepository.save(tech);
            }
        }

        Booking updated = bookingRepository.save(booking);
        return new BookingDto(updated);
    }

    @Transactional
    public BookingDto assignTechnician(Long bookingId, Long technicianId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with ID: " + bookingId));

        if (booking.getStatus() == BookingStatus.CANCELLED || booking.getStatus() == BookingStatus.COMPLETED) {
            throw new BadRequestException("Cannot assign technician to a " + booking.getStatus() + " booking");
        }

        Technician technician = technicianRepository.findById(technicianId)
                .orElseThrow(() -> new ResourceNotFoundException("Technician not found with ID: " + technicianId));

        if (technician.getAvailable() != null && !technician.getAvailable()) {
            throw new BadRequestException("Technician " + technician.getName() + " is currently marked as unavailable");
        }

        booking.setTechnician(technician);
        if (booking.getStatus() == BookingStatus.BOOKED) {
            booking.setStatus(BookingStatus.CONFIRMED);
        }

        // Create initial Job Card if one doesn't exist yet
        if (jobCardRepository.findByBooking_BookingId(bookingId).isEmpty()) {
            String jcNumber = "JC-" + LocalDate.now().getYear() + "-" + String.format("%04d", booking.getBookingId());
            JobCard jobCard = new JobCard(
                    jcNumber,
                    booking,
                    technician,
                    booking.getProblemDescription(),
                    "Assigned to " + technician.getName() + " (" + technician.getSpecialization() + ")",
                    "Initial inspection scheduled",
                    JobCardStatus.PENDING,
                    BigDecimal.valueOf(2.0)
            );
            jobCardRepository.save(jobCard);
        }

        Booking saved = bookingRepository.save(booking);
        return new BookingDto(saved);
    }

    @Transactional
    public BookingDto cancelBooking(Long bookingId, Long currentUserId, boolean isAdmin) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with ID: " + bookingId));

        if (!isAdmin && !booking.getUser().getUserId().equals(currentUserId)) {
            throw new UnauthorizedException("You are not authorized to cancel this booking");
        }

        if (booking.getStatus() == BookingStatus.COMPLETED) {
            throw new BadRequestException("Cannot cancel a completed service booking");
        }

        booking.setStatus(BookingStatus.CANCELLED);

        if (booking.getTechnician() != null) {
            Technician tech = booking.getTechnician();
            tech.setAvailable(true);
            technicianRepository.save(tech);
        }

        Booking saved = bookingRepository.save(booking);
        return new BookingDto(saved);
    }
}


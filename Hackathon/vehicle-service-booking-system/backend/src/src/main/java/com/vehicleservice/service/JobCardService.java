package com.vehicleservice.service;

import com.vehicleservice.dto.AddPartToJobCardRequest;
import com.vehicleservice.dto.JobCardDto;
import com.vehicleservice.dto.JobCardRequest;
import com.vehicleservice.entity.*;
import com.vehicleservice.exception.BadRequestException;
import com.vehicleservice.exception.InsufficientStockException;
import com.vehicleservice.exception.ResourceNotFoundException;
import com.vehicleservice.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Service
@Transactional(readOnly = true)
public class JobCardService {

    private final JobCardRepository jobCardRepository;
    private final BookingRepository bookingRepository;
    private final TechnicianRepository technicianRepository;
    private final SparePartRepository sparePartRepository;
    private final JobCardPartRepository jobCardPartRepository;

    public JobCardService(JobCardRepository jobCardRepository,
                          BookingRepository bookingRepository,
                          TechnicianRepository technicianRepository,
                          SparePartRepository sparePartRepository,
                          JobCardPartRepository jobCardPartRepository) {
        this.jobCardRepository = jobCardRepository;
        this.bookingRepository = bookingRepository;
        this.technicianRepository = technicianRepository;
        this.sparePartRepository = sparePartRepository;
        this.jobCardPartRepository = jobCardPartRepository;
    }

    public List<JobCardDto> getAllJobCards() {
        return jobCardRepository.findAll().stream()
                .map(JobCardDto::new)
                .toList();
    }

    public JobCardDto getJobCardById(Long jobCardId) {
        JobCard jc = jobCardRepository.findById(jobCardId)
                .orElseThrow(() -> new ResourceNotFoundException("Job card not found with ID: " + jobCardId));
        return new JobCardDto(jc);
    }

    public JobCardDto getJobCardByBookingId(Long bookingId) {
        JobCard jc = jobCardRepository.findByBooking_BookingId(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Job card not found for booking ID: " + bookingId));
        return new JobCardDto(jc);
    }

    @Transactional
    public JobCardDto createJobCard(JobCardRequest request) {
        Booking booking = bookingRepository.findById(request.getBookingId())
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with ID: " + request.getBookingId()));

        if (jobCardRepository.findByBooking_BookingId(request.getBookingId()).isPresent()) {
            throw new BadRequestException("A job card already exists for booking #" + request.getBookingId());
        }

        Technician technician = null;
        if (request.getTechnicianId() != null) {
            technician = technicianRepository.findById(request.getTechnicianId()).orElse(null);
        } else if (booking.getTechnician() != null) {
            technician = booking.getTechnician();
        }

        String jcNumber = "JC-" + LocalDate.now().getYear() + "-" + String.format("%04d", booking.getBookingId());
        JobCard jobCard = new JobCard(
                jcNumber,
                booking,
                technician,
                request.getProblemDescription() != null ? request.getProblemDescription() : booking.getProblemDescription(),
                request.getDiagnosis(),
                request.getWorkDone(),
                request.getStatus() != null ? request.getStatus() : JobCardStatus.PENDING,
                request.getEstimatedHours() != null ? request.getEstimatedHours() : BigDecimal.valueOf(2.0)
        );

        JobCard saved = jobCardRepository.save(jobCard);
        return new JobCardDto(saved);
    }

    @Transactional
    public JobCardDto updateJobCard(Long jobCardId, JobCardRequest request) {
        JobCard jobCard = jobCardRepository.findById(jobCardId)
                .orElseThrow(() -> new ResourceNotFoundException("Job card not found with ID: " + jobCardId));

        if (request.getTechnicianId() != null) {
            Technician tech = technicianRepository.findById(request.getTechnicianId())
                    .orElseThrow(() -> new ResourceNotFoundException("Technician not found with ID: " + request.getTechnicianId()));
            jobCard.setTechnician(tech);
        }
        if (request.getProblemDescription() != null) {
            jobCard.setProblemDescription(request.getProblemDescription());
        }
        if (request.getDiagnosis() != null) {
            jobCard.setDiagnosis(request.getDiagnosis());
        }
        if (request.getWorkDone() != null) {
            jobCard.setWorkDone(request.getWorkDone());
        }
        if (request.getStatus() != null) {
            jobCard.setStatus(request.getStatus());
            if (request.getStatus() == JobCardStatus.IN_PROGRESS && jobCard.getBooking().getStatus() == BookingStatus.CONFIRMED) {
                jobCard.getBooking().setStatus(BookingStatus.IN_PROGRESS);
                bookingRepository.save(jobCard.getBooking());
            }
        }
        if (request.getEstimatedHours() != null) {
            jobCard.setEstimatedHours(request.getEstimatedHours());
        }

        JobCard updated = jobCardRepository.save(jobCard);
        return new JobCardDto(updated);
    }

    @Transactional
    public JobCardDto addPartToJobCard(Long jobCardId, AddPartToJobCardRequest request) {
        JobCard jobCard = jobCardRepository.findById(jobCardId)
                .orElseThrow(() -> new ResourceNotFoundException("Job card not found with ID: " + jobCardId));

        SparePart part = sparePartRepository.findById(request.getPartId())
                .orElseThrow(() -> new ResourceNotFoundException("Spare part not found with ID: " + request.getPartId()));

        if (part.getQuantity() < request.getQuantity()) {
            throw new InsufficientStockException("Insufficient stock for " + part.getPartName() + ". Available: " + part.getQuantity() + ", requested: " + request.getQuantity());
        }

        // Deduct inventory
        part.setQuantity(part.getQuantity() - request.getQuantity());
        sparePartRepository.save(part);

        // Add part record to job card
        JobCardPart jcp = new JobCardPart(jobCard, part, request.getQuantity(), part.getPrice());
        jobCardPartRepository.save(jcp);
        jobCard.getParts().add(jcp);

        // Advance to IN_PROGRESS if confirmed
        if (jobCard.getStatus() == JobCardStatus.PENDING) {
            jobCard.setStatus(JobCardStatus.IN_PROGRESS);
            if (jobCard.getBooking().getStatus() == BookingStatus.CONFIRMED) {
                jobCard.getBooking().setStatus(BookingStatus.IN_PROGRESS);
                bookingRepository.save(jobCard.getBooking());
            }
        }

        JobCard saved = jobCardRepository.save(jobCard);
        return new JobCardDto(saved);
    }
}

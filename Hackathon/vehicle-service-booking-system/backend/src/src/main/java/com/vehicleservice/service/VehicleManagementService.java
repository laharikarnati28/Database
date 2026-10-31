package com.vehicleservice.service;

import com.vehicleservice.dto.VehicleDto;
import com.vehicleservice.dto.VehicleRequest;
import com.vehicleservice.entity.Role;
import com.vehicleservice.entity.User;
import com.vehicleservice.entity.Vehicle;
import com.vehicleservice.exception.BadRequestException;
import com.vehicleservice.exception.ResourceNotFoundException;
import com.vehicleservice.exception.UnauthorizedException;
import com.vehicleservice.repository.BookingRepository;
import com.vehicleservice.repository.UserRepository;
import com.vehicleservice.repository.VehicleRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional(readOnly = true)
public class VehicleManagementService {

    private final VehicleRepository vehicleRepository;
    private final UserRepository userRepository;
    private final BookingRepository bookingRepository;

    public VehicleManagementService(VehicleRepository vehicleRepository,
                                    UserRepository userRepository,
                                    BookingRepository bookingRepository) {
        this.vehicleRepository = vehicleRepository;
        this.userRepository = userRepository;
        this.bookingRepository = bookingRepository;
    }

    public List<VehicleDto> getAllVehicles() {
        return vehicleRepository.findAllWithUser().stream()
                .map(VehicleDto::new)
                .toList();
    }

    public List<VehicleDto> getVehiclesByUserId(Long userId) {
        return vehicleRepository.findByUser_UserId(userId).stream()
                .map(VehicleDto::new)
                .toList();
    }

    public VehicleDto getVehicleById(Long vehicleId, Long currentUserId, boolean isAdmin) {
        Vehicle vehicle = vehicleRepository.findById(vehicleId)
                .orElseThrow(() -> new ResourceNotFoundException("Vehicle not found with ID: " + vehicleId));

        if (!isAdmin && !vehicle.getUser().getUserId().equals(currentUserId)) {
            throw new UnauthorizedException("You are not authorized to view this vehicle");
        }

        return new VehicleDto(vehicle);
    }

    @Transactional
    public VehicleDto createVehicle(VehicleRequest request, Long currentUserId, boolean isAdmin) {
        if (vehicleRepository.existsByVehicleNumber(request.getVehicleNumber().trim().toUpperCase())) {
            throw new BadRequestException("A vehicle with registration number " + request.getVehicleNumber() + " already exists");
        }

        Long ownerId = (isAdmin && request.getUserId() != null) ? request.getUserId() : currentUserId;
        User owner = userRepository.findById(ownerId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + ownerId));

        Vehicle vehicle = new Vehicle(
                owner,
                request.getVehicleNumber().trim().toUpperCase(),
                request.getBrand().trim(),
                request.getModel().trim(),
                request.getVehicleType().trim().toUpperCase(),
                request.getYear(),
                request.getFuelType() != null ? request.getFuelType().trim().toUpperCase() : "PETROL"
        );

        Vehicle saved = vehicleRepository.save(vehicle);
        return new VehicleDto(saved);
    }

    @Transactional
    public VehicleDto updateVehicle(Long vehicleId, VehicleRequest request, Long currentUserId, boolean isAdmin) {
        Vehicle vehicle = vehicleRepository.findById(vehicleId)
                .orElseThrow(() -> new ResourceNotFoundException("Vehicle not found with ID: " + vehicleId));

        if (!isAdmin && !vehicle.getUser().getUserId().equals(currentUserId)) {
            throw new UnauthorizedException("You are not authorized to update this vehicle");
        }

        String normalizedNumber = request.getVehicleNumber().trim().toUpperCase();
        if (!vehicle.getVehicleNumber().equalsIgnoreCase(normalizedNumber) &&
                vehicleRepository.existsByVehicleNumber(normalizedNumber)) {
            throw new BadRequestException("Registration number " + normalizedNumber + " is already in use");
        }

        vehicle.setVehicleNumber(normalizedNumber);
        vehicle.setBrand(request.getBrand().trim());
        vehicle.setModel(request.getModel().trim());
        vehicle.setVehicleType(request.getVehicleType().trim().toUpperCase());
        vehicle.setYear(request.getYear());
        if (request.getFuelType() != null) {
            vehicle.setFuelType(request.getFuelType().trim().toUpperCase());
        }

        Vehicle updated = vehicleRepository.save(vehicle);
        return new VehicleDto(updated);
    }

    @Transactional
    public void deleteVehicle(Long vehicleId, Long currentUserId, boolean isAdmin) {
        Vehicle vehicle = vehicleRepository.findById(vehicleId)
                .orElseThrow(() -> new ResourceNotFoundException("Vehicle not found with ID: " + vehicleId));

        if (!isAdmin && !vehicle.getUser().getUserId().equals(currentUserId)) {
            throw new UnauthorizedException("You are not authorized to delete this vehicle");
        }

        // Check if dependent booking records exist
        boolean hasBookings = bookingRepository.findAll().stream()
                .anyMatch(b -> b.getVehicle().getVehicleId().equals(vehicleId));

        if (hasBookings) {
            throw new BadRequestException("Cannot delete vehicle because service history and booking records exist for this vehicle");
        }

        vehicleRepository.delete(vehicle);
    }
}


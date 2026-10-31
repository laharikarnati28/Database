package com.vehicleservice.service;

import com.vehicleservice.dto.ServiceDto;
import com.vehicleservice.dto.ServiceRequest;
import com.vehicleservice.entity.VehicleService;
import com.vehicleservice.exception.BadRequestException;
import com.vehicleservice.exception.ResourceNotFoundException;
import com.vehicleservice.repository.ServiceRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class CatalogService {

    private final ServiceRepository serviceRepository;

    public CatalogService(ServiceRepository serviceRepository) {
        this.serviceRepository = serviceRepository;
    }

    public List<ServiceDto> getAllActiveServices() {
        return serviceRepository.findByIsActiveTrue().stream()
                .map(ServiceDto::new)
                .toList();
    }

    public List<ServiceDto> getAllServices() {
        return serviceRepository.findAll().stream()
                .map(ServiceDto::new)
                .toList();
    }

    public ServiceDto getServiceById(Long serviceId) {
        VehicleService service = serviceRepository.findById(serviceId)
                .orElseThrow(() -> new ResourceNotFoundException("Service item not found with ID: " + serviceId));
        return new ServiceDto(service);
    }

    @Transactional
    public ServiceDto createService(ServiceRequest request) {
        if (serviceRepository.existsByServiceName(request.getServiceName().trim())) {
            throw new BadRequestException("A service named '" + request.getServiceName() + "' already exists");
        }

        VehicleService service = new VehicleService(
                request.getServiceName().trim(),
                request.getDescription(),
                request.getPrice(),
                request.getEstimatedTime(),
                request.getCategory() != null ? request.getCategory().trim() : "General",
                request.getIsActive() != null ? request.getIsActive() : true
        );

        VehicleService saved = serviceRepository.save(service);
        return new ServiceDto(saved);
    }

    @Transactional
    public ServiceDto updateService(Long serviceId, ServiceRequest request) {
        VehicleService service = serviceRepository.findById(serviceId)
                .orElseThrow(() -> new ResourceNotFoundException("Service item not found with ID: " + serviceId));

        service.setServiceName(request.getServiceName().trim());
        service.setDescription(request.getDescription());
        service.setPrice(request.getPrice());
        service.setEstimatedTime(request.getEstimatedTime());
        if (request.getCategory() != null) {
            service.setCategory(request.getCategory().trim());
        }
        if (request.getIsActive() != null) {
            service.setIsActive(request.getIsActive());
        }

        VehicleService updated = serviceRepository.save(service);
        return new ServiceDto(updated);
    }

    @Transactional
    public void deleteService(Long serviceId) {
        VehicleService service = serviceRepository.findById(serviceId)
                .orElseThrow(() -> new ResourceNotFoundException("Service item not found with ID: " + serviceId));
        // Soft delete to protect relational integrity of historical bookings
        service.setIsActive(false);
        serviceRepository.save(service);
    }
}


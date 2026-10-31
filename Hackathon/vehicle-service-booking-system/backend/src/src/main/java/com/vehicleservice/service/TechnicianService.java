package com.vehicleservice.service;

import com.vehicleservice.dto.TechnicianDto;
import com.vehicleservice.dto.TechnicianRequest;
import com.vehicleservice.entity.Technician;
import com.vehicleservice.entity.User;
import com.vehicleservice.exception.BadRequestException;
import com.vehicleservice.exception.ResourceNotFoundException;
import com.vehicleservice.repository.TechnicianRepository;
import com.vehicleservice.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class TechnicianService {

    private final TechnicianRepository technicianRepository;
    private final UserRepository userRepository;

    public TechnicianService(TechnicianRepository technicianRepository, UserRepository userRepository) {
        this.technicianRepository = technicianRepository;
        this.userRepository = userRepository;
    }

    public List<TechnicianDto> getAllTechnicians() {
        return technicianRepository.findAll().stream()
                .map(TechnicianDto::new)
                .toList();
    }

    public List<TechnicianDto> getAvailableTechnicians() {
        return technicianRepository.findByAvailableTrue().stream()
                .map(TechnicianDto::new)
                .toList();
    }

    public TechnicianDto getTechnicianById(Long technicianId) {
        Technician technician = technicianRepository.findById(technicianId)
                .orElseThrow(() -> new ResourceNotFoundException("Technician not found with ID: " + technicianId));
        return new TechnicianDto(technician);
    }

    @Transactional
    public TechnicianDto createTechnician(TechnicianRequest request) {
        if (request.getEmail() != null && !request.getEmail().isBlank() && technicianRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Technician with email " + request.getEmail() + " already exists");
        }

        User user = null;
        if (request.getUserId() != null) {
            user = userRepository.findById(request.getUserId()).orElse(null);
        }

        Technician technician = new Technician(
                user,
                request.getName().trim(),
                request.getEmail(),
                request.getPhone().trim(),
                request.getSpecialization().trim(),
                request.getAvailable() != null ? request.getAvailable() : true,
                request.getExperienceYears() != null ? request.getExperienceYears() : 3
        );

        Technician saved = technicianRepository.save(technician);
        return new TechnicianDto(saved);
    }

    @Transactional
    public TechnicianDto updateTechnician(Long technicianId, TechnicianRequest request) {
        Technician technician = technicianRepository.findById(technicianId)
                .orElseThrow(() -> new ResourceNotFoundException("Technician not found with ID: " + technicianId));

        technician.setName(request.getName().trim());
        technician.setPhone(request.getPhone().trim());
        technician.setSpecialization(request.getSpecialization().trim());
        if (request.getEmail() != null) {
            technician.setEmail(request.getEmail().trim());
        }
        if (request.getAvailable() != null) {
            technician.setAvailable(request.getAvailable());
        }
        if (request.getExperienceYears() != null) {
            technician.setExperienceYears(request.getExperienceYears());
        }

        Technician updated = technicianRepository.save(technician);
        return new TechnicianDto(updated);
    }

    @Transactional
    public TechnicianDto setAvailability(Long technicianId, boolean available) {
        Technician technician = technicianRepository.findById(technicianId)
                .orElseThrow(() -> new ResourceNotFoundException("Technician not found with ID: " + technicianId));
        technician.setAvailable(available);
        return new TechnicianDto(technicianRepository.save(technician));
    }
}


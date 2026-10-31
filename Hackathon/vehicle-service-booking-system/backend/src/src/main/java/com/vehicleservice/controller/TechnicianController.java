package com.vehicleservice.controller;

import com.vehicleservice.dto.ApiResponse;
import com.vehicleservice.dto.TechnicianDto;
import com.vehicleservice.dto.TechnicianRequest;
import com.vehicleservice.service.TechnicianService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/technicians")
@Tag(name = "Technicians", description = "Management and allocation of garage service technicians")
public class TechnicianController {

    private final TechnicianService technicianService;

    public TechnicianController(TechnicianService technicianService) {
        this.technicianService = technicianService;
    }

    @GetMapping
    @Operation(summary = "Get list of technicians (optional ?availableOnly=true filter)")
    public ResponseEntity<ApiResponse<List<TechnicianDto>>> getTechnicians(
            @RequestParam(required = false, defaultValue = "false") boolean availableOnly) {
        List<TechnicianDto> technicians = availableOnly ?
                technicianService.getAvailableTechnicians() : technicianService.getAllTechnicians();
        return ResponseEntity.ok(ApiResponse.ok(technicians));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get technician details by ID")
    public ResponseEntity<ApiResponse<TechnicianDto>> getTechnicianById(@PathVariable Long id) {
        TechnicianDto technician = technicianService.getTechnicianById(id);
        return ResponseEntity.ok(ApiResponse.ok(technician));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Register a new technician (Admin only)")
    public ResponseEntity<ApiResponse<TechnicianDto>> createTechnician(@Valid @RequestBody TechnicianRequest request) {
        TechnicianDto created = technicianService.createTechnician(request);
        return new ResponseEntity<>(ApiResponse.ok("Technician created successfully", created), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Update technician profile and specialization (Admin only)")
    public ResponseEntity<ApiResponse<TechnicianDto>> updateTechnician(
            @PathVariable Long id,
            @Valid @RequestBody TechnicianRequest request) {
        TechnicianDto updated = technicianService.updateTechnician(id, request);
        return ResponseEntity.ok(ApiResponse.ok("Technician updated successfully", updated));
    }

    @PutMapping("/{id}/availability")
    @PreAuthorize("hasAnyRole('ADMIN', 'TECHNICIAN')")
    @Operation(summary = "Toggle technician availability")
    public ResponseEntity<ApiResponse<TechnicianDto>> setAvailability(
            @PathVariable Long id,
            @RequestParam boolean available) {
        TechnicianDto updated = technicianService.setAvailability(id, available);
        return ResponseEntity.ok(ApiResponse.ok("Technician availability updated", updated));
    }
}


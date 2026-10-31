package com.vehicleservice.controller;

import com.vehicleservice.dto.ApiResponse;
import com.vehicleservice.dto.ServiceDto;
import com.vehicleservice.dto.ServiceRequest;
import com.vehicleservice.service.CatalogService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/services")
@Tag(name = "Services Catalog", description = "Service packages catalog and administration")
public class CatalogController {

    private final CatalogService catalogService;

    public CatalogController(CatalogService catalogService) {
        this.catalogService = catalogService;
    }

    @GetMapping
    @Operation(summary = "Get vehicle service catalog (Public)")
    public ResponseEntity<ApiResponse<List<ServiceDto>>> getServices(
            @RequestParam(required = false, defaultValue = "false") boolean all) {
        List<ServiceDto> services = all ? catalogService.getAllServices() : catalogService.getAllActiveServices();
        return ResponseEntity.ok(ApiResponse.ok(services));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get specific service package details by ID")
    public ResponseEntity<ApiResponse<ServiceDto>> getServiceById(@PathVariable Long id) {
        ServiceDto service = catalogService.getServiceById(id);
        return ResponseEntity.ok(ApiResponse.ok(service));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Add a new service package (Admin only)")
    public ResponseEntity<ApiResponse<ServiceDto>> createService(@Valid @RequestBody ServiceRequest request) {
        ServiceDto created = catalogService.createService(request);
        return new ResponseEntity<>(ApiResponse.ok("Service package created successfully", created), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Update an existing service package (Admin only)")
    public ResponseEntity<ApiResponse<ServiceDto>> updateService(
            @PathVariable Long id,
            @Valid @RequestBody ServiceRequest request) {
        ServiceDto updated = catalogService.updateService(id, request);
        return ResponseEntity.ok(ApiResponse.ok("Service package updated successfully", updated));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Deactivate/delete a service package (Admin only)")
    public ResponseEntity<ApiResponse<Void>> deleteService(@PathVariable Long id) {
        catalogService.deleteService(id);
        return ResponseEntity.ok(ApiResponse.ok("Service package deactivated successfully", null));
    }
}


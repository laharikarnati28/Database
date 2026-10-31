package com.vehicleservice.controller;

import com.vehicleservice.dto.ApiResponse;
import com.vehicleservice.dto.VehicleDto;
import com.vehicleservice.dto.VehicleRequest;
import com.vehicleservice.entity.Role;
import com.vehicleservice.entity.User;
import com.vehicleservice.service.VehicleManagementService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/vehicles")
@Tag(name = "Vehicles", description = "Endpoints for managing customer vehicles")
public class VehicleController {

    private final VehicleManagementService vehicleService;

    public VehicleController(VehicleManagementService vehicleService) {
        this.vehicleService = vehicleService;
    }

    @GetMapping
    @Operation(summary = "Get registered vehicles (Customer gets their own; Admin gets all or by userId)")
    public ResponseEntity<ApiResponse<List<VehicleDto>>> getVehicles(
            @RequestParam(required = false) Long userId,
            @AuthenticationPrincipal User currentUser) {

        boolean isAdmin = currentUser.getRole() == Role.ADMIN;
        List<VehicleDto> vehicles;

        if (isAdmin && userId == null) {
            vehicles = vehicleService.getAllVehicles();
        } else if (isAdmin && userId != null) {
            vehicles = vehicleService.getVehiclesByUserId(userId);
        } else {
            vehicles = vehicleService.getVehiclesByUserId(currentUser.getUserId());
        }

        return ResponseEntity.ok(ApiResponse.ok(vehicles));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get vehicle details by ID")
    public ResponseEntity<ApiResponse<VehicleDto>> getVehicleById(
            @PathVariable Long id,
            @AuthenticationPrincipal User currentUser) {

        boolean isAdmin = currentUser.getRole() == Role.ADMIN;
        VehicleDto vehicle = vehicleService.getVehicleById(id, currentUser.getUserId(), isAdmin);
        return ResponseEntity.ok(ApiResponse.ok(vehicle));
    }

    @PostMapping
    @Operation(summary = "Register a new vehicle")
    public ResponseEntity<ApiResponse<VehicleDto>> createVehicle(
            @Valid @RequestBody VehicleRequest request,
            @AuthenticationPrincipal User currentUser) {

        boolean isAdmin = currentUser.getRole() == Role.ADMIN;
        VehicleDto created = vehicleService.createVehicle(request, currentUser.getUserId(), isAdmin);
        return new ResponseEntity<>(ApiResponse.ok("Vehicle registered successfully", created), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update vehicle details")
    public ResponseEntity<ApiResponse<VehicleDto>> updateVehicle(
            @PathVariable Long id,
            @Valid @RequestBody VehicleRequest request,
            @AuthenticationPrincipal User currentUser) {

        boolean isAdmin = currentUser.getRole() == Role.ADMIN;
        VehicleDto updated = vehicleService.updateVehicle(id, request, currentUser.getUserId(), isAdmin);
        return ResponseEntity.ok(ApiResponse.ok("Vehicle updated successfully", updated));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete vehicle if no dependent booking records exist")
    public ResponseEntity<ApiResponse<Void>> deleteVehicle(
            @PathVariable Long id,
            @AuthenticationPrincipal User currentUser) {

        boolean isAdmin = currentUser.getRole() == Role.ADMIN;
        vehicleService.deleteVehicle(id, currentUser.getUserId(), isAdmin);
        return ResponseEntity.ok(ApiResponse.ok("Vehicle removed successfully", null));
    }
}


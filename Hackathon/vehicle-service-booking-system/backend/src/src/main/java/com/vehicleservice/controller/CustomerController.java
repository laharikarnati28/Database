package com.vehicleservice.controller;

import com.vehicleservice.dto.ApiResponse;
import com.vehicleservice.dto.UserProfileDto;
import com.vehicleservice.entity.Role;
import com.vehicleservice.entity.User;
import com.vehicleservice.exception.UnauthorizedException;
import com.vehicleservice.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/customers")
@Tag(name = "Customers", description = "Management endpoints for customer profiles")
public class CustomerController {

    private final UserService userService;

    public CustomerController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Get list of all registered customers (Admin only)")
    public ResponseEntity<ApiResponse<List<UserProfileDto>>> getAllCustomers() {
        List<UserProfileDto> customers = userService.getAllCustomers();
        return ResponseEntity.ok(ApiResponse.ok(customers));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get customer details by ID")
    public ResponseEntity<ApiResponse<UserProfileDto>> getCustomerById(@PathVariable Long id,
                                                                       @AuthenticationPrincipal User currentUser) {
        boolean isAdmin = currentUser.getRole() == Role.ADMIN;
        if (!isAdmin && !currentUser.getUserId().equals(id)) {
            throw new UnauthorizedException("Access denied to view other customer records");
        }
        UserProfileDto customer = userService.getUserById(id);
        return ResponseEntity.ok(ApiResponse.ok(customer));
    }
}


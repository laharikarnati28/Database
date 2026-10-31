package com.vehicleservice.controller;

import com.vehicleservice.dto.ApiResponse;
import com.vehicleservice.dto.AssignTechnicianRequest;
import com.vehicleservice.dto.BookingDto;
import com.vehicleservice.dto.BookingRequest;
import com.vehicleservice.dto.UpdateStatusRequest;
import com.vehicleservice.entity.Role;
import com.vehicleservice.entity.User;
import com.vehicleservice.service.BookingService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bookings")
@Tag(name = "Bookings", description = "Service booking lifecycle, scheduling, technician assignment and tracking")
public class BookingController {

    private final BookingService bookingService;

    public BookingController(BookingService bookingService) {
        this.bookingService = bookingService;
    }

    @GetMapping
    @Operation(summary = "Get bookings (Admin gets all; Customer gets their own)")
    public ResponseEntity<ApiResponse<List<BookingDto>>> getBookings(
            @RequestParam(required = false) Long userId,
            @AuthenticationPrincipal User currentUser) {

        boolean isAdmin = currentUser.getRole() == Role.ADMIN;
        List<BookingDto> bookings;

        if (isAdmin && userId == null) {
            bookings = bookingService.getAllBookings();
        } else if (isAdmin && userId != null) {
            bookings = bookingService.getBookingsByUserId(userId);
        } else {
            bookings = bookingService.getBookingsByUserId(currentUser.getUserId());
        }

        return ResponseEntity.ok(ApiResponse.ok(bookings));
    }

    @GetMapping("/my")
    @Operation(summary = "Get current authenticated customer's bookings")
    public ResponseEntity<ApiResponse<List<BookingDto>>> getMyBookings(@AuthenticationPrincipal User currentUser) {
        List<BookingDto> bookings = bookingService.getBookingsByUserId(currentUser.getUserId());
        return ResponseEntity.ok(ApiResponse.ok(bookings));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get booking details by ID")
    public ResponseEntity<ApiResponse<BookingDto>> getBookingById(
            @PathVariable Long id,
            @AuthenticationPrincipal User currentUser) {

        boolean isAdmin = currentUser.getRole() == Role.ADMIN;
        boolean isTech = currentUser.getRole() == Role.TECHNICIAN;
        BookingDto booking = bookingService.getBookingById(id, currentUser.getUserId(), isAdmin, isTech);
        return ResponseEntity.ok(ApiResponse.ok(booking));
    }

    @PostMapping
    @Operation(summary = "Create a new service booking")
    public ResponseEntity<ApiResponse<BookingDto>> createBooking(
            @Valid @RequestBody BookingRequest request,
            @AuthenticationPrincipal User currentUser) {

        boolean isAdmin = currentUser.getRole() == Role.ADMIN;
        BookingDto created = bookingService.createBooking(request, currentUser.getUserId(), isAdmin);
        return new ResponseEntity<>(ApiResponse.ok("Service booking created successfully", created), HttpStatus.CREATED);
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('ADMIN', 'TECHNICIAN')")
    @Operation(summary = "Update booking status with lifecycle validation")
    public ResponseEntity<ApiResponse<BookingDto>> updateStatus(
            @PathVariable Long id,
            @Valid @RequestBody UpdateStatusRequest request) {

        BookingDto updated = bookingService.updateStatus(id, request.getStatus());
        return ResponseEntity.ok(ApiResponse.ok("Booking status updated to " + request.getStatus(), updated));
    }

    @PostMapping("/{id}/assign-technician")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Assign technician to a booking and confirm appointment (Admin only)")
    public ResponseEntity<ApiResponse<BookingDto>> assignTechnician(
            @PathVariable Long id,
            @Valid @RequestBody AssignTechnicianRequest request) {

        BookingDto updated = bookingService.assignTechnician(id, request.getTechnicianId());
        return ResponseEntity.ok(ApiResponse.ok("Technician assigned and booking confirmed", updated));
    }

    @PatchMapping("/{id}/cancel")
    @Operation(summary = "Cancel a booking")
    public ResponseEntity<ApiResponse<BookingDto>> cancelBooking(
            @PathVariable Long id,
            @AuthenticationPrincipal User currentUser) {

        boolean isAdmin = currentUser.getRole() == Role.ADMIN;
        BookingDto cancelled = bookingService.cancelBooking(id, currentUser.getUserId(), isAdmin);
        return ResponseEntity.ok(ApiResponse.ok("Booking cancelled successfully", cancelled));
    }
}


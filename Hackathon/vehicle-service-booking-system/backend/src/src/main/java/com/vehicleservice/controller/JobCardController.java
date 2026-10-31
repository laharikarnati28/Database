package com.vehicleservice.controller;

import com.vehicleservice.dto.AddPartToJobCardRequest;
import com.vehicleservice.dto.ApiResponse;
import com.vehicleservice.dto.JobCardDto;
import com.vehicleservice.dto.JobCardRequest;
import com.vehicleservice.service.JobCardService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/job-cards")
@Tag(name = "Job Cards", description = "Workshop job cards, diagnostics, labor notes, and parts consumption")
public class JobCardController {

    private final JobCardService jobCardService;

    public JobCardController(JobCardService jobCardService) {
        this.jobCardService = jobCardService;
    }

    @GetMapping
    @Operation(summary = "Get list of all job cards")
    public ResponseEntity<ApiResponse<List<JobCardDto>>> getAllJobCards() {
        List<JobCardDto> cards = jobCardService.getAllJobCards();
        return ResponseEntity.ok(ApiResponse.ok(cards));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get job card details by ID")
    public ResponseEntity<ApiResponse<JobCardDto>> getJobCardById(@PathVariable Long id) {
        JobCardDto card = jobCardService.getJobCardById(id);
        return ResponseEntity.ok(ApiResponse.ok(card));
    }

    @GetMapping("/booking/{bookingId}")
    @Operation(summary = "Get job card for a specific booking ID")
    public ResponseEntity<ApiResponse<JobCardDto>> getJobCardByBookingId(@PathVariable Long bookingId) {
        JobCardDto card = jobCardService.getJobCardByBookingId(bookingId);
        return ResponseEntity.ok(ApiResponse.ok(card));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'TECHNICIAN')")
    @Operation(summary = "Create a new job card for an active booking")
    public ResponseEntity<ApiResponse<JobCardDto>> createJobCard(@Valid @RequestBody JobCardRequest request) {
        JobCardDto created = jobCardService.createJobCard(request);
        return new ResponseEntity<>(ApiResponse.ok("Job card created successfully", created), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'TECHNICIAN')")
    @Operation(summary = "Update job card diagnostics, work performed, or status")
    public ResponseEntity<ApiResponse<JobCardDto>> updateJobCard(
            @PathVariable Long id,
            @Valid @RequestBody JobCardRequest request) {
        JobCardDto updated = jobCardService.updateJobCard(id, request);
        return ResponseEntity.ok(ApiResponse.ok("Job card updated successfully", updated));
    }

    @PostMapping("/{id}/parts")
    @PreAuthorize("hasAnyRole('ADMIN', 'TECHNICIAN')")
    @Operation(summary = "Add spare parts used to job card (automatically checks & deducts inventory)")
    public ResponseEntity<ApiResponse<JobCardDto>> addPartToJobCard(
            @PathVariable Long id,
            @Valid @RequestBody AddPartToJobCardRequest request) {
        JobCardDto updated = jobCardService.addPartToJobCard(id, request);
        return ResponseEntity.ok(ApiResponse.ok("Spare part logged to job card and stock deducted", updated));
    }
}


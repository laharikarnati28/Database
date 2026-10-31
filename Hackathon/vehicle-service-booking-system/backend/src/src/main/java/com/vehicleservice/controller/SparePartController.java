package com.vehicleservice.controller;

import com.vehicleservice.dto.ApiResponse;
import com.vehicleservice.dto.SparePartDto;
import com.vehicleservice.dto.SparePartRequest;
import com.vehicleservice.service.SparePartService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/spare-parts")
@Tag(name = "Spare Parts Inventory", description = "Management of inventory items, SKU catalog, and stock adjustments")
public class SparePartController {

    private final SparePartService sparePartService;

    public SparePartController(SparePartService sparePartService) {
        this.sparePartService = sparePartService;
    }

    @GetMapping
    @Operation(summary = "Get list of all spare parts in inventory")
    public ResponseEntity<ApiResponse<List<SparePartDto>>> getAllParts() {
        List<SparePartDto> parts = sparePartService.getAllParts();
        return ResponseEntity.ok(ApiResponse.ok(parts));
    }

    @GetMapping("/low-stock")
    @Operation(summary = "Get list of spare parts with low stock alerts")
    public ResponseEntity<ApiResponse<List<SparePartDto>>> getLowStockParts() {
        List<SparePartDto> lowParts = sparePartService.getLowStockParts();
        return ResponseEntity.ok(ApiResponse.ok(lowParts));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get spare part details by ID")
    public ResponseEntity<ApiResponse<SparePartDto>> getPartById(@PathVariable Long id) {
        SparePartDto part = sparePartService.getPartById(id);
        return ResponseEntity.ok(ApiResponse.ok(part));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'TECHNICIAN')")
    @Operation(summary = "Add a new spare part to inventory")
    public ResponseEntity<ApiResponse<SparePartDto>> createPart(@Valid @RequestBody SparePartRequest request) {
        SparePartDto created = sparePartService.createPart(request);
        return new ResponseEntity<>(ApiResponse.ok("Spare part added to inventory", created), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'TECHNICIAN')")
    @Operation(summary = "Update spare part details")
    public ResponseEntity<ApiResponse<SparePartDto>> updatePart(
            @PathVariable Long id,
            @Valid @RequestBody SparePartRequest request) {
        SparePartDto updated = sparePartService.updatePart(id, request);
        return ResponseEntity.ok(ApiResponse.ok("Spare part updated successfully", updated));
    }

    @PatchMapping("/{id}/stock")
    @PreAuthorize("hasAnyRole('ADMIN', 'TECHNICIAN')")
    @Operation(summary = "Adjust inventory stock quantity by delta (positive or negative)")
    public ResponseEntity<ApiResponse<SparePartDto>> adjustStock(
            @PathVariable Long id,
            @RequestParam int delta) {
        SparePartDto updated = sparePartService.adjustStock(id, delta);
        return ResponseEntity.ok(ApiResponse.ok("Stock quantity adjusted", updated));
    }
}


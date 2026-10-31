package com.vehicleservice.controller;

import com.vehicleservice.dto.ApiResponse;
import com.vehicleservice.dto.CreateInvoiceRequest;
import com.vehicleservice.dto.InvoiceDto;
import com.vehicleservice.service.InvoiceService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/invoices")
@Tag(name = "Invoices", description = "Billing, invoice generation, tax calculation, and payment status tracking")
public class InvoiceController {

    private final InvoiceService invoiceService;

    public InvoiceController(InvoiceService invoiceService) {
        this.invoiceService = invoiceService;
    }

    @GetMapping
    @Operation(summary = "Get list of all invoices")
    public ResponseEntity<ApiResponse<List<InvoiceDto>>> getAllInvoices() {
        List<InvoiceDto> invoices = invoiceService.getAllInvoices();
        return ResponseEntity.ok(ApiResponse.ok(invoices));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get invoice details by ID")
    public ResponseEntity<ApiResponse<InvoiceDto>> getInvoiceById(@PathVariable Long id) {
        InvoiceDto invoice = invoiceService.getInvoiceById(id);
        return ResponseEntity.ok(ApiResponse.ok(invoice));
    }

    @GetMapping("/booking/{bookingId}")
    @Operation(summary = "Get invoice for specific booking ID")
    public ResponseEntity<ApiResponse<InvoiceDto>> getInvoiceByBookingId(@PathVariable Long bookingId) {
        InvoiceDto invoice = invoiceService.getInvoiceByBookingId(bookingId);
        return ResponseEntity.ok(ApiResponse.ok(invoice));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Generate a new invoice for a completed/in-progress booking (Admin only)")
    public ResponseEntity<ApiResponse<InvoiceDto>> generateInvoice(@Valid @RequestBody CreateInvoiceRequest request) {
        InvoiceDto invoice = invoiceService.generateInvoice(request);
        return new ResponseEntity<>(ApiResponse.ok("Invoice generated successfully", invoice), HttpStatus.CREATED);
    }

    @PutMapping("/{id}/pay")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Mark invoice as paid by administrator")
    public ResponseEntity<ApiResponse<InvoiceDto>> markAsPaid(@PathVariable Long id) {
        InvoiceDto invoice = invoiceService.markAsPaid(id);
        return ResponseEntity.ok(ApiResponse.ok("Invoice marked as PAID", invoice));
    }
}


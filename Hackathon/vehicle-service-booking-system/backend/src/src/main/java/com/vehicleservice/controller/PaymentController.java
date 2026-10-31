package com.vehicleservice.controller;

import com.vehicleservice.dto.ApiResponse;
import com.vehicleservice.dto.PaymentDto;
import com.vehicleservice.dto.PaymentRequest;
import com.vehicleservice.service.PaymentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/payments")
@Tag(name = "Payments", description = "Payment recording, verification, and settlement against invoices")
public class PaymentController {

    private final PaymentService paymentService;

    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    @PostMapping
    @Operation(summary = "Record a verified payment transaction against an invoice")
    public ResponseEntity<ApiResponse<PaymentDto>> recordPayment(@Valid @RequestBody PaymentRequest request) {
        PaymentDto payment = paymentService.recordPayment(request);
        return new ResponseEntity<>(ApiResponse.ok("Payment recorded successfully", payment), HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get payment transaction details by ID")
    public ResponseEntity<ApiResponse<PaymentDto>> getPaymentById(@PathVariable Long id) {
        PaymentDto payment = paymentService.getPaymentById(id);
        return ResponseEntity.ok(ApiResponse.ok(payment));
    }

    @GetMapping("/invoice/{invoiceId}")
    @Operation(summary = "Get list of payments recorded for an invoice")
    public ResponseEntity<ApiResponse<List<PaymentDto>>> getPaymentsByInvoiceId(@PathVariable Long invoiceId) {
        List<PaymentDto> payments = paymentService.getPaymentsByInvoiceId(invoiceId);
        return ResponseEntity.ok(ApiResponse.ok(payments));
    }
}


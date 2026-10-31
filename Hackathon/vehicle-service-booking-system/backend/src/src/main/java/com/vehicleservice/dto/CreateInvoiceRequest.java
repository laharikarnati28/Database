package com.vehicleservice.dto;

import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;

public class CreateInvoiceRequest {

    @NotNull(message = "Booking ID is required")
    private Long bookingId;

    private BigDecimal taxPercentage = BigDecimal.valueOf(18.0); // 18% GST standard

    public CreateInvoiceRequest() {}

    public CreateInvoiceRequest(Long bookingId, BigDecimal taxPercentage) {
        this.bookingId = bookingId;
        this.taxPercentage = taxPercentage != null ? taxPercentage : BigDecimal.valueOf(18.0);
    }

    public Long getBookingId() {
        return bookingId;
    }

    public void setBookingId(Long bookingId) {
        this.bookingId = bookingId;
    }

    public BigDecimal getTaxPercentage() {
        return taxPercentage;
    }

    public void setTaxPercentage(BigDecimal taxPercentage) {
        this.taxPercentage = taxPercentage;
    }
}


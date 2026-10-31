package com.vehicleservice.dto;

import com.vehicleservice.entity.BookingStatus;
import jakarta.validation.constraints.NotNull;

public class UpdateStatusRequest {

    @NotNull(message = "New status is required")
    private BookingStatus status;

    public UpdateStatusRequest() {}

    public UpdateStatusRequest(BookingStatus status) {
        this.status = status;
    }

    public BookingStatus getStatus() {
        return status;
    }

    public void setStatus(BookingStatus status) {
        this.status = status;
    }
}


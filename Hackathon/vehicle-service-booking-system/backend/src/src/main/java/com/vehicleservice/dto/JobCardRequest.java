package com.vehicleservice.dto;

import com.vehicleservice.entity.JobCardStatus;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;

public class JobCardRequest {

    @NotNull(message = "Booking ID is required")
    private Long bookingId;

    private Long technicianId;

    private String problemDescription;

    private String diagnosis;

    private String workDone;

    private JobCardStatus status = JobCardStatus.PENDING;

    private BigDecimal estimatedHours;

    public JobCardRequest() {}

    public Long getBookingId() {
        return bookingId;
    }

    public void setBookingId(Long bookingId) {
        this.bookingId = bookingId;
    }

    public Long getTechnicianId() {
        return technicianId;
    }

    public void setTechnicianId(Long technicianId) {
        this.technicianId = technicianId;
    }

    public String getProblemDescription() {
        return problemDescription;
    }

    public void setProblemDescription(String problemDescription) {
        this.problemDescription = problemDescription;
    }

    public String getDiagnosis() {
        return diagnosis;
    }

    public void setDiagnosis(String diagnosis) {
        this.diagnosis = diagnosis;
    }

    public String getWorkDone() {
        return workDone;
    }

    public void setWorkDone(String workDone) {
        this.workDone = workDone;
    }

    public JobCardStatus getStatus() {
        return status;
    }

    public void setStatus(JobCardStatus status) {
        this.status = status;
    }

    public BigDecimal getEstimatedHours() {
        return estimatedHours;
    }

    public void setEstimatedHours(BigDecimal estimatedHours) {
        this.estimatedHours = estimatedHours;
    }
}


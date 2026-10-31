package com.vehicleservice.dto;

import com.vehicleservice.entity.JobCard;
import com.vehicleservice.entity.JobCardStatus;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

public class JobCardDto {
    private Long jobCardId;
    private String jobCardNumber;
    private Long bookingId;
    private Long vehicleId;
    private String vehicleNumber;
    private String vehicleBrand;
    private String vehicleModel;
    private String customerName;
    private Long technicianId;
    private String technicianName;
    private String problemDescription;
    private String diagnosis;
    private String workDone;
    private JobCardStatus status;
    private BigDecimal estimatedHours;
    private List<JobCardPartDto> parts = new ArrayList<>();
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public JobCardDto() {}

    public JobCardDto(JobCard jc) {
        this.jobCardId = jc.getJobCardId();
        this.jobCardNumber = jc.getJobCardNumber();
        if (jc.getBooking() != null) {
            this.bookingId = jc.getBooking().getBookingId();
            if (jc.getBooking().getVehicle() != null) {
                this.vehicleId = jc.getBooking().getVehicle().getVehicleId();
                this.vehicleNumber = jc.getBooking().getVehicle().getVehicleNumber();
                this.vehicleBrand = jc.getBooking().getVehicle().getBrand();
                this.vehicleModel = jc.getBooking().getVehicle().getModel();
            }
            if (jc.getBooking().getUser() != null) {
                this.customerName = jc.getBooking().getUser().getName();
            }
        }
        if (jc.getTechnician() != null) {
            this.technicianId = jc.getTechnician().getTechnicianId();
            this.technicianName = jc.getTechnician().getName();
        }
        this.problemDescription = jc.getProblemDescription();
        this.diagnosis = jc.getDiagnosis();
        this.workDone = jc.getWorkDone();
        this.status = jc.getStatus();
        this.estimatedHours = jc.getEstimatedHours();
        this.createdAt = jc.getCreatedAt();
        this.updatedAt = jc.getUpdatedAt();
        if (jc.getParts() != null) {
            this.parts = jc.getParts().stream().map(JobCardPartDto::new).toList();
        }
    }

    public Long getJobCardId() {
        return jobCardId;
    }

    public void setJobCardId(Long jobCardId) {
        this.jobCardId = jobCardId;
    }

    public String getJobCardNumber() {
        return jobCardNumber;
    }

    public void setJobCardNumber(String jobCardNumber) {
        this.jobCardNumber = jobCardNumber;
    }

    public Long getBookingId() {
        return bookingId;
    }

    public void setBookingId(Long bookingId) {
        this.bookingId = bookingId;
    }

    public Long getVehicleId() {
        return vehicleId;
    }

    public void setVehicleId(Long vehicleId) {
        this.vehicleId = vehicleId;
    }

    public String getVehicleNumber() {
        return vehicleNumber;
    }

    public void setVehicleNumber(String vehicleNumber) {
        this.vehicleNumber = vehicleNumber;
    }

    public String getVehicleBrand() {
        return vehicleBrand;
    }

    public void setVehicleBrand(String vehicleBrand) {
        this.vehicleBrand = vehicleBrand;
    }

    public String getVehicleModel() {
        return vehicleModel;
    }

    public void setVehicleModel(String vehicleModel) {
        this.vehicleModel = vehicleModel;
    }

    public String getCustomerName() {
        return customerName;
    }

    public void setCustomerName(String customerName) {
        this.customerName = customerName;
    }

    public Long getTechnicianId() {
        return technicianId;
    }

    public void setTechnicianId(Long technicianId) {
        this.technicianId = technicianId;
    }

    public String getTechnicianName() {
        return technicianName;
    }

    public void setTechnicianName(String technicianName) {
        this.technicianName = technicianName;
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

    public List<JobCardPartDto> getParts() {
        return parts;
    }

    public void setParts(List<JobCardPartDto> parts) {
        this.parts = parts;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}


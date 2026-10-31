package com.vehicleservice.dto;

import com.vehicleservice.entity.Booking;
import com.vehicleservice.entity.BookingStatus;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

public class BookingDto {
    private Long bookingId;
    private Long userId;
    private String customerName;
    private String customerEmail;
    private String customerPhone;
    private Long vehicleId;
    private String vehicleNumber;
    private String vehicleBrand;
    private String vehicleModel;
    private Long serviceId;
    private String serviceName;
    private Long technicianId;
    private String technicianName;
    private LocalDate bookingDate;
    private LocalTime bookingTime;
    private BookingStatus status;
    private String problemDescription;
    private BigDecimal totalAmount;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public BookingDto() {}

    public BookingDto(Booking b) {
        this.bookingId = b.getBookingId();
        if (b.getUser() != null) {
            this.userId = b.getUser().getUserId();
            this.customerName = b.getUser().getName();
            this.customerEmail = b.getUser().getEmail();
            this.customerPhone = b.getUser().getPhone();
        }
        if (b.getVehicle() != null) {
            this.vehicleId = b.getVehicle().getVehicleId();
            this.vehicleNumber = b.getVehicle().getVehicleNumber();
            this.vehicleBrand = b.getVehicle().getBrand();
            this.vehicleModel = b.getVehicle().getModel();
        }
        if (b.getService() != null) {
            this.serviceId = b.getService().getServiceId();
            this.serviceName = b.getService().getServiceName();
        }
        if (b.getTechnician() != null) {
            this.technicianId = b.getTechnician().getTechnicianId();
            this.technicianName = b.getTechnician().getName();
        }
        this.bookingDate = b.getBookingDate();
        this.bookingTime = b.getBookingTime();
        this.status = b.getStatus();
        this.problemDescription = b.getProblemDescription();
        this.totalAmount = b.getTotalAmount();
        this.createdAt = b.getCreatedAt();
        this.updatedAt = b.getUpdatedAt();
    }

    public Long getBookingId() {
        return bookingId;
    }

    public void setBookingId(Long bookingId) {
        this.bookingId = bookingId;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getCustomerName() {
        return customerName;
    }

    public void setCustomerName(String customerName) {
        this.customerName = customerName;
    }

    public String getCustomerEmail() {
        return customerEmail;
    }

    public void setCustomerEmail(String customerEmail) {
        this.customerEmail = customerEmail;
    }

    public String getCustomerPhone() {
        return customerPhone;
    }

    public void setCustomerPhone(String customerPhone) {
        this.customerPhone = customerPhone;
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

    public Long getServiceId() {
        return serviceId;
    }

    public void setServiceId(Long serviceId) {
        this.serviceId = serviceId;
    }

    public String getServiceName() {
        return serviceName;
    }

    public void setServiceName(String serviceName) {
        this.serviceName = serviceName;
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

    public LocalDate getBookingDate() {
        return bookingDate;
    }

    public void setBookingDate(LocalDate bookingDate) {
        this.bookingDate = bookingDate;
    }

    public LocalTime getBookingTime() {
        return bookingTime;
    }

    public void setBookingTime(LocalTime bookingTime) {
        this.bookingTime = bookingTime;
    }

    public BookingStatus getStatus() {
        return status;
    }

    public void setStatus(BookingStatus status) {
        this.status = status;
    }

    public String getProblemDescription() {
        return problemDescription;
    }

    public void setProblemDescription(String problemDescription) {
        this.problemDescription = problemDescription;
    }

    public BigDecimal getTotalAmount() {
        return totalAmount;
    }

    public void setTotalAmount(BigDecimal totalAmount) {
        this.totalAmount = totalAmount;
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


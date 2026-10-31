package com.vehicleservice.dto;

import com.vehicleservice.entity.Vehicle;

import java.time.LocalDateTime;

public class VehicleDto {
    private Long vehicleId;
    private Long userId;
    private String ownerName;
    private String vehicleNumber;
    private String brand;
    private String model;
    private String vehicleType;
    private Integer year;
    private String fuelType;
    private LocalDateTime createdAt;

    public VehicleDto() {}

    public VehicleDto(Vehicle vehicle) {
        this.vehicleId = vehicle.getVehicleId();
        if (vehicle.getUser() != null) {
            try {
                this.userId = vehicle.getUser().getUserId();
                this.ownerName = vehicle.getUser().getName();
            } catch (Exception e) {
                this.userId = null;
                this.ownerName = null;
            }
        }
        this.vehicleNumber = vehicle.getVehicleNumber();
        this.brand = vehicle.getBrand();
        this.model = vehicle.getModel();
        this.vehicleType = vehicle.getVehicleType();
        this.year = vehicle.getYear();
        this.fuelType = vehicle.getFuelType();
        this.createdAt = vehicle.getCreatedAt();
    }

    public Long getVehicleId() {
        return vehicleId;
    }

    public void setVehicleId(Long vehicleId) {
        this.vehicleId = vehicleId;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getOwnerName() {
        return ownerName;
    }

    public void setOwnerName(String ownerName) {
        this.ownerName = ownerName;
    }

    public String getVehicleNumber() {
        return vehicleNumber;
    }

    public void setVehicleNumber(String vehicleNumber) {
        this.vehicleNumber = vehicleNumber;
    }

    public String getBrand() {
        return brand;
    }

    public void setBrand(String brand) {
        this.brand = brand;
    }

    public String getModel() {
        return model;
    }

    public void setModel(String model) {
        this.model = model;
    }

    public String getVehicleType() {
        return vehicleType;
    }

    public void setVehicleType(String vehicleType) {
        this.vehicleType = vehicleType;
    }

    public Integer getYear() {
        return year;
    }

    public void setYear(Integer year) {
        this.year = year;
    }

    public String getFuelType() {
        return fuelType;
    }

    public void setFuelType(String fuelType) {
        this.fuelType = fuelType;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}


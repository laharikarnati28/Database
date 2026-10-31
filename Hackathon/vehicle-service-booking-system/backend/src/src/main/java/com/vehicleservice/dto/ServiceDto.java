package com.vehicleservice.dto;

import com.vehicleservice.entity.VehicleService;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class ServiceDto {
    private Long serviceId;
    private String serviceName;
    private String description;
    private BigDecimal price;
    private Integer estimatedTime;
    private String category;
    private Boolean isActive;
    private LocalDateTime createdAt;

    public ServiceDto() {}

    public ServiceDto(VehicleService s) {
        this.serviceId = s.getServiceId();
        this.serviceName = s.getServiceName();
        this.description = s.getDescription();
        this.price = s.getPrice();
        this.estimatedTime = s.getEstimatedTime();
        this.category = s.getCategory();
        this.isActive = s.getIsActive();
        this.createdAt = s.getCreatedAt();
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

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }

    public Integer getEstimatedTime() {
        return estimatedTime;
    }

    public void setEstimatedTime(Integer estimatedTime) {
        this.estimatedTime = estimatedTime;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public Boolean getIsActive() {
        return isActive;
    }

    public void setIsActive(Boolean isActive) {
        this.isActive = isActive;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}


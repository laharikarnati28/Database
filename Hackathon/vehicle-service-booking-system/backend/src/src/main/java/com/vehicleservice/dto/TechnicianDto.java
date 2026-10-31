package com.vehicleservice.dto;

import com.vehicleservice.entity.Technician;

import java.time.LocalDateTime;

public class TechnicianDto {
    private Long technicianId;
    private Long userId;
    private String name;
    private String email;
    private String phone;
    private String specialization;
    private Boolean available;
    private Integer experienceYears;
    private LocalDateTime createdAt;

    public TechnicianDto() {}

    public TechnicianDto(Technician t) {
        this.technicianId = t.getTechnicianId();
        if (t.getUser() != null) {
            this.userId = t.getUser().getUserId();
        }
        this.name = t.getName();
        this.email = t.getEmail();
        this.phone = t.getPhone();
        this.specialization = t.getSpecialization();
        this.available = t.getAvailable();
        this.experienceYears = t.getExperienceYears();
        this.createdAt = t.getCreatedAt();
    }

    public Long getTechnicianId() {
        return technicianId;
    }

    public void setTechnicianId(Long technicianId) {
        this.technicianId = technicianId;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getSpecialization() {
        return specialization;
    }

    public void setSpecialization(String specialization) {
        this.specialization = specialization;
    }

    public Boolean getAvailable() {
        return available;
    }

    public void setAvailable(Boolean available) {
        this.available = available;
    }

    public Integer getExperienceYears() {
        return experienceYears;
    }

    public void setExperienceYears(Integer experienceYears) {
        this.experienceYears = experienceYears;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}


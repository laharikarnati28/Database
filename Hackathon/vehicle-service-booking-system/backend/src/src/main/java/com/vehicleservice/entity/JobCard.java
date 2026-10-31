package com.vehicleservice.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "job_cards")
public class JobCard {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "job_card_id")
    private Long jobCardId;

    @Column(name = "job_card_number", nullable = false, unique = true, length = 50)
    private String jobCardNumber;

    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "booking_id", nullable = false, unique = true)
    private Booking booking;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "technician_id")
    private Technician technician;

    @Column(name = "problem_description", columnDefinition = "TEXT")
    private String problemDescription;

    @Column(name = "diagnosis", columnDefinition = "TEXT")
    private String diagnosis;

    @Column(name = "work_done", columnDefinition = "TEXT")
    private String workDone;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", length = 30)
    private JobCardStatus status = JobCardStatus.PENDING;

    @Column(name = "estimated_hours", precision = 4, scale = 1)
    private BigDecimal estimatedHours = BigDecimal.valueOf(2.0);

    @OneToMany(mappedBy = "jobCard", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<JobCardPart> parts = new ArrayList<>();

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at")
    private LocalDateTime updatedAt = LocalDateTime.now();

    public JobCard() {}

    public JobCard(String jobCardNumber, Booking booking, Technician technician, String problemDescription, String diagnosis, String workDone, JobCardStatus status, BigDecimal estimatedHours) {
        this.jobCardNumber = jobCardNumber;
        this.booking = booking;
        this.technician = technician;
        this.problemDescription = problemDescription;
        this.diagnosis = diagnosis;
        this.workDone = workDone;
        this.status = status != null ? status : JobCardStatus.PENDING;
        this.estimatedHours = estimatedHours != null ? estimatedHours : BigDecimal.valueOf(2.0);
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    public void onUpdate() {
        this.updatedAt = LocalDateTime.now();
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

    public Booking getBooking() {
        return booking;
    }

    public void setBooking(Booking booking) {
        this.booking = booking;
    }

    public Technician getTechnician() {
        return technician;
    }

    public void setTechnician(Technician technician) {
        this.technician = technician;
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

    public List<JobCardPart> getParts() {
        return parts;
    }

    public void setParts(List<JobCardPart> parts) {
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


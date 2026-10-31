package com.vehicleservice.repository;

import com.vehicleservice.entity.JobCard;
import com.vehicleservice.entity.JobCardStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface JobCardRepository extends JpaRepository<JobCard, Long> {
    Optional<JobCard> findByBooking_BookingId(Long bookingId);
    Optional<JobCard> findByJobCardNumber(String jobCardNumber);
    List<JobCard> findByTechnician_TechnicianId(Long technicianId);
    List<JobCard> findByStatus(JobCardStatus status);
    boolean existsByJobCardNumber(String jobCardNumber);
}


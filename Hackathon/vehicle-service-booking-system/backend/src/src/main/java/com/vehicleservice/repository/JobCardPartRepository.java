package com.vehicleservice.repository;

import com.vehicleservice.entity.JobCardPart;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface JobCardPartRepository extends JpaRepository<JobCardPart, Long> {
    List<JobCardPart> findByJobCard_JobCardId(Long jobCardId);
}


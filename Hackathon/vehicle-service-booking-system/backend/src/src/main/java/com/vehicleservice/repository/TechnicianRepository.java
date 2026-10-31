package com.vehicleservice.repository;

import com.vehicleservice.entity.Technician;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TechnicianRepository extends JpaRepository<Technician, Long> {
    List<Technician> findByAvailableTrue();
    Optional<Technician> findByUser_UserId(Long userId);
    Optional<Technician> findByEmail(String email);
    boolean existsByEmail(String email);
}


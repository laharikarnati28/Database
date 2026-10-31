package com.vehicleservice.repository;

import com.vehicleservice.entity.VehicleService;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ServiceRepository extends JpaRepository<VehicleService, Long> {
    List<VehicleService> findByIsActiveTrue();
    boolean existsByServiceName(String serviceName);
}


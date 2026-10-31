package com.vehicleservice.repository;

import com.vehicleservice.entity.Vehicle;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface VehicleRepository extends JpaRepository<Vehicle, Long> {

    @Query("SELECT v FROM Vehicle v JOIN FETCH v.user WHERE v.user.userId = :userId")
    List<Vehicle> findByUser_UserId(@Param("userId") Long userId);

    @Query("SELECT v FROM Vehicle v JOIN FETCH v.user")
    List<Vehicle> findAllWithUser();

    Optional<Vehicle> findByVehicleNumber(String vehicleNumber);
    boolean existsByVehicleNumber(String vehicleNumber);
}


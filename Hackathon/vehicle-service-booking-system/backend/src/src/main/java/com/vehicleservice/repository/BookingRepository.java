package com.vehicleservice.repository;

import com.vehicleservice.entity.Booking;
import com.vehicleservice.entity.BookingStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {

    @Query("SELECT b FROM Booking b LEFT JOIN FETCH b.user LEFT JOIN FETCH b.vehicle LEFT JOIN FETCH b.service LEFT JOIN FETCH b.technician WHERE b.user.userId = :userId ORDER BY b.bookingDate DESC, b.bookingTime DESC")
    List<Booking> findByUser_UserIdOrderByBookingDateDescBookingTimeDesc(@org.springframework.data.repository.query.Param("userId") Long userId);

    @Query("SELECT b FROM Booking b LEFT JOIN FETCH b.user LEFT JOIN FETCH b.vehicle LEFT JOIN FETCH b.service LEFT JOIN FETCH b.technician WHERE b.technician.technicianId = :technicianId")
    List<Booking> findByTechnician_TechnicianId(@org.springframework.data.repository.query.Param("technicianId") Long technicianId);

    List<Booking> findByStatus(BookingStatus status);
    long countByStatus(BookingStatus status);
    boolean existsByVehicle_VehicleIdAndStatusIn(Long vehicleId, List<BookingStatus> activeStatuses);

    @Query("SELECT b FROM Booking b LEFT JOIN FETCH b.user LEFT JOIN FETCH b.vehicle LEFT JOIN FETCH b.service LEFT JOIN FETCH b.technician ORDER BY b.createdAt DESC")
    List<Booking> findAllOrderByCreatedAtDesc();
}


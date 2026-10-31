package com.vehicleservice.repository;

import com.vehicleservice.entity.SparePart;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SparePartRepository extends JpaRepository<SparePart, Long> {
    Optional<SparePart> findByPartNumber(String partNumber);
    boolean existsByPartNumber(String partNumber);
    List<SparePart> findByQuantityLessThanEqual(Integer minStockLevel);
}


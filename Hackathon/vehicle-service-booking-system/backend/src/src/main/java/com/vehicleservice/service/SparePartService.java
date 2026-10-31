package com.vehicleservice.service;

import com.vehicleservice.dto.SparePartDto;
import com.vehicleservice.dto.SparePartRequest;
import com.vehicleservice.entity.SparePart;
import com.vehicleservice.exception.BadRequestException;
import com.vehicleservice.exception.InsufficientStockException;
import com.vehicleservice.exception.ResourceNotFoundException;
import com.vehicleservice.repository.SparePartRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class SparePartService {

    private final SparePartRepository sparePartRepository;

    public SparePartService(SparePartRepository sparePartRepository) {
        this.sparePartRepository = sparePartRepository;
    }

    public List<SparePartDto> getAllParts() {
        return sparePartRepository.findAll().stream()
                .map(SparePartDto::new)
                .toList();
    }

    public List<SparePartDto> getLowStockParts() {
        return sparePartRepository.findAll().stream()
                .filter(p -> p.getQuantity() != null && p.getMinStockLevel() != null && p.getQuantity() <= p.getMinStockLevel())
                .map(SparePartDto::new)
                .toList();
    }

    public SparePartDto getPartById(Long partId) {
        SparePart part = sparePartRepository.findById(partId)
                .orElseThrow(() -> new ResourceNotFoundException("Spare part not found with ID: " + partId));
        return new SparePartDto(part);
    }

    @Transactional
    public SparePartDto createPart(SparePartRequest request) {
        String sku = request.getPartNumber().trim().toUpperCase();
        if (sparePartRepository.existsByPartNumber(sku)) {
            throw new BadRequestException("Spare part with SKU/Part number " + sku + " already exists");
        }

        SparePart part = new SparePart(
                request.getPartName().trim(),
                sku,
                request.getQuantity(),
                request.getPrice(),
                request.getCategory() != null ? request.getCategory().trim() : "Mechanical",
                request.getMinStockLevel() != null ? request.getMinStockLevel() : 5
        );

        SparePart saved = sparePartRepository.save(part);
        return new SparePartDto(saved);
    }

    @Transactional
    public SparePartDto updatePart(Long partId, SparePartRequest request) {
        SparePart part = sparePartRepository.findById(partId)
                .orElseThrow(() -> new ResourceNotFoundException("Spare part not found with ID: " + partId));

        String sku = request.getPartNumber().trim().toUpperCase();
        if (!part.getPartNumber().equalsIgnoreCase(sku) && sparePartRepository.existsByPartNumber(sku)) {
            throw new BadRequestException("Part number " + sku + " is already in use");
        }

        part.setPartName(request.getPartName().trim());
        part.setPartNumber(sku);
        part.setQuantity(request.getQuantity());
        part.setPrice(request.getPrice());
        if (request.getCategory() != null) {
            part.setCategory(request.getCategory().trim());
        }
        if (request.getMinStockLevel() != null) {
            part.setMinStockLevel(request.getMinStockLevel());
        }

        SparePart updated = sparePartRepository.save(part);
        return new SparePartDto(updated);
    }

    @Transactional
    public SparePartDto adjustStock(Long partId, int quantityDelta) {
        SparePart part = sparePartRepository.findById(partId)
                .orElseThrow(() -> new ResourceNotFoundException("Spare part not found with ID: " + partId));

        int newQty = part.getQuantity() + quantityDelta;
        if (newQty < 0) {
            throw new InsufficientStockException("Insufficient stock for part: " + part.getPartName() + ". Current stock: " + part.getQuantity() + ", requested delta: " + quantityDelta);
        }

        part.setQuantity(newQty);
        return new SparePartDto(sparePartRepository.save(part));
    }
}


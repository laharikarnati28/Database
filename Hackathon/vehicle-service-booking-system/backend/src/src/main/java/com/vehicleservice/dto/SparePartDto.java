package com.vehicleservice.dto;

import com.vehicleservice.entity.SparePart;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class SparePartDto {
    private Long partId;
    private String partName;
    private String partNumber;
    private Integer quantity;
    private BigDecimal price;
    private String category;
    private Integer minStockLevel;
    private boolean lowStock;
    private LocalDateTime createdAt;

    public SparePartDto() {}

    public SparePartDto(SparePart p) {
        this.partId = p.getPartId();
        this.partName = p.getPartName();
        this.partNumber = p.getPartNumber();
        this.quantity = p.getQuantity();
        this.price = p.getPrice();
        this.category = p.getCategory();
        this.minStockLevel = p.getMinStockLevel();
        this.lowStock = p.getQuantity() != null && p.getMinStockLevel() != null && p.getQuantity() <= p.getMinStockLevel();
        this.createdAt = p.getCreatedAt();
    }

    public Long getPartId() {
        return partId;
    }

    public void setPartId(Long partId) {
        this.partId = partId;
    }

    public String getPartName() {
        return partName;
    }

    public void setPartName(String partName) {
        this.partName = partName;
    }

    public String getPartNumber() {
        return partNumber;
    }

    public void setPartNumber(String partNumber) {
        this.partNumber = partNumber;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public Integer getMinStockLevel() {
        return minStockLevel;
    }

    public void setMinStockLevel(Integer minStockLevel) {
        this.minStockLevel = minStockLevel;
    }

    public boolean isLowStock() {
        return lowStock;
    }

    public void setLowStock(boolean lowStock) {
        this.lowStock = lowStock;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}


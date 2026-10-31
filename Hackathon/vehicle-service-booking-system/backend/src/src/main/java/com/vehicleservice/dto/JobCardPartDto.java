package com.vehicleservice.dto;

import com.vehicleservice.entity.JobCardPart;

import java.math.BigDecimal;

public class JobCardPartDto {
    private Long id;
    private Long partId;
    private String partName;
    private String partNumber;
    private Integer quantity;
    private BigDecimal unitPrice;
    private BigDecimal totalPrice;

    public JobCardPartDto() {}

    public JobCardPartDto(JobCardPart p) {
        this.id = p.getId();
        if (p.getSparePart() != null) {
            this.partId = p.getSparePart().getPartId();
            this.partName = p.getSparePart().getPartName();
            this.partNumber = p.getSparePart().getPartNumber();
        }
        this.quantity = p.getQuantity();
        this.unitPrice = p.getUnitPrice();
        this.totalPrice = p.getTotalPrice();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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

    public BigDecimal getUnitPrice() {
        return unitPrice;
    }

    public void setUnitPrice(BigDecimal unitPrice) {
        this.unitPrice = unitPrice;
    }

    public BigDecimal getTotalPrice() {
        return totalPrice;
    }

    public void setTotalPrice(BigDecimal totalPrice) {
        this.totalPrice = totalPrice;
    }
}


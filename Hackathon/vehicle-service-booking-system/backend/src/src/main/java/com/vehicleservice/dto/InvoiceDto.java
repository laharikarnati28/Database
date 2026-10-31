package com.vehicleservice.dto;

import com.vehicleservice.entity.Invoice;
import com.vehicleservice.entity.PaymentStatus;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

public class InvoiceDto {
    private Long invoiceId;
    private String invoiceNumber;
    private Long bookingId;
    private String customerName;
    private String customerEmail;
    private String customerPhone;
    private String vehicleNumber;
    private String vehicleBrand;
    private String vehicleModel;
    private String serviceName;
    private BigDecimal serviceAmount;
    private BigDecimal partsAmount;
    private BigDecimal taxAmount;
    private BigDecimal totalAmount;
    private PaymentStatus paymentStatus;
    private LocalDate invoiceDate;
    private LocalDateTime createdAt;

    public InvoiceDto() {}

    public InvoiceDto(Invoice inv) {
        this.invoiceId = inv.getInvoiceId();
        this.invoiceNumber = inv.getInvoiceNumber();
        if (inv.getBooking() != null) {
            this.bookingId = inv.getBooking().getBookingId();
            if (inv.getBooking().getUser() != null) {
                this.customerName = inv.getBooking().getUser().getName();
                this.customerEmail = inv.getBooking().getUser().getEmail();
                this.customerPhone = inv.getBooking().getUser().getPhone();
            }
            if (inv.getBooking().getVehicle() != null) {
                this.vehicleNumber = inv.getBooking().getVehicle().getVehicleNumber();
                this.vehicleBrand = inv.getBooking().getVehicle().getBrand();
                this.vehicleModel = inv.getBooking().getVehicle().getModel();
            }
            if (inv.getBooking().getService() != null) {
                this.serviceName = inv.getBooking().getService().getServiceName();
            }
        }
        this.serviceAmount = inv.getServiceAmount();
        this.partsAmount = inv.getPartsAmount();
        this.taxAmount = inv.getTaxAmount();
        this.totalAmount = inv.getTotalAmount();
        this.paymentStatus = inv.getPaymentStatus();
        this.invoiceDate = inv.getInvoiceDate();
        this.createdAt = inv.getCreatedAt();
    }

    public Long getInvoiceId() {
        return invoiceId;
    }

    public void setInvoiceId(Long invoiceId) {
        this.invoiceId = invoiceId;
    }

    public String getInvoiceNumber() {
        return invoiceNumber;
    }

    public void setInvoiceNumber(String invoiceNumber) {
        this.invoiceNumber = invoiceNumber;
    }

    public Long getBookingId() {
        return bookingId;
    }

    public void setBookingId(Long bookingId) {
        this.bookingId = bookingId;
    }

    public String getCustomerName() {
        return customerName;
    }

    public void setCustomerName(String customerName) {
        this.customerName = customerName;
    }

    public String getCustomerEmail() {
        return customerEmail;
    }

    public void setCustomerEmail(String customerEmail) {
        this.customerEmail = customerEmail;
    }

    public String getCustomerPhone() {
        return customerPhone;
    }

    public void setCustomerPhone(String customerPhone) {
        this.customerPhone = customerPhone;
    }

    public String getVehicleNumber() {
        return vehicleNumber;
    }

    public void setVehicleNumber(String vehicleNumber) {
        this.vehicleNumber = vehicleNumber;
    }

    public String getVehicleBrand() {
        return vehicleBrand;
    }

    public void setVehicleBrand(String vehicleBrand) {
        this.vehicleBrand = vehicleBrand;
    }

    public String getVehicleModel() {
        return vehicleModel;
    }

    public void setVehicleModel(String vehicleModel) {
        this.vehicleModel = vehicleModel;
    }

    public String getServiceName() {
        return serviceName;
    }

    public void setServiceName(String serviceName) {
        this.serviceName = serviceName;
    }

    public BigDecimal getServiceAmount() {
        return serviceAmount;
    }

    public void setServiceAmount(BigDecimal serviceAmount) {
        this.serviceAmount = serviceAmount;
    }

    public BigDecimal getPartsAmount() {
        return partsAmount;
    }

    public void setPartsAmount(BigDecimal partsAmount) {
        this.partsAmount = partsAmount;
    }

    public BigDecimal getTaxAmount() {
        return taxAmount;
    }

    public void setTaxAmount(BigDecimal taxAmount) {
        this.taxAmount = taxAmount;
    }

    public BigDecimal getTotalAmount() {
        return totalAmount;
    }

    public void setTotalAmount(BigDecimal totalAmount) {
        this.totalAmount = totalAmount;
    }

    public PaymentStatus getPaymentStatus() {
        return paymentStatus;
    }

    public void setPaymentStatus(PaymentStatus paymentStatus) {
        this.paymentStatus = paymentStatus;
    }

    public LocalDate getInvoiceDate() {
        return invoiceDate;
    }

    public void setInvoiceDate(LocalDate invoiceDate) {
        this.invoiceDate = invoiceDate;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}


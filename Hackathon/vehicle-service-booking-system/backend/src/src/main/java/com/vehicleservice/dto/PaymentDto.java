package com.vehicleservice.dto;

import com.vehicleservice.entity.Payment;
import com.vehicleservice.entity.PaymentMethod;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class PaymentDto {
    private Long paymentId;
    private Long invoiceId;
    private String invoiceNumber;
    private BigDecimal amount;
    private PaymentMethod paymentMethod;
    private String transactionReference;
    private String paymentStatus;
    private LocalDateTime paymentDate;

    public PaymentDto() {}

    public PaymentDto(Payment p) {
        this.paymentId = p.getPaymentId();
        if (p.getInvoice() != null) {
            this.invoiceId = p.getInvoice().getInvoiceId();
            this.invoiceNumber = p.getInvoice().getInvoiceNumber();
        }
        this.amount = p.getAmount();
        this.paymentMethod = p.getPaymentMethod();
        this.transactionReference = p.getTransactionReference();
        this.paymentStatus = p.getPaymentStatus();
        this.paymentDate = p.getPaymentDate();
    }

    public Long getPaymentId() {
        return paymentId;
    }

    public void setPaymentId(Long paymentId) {
        this.paymentId = paymentId;
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

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }

    public PaymentMethod getPaymentMethod() {
        return paymentMethod;
    }

    public void setPaymentMethod(PaymentMethod paymentMethod) {
        this.paymentMethod = paymentMethod;
    }

    public String getTransactionReference() {
        return transactionReference;
    }

    public void setTransactionReference(String transactionReference) {
        this.transactionReference = transactionReference;
    }

    public String getPaymentStatus() {
        return paymentStatus;
    }

    public void setPaymentStatus(String paymentStatus) {
        this.paymentStatus = paymentStatus;
    }

    public LocalDateTime getPaymentDate() {
        return paymentDate;
    }

    public void setPaymentDate(LocalDateTime paymentDate) {
        this.paymentDate = paymentDate;
    }
}


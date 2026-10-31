package com.vehicleservice.repository;

import com.vehicleservice.entity.Invoice;
import com.vehicleservice.entity.PaymentStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Repository
public interface InvoiceRepository extends JpaRepository<Invoice, Long> {
    Optional<Invoice> findByBooking_BookingId(Long bookingId);
    Optional<Invoice> findByInvoiceNumber(String invoiceNumber);
    List<Invoice> findByPaymentStatus(PaymentStatus paymentStatus);
    boolean existsByInvoiceNumber(String invoiceNumber);

    @Query("SELECT COALESCE(SUM(i.totalAmount), 0) FROM Invoice i WHERE i.paymentStatus = 'PAID'")
    BigDecimal calculateTotalPaidRevenue();
}


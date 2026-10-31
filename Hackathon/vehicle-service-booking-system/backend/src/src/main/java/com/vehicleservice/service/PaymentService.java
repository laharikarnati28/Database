package com.vehicleservice.service;

import com.vehicleservice.dto.PaymentDto;
import com.vehicleservice.dto.PaymentRequest;
import com.vehicleservice.entity.*;
import com.vehicleservice.exception.BadRequestException;
import com.vehicleservice.exception.ResourceNotFoundException;
import com.vehicleservice.repository.BookingRepository;
import com.vehicleservice.repository.InvoiceRepository;
import com.vehicleservice.repository.PaymentRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final InvoiceRepository invoiceRepository;
    private final BookingRepository bookingRepository;

    public PaymentService(PaymentRepository paymentRepository,
                          InvoiceRepository invoiceRepository,
                          BookingRepository bookingRepository) {
        this.paymentRepository = paymentRepository;
        this.invoiceRepository = invoiceRepository;
        this.bookingRepository = bookingRepository;
    }

    @Transactional
    public PaymentDto recordPayment(PaymentRequest request) {
        Invoice invoice = invoiceRepository.findById(request.getInvoiceId())
                .orElseThrow(() -> new ResourceNotFoundException("Invoice not found with ID: " + request.getInvoiceId()));

        if (invoice.getPaymentStatus() == PaymentStatus.PAID) {
            throw new BadRequestException("Invoice #" + invoice.getInvoiceNumber() + " is already marked as PAID");
        }

        String txnRef = request.getTransactionReference();
        if (txnRef == null || txnRef.isBlank()) {
            txnRef = "TXN-" + System.currentTimeMillis() + "-" + UUID.randomUUID().toString().substring(0, 6).toUpperCase();
        }

        Payment payment = new Payment(
                invoice,
                request.getAmount(),
                request.getPaymentMethod(),
                txnRef,
                "SUCCESS"
        );

        Payment saved = paymentRepository.save(payment);

        // Update invoice payment status to PAID
        invoice.setPaymentStatus(PaymentStatus.PAID);
        invoiceRepository.save(invoice);

        // Advance booking to COMPLETED
        Booking booking = invoice.getBooking();
        if (booking.getStatus() != BookingStatus.COMPLETED) {
            booking.setStatus(BookingStatus.COMPLETED);
            bookingRepository.save(booking);
        }

        return new PaymentDto(saved);
    }

    public PaymentDto getPaymentById(Long paymentId) {
        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new ResourceNotFoundException("Payment record not found with ID: " + paymentId));
        return new PaymentDto(payment);
    }

    public List<PaymentDto> getPaymentsByInvoiceId(Long invoiceId) {
        return paymentRepository.findByInvoice_InvoiceId(invoiceId).stream()
                .map(PaymentDto::new)
                .toList();
    }
}


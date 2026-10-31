package com.vehicleservice.service;

import com.vehicleservice.dto.CreateInvoiceRequest;
import com.vehicleservice.dto.InvoiceDto;
import com.vehicleservice.entity.*;
import com.vehicleservice.exception.BadRequestException;
import com.vehicleservice.exception.ResourceNotFoundException;
import com.vehicleservice.repository.BookingRepository;
import com.vehicleservice.repository.InvoiceRepository;
import com.vehicleservice.repository.JobCardPartRepository;
import com.vehicleservice.repository.JobCardRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
@Transactional(readOnly = true)
public class InvoiceService {

    private final InvoiceRepository invoiceRepository;
    private final BookingRepository bookingRepository;
    private final JobCardRepository jobCardRepository;
    private final JobCardPartRepository jobCardPartRepository;

    public InvoiceService(InvoiceRepository invoiceRepository,
                          BookingRepository bookingRepository,
                          JobCardRepository jobCardRepository,
                          JobCardPartRepository jobCardPartRepository) {
        this.invoiceRepository = invoiceRepository;
        this.bookingRepository = bookingRepository;
        this.jobCardRepository = jobCardRepository;
        this.jobCardPartRepository = jobCardPartRepository;
    }

    public List<InvoiceDto> getAllInvoices() {
        return invoiceRepository.findAll().stream()
                .map(InvoiceDto::new)
                .toList();
    }

    public InvoiceDto getInvoiceById(Long invoiceId) {
        Invoice invoice = invoiceRepository.findById(invoiceId)
                .orElseThrow(() -> new ResourceNotFoundException("Invoice not found with ID: " + invoiceId));
        return new InvoiceDto(invoice);
    }

    public InvoiceDto getInvoiceByBookingId(Long bookingId) {
        Invoice invoice = invoiceRepository.findByBooking_BookingId(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Invoice not found for booking ID: " + bookingId));
        return new InvoiceDto(invoice);
    }

    @Transactional
    public InvoiceDto generateInvoice(CreateInvoiceRequest request) {
        Booking booking = bookingRepository.findById(request.getBookingId())
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with ID: " + request.getBookingId()));

        Optional<Invoice> existing = invoiceRepository.findByBooking_BookingId(request.getBookingId());
        if (existing.isPresent()) {
            return new InvoiceDto(existing.get());
        }

        BigDecimal serviceAmount = booking.getTotalAmount();
        BigDecimal partsAmount = BigDecimal.ZERO;

        Optional<JobCard> jcOptional = jobCardRepository.findByBooking_BookingId(booking.getBookingId());
        if (jcOptional.isPresent()) {
            List<JobCardPart> parts = jobCardPartRepository.findByJobCard_JobCardId(jcOptional.get().getJobCardId());
            for (JobCardPart p : parts) {
                partsAmount = partsAmount.add(p.getTotalPrice());
            }
        }

        BigDecimal subtotal = serviceAmount.add(partsAmount);
        BigDecimal taxPercent = request.getTaxPercentage() != null ? request.getTaxPercentage() : BigDecimal.valueOf(18.0);
        BigDecimal taxAmount = subtotal.multiply(taxPercent).divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP);
        BigDecimal totalAmount = subtotal.add(taxAmount);

        String invoiceNumber = "INV-" + LocalDate.now().getYear() + "-" + String.format("%04d", booking.getBookingId());

        Invoice invoice = new Invoice(
                invoiceNumber,
                booking,
                serviceAmount,
                partsAmount,
                taxAmount,
                totalAmount,
                PaymentStatus.PENDING,
                LocalDate.now()
        );

        Invoice saved = invoiceRepository.save(invoice);
        return new InvoiceDto(saved);
    }

    @Transactional
    public InvoiceDto markAsPaid(Long invoiceId) {
        Invoice invoice = invoiceRepository.findById(invoiceId)
                .orElseThrow(() -> new ResourceNotFoundException("Invoice not found with ID: " + invoiceId));

        invoice.setPaymentStatus(PaymentStatus.PAID);
        Invoice saved = invoiceRepository.save(invoice);

        // Ensure booking is marked COMPLETED
        Booking booking = invoice.getBooking();
        if (booking.getStatus() != BookingStatus.COMPLETED) {
            booking.setStatus(BookingStatus.COMPLETED);
            bookingRepository.save(booking);
        }

        return new InvoiceDto(saved);
    }
}

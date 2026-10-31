package com.vehicleservice.service;

import com.vehicleservice.dto.BookingDto;
import com.vehicleservice.dto.DashboardStatsDto;
import com.vehicleservice.entity.BookingStatus;
import com.vehicleservice.entity.Role;
import com.vehicleservice.repository.*;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Service
public class DashboardService {

    private final BookingRepository bookingRepository;
    private final UserRepository userRepository;
    private final TechnicianRepository technicianRepository;
    private final InvoiceRepository invoiceRepository;
    private final SparePartRepository sparePartRepository;

    public DashboardService(BookingRepository bookingRepository,
                            UserRepository userRepository,
                            TechnicianRepository technicianRepository,
                            InvoiceRepository invoiceRepository,
                            SparePartRepository sparePartRepository) {
        this.bookingRepository = bookingRepository;
        this.userRepository = userRepository;
        this.technicianRepository = technicianRepository;
        this.invoiceRepository = invoiceRepository;
        this.sparePartRepository = sparePartRepository;
    }

    public DashboardStatsDto getDashboardStats() {
        DashboardStatsDto stats = new DashboardStatsDto();

        stats.setTotalBookings(bookingRepository.count());
        stats.setPendingBookings(bookingRepository.countByStatus(BookingStatus.BOOKED));
        stats.setInProgressServices(bookingRepository.countByStatus(BookingStatus.IN_PROGRESS));
        stats.setCompletedServices(bookingRepository.countByStatus(BookingStatus.COMPLETED));
        stats.setTotalCustomers(userRepository.countByRole(Role.CUSTOMER));
        stats.setTotalTechnicians(technicianRepository.count());

        BigDecimal revenue = invoiceRepository.calculateTotalPaidRevenue();
        stats.setTotalRevenue(revenue != null ? revenue : BigDecimal.ZERO);

        long lowStockCount = sparePartRepository.findAll().stream()
                .filter(p -> p.getQuantity() != null && p.getMinStockLevel() != null && p.getQuantity() <= p.getMinStockLevel())
                .count();
        stats.setLowStockPartsCount(lowStockCount);

        List<BookingDto> recent = bookingRepository.findAllOrderByCreatedAtDesc().stream()
                .limit(5)
                .map(BookingDto::new)
                .toList();
        stats.setRecentBookings(recent);

        return stats;
    }
}


package com.vehicleservice.dto;

import java.math.BigDecimal;
import java.util.List;

public class DashboardStatsDto {
    private long totalBookings;
    private long pendingBookings;
    private long inProgressServices;
    private long completedServices;
    private long totalCustomers;
    private long totalTechnicians;
    private BigDecimal totalRevenue;
    private long lowStockPartsCount;
    private List<BookingDto> recentBookings;

    public DashboardStatsDto() {}

    public long getTotalBookings() {
        return totalBookings;
    }

    public void setTotalBookings(long totalBookings) {
        this.totalBookings = totalBookings;
    }

    public long getPendingBookings() {
        return pendingBookings;
    }

    public void setPendingBookings(long pendingBookings) {
        this.pendingBookings = pendingBookings;
    }

    public long getInProgressServices() {
        return inProgressServices;
    }

    public void setInProgressServices(long inProgressServices) {
        this.inProgressServices = inProgressServices;
    }

    public long getCompletedServices() {
        return completedServices;
    }

    public void setCompletedServices(long completedServices) {
        this.completedServices = completedServices;
    }

    public long getTotalCustomers() {
        return totalCustomers;
    }

    public void setTotalCustomers(long totalCustomers) {
        this.totalCustomers = totalCustomers;
    }

    public long getTotalTechnicians() {
        return totalTechnicians;
    }

    public void setTotalTechnicians(long totalTechnicians) {
        this.totalTechnicians = totalTechnicians;
    }

    public BigDecimal getTotalRevenue() {
        return totalRevenue;
    }

    public void setTotalRevenue(BigDecimal totalRevenue) {
        this.totalRevenue = totalRevenue;
    }

    public long getLowStockPartsCount() {
        return lowStockPartsCount;
    }

    public void setLowStockPartsCount(long lowStockPartsCount) {
        this.lowStockPartsCount = lowStockPartsCount;
    }

    public List<BookingDto> getRecentBookings() {
        return recentBookings;
    }

    public void setRecentBookings(List<BookingDto> recentBookings) {
        this.recentBookings = recentBookings;
    }
}


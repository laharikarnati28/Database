package com.vehicleservice;

import com.vehicleservice.dto.*;
import com.vehicleservice.entity.*;
import com.vehicleservice.exception.BadRequestException;
import com.vehicleservice.exception.InvalidStatusTransitionException;
import com.vehicleservice.exception.ResourceNotFoundException;
import com.vehicleservice.exception.UnauthorizedException;
import com.vehicleservice.repository.ServiceRepository;
import com.vehicleservice.repository.TechnicianRepository;
import com.vehicleservice.repository.UserRepository;
import com.vehicleservice.service.BookingService;
import com.vehicleservice.service.CatalogService;
import com.vehicleservice.service.VehicleManagementService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.TestPropertySource;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@TestPropertySource(locations = "classpath:application-test.properties")
@Transactional
class BookingServiceTest {

    @Autowired
    private BookingService bookingService;

    @Autowired
    private VehicleManagementService vehicleService;

    @Autowired
    private CatalogService catalogService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ServiceRepository serviceRepository;

    @Autowired
    private TechnicianRepository technicianRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    private User customer1;
    private User customer2;
    private VehicleDto customer1Vehicle;
    private ServiceDto testService;
    private Technician testTechnician;

    @BeforeEach
    void setUp() {
        // Create customer 1
        customer1 = userRepository.save(new User(
                "Customer One",
                "c1." + System.currentTimeMillis() + "@test.com",
                "9876540001",
                passwordEncoder.encode("password123"),
                "Hyderabad",
                Role.CUSTOMER
        ));

        // Create customer 2
        customer2 = userRepository.save(new User(
                "Customer Two",
                "c2." + System.currentTimeMillis() + "@test.com",
                "9876540002",
                passwordEncoder.encode("password123"),
                "Hyderabad",
                Role.CUSTOMER
        ));

        // Register vehicle for customer 1
        VehicleRequest vReq = new VehicleRequest();
        vReq.setVehicleNumber("TS09TEST" + (System.currentTimeMillis() % 10000));
        vReq.setBrand("Honda");
        vReq.setModel("City");
        vReq.setVehicleType("SEDAN");
        vReq.setYear(2022);
        vReq.setFuelType("PETROL");
        customer1Vehicle = vehicleService.createVehicle(vReq, customer1.getUserId(), false);

        // Fetch or create service
        List<ServiceDto> services = catalogService.getAllActiveServices();
        if (services.isEmpty()) {
            ServiceRequest sReq = new ServiceRequest();
            sReq.setServiceName("Standard Maintenance");
            sReq.setDescription("Standard check");
            sReq.setPrice(BigDecimal.valueOf(1299.00));
            sReq.setEstimatedTime(60);
            testService = catalogService.createService(sReq);
        } else {
            testService = services.get(0);
        }

        // Fetch or create technician
        List<Technician> techs = technicianRepository.findAll();
        if (techs.isEmpty()) {
            testTechnician = technicianRepository.save(new Technician(
                    null, "Test Tech", "tech." + System.currentTimeMillis() + "@test.com",
                    "9876540099", "General Inspection", true, 5
            ));
        } else {
            testTechnician = techs.get(0);
            testTechnician.setAvailable(true);
            technicianRepository.save(testTechnician);
        }
    }

    @Test
    @DisplayName("Should list active services correctly")
    void testServiceListing() {
        List<ServiceDto> list = catalogService.getAllActiveServices();
        assertNotNull(list);
        assertFalse(list.isEmpty());
        assertTrue(list.stream().allMatch(s -> s.getPrice().compareTo(BigDecimal.ZERO) > 0));
    }

    @Test
    @DisplayName("Should create booking successfully with DB authoritative price")
    void testBookingCreationSuccess() {
        BookingRequest req = new BookingRequest(
                customer1Vehicle.getVehicleId(),
                testService.getServiceId(),
                LocalDate.now().plusDays(2),
                LocalTime.of(10, 0),
                "Brake pedal feels soft"
        );

        BookingDto booking = bookingService.createBooking(req, customer1.getUserId(), false);

        assertNotNull(booking);
        assertNotNull(booking.getBookingId());
        assertEquals(BookingStatus.BOOKED, booking.getStatus());
        assertEquals(testService.getPrice(), booking.getTotalAmount());
        assertEquals(customer1.getUserId(), booking.getUserId());
    }

    @Test
    @DisplayName("Should reject booking creation with invalid vehicle ID")
    void testBookingWithInvalidVehicleIdFails() {
        BookingRequest req = new BookingRequest(
                999999L,
                testService.getServiceId(),
                LocalDate.now().plusDays(1),
                LocalTime.of(11, 0),
                "Checkup"
        );

        assertThrows(ResourceNotFoundException.class, () ->
                bookingService.createBooking(req, customer1.getUserId(), false));
    }

    @Test
    @DisplayName("Should reject booking creation with invalid service ID")
    void testBookingWithInvalidServiceIdFails() {
        BookingRequest req = new BookingRequest(
                customer1Vehicle.getVehicleId(),
                999999L,
                LocalDate.now().plusDays(1),
                LocalTime.of(11, 0),
                "Checkup"
        );

        assertThrows(ResourceNotFoundException.class, () ->
                bookingService.createBooking(req, customer1.getUserId(), false));
    }

    @Test
    @DisplayName("Should reject booking creation with past date")
    void testBookingWithPastDateFails() {
        BookingRequest req = new BookingRequest(
                customer1Vehicle.getVehicleId(),
                testService.getServiceId(),
                LocalDate.now().minusDays(1),
                LocalTime.of(10, 0),
                "Past date booking"
        );

        assertThrows(BadRequestException.class, () ->
                bookingService.createBooking(req, customer1.getUserId(), false));
    }

    @Test
    @DisplayName("Should enforce customer authorization and prevent booking vehicle owned by another user")
    void testCustomerAuthorizationVehicleOwnership() {
        // Customer 2 attempts to book a service using Customer 1's vehicle
        BookingRequest req = new BookingRequest(
                customer1Vehicle.getVehicleId(),
                testService.getServiceId(),
                LocalDate.now().plusDays(1),
                LocalTime.of(14, 0),
                "Unauthorized attempt"
        );

        assertThrows(UnauthorizedException.class, () ->
                bookingService.createBooking(req, customer2.getUserId(), false));
    }

    @Test
    @DisplayName("Should handle booking status updates and prevent invalid transitions")
    void testBookingStatusTransitions() {
        BookingRequest req = new BookingRequest(
                customer1Vehicle.getVehicleId(),
                testService.getServiceId(),
                LocalDate.now().plusDays(3),
                LocalTime.of(15, 0),
                "Oil change"
        );
        BookingDto booking = bookingService.createBooking(req, customer1.getUserId(), false);

        // Valid transition: BOOKED -> CONFIRMED
        BookingDto confirmed = bookingService.updateStatus(booking.getBookingId(), BookingStatus.CONFIRMED);
        assertEquals(BookingStatus.CONFIRMED, confirmed.getStatus());

        // Valid transition: CONFIRMED -> IN_PROGRESS
        BookingDto inProgress = bookingService.updateStatus(booking.getBookingId(), BookingStatus.IN_PROGRESS);
        assertEquals(BookingStatus.IN_PROGRESS, inProgress.getStatus());

        // Cancelled bookings cannot transition directly to COMPLETED
        BookingDto cancelled = bookingService.updateStatus(booking.getBookingId(), BookingStatus.CANCELLED);
        assertEquals(BookingStatus.CANCELLED, cancelled.getStatus());

        // Invalid transition: CANCELLED -> COMPLETED should throw InvalidStatusTransitionException
        assertThrows(InvalidStatusTransitionException.class, () ->
                bookingService.updateStatus(booking.getBookingId(), BookingStatus.COMPLETED));
    }

    @Test
    @DisplayName("Should allocate technician, confirm booking, and create job card")
    void testTechnicianAllocation() {
        BookingRequest req = new BookingRequest(
                customer1Vehicle.getVehicleId(),
                testService.getServiceId(),
                LocalDate.now().plusDays(1),
                LocalTime.of(9, 30),
                "Diagnostic noise"
        );
        BookingDto booking = bookingService.createBooking(req, customer1.getUserId(), false);

        BookingDto assigned = bookingService.assignTechnician(booking.getBookingId(), testTechnician.getTechnicianId());

        assertNotNull(assigned.getTechnicianId());
        assertEquals(testTechnician.getTechnicianId(), assigned.getTechnicianId());
        assertEquals(BookingStatus.CONFIRMED, assigned.getStatus());
    }
}


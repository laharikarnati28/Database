package com.vehicleservice;

import com.vehicleservice.dto.*;
import com.vehicleservice.entity.*;
import com.vehicleservice.exception.BadRequestException;
import com.vehicleservice.exception.InsufficientStockException;
import com.vehicleservice.repository.*;
import com.vehicleservice.service.*;
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

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@TestPropertySource(locations = "classpath:application-test.properties")
@Transactional
class InventoryAndBillingTest {

    @Autowired
    private SparePartService sparePartService;

    @Autowired
    private JobCardService jobCardService;

    @Autowired
    private InvoiceService invoiceService;

    @Autowired
    private PaymentService paymentService;

    @Autowired
    private BookingService bookingService;

    @Autowired
    private VehicleManagementService vehicleService;

    @Autowired
    private CatalogService catalogService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    private User testUser;
    private VehicleDto testVehicle;
    private ServiceDto testService;
    private BookingDto testBooking;
    private SparePartDto testPart;

    @BeforeEach
    void setUp() {
        testUser = userRepository.save(new User(
                "Billing Test User",
                "billing." + System.currentTimeMillis() + "@test.com",
                "9876543200",
                passwordEncoder.encode("secret"),
                "Financial District",
                Role.CUSTOMER
        ));

        VehicleRequest vReq = new VehicleRequest();
        vReq.setVehicleNumber("TS10BILL" + (System.currentTimeMillis() % 10000));
        vReq.setBrand("Hyundai");
        vReq.setModel("Creta");
        vReq.setVehicleType("SUV");
        vReq.setYear(2023);
        vReq.setFuelType("DIESEL");
        testVehicle = vehicleService.createVehicle(vReq, testUser.getUserId(), false);

        ServiceRequest sReq = new ServiceRequest();
        sReq.setServiceName("Brake Service Package " + System.currentTimeMillis());
        sReq.setDescription("Front and rear brake service");
        sReq.setPrice(BigDecimal.valueOf(2000.00));
        sReq.setEstimatedTime(90);
        testService = catalogService.createService(sReq);

        BookingRequest bReq = new BookingRequest(
                testVehicle.getVehicleId(),
                testService.getServiceId(),
                LocalDate.now().plusDays(2),
                LocalTime.of(11, 0),
                "Brake shuddering"
        );
        testBooking = bookingService.createBooking(bReq, testUser.getUserId(), false);

        SparePartRequest pReq = new SparePartRequest();
        pReq.setPartName("Brake Rotor Disc");
        pReq.setPartNumber("SKU-BRK-DISC-" + System.currentTimeMillis());
        pReq.setQuantity(10);
        pReq.setPrice(BigDecimal.valueOf(1500.00));
        pReq.setCategory("Brakes");
        pReq.setMinStockLevel(2);
        testPart = sparePartService.createPart(pReq);
    }

    @Test
    @DisplayName("Should prevent negative spare parts inventory")
    void testNegativeStockPrevention() {
        // Current quantity is 10. Attempting to deduct 15 should throw InsufficientStockException
        assertThrows(InsufficientStockException.class, () ->
                sparePartService.adjustStock(testPart.getPartId(), -15));
    }

    @Test
    @DisplayName("Should create job card and consume spare parts with safe stock deduction")
    void testJobCardSparePartsConsumption() {
        JobCardRequest jcReq = new JobCardRequest();
        jcReq.setBookingId(testBooking.getBookingId());
        jcReq.setProblemDescription("Brake shuddering");
        jcReq.setDiagnosis("Rotors warped");
        jcReq.setWorkDone("Replaced front brake discs");
        JobCardDto jc = jobCardService.createJobCard(jcReq);

        assertNotNull(jc);
        assertEquals(JobCardStatus.PENDING, jc.getStatus());

        // Add 2 rotors to job card
        AddPartToJobCardRequest partReq = new AddPartToJobCardRequest(testPart.getPartId(), 2);
        JobCardDto updatedJc = jobCardService.addPartToJobCard(jc.getJobCardId(), partReq);

        assertFalse(updatedJc.getParts().isEmpty());
        assertEquals(1, updatedJc.getParts().size());

        // Verify inventory stock was reduced from 10 to 8
        SparePartDto partAfter = sparePartService.getPartById(testPart.getPartId());
        assertEquals(8, partAfter.getQuantity());
    }

    @Test
    @DisplayName("Should generate invoice with correct service, parts, and tax calculations")
    void testInvoiceGenerationAndCalculations() {
        // Create Job Card with parts
        JobCardRequest jcReq = new JobCardRequest();
        jcReq.setBookingId(testBooking.getBookingId());
        JobCardDto jc = jobCardService.createJobCard(jcReq);
        jobCardService.addPartToJobCard(jc.getJobCardId(), new AddPartToJobCardRequest(testPart.getPartId(), 2)); // 2 * 1500 = 3000

        // Service amount = 2000.00
        // Parts amount = 3000.00
        // Subtotal = 5000.00
        // 18% GST = 900.00
        // Total = 5900.00
        CreateInvoiceRequest invReq = new CreateInvoiceRequest(testBooking.getBookingId(), BigDecimal.valueOf(18.0));
        InvoiceDto invoice = invoiceService.generateInvoice(invReq);

        assertNotNull(invoice);
        assertEquals(0, BigDecimal.valueOf(2000.00).compareTo(invoice.getServiceAmount()));
        assertEquals(0, BigDecimal.valueOf(3000.00).compareTo(invoice.getPartsAmount()));
        assertEquals(0, BigDecimal.valueOf(900.00).compareTo(invoice.getTaxAmount()));
        assertEquals(0, BigDecimal.valueOf(5900.00).compareTo(invoice.getTotalAmount()));
        assertEquals(PaymentStatus.PENDING, invoice.getPaymentStatus());
    }

    @Test
    @DisplayName("Should record payment, update invoice status to PAID, and reject duplicate payment")
    void testPaymentRecordingAndInvoiceSettlement() {
        CreateInvoiceRequest invReq = new CreateInvoiceRequest(testBooking.getBookingId(), BigDecimal.valueOf(18.0));
        InvoiceDto invoice = invoiceService.generateInvoice(invReq);

        PaymentRequest payReq = new PaymentRequest();
        payReq.setInvoiceId(invoice.getInvoiceId());
        payReq.setAmount(invoice.getTotalAmount());
        payReq.setPaymentMethod(PaymentMethod.UPI);
        payReq.setTransactionReference("UPI-DEMO-12345");

        PaymentDto payment = paymentService.recordPayment(payReq);

        assertNotNull(payment);
        assertEquals("SUCCESS", payment.getPaymentStatus());

        InvoiceDto settledInvoice = invoiceService.getInvoiceById(invoice.getInvoiceId());
        assertEquals(PaymentStatus.PAID, settledInvoice.getPaymentStatus());

        // Duplicate payment on settled invoice must be rejected
        assertThrows(BadRequestException.class, () -> paymentService.recordPayment(payReq));
    }
}


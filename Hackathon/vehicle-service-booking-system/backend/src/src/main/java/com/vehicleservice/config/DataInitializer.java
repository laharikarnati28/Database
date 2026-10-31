package com.vehicleservice.config;

import com.vehicleservice.entity.*;
import com.vehicleservice.repository.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.Optional;

@Component
public class DataInitializer implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataInitializer.class);

    private final UserRepository userRepository;
    private final ServiceRepository serviceRepository;
    private final TechnicianRepository technicianRepository;
    private final SparePartRepository sparePartRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(UserRepository userRepository,
                           ServiceRepository serviceRepository,
                           TechnicianRepository technicianRepository,
                           SparePartRepository sparePartRepository,
                           PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.serviceRepository = serviceRepository;
        this.technicianRepository = technicianRepository;
        this.sparePartRepository = sparePartRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        log.info("Initializing system users, seed data and security credentials...");

        // 1. Admin Account
        initUser("admin@vehicleservice.com", "System Administrator", "9876500000", "admin123", "Headquarters, Tech Park, Hyderabad", Role.ADMIN);

        // 2. Demo Customer Accounts
        initUser("jhansi@gmail.com", "Jhansi Priya", "9876543210", "123456", "Plot 45, Banjara Hills, Hyderabad", Role.CUSTOMER);
        initUser("arun@example.com", "Arun Kumar", "9876543211", "123456", "Flat 302, Madhapur, Hyderabad", Role.CUSTOMER);

        // 3. Technician User
        User techUser = initUser("ravi.tech@vehicleservice.com", "Ravi Kumar", "9876543212", "tech123", "Workshop Bay 1, Service Hub", Role.TECHNICIAN);

        // 4. Link or create Technicians
        if (technicianRepository.count() == 0) {
            technicianRepository.save(new Technician(techUser, "Ravi Kumar", "ravi.tech@vehicleservice.com", "9876543212", "Engine & Transmission Specialist", true, 6));
            technicianRepository.save(new Technician(null, "Arjun Reddy", "arjun.tech@vehicleservice.com", "9876543213", "Brakes & Suspension Specialist", true, 4));
            technicianRepository.save(new Technician(null, "Kiran Kumar", "kiran.tech@vehicleservice.com", "9876543214", "AC & Electrical Systems", true, 5));
            technicianRepository.save(new Technician(null, "Suresh Babu", "suresh.tech@vehicleservice.com", "9876543215", "General Periodic Maintenance", true, 7));
        }

        // 5. Default Services if empty
        if (serviceRepository.count() == 0) {
            serviceRepository.save(new VehicleService("General Periodic Service", "Engine oil check, filter cleaning, 40-point vehicle safety inspection and wash.", BigDecimal.valueOf(1499.00), 90, "Maintenance", true));
            serviceRepository.save(new VehicleService("Engine Oil & Filter Replacement", "Drain old oil, flush, fill with synthetic oil, replace OEM oil filter.", BigDecimal.valueOf(899.00), 45, "Engine", true));
            serviceRepository.save(new VehicleService("Comprehensive Brake Overhaul", "Front and rear brake pads inspection, caliper cleaning, rotor resurfacing, brake bleeding.", BigDecimal.valueOf(1799.00), 120, "Brakes", true));
            serviceRepository.save(new VehicleService("AC Cooling & Disinfection", "AC gas recharge, cabin filter sanitization, cooling coil antibacterial foam treatment.", BigDecimal.valueOf(1299.00), 60, "Climate Control", true));
            serviceRepository.save(new VehicleService("Wheel Alignment & Dynamic Balancing", "Computerized 4-wheel laser alignment, balance weight balancing, tire rotation.", BigDecimal.valueOf(749.00), 45, "Tyres & Wheels", true));
            serviceRepository.save(new VehicleService("Full Vehicle Deep Detailing", "Exterior high-gloss machine polishing, engine bay cleaning, interior shampoo and ozone treatment.", BigDecimal.valueOf(3499.00), 240, "Detailing", true));
            serviceRepository.save(new VehicleService("Electrical & Battery Diagnostics", "Computerized OBD-II scanner health diagnostics, alternator output, battery load test.", BigDecimal.valueOf(599.00), 30, "Electrical", true));
        }

        // 6. Default Spare Parts if empty
        if (sparePartRepository.count() == 0) {
            sparePartRepository.save(new SparePart("Fully Synthetic Engine Oil 5W-30 (4L)", "SP-OIL-5W30", 45, BigDecimal.valueOf(1650.00), "Fluids", 10));
            sparePartRepository.save(new SparePart("OEM High Flow Oil Filter", "SP-FLT-OIL01", 60, BigDecimal.valueOf(280.00), "Filters", 15));
            sparePartRepository.save(new SparePart("Ceramic Front Brake Pads (Set)", "SP-BRK-FPAD", 28, BigDecimal.valueOf(1450.00), "Brakes", 8));
            sparePartRepository.save(new SparePart("Activated Carbon Cabin Air Filter", "SP-FLT-AC01", 35, BigDecimal.valueOf(480.00), "Filters", 10));
            sparePartRepository.save(new SparePart("Engine Intake Air Filter", "SP-FLT-AIR01", 40, BigDecimal.valueOf(350.00), "Filters", 10));
            sparePartRepository.save(new SparePart("Long Life Engine Coolant (1L)", "SP-FLUID-CL01", 32, BigDecimal.valueOf(320.00), "Fluids", 10));
            sparePartRepository.save(new SparePart("Iridium Spark Plug Set (4 pcs)", "SP-IGN-SPK04", 22, BigDecimal.valueOf(920.00), "Ignition", 5));
            sparePartRepository.save(new SparePart("DOT 4 High Performance Brake Fluid (500ml)", "SP-FLUID-BF04", 38, BigDecimal.valueOf(290.00), "Fluids", 8));
        }

        log.info("System initialization complete. Demo accounts ready.");
    }

    private User initUser(String email, String name, String phone, String rawPassword, String address, Role role) {
        Optional<User> existing = userRepository.findByEmail(email);
        if (existing.isPresent()) {
            User u = existing.get();
            // Always ensure the default accounts have valid encrypted passwords for the configured raw password
            u.setPassword(passwordEncoder.encode(rawPassword));
            u.setName(name);
            u.setPhone(phone);
            u.setAddress(address);
            u.setRole(role);
            return userRepository.save(u);
        } else {
            User newUser = new User(name, email, phone, passwordEncoder.encode(rawPassword), address, role);
            return userRepository.save(newUser);
        }
    }
}


-- ========================================================
-- VEHICLE SERVICE BOOKING & TRACKING SYSTEM
-- Sample Data (MySQL 8.x)
-- ========================================================

USE `vehicle_service_db`;

-- Password hashes below are BCrypt encoded for:
-- 'admin123' for admin@vehicleservice.com
-- '123456' for jhansi@gmail.com and arun@example.com
-- 'tech123' for ravi.tech@vehicleservice.com
-- (Spring Boot DataInitializer will also ensure/refresh credentials on startup)

-- 1. USERS
INSERT INTO `users` (`user_id`, `name`, `email`, `phone`, `password`, `address`, `role`) VALUES
(1, 'System Administrator', 'admin@vehicleservice.com', '9876500000', '$2a$10$btT4l.6NP2UNGdd51kEqhOZxFYBqeN41/Z1/kymy8xUQ2S8XSpD/q', 'Headquarters, Tech Park, Hyderabad', 'ADMIN'),
(2, 'Jhansi Priya', 'jhansi@gmail.com', '9876543210', '$2a$10$eTn.YrOUst3gG0FwMc2RE.kXW/4noGcwpLm8DVJh4y4ts36WwLFxK', 'Plot 45, Banjara Hills, Hyderabad', 'CUSTOMER'),
(3, 'Arun Kumar', 'arun@example.com', '9876543211', '$2a$10$eTn.YrOUst3gG0FwMc2RE.kXW/4noGcwpLm8DVJh4y4ts36WwLFxK', 'Flat 302, Madhapur, Hyderabad', 'CUSTOMER'),
(4, 'Ravi Kumar (Technician)', 'ravi.tech@vehicleservice.com', '9876543212', '$2a$10$qW59.7F3JgHG2ymbbyPdxOnr.c9dn3CRKpUqhbjSH.WV31tJVj2/y', 'Workshop Bay 1, Service Hub', 'TECHNICIAN');

-- 2. VEHICLES
INSERT INTO `vehicles` (`vehicle_id`, `user_id`, `vehicle_number`, `brand`, `model`, `vehicle_type`, `year`, `fuel_type`) VALUES
(1, 2, 'TS09EA1234', 'Honda', 'City ZX', 'SEDAN', 2021, 'PETROL'),
(2, 2, 'TS07FB5678', 'Hyundai', 'Creta SX(O)', 'SUV', 2023, 'DIESEL'),
(3, 3, 'AP09CC9999', 'Royal Enfield', 'Classic 350', 'BIKE', 2022, 'PETROL'),
(4, 3, 'TS08ZZ4321', 'Tata', 'Nexon EV', 'SUV', 2023, 'ELECTRIC');

-- 3. SERVICES
INSERT INTO `services` (`service_id`, `service_name`, `description`, `price`, `estimated_time`, `category`, `is_active`) VALUES
(1, 'General Periodic Service', 'Engine oil check, filter cleaning, 40-point vehicle safety inspection and wash.', 1499.00, 90, 'Maintenance', 1),
(2, 'Engine Oil & Filter Replacement', 'Drain old oil, flush, fill with synthetic oil, replace OEM oil filter.', 899.00, 45, 'Engine', 1),
(3, 'Comprehensive Brake Overhaul', 'Front and rear brake pads inspection, caliper cleaning, rotor resurfacing, brake bleeding.', 1799.00, 120, 'Brakes', 1),
(4, 'AC Cooling & Disinfection', 'AC gas recharge, cabin filter sanitization, cooling coil antibacterial foam treatment.', 1299.00, 60, 'Climate Control', 1),
(5, 'Wheel Alignment & Dynamic Balancing', 'Computerized 4-wheel laser alignment, balance weight balancing, tire rotation.', 749.00, 45, 'Tyres & Wheels', 1),
(6, 'Full Vehicle Deep Detailing', 'Exterior high-gloss machine polishing, engine bay cleaning, interior shampoo and ozone treatment.', 3499.00, 240, 'Detailing', 1),
(7, 'Electrical & Battery Diagnostics', 'Computerized OBD-II scanner health diagnostics, alternator output, battery load test.', 599.00, 30, 'Electrical', 1);

-- 4. TECHNICIANS
INSERT INTO `technicians` (`technician_id`, `user_id`, `name`, `email`, `phone`, `specialization`, `available`, `experience_years`) VALUES
(1, 4, 'Ravi Kumar', 'ravi.tech@vehicleservice.com', '9876543212', 'Engine & Transmission Specialist', 1, 6),
(2, NULL, 'Arjun Reddy', 'arjun.tech@vehicleservice.com', '9876543213', 'Brakes & Suspension Specialist', 1, 4),
(3, NULL, 'Kiran Kumar', 'kiran.tech@vehicleservice.com', '9876543214', 'AC & Electrical Systems', 1, 5),
(4, NULL, 'Suresh Babu', 'suresh.tech@vehicleservice.com', '9876543215', 'General Periodic Maintenance', 1, 7);

-- 5. SPARE PARTS INVENTORY
INSERT INTO `spare_parts` (`part_id`, `part_name`, `part_number`, `quantity`, `price`, `category`, `min_stock_level`) VALUES
(1, 'Fully Synthetic Engine Oil 5W-30 (4L)', 'SP-OIL-5W30', 45, 1650.00, 'Fluids', 10),
(2, 'OEM High Flow Oil Filter', 'SP-FLT-OIL01', 60, 280.00, 'Filters', 15),
(3, 'Ceramic Front Brake Pads (Set)', 'SP-BRK-FPAD', 28, 1450.00, 'Brakes', 8),
(4, 'Activated Carbon Cabin Air Filter', 'SP-FLT-AC01', 35, 480.00, 'Filters', 10),
(5, 'Engine Intake Air Filter', 'SP-FLT-AIR01', 40, 350.00, 'Filters', 10),
(6, 'Long Life Engine Coolant (1L)', 'SP-FLUID-CL01', 32, 320.00, 'Fluids', 10),
(7, 'Iridium Spark Plug Set (4 pcs)', 'SP-IGN-SPK04', 22, 920.00, 'Ignition', 5),
(8, 'DOT 4 High Performance Brake Fluid (500ml)', 'SP-FLUID-BF04', 38, 290.00, 'Fluids', 8);

-- 6. SAMPLE BOOKINGS (Covering various lifecycle states)
INSERT INTO `bookings` (`booking_id`, `user_id`, `vehicle_id`, `service_id`, `technician_id`, `booking_date`, `booking_time`, `status`, `problem_description`, `total_amount`) VALUES
-- Completed booking
(1, 2, 1, 1, 1, '2026-10-25', '10:00:00', 'COMPLETED', 'Regular 30,000km scheduled maintenance, slight engine vibration.', 1499.00),
-- In Progress booking
(2, 2, 2, 3, 2, '2026-10-30', '11:30:00', 'IN_PROGRESS', 'Brake squeaking noise when decelerating from high speed.', 1799.00),
-- Confirmed booking
(3, 3, 3, 2, 1, '2026-10-31', '14:00:00', 'CONFIRMED', 'Engine oil feels dark, clutch lever requires adjustment.', 899.00),
-- Fresh booking (Pending Admin confirmation)
(4, 3, 4, 4, NULL, '2026-11-02', '09:30:00', 'BOOKED', 'Cabin air conditioning not cooling effectively during daytime.', 1299.00);

-- 7. JOB CARDS
INSERT INTO `job_cards` (`job_card_id`, `job_card_number`, `booking_id`, `technician_id`, `problem_description`, `diagnosis`, `work_done`, `status`, `estimated_hours`) VALUES
(1, 'JC-2026-0001', 1, 1, 'Regular 30,000km scheduled maintenance, slight engine vibration.', 'Spark plugs dirty, oil aged. General wear and tear.', 'Full 40-point inspection completed, engine flushed, fresh synthetic oil and oil filter installed. Spark plugs cleaned.', 'COMPLETED', 2.5),
(2, 'JC-2026-0002', 2, 2, 'Brake squeaking noise when decelerating from high speed.', 'Front brake pads worn down to 2mm. Caliper pins dry.', 'Removed worn pads, lubed caliper sliding pins, installed new ceramic front brake pads, performed brake bleeding.', 'IN_PROGRESS', 2.0);

-- 8. JOB CARD PARTS
INSERT INTO `job_card_parts` (`id`, `job_card_id`, `part_id`, `quantity`, `unit_price`, `total_price`) VALUES
(1, 1, 1, 1, 1650.00, 1650.00), -- 1 can synthetic oil
(2, 1, 2, 1, 280.00, 280.00),   -- 1 oil filter
(3, 2, 3, 1, 1450.00, 1450.00), -- 1 set front brake pads
(4, 2, 8, 1, 290.00, 290.00);   -- 1 bottle brake fluid

-- 9. INVOICES
INSERT INTO `invoices` (`invoice_id`, `invoice_number`, `booking_id`, `service_amount`, `parts_amount`, `tax_amount`, `total_amount`, `payment_status`, `invoice_date`) VALUES
(1, 'INV-2026-0001', 1, 1499.00, 1930.00, 617.22, 4046.22, 'PAID', '2026-10-25');

-- 10. PAYMENTS
INSERT INTO `payments` (`payment_id`, `invoice_id`, `amount`, `payment_method`, `transaction_reference`, `payment_status`, `payment_date`) VALUES
(1, 1, 4046.22, 'UPI', 'UPI-TXN-20261025-98324', 'SUCCESS', '2026-10-25 12:45:00');


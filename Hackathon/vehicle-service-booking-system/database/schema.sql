-- ========================================================
-- VEHICLE SERVICE BOOKING & TRACKING SYSTEM
-- Database Schema (MySQL 8.x)
-- ========================================================

CREATE DATABASE IF NOT EXISTS `vehicle_service_db`
CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE `vehicle_service_db`;

-- Drop existing tables in reverse dependency order
SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS `payments`;
DROP TABLE IF EXISTS `invoices`;
DROP TABLE IF EXISTS `job_card_parts`;
DROP TABLE IF EXISTS `job_cards`;
DROP TABLE IF EXISTS `spare_parts`;
DROP TABLE IF EXISTS `bookings`;
DROP TABLE IF EXISTS `technicians`;
DROP TABLE IF EXISTS `vehicles`;
DROP TABLE IF EXISTS `services`;
DROP TABLE IF EXISTS `users`;
SET FOREIGN_KEY_CHECKS = 1;

-- 1. USERS TABLE
CREATE TABLE `users` (
    `user_id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(100) NOT NULL,
    `email` VARCHAR(100) NOT NULL UNIQUE,
    `phone` VARCHAR(20) NOT NULL,
    `password` VARCHAR(255) NOT NULL,
    `address` VARCHAR(255) NULL,
    `role` ENUM('CUSTOMER', 'ADMIN', 'TECHNICIAN') NOT NULL DEFAULT 'CUSTOMER',
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX `idx_users_email` (`email`),
    INDEX `idx_users_role` (`role`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 2. VEHICLES TABLE
CREATE TABLE `vehicles` (
    `vehicle_id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `user_id` BIGINT NOT NULL,
    `vehicle_number` VARCHAR(30) NOT NULL UNIQUE,
    `brand` VARCHAR(50) NOT NULL,
    `model` VARCHAR(50) NOT NULL,
    `vehicle_type` VARCHAR(30) NOT NULL, -- SEDAN, SUV, HATCHBACK, BIKE, LUXURY
    `year` INT NOT NULL,
    `fuel_type` VARCHAR(20) DEFAULT 'PETROL',
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT `fk_vehicles_user` FOREIGN KEY (`user_id`)
        REFERENCES `users` (`user_id`) ON DELETE CASCADE,
    INDEX `idx_vehicles_user_id` (`user_id`),
    INDEX `idx_vehicles_number` (`vehicle_number`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 3. SERVICES TABLE
CREATE TABLE `services` (
    `service_id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `service_name` VARCHAR(100) NOT NULL,
    `description` VARCHAR(500) NULL,
    `price` DECIMAL(10,2) NOT NULL,
    `estimated_time` INT NOT NULL, -- in minutes
    `category` VARCHAR(50) DEFAULT 'General',
    `is_active` BOOLEAN DEFAULT TRUE,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 4. TECHNICIANS TABLE
CREATE TABLE `technicians` (
    `technician_id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `user_id` BIGINT NULL,
    `name` VARCHAR(100) NOT NULL,
    `email` VARCHAR(100) NULL UNIQUE,
    `phone` VARCHAR(20) NOT NULL,
    `specialization` VARCHAR(100) NOT NULL,
    `available` BOOLEAN DEFAULT TRUE,
    `experience_years` INT DEFAULT 3,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT `fk_technicians_user` FOREIGN KEY (`user_id`)
        REFERENCES `users` (`user_id`) ON DELETE SET NULL,
    INDEX `idx_technicians_available` (`available`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 5. SPARE_PARTS TABLE
CREATE TABLE `spare_parts` (
    `part_id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `part_name` VARCHAR(100) NOT NULL,
    `part_number` VARCHAR(50) NOT NULL UNIQUE,
    `quantity` INT NOT NULL DEFAULT 0,
    `price` DECIMAL(10,2) NOT NULL,
    `category` VARCHAR(50) DEFAULT 'Mechanical',
    `min_stock_level` INT DEFAULT 5,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX `idx_spare_parts_number` (`part_number`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 6. BOOKINGS TABLE
CREATE TABLE `bookings` (
    `booking_id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `user_id` BIGINT NOT NULL,
    `vehicle_id` BIGINT NOT NULL,
    `service_id` BIGINT NOT NULL,
    `technician_id` BIGINT NULL,
    `booking_date` DATE NOT NULL,
    `booking_time` TIME NOT NULL,
    `status` ENUM('BOOKED', 'CONFIRMED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED') NOT NULL DEFAULT 'BOOKED',
    `problem_description` TEXT NULL,
    `total_amount` DECIMAL(10,2) NOT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT `fk_bookings_user` FOREIGN KEY (`user_id`)
        REFERENCES `users` (`user_id`),
    CONSTRAINT `fk_bookings_vehicle` FOREIGN KEY (`vehicle_id`)
        REFERENCES `vehicles` (`vehicle_id`),
    CONSTRAINT `fk_bookings_service` FOREIGN KEY (`service_id`)
        REFERENCES `services` (`service_id`),
    CONSTRAINT `fk_bookings_technician` FOREIGN KEY (`technician_id`)
        REFERENCES `technicians` (`technician_id`) ON DELETE SET NULL,
    INDEX `idx_bookings_user` (`user_id`),
    INDEX `idx_bookings_status` (`status`),
    INDEX `idx_bookings_date` (`booking_date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 7. JOB_CARDS TABLE
CREATE TABLE `job_cards` (
    `job_card_id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `job_card_number` VARCHAR(50) NOT NULL UNIQUE,
    `booking_id` BIGINT NOT NULL UNIQUE,
    `technician_id` BIGINT NULL,
    `problem_description` TEXT NULL,
    `diagnosis` TEXT NULL,
    `work_done` TEXT NULL,
    `status` ENUM('PENDING', 'IN_PROGRESS', 'COMPLETED') DEFAULT 'PENDING',
    `estimated_hours` DECIMAL(4,1) DEFAULT 2.0,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT `fk_job_cards_booking` FOREIGN KEY (`booking_id`)
        REFERENCES `bookings` (`booking_id`) ON DELETE CASCADE,
    CONSTRAINT `fk_job_cards_technician` FOREIGN KEY (`technician_id`)
        REFERENCES `technicians` (`technician_id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 8. JOB_CARD_PARTS (Many-to-Many between Job Cards and Spare Parts)
CREATE TABLE `job_card_parts` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `job_card_id` BIGINT NOT NULL,
    `part_id` BIGINT NOT NULL,
    `quantity` INT NOT NULL DEFAULT 1,
    `unit_price` DECIMAL(10,2) NOT NULL,
    `total_price` DECIMAL(10,2) NOT NULL,
    CONSTRAINT `fk_jcp_job_card` FOREIGN KEY (`job_card_id`)
        REFERENCES `job_cards` (`job_card_id`) ON DELETE CASCADE,
    CONSTRAINT `fk_jcp_part` FOREIGN KEY (`part_id`)
        REFERENCES `spare_parts` (`part_id`),
    INDEX `idx_jcp_job_card` (`job_card_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 9. INVOICES TABLE
CREATE TABLE `invoices` (
    `invoice_id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `invoice_number` VARCHAR(50) NOT NULL UNIQUE,
    `booking_id` BIGINT NOT NULL UNIQUE,
    `service_amount` DECIMAL(10,2) NOT NULL,
    `parts_amount` DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    `tax_amount` DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    `total_amount` DECIMAL(10,2) NOT NULL,
    `payment_status` ENUM('PENDING', 'PAID', 'CANCELLED') NOT NULL DEFAULT 'PENDING',
    `invoice_date` DATE NOT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT `fk_invoices_booking` FOREIGN KEY (`booking_id`)
        REFERENCES `bookings` (`booking_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 10. PAYMENTS TABLE
CREATE TABLE `payments` (
    `payment_id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `invoice_id` BIGINT NOT NULL,
    `amount` DECIMAL(10,2) NOT NULL,
    `payment_method` ENUM('CASH', 'CARD', 'UPI', 'NET_BANKING') NOT NULL,
    `transaction_reference` VARCHAR(100) NULL,
    `payment_status` ENUM('SUCCESS', 'FAILED', 'REFUNDED') NOT NULL DEFAULT 'SUCCESS',
    `payment_date` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT `fk_payments_invoice` FOREIGN KEY (`invoice_id`)
        REFERENCES `invoices` (`invoice_id`) ON DELETE CASCADE,
    INDEX `idx_payments_invoice` (`invoice_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


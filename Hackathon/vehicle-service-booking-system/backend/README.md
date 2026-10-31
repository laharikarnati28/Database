# Vehicle Service Booking System - Spring Boot Backend

The backend of the Vehicle Service Booking & Tracking System is built with **Java 21/25**, **Spring Boot 3.3.5**, and **Hibernate 6 / Spring Data JPA**, connecting to a **MySQL 8.x** relational database.

---

## 1. Technical Stack & Features

- **Framework**: Spring Boot 3.3.5
- **Language**: Java 21 LTS (tested on JDK 25)
- **Persistence**: Spring Data JPA, Hibernate 6 ORM
- **Database**: MySQL 8.x (`vehicle_service_db`)
- **Security**: Spring Security 6 with stateless JWT (JSON Web Tokens) & BCrypt password hashing
- **Validation**: Jakarta Bean Validation (`@Valid`, `@NotNull`, `@Size`, `@DecimalMin`, `@FutureOrPresent`)
- **Documentation**: Springdoc OpenAPI 2.6.0 (Swagger UI at `/swagger-ui.html`)
- **Monitoring**: Spring Boot Actuator (`/actuator/health`, `/actuator/metrics`)
- **Unit & Integration Testing**: JUnit 5, Mockito, H2 in-memory test database

---

## 2. Layered Architecture

```
com.vehicleservice/
├── config/              # SecurityConfig, JwtTokenProvider, OpenApiConfig, DataInitializer
├── controller/          # REST Endpoints with @RestController & Role Authorization
├── service/             # Transactional Business Logic & Stock Verification
├── repository/          # Spring Data JPA Repositories
├── entity/              # JPA Database Entities & Relationships
├── dto/                 # Request & Response Data Transfer Objects
└── exception/           # Global Exception Handling & Custom Exceptions
```

---

## 3. Configuration & Environment Variables

Edit `src/main/resources/application.properties` or configure environment variables:

| Variable | Default Value | Description |
| :--- | :--- | :--- |
| `SERVER_PORT` | `8080` | Port for the REST API server |
| `DB_HOST` | `localhost` | MySQL Server host |
| `DB_PORT` | `3306` | MySQL Server port |
| `DB_NAME` | `vehicle_service_db` | Database name |
| `DB_USERNAME` | `root` | MySQL username |
| `DB_PASSWORD` | `jhansi@08` | MySQL password |
| `JWT_SECRET` | `404E635266556A58...` | 256-bit secret key for HMAC-SHA signing |
| `JWT_EXPIRATION_MS` | `86400000` | Token validity (24 hours in milliseconds) |

---

## 4. How to Build & Run

### Prerequisites
- Java JDK 21 or later installed (`java -version`).
- MySQL 8.0 running on `localhost:3306`.
- Schema initialized via `../database/schema.sql` and `../database/sample-data.sql`.

### Build JAR Package
```powershell
cd d:\DBMSE\Vechile_Service_Management\vehicle-service-booking-system\backend
.\mvnw.cmd clean package -DskipTests
```

### Run Automated Tests (16 tests, 100% pass)
```powershell
.\mvnw.cmd test
```

### Start the Spring Boot Server
You can start using Maven:
```powershell
.\mvnw.cmd spring-boot:run
```
Or run the packaged JAR directly:
```powershell
java -jar target/vehicle-service-backend-1.0.0.jar
```

---

## 5. Live Endpoints

- **REST API Base**: `http://localhost:8080/api`
- **Interactive Swagger UI**: [http://localhost:8080/swagger-ui.html](http://localhost:8080/swagger-ui.html)
- **OpenAPI JSON Docs**: `http://localhost:8080/v3/api-docs`
- **Actuator Health Check**: `http://localhost:8080/actuator/health`

---

## 6. Pre-Configured Demo Accounts

| Role | Email | Password | Permissions |
| :--- | :--- | :--- | :--- |
| **ADMIN** | `admin@vehicleservice.com` | `admin123` | Full access to dashboard, bookings, technicians, inventory, invoices |
| **CUSTOMER** | `jhansi@gmail.com` | `123456` | Manage own vehicles, book services, view live tracking, invoice history |
| **CUSTOMER** | `arun@example.com` | `123456` | Manage own vehicles, book services, view tracking |
| **TECHNICIAN** | `ravi.tech@vehicleservice.com` | `tech123` | Assigned jobs view, update job status, record diagnostics |


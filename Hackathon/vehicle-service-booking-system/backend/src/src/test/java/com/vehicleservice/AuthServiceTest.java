package com.vehicleservice;

import com.vehicleservice.dto.AuthRequest;
import com.vehicleservice.dto.AuthResponse;
import com.vehicleservice.dto.RegisterRequest;
import com.vehicleservice.entity.Role;
import com.vehicleservice.exception.BadRequestException;
import com.vehicleservice.service.AuthService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.test.context.TestPropertySource;
import org.springframework.transaction.annotation.Transactional;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@TestPropertySource(locations = "classpath:application-test.properties")
@Transactional
class AuthServiceTest {

    @Autowired
    private AuthService authService;

    @Autowired
    private com.vehicleservice.config.JwtTokenProvider tokenProvider;

    @Test
    @DisplayName("Should successfully register a new customer and return JWT")
    void testCustomerRegistrationSuccess() {
        RegisterRequest request = new RegisterRequest(
                "Naveen Rao",
                "naveen.test@example.com",
                "9876543299",
                "securePass123",
                "Flat 101, Hitech City",
                Role.CUSTOMER
        );

        AuthResponse response = authService.register(request);

        assertNotNull(response);
        assertNotNull(response.getToken());
        assertTrue(tokenProvider.validateToken(response.getToken()));
        assertEquals("naveen.test@example.com", tokenProvider.getEmailFromToken(response.getToken()));
        assertEquals("naveen.test@example.com", response.getEmail());
        assertEquals(Role.CUSTOMER, response.getRole());
    }

    @Test
    @DisplayName("Should reject registration with duplicate email")
    void testRegistrationDuplicateEmailFails() {
        RegisterRequest request1 = new RegisterRequest(
                "Duplicate User",
                "duplicate@example.com",
                "9876543298",
                "password123",
                "Hyderabad",
                Role.CUSTOMER
        );
        authService.register(request1);

        RegisterRequest request2 = new RegisterRequest(
                "Duplicate User 2",
                "duplicate@example.com",
                "9876543297",
                "password456",
                "Hyderabad",
                Role.CUSTOMER
        );

        assertThrows(BadRequestException.class, () -> authService.register(request2));
    }

    @Test
    @DisplayName("Should authenticate valid user and reject invalid password")
    void testAuthenticationLogin() {
        RegisterRequest registerReq = new RegisterRequest(
                "Login Test User",
                "login.test@example.com",
                "9876543296",
                "correctPassword",
                "Madhapur",
                Role.CUSTOMER
        );
        authService.register(registerReq);

        // Valid login
        AuthRequest validLogin = new AuthRequest("login.test@example.com", "correctPassword");
        AuthResponse loginResponse = authService.login(validLogin);
        assertNotNull(loginResponse.getToken());

        // Invalid login password
        AuthRequest invalidLogin = new AuthRequest("login.test@example.com", "wrongPassword");
        assertThrows(BadCredentialsException.class, () -> authService.login(invalidLogin));
    }
}


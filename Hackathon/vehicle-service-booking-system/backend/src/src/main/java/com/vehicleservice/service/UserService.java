package com.vehicleservice.service;

import com.vehicleservice.dto.UserProfileDto;
import com.vehicleservice.entity.Role;
import com.vehicleservice.entity.User;
import com.vehicleservice.exception.ResourceNotFoundException;
import com.vehicleservice.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public List<UserProfileDto> getAllCustomers() {
        return userRepository.findByRole(Role.CUSTOMER).stream()
                .map(UserProfileDto::new)
                .toList();
    }

    public UserProfileDto getUserById(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + userId));
        return new UserProfileDto(user);
    }
}


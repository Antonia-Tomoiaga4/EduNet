package com.edunet.service;

import com.edunet.Logger;
import com.edunet.dto.LoginRequest;
import com.edunet.dto.LoginResponse;
import com.edunet.dto.RegisterRequest;
import com.edunet.dto.UserDTO;
import com.edunet.entity.User;
import com.edunet.repository.UserRepository;
import com.edunet.security.JwtTokenProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtTokenProvider tokenProvider;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public UserDTO register(RegisterRequest request) {
        String email = request.getEmail().trim().toLowerCase();

        if (userRepository.existsByEmail(email)) {
            throw new RuntimeException("Email already registered");
        }

        User user = User.builder()
                .email(email)
                .password(passwordEncoder.encode(request.getPassword()))
                .name(request.getName().trim())
                .role(User.UserRole.valueOf(request.getRole().toUpperCase()))
                .build();

        userRepository.save(user);
        return UserDTO.from(user);
    }


    public LoginResponse login(LoginRequest request) {
        String email = request.getEmail().trim().toLowerCase();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid password");
        }

        String token = tokenProvider.generateToken(
                user.getId(),
                user.getEmail(),
                user.getRole().toString()
        );

        return LoginResponse.from(token, user);
    }



    public UserDTO getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return UserDTO.from(user);
    }

    public UserDTO getUserByEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return UserDTO.from(user);
    }

    public void login() {
        Logger.getInstance().log("AuthService login"); // <-- ADAUGI linia asta
        // restul codului tău
    }
}

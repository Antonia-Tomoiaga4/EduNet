package com.edunet.controller;

import com.edunet.Logger;
import com.edunet.dto.LoginRequest;
import com.edunet.dto.LoginResponse;
import com.edunet.dto.RegisterRequest;
import com.edunet.dto.UserDTO;
import com.edunet.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<UserDTO> register(@RequestBody RegisterRequest request) {
        UserDTO user = authService.register(request);
        return ResponseEntity.ok(user);
    }

    // ✅ O SINGURĂ metodă login
    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest request) {

        // 🔹 AICI e dovada Singleton-ului
        Logger.getInstance().log("AuthController.login called: " + request.getEmail());

        LoginResponse response = authService.login(request);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/user/{id}")
    public ResponseEntity<UserDTO> getUserById(@PathVariable Long id) {
        UserDTO user = authService.getUserById(id);
        return ResponseEntity.ok(user);
    }

    @GetMapping("/user/email/{email}")
    public ResponseEntity<UserDTO> getUserByEmail(@PathVariable String email) {
        UserDTO user = authService.getUserByEmail(email);
        return ResponseEntity.ok(user);
    }
}

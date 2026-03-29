package com.edunet.dto;

import com.edunet.entity.User;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LoginResponse {
    private String token;
    private UserDTO user;

    public static LoginResponse from(String token, User user) {
        return LoginResponse.builder()
                .token(token)
                .user(UserDTO.from(user))
                .build();
    }
}

package com.pfo.koraya.auth.dto;

public record LoginResponse(
        String accessToken,
        String refreshToken,
        String tokenType,
        String fullName,
        String role
) {
    public static LoginResponse of(String accessToken, String refreshToken, String fullName, String role) {
        return new LoginResponse(accessToken, refreshToken, "Bearer", fullName, role);
    }
}

package com.pfo.koraya.auth.dto;

public record LoginResponse(
        String accessToken,
        String tokenType,
        String fullName,
        String role
) {
    public static LoginResponse of(String accessToken, String fullName, String role) {
        return new LoginResponse(accessToken, "Bearer", fullName, role);
    }
}

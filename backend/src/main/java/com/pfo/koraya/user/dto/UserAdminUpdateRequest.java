package com.pfo.koraya.user.dto;

import com.pfo.koraya.user.Role;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.util.UUID;

public record UserAdminUpdateRequest(
        @NotBlank String fullName,
        @NotNull Role role,
        @NotNull UUID siteId,
        UUID departmentId,
        UUID jobTitleId,
        String phoneNumber,
        boolean active
) {
}

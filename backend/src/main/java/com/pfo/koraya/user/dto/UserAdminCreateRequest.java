package com.pfo.koraya.user.dto;

import com.pfo.koraya.user.Role;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

import java.util.UUID;

public record UserAdminCreateRequest(
        @NotBlank String fullName,
        @NotBlank
        @Pattern(regexp = "^[^\\s@]+$", message = "l'alias ne doit contenir ni espace ni @")
        String emailAlias,
        @NotNull UUID emailDomainId,
        @NotBlank @Size(min = 8, message = "doit contenir au moins 8 caracteres") String password,
        @NotNull Role role,
        @NotNull UUID siteId,
        UUID departmentId,
        UUID jobTitleId,
        String phoneNumber
) {
}

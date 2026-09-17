package com.pfo.koraya.auth.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

import java.util.UUID;

public record RegisterRequest(
        @NotBlank String firstName,
        @NotBlank String lastName,
        @NotBlank
        @Pattern(regexp = "^[^\\s@]+$", message = "l'alias ne doit contenir ni espace ni @")
        String emailAlias,
        @NotNull UUID emailDomainId,
        @NotBlank @Size(min = 8, message = "doit contenir au moins 8 caracteres") String password,
        @NotNull UUID siteId
) {
}

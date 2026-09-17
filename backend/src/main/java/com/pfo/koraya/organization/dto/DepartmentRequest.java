package com.pfo.koraya.organization.dto;

import jakarta.validation.constraints.NotBlank;

import java.util.UUID;

public record DepartmentRequest(
        @NotBlank String name,
        UUID siteId
) {
}

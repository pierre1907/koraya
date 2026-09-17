package com.pfo.koraya.organization.dto;

import jakarta.validation.constraints.NotBlank;

import java.util.UUID;

public record DepartmentUpdateRequest(
        @NotBlank String name,
        UUID siteId,
        boolean active
) {
}

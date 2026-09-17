package com.pfo.koraya.organization.dto;

import jakarta.validation.constraints.NotBlank;

public record SiteUpdateRequest(
        @NotBlank String name,
        String address,
        boolean active
) {
}

package com.pfo.koraya.organization.dto;

import jakarta.validation.constraints.NotBlank;

public record SiteRequest(
        @NotBlank String name,
        String address
) {
}

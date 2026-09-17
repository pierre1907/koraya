package com.pfo.koraya.organization.dto;

import jakarta.validation.constraints.NotBlank;

public record JobTitleUpdateRequest(
        @NotBlank String title,
        boolean active
) {
}

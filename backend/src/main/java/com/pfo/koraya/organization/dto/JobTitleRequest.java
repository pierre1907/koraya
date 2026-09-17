package com.pfo.koraya.organization.dto;

import jakarta.validation.constraints.NotBlank;

public record JobTitleRequest(
        @NotBlank String title
) {
}

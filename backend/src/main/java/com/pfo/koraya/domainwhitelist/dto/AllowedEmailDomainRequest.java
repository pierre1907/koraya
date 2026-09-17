package com.pfo.koraya.domainwhitelist.dto;

import jakarta.validation.constraints.NotBlank;

public record AllowedEmailDomainRequest(
        @NotBlank String domain
) {
}

package com.pfo.koraya.domainwhitelist.dto;

import com.pfo.koraya.domainwhitelist.AllowedEmailDomain;

import java.time.Instant;
import java.util.UUID;

public record AllowedEmailDomainAdminResponse(
        UUID id,
        String domain,
        boolean active,
        Instant createdAt
) {
    public static AllowedEmailDomainAdminResponse of(AllowedEmailDomain domain) {
        return new AllowedEmailDomainAdminResponse(
                domain.getId(), domain.getDomain(), domain.isActive(), domain.getCreatedAt());
    }
}

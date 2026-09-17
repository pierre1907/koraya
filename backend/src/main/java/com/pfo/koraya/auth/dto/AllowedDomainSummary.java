package com.pfo.koraya.auth.dto;

import com.pfo.koraya.domainwhitelist.AllowedEmailDomain;

import java.util.UUID;

public record AllowedDomainSummary(UUID id, String domain) {
    public static AllowedDomainSummary of(AllowedEmailDomain allowedEmailDomain) {
        return new AllowedDomainSummary(allowedEmailDomain.getId(), allowedEmailDomain.getDomain());
    }
}

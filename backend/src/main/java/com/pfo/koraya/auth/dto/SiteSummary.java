package com.pfo.koraya.auth.dto;

import com.pfo.koraya.organization.Site;

import java.util.UUID;

public record SiteSummary(UUID id, String name) {
    public static SiteSummary of(Site site) {
        return new SiteSummary(site.getId(), site.getName());
    }
}

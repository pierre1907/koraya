package com.pfo.koraya.organization.dto;

import com.pfo.koraya.organization.Site;

import java.util.UUID;

public record SiteAdminResponse(
        UUID id,
        String name,
        String address,
        boolean active
) {
    public static SiteAdminResponse of(Site site) {
        return new SiteAdminResponse(site.getId(), site.getName(), site.getAddress(), site.isActive());
    }
}

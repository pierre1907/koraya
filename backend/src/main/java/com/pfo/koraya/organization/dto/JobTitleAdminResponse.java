package com.pfo.koraya.organization.dto;

import com.pfo.koraya.organization.JobTitle;

import java.time.Instant;
import java.util.UUID;

public record JobTitleAdminResponse(
        UUID id,
        String title,
        boolean active,
        Instant createdAt
) {
    public static JobTitleAdminResponse of(JobTitle jobTitle) {
        return new JobTitleAdminResponse(jobTitle.getId(), jobTitle.getTitle(), jobTitle.isActive(), jobTitle.getCreatedAt());
    }
}

package com.pfo.koraya.user.dto;

import com.pfo.koraya.user.User;

import java.time.Instant;
import java.util.UUID;

public record UserAdminResponse(
        UUID id,
        String email,
        String fullName,
        String role,
        UUID siteId,
        String siteName,
        UUID departmentId,
        String departmentName,
        UUID jobTitleId,
        String jobTitleName,
        String phoneNumber,
        boolean active,
        Instant lastLoginAt,
        Instant createdAt
) {
    public static UserAdminResponse of(User user) {
        return new UserAdminResponse(
                user.getId(),
                user.getEmail(),
                user.getFullName(),
                user.getRole().name(),
                user.getSite() != null ? user.getSite().getId() : null,
                user.getSite() != null ? user.getSite().getName() : null,
                user.getDepartment() != null ? user.getDepartment().getId() : null,
                user.getDepartment() != null ? user.getDepartment().getName() : null,
                user.getJobTitle() != null ? user.getJobTitle().getId() : null,
                user.getJobTitle() != null ? user.getJobTitle().getTitle() : null,
                user.getPhoneNumber(),
                user.isActive(),
                user.getLastLoginAt(),
                user.getCreatedAt());
    }
}

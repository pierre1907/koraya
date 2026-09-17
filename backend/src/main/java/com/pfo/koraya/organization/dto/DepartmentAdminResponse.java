package com.pfo.koraya.organization.dto;

import com.pfo.koraya.organization.Department;

import java.util.UUID;

public record DepartmentAdminResponse(
        UUID id,
        String name,
        UUID siteId,
        String siteName,
        boolean active
) {
    public static DepartmentAdminResponse of(Department department) {
        return new DepartmentAdminResponse(
                department.getId(),
                department.getName(),
                department.getSite() != null ? department.getSite().getId() : null,
                department.getSite() != null ? department.getSite().getName() : null,
                department.isActive());
    }
}

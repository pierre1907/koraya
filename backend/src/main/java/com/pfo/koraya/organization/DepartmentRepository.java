package com.pfo.koraya.organization;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface DepartmentRepository extends JpaRepository<Department, UUID> {

    boolean existsBySiteId(UUID siteId);

    boolean existsByNameIgnoreCaseAndSiteId(String name, UUID siteId);

    boolean existsByNameIgnoreCaseAndSiteIsNull(String name);

    boolean existsByNameIgnoreCaseAndSiteIdAndIdNot(String name, UUID siteId, UUID id);

    boolean existsByNameIgnoreCaseAndSiteIsNullAndIdNot(String name, UUID id);
}

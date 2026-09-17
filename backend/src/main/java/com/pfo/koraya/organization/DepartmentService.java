package com.pfo.koraya.organization;

import com.pfo.koraya.audit.AuditLogService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class DepartmentService {

    private final DepartmentRepository departmentRepository;
    private final SiteRepository siteRepository;
    private final AuditLogService auditLogService;

    public List<Department> findAll() {
        return departmentRepository.findAll();
    }

    public Department findById(UUID id) {
        return departmentRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Departement introuvable"));
    }

    @Transactional
    public Department create(String name, UUID siteId, UUID actorId) {
        Department department = new Department();
        department.setName(name.trim());
        department.setSite(resolveSite(siteId));
        Department saved = departmentRepository.save(department);
        auditLogService.record(actorId, "DEPARTMENT_CREATED", "Department", saved.getId(),
                "Departement cree : " + saved.getName());
        return saved;
    }

    @Transactional
    public Department update(UUID id, String name, UUID siteId, boolean active, UUID actorId) {
        Department department = findById(id);
        department.setName(name.trim());
        department.setSite(resolveSite(siteId));
        department.setActive(active);
        Department saved = departmentRepository.save(department);
        auditLogService.record(actorId, "DEPARTMENT_UPDATED", "Department", saved.getId(),
                "Departement mis a jour : " + saved.getName());
        return saved;
    }

    /**
     * "Suppression" = desactivation, pour ne pas casser l'historique des users
     * deja rattaches a ce departement.
     */
    @Transactional
    public void deactivate(UUID id, UUID actorId) {
        Department department = findById(id);
        department.setActive(false);
        departmentRepository.save(department);
        auditLogService.record(actorId, "DEPARTMENT_DEACTIVATED", "Department", department.getId(),
                "Departement desactive : " + department.getName());
    }

    private Site resolveSite(UUID siteId) {
        if (siteId == null) {
            return null;
        }
        return siteRepository.findById(siteId)
                .orElseThrow(() -> new IllegalArgumentException("Site invalide"));
    }
}

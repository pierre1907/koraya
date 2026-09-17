package com.pfo.koraya.organization;

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

    public List<Department> findAll() {
        return departmentRepository.findAll();
    }

    public Department findById(UUID id) {
        return departmentRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Departement introuvable"));
    }

    @Transactional
    public Department create(String name, UUID siteId) {
        Department department = new Department();
        department.setName(name.trim());
        department.setSite(resolveSite(siteId));
        return departmentRepository.save(department);
    }

    @Transactional
    public Department update(UUID id, String name, UUID siteId, boolean active) {
        Department department = findById(id);
        department.setName(name.trim());
        department.setSite(resolveSite(siteId));
        department.setActive(active);
        return departmentRepository.save(department);
    }

    /**
     * "Suppression" = desactivation, pour ne pas casser l'historique des users
     * deja rattaches a ce departement.
     */
    @Transactional
    public void deactivate(UUID id) {
        Department department = findById(id);
        department.setActive(false);
        departmentRepository.save(department);
    }

    private Site resolveSite(UUID siteId) {
        if (siteId == null) {
            return null;
        }
        return siteRepository.findById(siteId)
                .orElseThrow(() -> new IllegalArgumentException("Site invalide"));
    }
}

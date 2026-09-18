package com.pfo.koraya.organization;

import com.pfo.koraya.audit.AuditLogService;
import com.pfo.koraya.user.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class DepartmentService {

    private final DepartmentRepository departmentRepository;
    private final SiteRepository siteRepository;
    private final UserRepository userRepository;
    private final AuditLogService auditLogService;

    public Page<Department> findAll(Pageable pageable) {
        return departmentRepository.findAll(pageable);
    }

    public Department findById(UUID id) {
        return departmentRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Departement introuvable"));
    }

    @Transactional
    public Department create(String name, UUID siteId, UUID actorId) {
        String trimmed = name.trim();
        if (existsByNameAndSite(trimmed, siteId, null)) {
            throw new IllegalStateException("Un departement avec ce nom existe deja pour ce site");
        }
        Department department = new Department();
        department.setName(trimmed);
        department.setSite(resolveSite(siteId));
        Department saved = departmentRepository.save(department);
        auditLogService.record(actorId, "DEPARTMENT_CREATED", "Department", saved.getId(),
                "Departement cree : " + saved.getName());
        return saved;
    }

    @Transactional
    public Department update(UUID id, String name, UUID siteId, boolean active, UUID actorId) {
        Department department = findById(id);
        String trimmed = name.trim();
        if (existsByNameAndSite(trimmed, siteId, id)) {
            throw new IllegalStateException("Un departement avec ce nom existe deja pour ce site");
        }
        department.setName(trimmed);
        department.setSite(resolveSite(siteId));
        department.setActive(active);
        Department saved = departmentRepository.save(department);
        auditLogService.record(actorId, "DEPARTMENT_UPDATED", "Department", saved.getId(),
                "Departement mis a jour : " + saved.getName());
        return saved;
    }

    /**
     * Un nom de departement doit etre unique au sein d'un meme site (le
     * "transverse", site=null, forme son propre groupe) : rien n'empechait
     * jusqu'ici deux departements "IT" transverses identiques d'exister.
     */
    private boolean existsByNameAndSite(String name, UUID siteId, UUID excludeId) {
        if (siteId == null) {
            return excludeId == null
                    ? departmentRepository.existsByNameIgnoreCaseAndSiteIsNull(name)
                    : departmentRepository.existsByNameIgnoreCaseAndSiteIsNullAndIdNot(name, excludeId);
        }
        return excludeId == null
                ? departmentRepository.existsByNameIgnoreCaseAndSiteId(name, siteId)
                : departmentRepository.existsByNameIgnoreCaseAndSiteIdAndIdNot(name, siteId, excludeId);
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

    /**
     * Suppression physique, irreversible. Refusee si le departement est
     * encore reference par un utilisateur (contrainte FK reelle en base sur
     * app_user.department_id).
     */
    @Transactional
    public void hardDelete(UUID id, UUID actorId) {
        Department department = findById(id);
        if (userRepository.existsByDepartmentId(id)) {
            throw new IllegalStateException(
                    "Impossible de supprimer definitivement ce departement : encore reference par au moins un utilisateur.");
        }
        String name = department.getName();
        departmentRepository.delete(department);
        auditLogService.record(actorId, "DEPARTMENT_HARD_DELETED", "Department", id,
                "Departement supprime definitivement : " + name);
    }

    private Site resolveSite(UUID siteId) {
        if (siteId == null) {
            return null;
        }
        return siteRepository.findById(siteId)
                .orElseThrow(() -> new IllegalArgumentException("Site invalide"));
    }
}

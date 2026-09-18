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
public class SiteService {

    private final SiteRepository siteRepository;
    private final DepartmentRepository departmentRepository;
    private final UserRepository userRepository;
    private final AuditLogService auditLogService;

    public Page<Site> findAll(Pageable pageable) {
        return siteRepository.findAll(pageable);
    }

    public Site findById(UUID id) {
        return siteRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Site introuvable"));
    }

    @Transactional
    public Site create(String name, String address, UUID actorId) {
        String trimmed = name.trim();
        if (siteRepository.existsByNameIgnoreCase(trimmed)) {
            throw new IllegalStateException("Un site avec ce nom existe deja");
        }
        Site site = new Site();
        site.setName(trimmed);
        site.setAddress(address == null || address.isBlank() ? null : address.trim());
        Site saved = siteRepository.save(site);
        auditLogService.record(actorId, "SITE_CREATED", "Site", saved.getId(), "Site cree : " + saved.getName());
        return saved;
    }

    @Transactional
    public Site update(UUID id, String name, String address, boolean active, UUID actorId) {
        Site site = findById(id);
        String trimmed = name.trim();
        if (siteRepository.existsByNameIgnoreCaseAndIdNot(trimmed, id)) {
            throw new IllegalStateException("Un site avec ce nom existe deja");
        }
        site.setName(trimmed);
        site.setAddress(address == null || address.isBlank() ? null : address.trim());
        site.setActive(active);
        Site saved = siteRepository.save(site);
        auditLogService.record(actorId, "SITE_UPDATED", "Site", saved.getId(), "Site mis a jour : " + saved.getName());
        return saved;
    }

    /**
     * "Suppression" = desactivation : un site reference par des users/departements
     * ne peut pas etre supprime physiquement sans casser l'integrite referentielle.
     */
    @Transactional
    public void deactivate(UUID id, UUID actorId) {
        Site site = findById(id);
        site.setActive(false);
        siteRepository.save(site);
        auditLogService.record(actorId, "SITE_DEACTIVATED", "Site", site.getId(), "Site desactive : " + site.getName());
    }

    /**
     * Suppression physique, irreversible. Refusee si le site est encore
     * reference par un departement ou un utilisateur (contrainte FK reelle
     * en base sur department.site_id / app_user.site_id).
     */
    @Transactional
    public void hardDelete(UUID id, UUID actorId) {
        Site site = findById(id);
        if (departmentRepository.existsBySiteId(id) || userRepository.existsBySiteId(id)) {
            throw new IllegalStateException(
                    "Impossible de supprimer definitivement ce site : encore reference par au moins un departement ou utilisateur.");
        }
        String name = site.getName();
        siteRepository.delete(site);
        auditLogService.record(actorId, "SITE_HARD_DELETED", "Site", id, "Site supprime definitivement : " + name);
    }
}

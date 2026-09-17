package com.pfo.koraya.organization;

import com.pfo.koraya.audit.AuditLogService;
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
        Site site = new Site();
        site.setName(name.trim());
        site.setAddress(address == null || address.isBlank() ? null : address.trim());
        Site saved = siteRepository.save(site);
        auditLogService.record(actorId, "SITE_CREATED", "Site", saved.getId(), "Site cree : " + saved.getName());
        return saved;
    }

    @Transactional
    public Site update(UUID id, String name, String address, boolean active, UUID actorId) {
        Site site = findById(id);
        site.setName(name.trim());
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
}

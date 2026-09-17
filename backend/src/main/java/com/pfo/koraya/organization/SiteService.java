package com.pfo.koraya.organization;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class SiteService {

    private final SiteRepository siteRepository;

    public List<Site> findAll() {
        return siteRepository.findAll();
    }

    public Site findById(UUID id) {
        return siteRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Site introuvable"));
    }

    @Transactional
    public Site create(String name, String address) {
        Site site = new Site();
        site.setName(name.trim());
        site.setAddress(address == null || address.isBlank() ? null : address.trim());
        return siteRepository.save(site);
    }

    @Transactional
    public Site update(UUID id, String name, String address, boolean active) {
        Site site = findById(id);
        site.setName(name.trim());
        site.setAddress(address == null || address.isBlank() ? null : address.trim());
        site.setActive(active);
        return siteRepository.save(site);
    }

    /**
     * "Suppression" = desactivation : un site reference par des users/departements
     * ne peut pas etre supprime physiquement sans casser l'integrite referentielle.
     */
    @Transactional
    public void deactivate(UUID id) {
        Site site = findById(id);
        site.setActive(false);
        siteRepository.save(site);
    }
}

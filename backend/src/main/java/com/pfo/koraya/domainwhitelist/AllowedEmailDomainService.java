package com.pfo.koraya.domainwhitelist;

import com.pfo.koraya.audit.AuditLogService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AllowedEmailDomainService {

    private final AllowedEmailDomainRepository repository;
    private final AuditLogService auditLogService;

    public List<AllowedEmailDomain> findAllActive() {
        return repository.findByActiveTrue();
    }

    public List<AllowedEmailDomain> findAll() {
        return repository.findAll();
    }

    /**
     * Cf. Bible SS4.3 : toute modification de la liste des domaines est tracee en audit_log.
     */
    @Transactional
    public AllowedEmailDomain create(String domain, UUID actorId) {
        String cleanDomain = domain.trim().toLowerCase().replaceFirst("^@", "");
        if (repository.findByDomainIgnoreCase(cleanDomain).isPresent()) {
            throw new IllegalStateException("Ce domaine existe deja");
        }
        AllowedEmailDomain entity = new AllowedEmailDomain();
        entity.setDomain(cleanDomain);
        entity.setCreatedBy(actorId);
        AllowedEmailDomain saved = repository.save(entity);
        auditLogService.record(actorId, "DOMAIN_CREATED", "AllowedEmailDomain", saved.getId(),
                "Domaine ajoute : " + cleanDomain);
        return saved;
    }

    @Transactional
    public AllowedEmailDomain setActive(UUID id, boolean active, UUID actorId) {
        AllowedEmailDomain entity = repository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Domaine introuvable"));

        if (active) {
            entity.setActive(true);
            repository.save(entity);
        } else {
            deactivate(entity);
        }

        auditLogService.record(actorId, active ? "DOMAIN_ACTIVATED" : "DOMAIN_DEACTIVATED",
                "AllowedEmailDomain", entity.getId(), "Domaine : " + entity.getDomain());
        return entity;
    }

    public boolean isDomainAllowed(String domain) {
        return repository.findByDomainIgnoreCase(domain)
                .map(AllowedEmailDomain::isActive)
                .orElse(false);
    }

    /**
     * Garde-fou : refuse de desactiver le dernier domaine actif du systeme,
     * sinon plus aucun utilisateur ne pourrait creer de compte.
     */
    @Transactional
    public void deactivate(AllowedEmailDomain domainToDeactivate) {
        long activeCount = repository.findByActiveTrue().size();
        if (activeCount <= 1 && domainToDeactivate.isActive()) {
            throw new IllegalStateException(
                    "Impossible de desactiver le dernier domaine email actif du systeme.");
        }
        domainToDeactivate.setActive(false);
        repository.save(domainToDeactivate);
    }

    /**
     * Compose une adresse email a partir d'un alias et d'un domaine
     * (ex: "saint-pierre.kassi" + "pfoafrica-senegal.com").
     */
    public String composeEmail(String alias, String domain) {
        String cleanAlias = alias.trim().toLowerCase();
        String cleanDomain = domain.trim().toLowerCase().replaceFirst("^@", "");
        return cleanAlias + "@" + cleanDomain;
    }
}

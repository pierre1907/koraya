package com.pfo.koraya.domainwhitelist;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AllowedEmailDomainService {

    private final AllowedEmailDomainRepository repository;

    public List<AllowedEmailDomain> findAllActive() {
        return repository.findByActiveTrue();
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

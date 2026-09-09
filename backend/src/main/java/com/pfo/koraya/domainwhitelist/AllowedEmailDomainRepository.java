package com.pfo.koraya.domainwhitelist;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface AllowedEmailDomainRepository extends JpaRepository<AllowedEmailDomain, UUID> {

    List<AllowedEmailDomain> findByActiveTrue();

    Optional<AllowedEmailDomain> findByDomainIgnoreCase(String domain);
}

package com.pfo.koraya.domainwhitelist;

import com.github.f4b6a3.uuid.UuidCreator;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.Instant;
import java.util.UUID;

/**
 * Domaine email autorise a creer un compte utilisateur.
 * Stocke sans le "@" (ex: "pfoafrica-senegal.com").
 */
@Entity
@Table(name = "allowed_email_domain")
@Getter
@Setter
@NoArgsConstructor
public class AllowedEmailDomain {

    @Id
    private UUID id;

    @Column(nullable = false, unique = true)
    private String domain;

    @Column(name = "is_active", nullable = false)
    private boolean active = true;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @Column(name = "created_by")
    private UUID createdBy;

    @PrePersist
    void prePersist() {
        if (id == null) {
            id = UuidCreator.getTimeOrderedEpoch();
        }
        if (createdAt == null) {
            createdAt = Instant.now();
        }
        if (domain != null) {
            domain = domain.toLowerCase().replaceFirst("^@", "");
        }
    }
}

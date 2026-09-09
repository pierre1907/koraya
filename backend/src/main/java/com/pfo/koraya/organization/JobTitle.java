package com.pfo.koraya.organization;

import com.github.f4b6a3.uuid.UuidCreator;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.Instant;
import java.util.UUID;

/**
 * Poste occupe par un utilisateur.
 * Liste extensible : si le poste saisi n'existe pas encore,
 * il est cree a la volee depuis le formulaire utilisateur.
 */
@Entity
@Table(name = "job_title")
@Getter
@Setter
@NoArgsConstructor
public class JobTitle {

    @Id
    private UUID id;

    @Column(nullable = false, unique = true)
    private String title;

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
    }
}

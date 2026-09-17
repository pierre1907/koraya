package com.pfo.koraya.audit.dto;

import com.pfo.koraya.audit.AuditLog;

import java.time.Instant;
import java.util.UUID;

public record AuditLogSummary(
        UUID id,
        UUID actorUserId,
        String action,
        String entityType,
        UUID entityId,
        String details,
        Instant createdAt
) {
    public static AuditLogSummary of(AuditLog log) {
        return new AuditLogSummary(
                log.getId(), log.getActorUserId(), log.getAction(),
                log.getEntityType(), log.getEntityId(), log.getDetails(), log.getCreatedAt());
    }
}

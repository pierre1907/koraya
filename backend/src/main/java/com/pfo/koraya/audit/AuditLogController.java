package com.pfo.koraya.audit;

import com.pfo.koraya.audit.dto.AuditLogSummary;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/admin/audit-logs")
@RequiredArgsConstructor
public class AuditLogController {

    private final AuditLogService auditLogService;

    @GetMapping
    public ResponseEntity<List<AuditLogSummary>> list() {
        List<AuditLogSummary> logs = auditLogService.findRecent().stream()
                .map(AuditLogSummary::of)
                .toList();
        return ResponseEntity.ok(logs);
    }
}

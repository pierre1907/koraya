package com.pfo.koraya.audit;

import com.pfo.koraya.audit.dto.AuditLogSummary;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin/audit-logs")
@RequiredArgsConstructor
public class AuditLogController {

    private final AuditLogService auditLogService;

    @GetMapping
    public ResponseEntity<Page<AuditLogSummary>> list(@PageableDefault(size = 10) Pageable pageable) {
        return ResponseEntity.ok(auditLogService.findRecent(pageable).map(AuditLogSummary::of));
    }
}

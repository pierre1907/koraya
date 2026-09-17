package com.pfo.koraya.organization;

import com.pfo.koraya.organization.dto.SiteAdminResponse;
import com.pfo.koraya.organization.dto.SiteRequest;
import com.pfo.koraya.organization.dto.SiteUpdateRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/admin/sites")
@RequiredArgsConstructor
public class SiteAdminController {

    private final SiteService siteService;

    @GetMapping
    public ResponseEntity<List<SiteAdminResponse>> list() {
        return ResponseEntity.ok(siteService.findAll().stream().map(SiteAdminResponse::of).toList());
    }

    @PostMapping
    public ResponseEntity<SiteAdminResponse> create(@Valid @RequestBody SiteRequest request) {
        Site site = siteService.create(request.name(), request.address());
        return ResponseEntity.status(HttpStatus.CREATED).body(SiteAdminResponse.of(site));
    }

    @PutMapping("/{id}")
    public ResponseEntity<SiteAdminResponse> update(@PathVariable UUID id, @Valid @RequestBody SiteUpdateRequest request) {
        Site site = siteService.update(id, request.name(), request.address(), request.active());
        return ResponseEntity.ok(SiteAdminResponse.of(site));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deactivate(@PathVariable UUID id) {
        siteService.deactivate(id);
        return ResponseEntity.noContent().build();
    }
}

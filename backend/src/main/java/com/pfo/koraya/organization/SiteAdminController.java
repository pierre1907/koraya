package com.pfo.koraya.organization;

import com.pfo.koraya.organization.dto.SiteAdminResponse;
import com.pfo.koraya.organization.dto.SiteRequest;
import com.pfo.koraya.organization.dto.SiteUpdateRequest;
import com.pfo.koraya.user.User;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
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
    public ResponseEntity<SiteAdminResponse> create(
            @Valid @RequestBody SiteRequest request, @AuthenticationPrincipal User currentUser) {
        Site site = siteService.create(request.name(), request.address(), currentUser.getId());
        return ResponseEntity.status(HttpStatus.CREATED).body(SiteAdminResponse.of(site));
    }

    @PutMapping("/{id}")
    public ResponseEntity<SiteAdminResponse> update(
            @PathVariable UUID id, @Valid @RequestBody SiteUpdateRequest request,
            @AuthenticationPrincipal User currentUser) {
        Site site = siteService.update(id, request.name(), request.address(), request.active(), currentUser.getId());
        return ResponseEntity.ok(SiteAdminResponse.of(site));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deactivate(@PathVariable UUID id, @AuthenticationPrincipal User currentUser) {
        siteService.deactivate(id, currentUser.getId());
        return ResponseEntity.noContent().build();
    }
}

package com.pfo.koraya.domainwhitelist;

import com.pfo.koraya.domainwhitelist.dto.AllowedEmailDomainAdminResponse;
import com.pfo.koraya.domainwhitelist.dto.AllowedEmailDomainRequest;
import com.pfo.koraya.domainwhitelist.dto.AllowedEmailDomainStatusRequest;
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
@RequestMapping("/api/admin/allowed-domains")
@RequiredArgsConstructor
public class AllowedEmailDomainAdminController {

    private final AllowedEmailDomainService allowedEmailDomainService;

    @GetMapping
    public ResponseEntity<List<AllowedEmailDomainAdminResponse>> list() {
        return ResponseEntity.ok(allowedEmailDomainService.findAll().stream()
                .map(AllowedEmailDomainAdminResponse::of)
                .toList());
    }

    @PostMapping
    public ResponseEntity<AllowedEmailDomainAdminResponse> create(
            @Valid @RequestBody AllowedEmailDomainRequest request, @AuthenticationPrincipal User currentUser) {
        AllowedEmailDomain domain = allowedEmailDomainService.create(request.domain(), currentUser.getId());
        return ResponseEntity.status(HttpStatus.CREATED).body(AllowedEmailDomainAdminResponse.of(domain));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<AllowedEmailDomainAdminResponse> setStatus(
            @PathVariable UUID id,
            @Valid @RequestBody AllowedEmailDomainStatusRequest request,
            @AuthenticationPrincipal User currentUser) {
        AllowedEmailDomain domain = allowedEmailDomainService.setActive(id, request.active(), currentUser.getId());
        return ResponseEntity.ok(AllowedEmailDomainAdminResponse.of(domain));
    }
}

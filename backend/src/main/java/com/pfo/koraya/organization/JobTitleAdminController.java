package com.pfo.koraya.organization;

import com.pfo.koraya.organization.dto.JobTitleAdminResponse;
import com.pfo.koraya.organization.dto.JobTitleRequest;
import com.pfo.koraya.organization.dto.JobTitleUpdateRequest;
import com.pfo.koraya.user.User;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/admin/job-titles")
@RequiredArgsConstructor
public class JobTitleAdminController {

    private final JobTitleService jobTitleService;

    @GetMapping
    public ResponseEntity<Page<JobTitleAdminResponse>> list(
            @PageableDefault(size = 10, sort = "title") Pageable pageable) {
        return ResponseEntity.ok(jobTitleService.findAll(pageable).map(JobTitleAdminResponse::of));
    }

    @PostMapping
    public ResponseEntity<JobTitleAdminResponse> create(
            @Valid @RequestBody JobTitleRequest request, @AuthenticationPrincipal User currentUser) {
        JobTitle jobTitle = jobTitleService.create(request.title(), currentUser.getId());
        return ResponseEntity.status(HttpStatus.CREATED).body(JobTitleAdminResponse.of(jobTitle));
    }

    @PutMapping("/{id}")
    public ResponseEntity<JobTitleAdminResponse> update(
            @PathVariable UUID id, @Valid @RequestBody JobTitleUpdateRequest request,
            @AuthenticationPrincipal User currentUser) {
        JobTitle jobTitle = jobTitleService.update(id, request.title(), request.active(), currentUser.getId());
        return ResponseEntity.ok(JobTitleAdminResponse.of(jobTitle));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deactivate(@PathVariable UUID id, @AuthenticationPrincipal User currentUser) {
        jobTitleService.deactivate(id, currentUser.getId());
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{id}/hard")
    public ResponseEntity<Void> hardDelete(@PathVariable UUID id, @AuthenticationPrincipal User currentUser) {
        jobTitleService.hardDelete(id, currentUser.getId());
        return ResponseEntity.noContent().build();
    }
}

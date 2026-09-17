package com.pfo.koraya.organization;

import com.pfo.koraya.organization.dto.JobTitleAdminResponse;
import com.pfo.koraya.organization.dto.JobTitleRequest;
import com.pfo.koraya.organization.dto.JobTitleUpdateRequest;
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
@RequestMapping("/api/admin/job-titles")
@RequiredArgsConstructor
public class JobTitleAdminController {

    private final JobTitleService jobTitleService;

    @GetMapping
    public ResponseEntity<List<JobTitleAdminResponse>> list() {
        return ResponseEntity.ok(jobTitleService.findAll().stream().map(JobTitleAdminResponse::of).toList());
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
}

package com.pfo.koraya.organization;

import com.pfo.koraya.organization.dto.DepartmentAdminResponse;
import com.pfo.koraya.organization.dto.DepartmentRequest;
import com.pfo.koraya.organization.dto.DepartmentUpdateRequest;
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
@RequestMapping("/api/admin/departments")
@RequiredArgsConstructor
public class DepartmentAdminController {

    private final DepartmentService departmentService;

    @GetMapping
    public ResponseEntity<Page<DepartmentAdminResponse>> list(
            @PageableDefault(size = 20, sort = "name") Pageable pageable) {
        return ResponseEntity.ok(departmentService.findAll(pageable).map(DepartmentAdminResponse::of));
    }

    @PostMapping
    public ResponseEntity<DepartmentAdminResponse> create(
            @Valid @RequestBody DepartmentRequest request, @AuthenticationPrincipal User currentUser) {
        Department department = departmentService.create(request.name(), request.siteId(), currentUser.getId());
        return ResponseEntity.status(HttpStatus.CREATED).body(DepartmentAdminResponse.of(department));
    }

    @PutMapping("/{id}")
    public ResponseEntity<DepartmentAdminResponse> update(
            @PathVariable UUID id, @Valid @RequestBody DepartmentUpdateRequest request,
            @AuthenticationPrincipal User currentUser) {
        Department department = departmentService.update(
                id, request.name(), request.siteId(), request.active(), currentUser.getId());
        return ResponseEntity.ok(DepartmentAdminResponse.of(department));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deactivate(@PathVariable UUID id, @AuthenticationPrincipal User currentUser) {
        departmentService.deactivate(id, currentUser.getId());
        return ResponseEntity.noContent().build();
    }
}

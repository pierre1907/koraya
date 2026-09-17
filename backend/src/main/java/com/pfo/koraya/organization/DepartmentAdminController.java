package com.pfo.koraya.organization;

import com.pfo.koraya.organization.dto.DepartmentAdminResponse;
import com.pfo.koraya.organization.dto.DepartmentRequest;
import com.pfo.koraya.organization.dto.DepartmentUpdateRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/admin/departments")
@RequiredArgsConstructor
public class DepartmentAdminController {

    private final DepartmentService departmentService;

    @GetMapping
    public ResponseEntity<List<DepartmentAdminResponse>> list() {
        return ResponseEntity.ok(departmentService.findAll().stream().map(DepartmentAdminResponse::of).toList());
    }

    @PostMapping
    public ResponseEntity<DepartmentAdminResponse> create(@Valid @RequestBody DepartmentRequest request) {
        Department department = departmentService.create(request.name(), request.siteId());
        return ResponseEntity.status(HttpStatus.CREATED).body(DepartmentAdminResponse.of(department));
    }

    @PutMapping("/{id}")
    public ResponseEntity<DepartmentAdminResponse> update(
            @PathVariable UUID id, @Valid @RequestBody DepartmentUpdateRequest request) {
        Department department = departmentService.update(id, request.name(), request.siteId(), request.active());
        return ResponseEntity.ok(DepartmentAdminResponse.of(department));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deactivate(@PathVariable UUID id) {
        departmentService.deactivate(id);
        return ResponseEntity.noContent().build();
    }
}

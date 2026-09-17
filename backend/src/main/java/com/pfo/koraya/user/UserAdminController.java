package com.pfo.koraya.user;

import com.pfo.koraya.user.dto.UserAdminCreateRequest;
import com.pfo.koraya.user.dto.UserAdminResponse;
import com.pfo.koraya.user.dto.UserAdminUpdateRequest;
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
@RequestMapping("/api/admin/users")
@RequiredArgsConstructor
public class UserAdminController {

    private final UserAdminService userAdminService;

    @GetMapping
    public ResponseEntity<Page<UserAdminResponse>> list(
            @PageableDefault(size = 20, sort = "fullName") Pageable pageable) {
        return ResponseEntity.ok(userAdminService.findAll(pageable).map(UserAdminResponse::of));
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserAdminResponse> get(@PathVariable UUID id) {
        return ResponseEntity.ok(UserAdminResponse.of(userAdminService.findById(id)));
    }

    @PostMapping
    public ResponseEntity<UserAdminResponse> create(
            @Valid @RequestBody UserAdminCreateRequest request, @AuthenticationPrincipal User currentUser) {
        User created = userAdminService.create(request, currentUser.getId());
        return ResponseEntity.status(HttpStatus.CREATED).body(UserAdminResponse.of(created));
    }

    @PutMapping("/{id}")
    public ResponseEntity<UserAdminResponse> update(
            @PathVariable UUID id,
            @Valid @RequestBody UserAdminUpdateRequest request,
            @AuthenticationPrincipal User currentUser) {
        User updated = userAdminService.update(id, request, currentUser.getId());
        return ResponseEntity.ok(UserAdminResponse.of(updated));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deactivate(@PathVariable UUID id, @AuthenticationPrincipal User currentUser) {
        userAdminService.deactivate(id, currentUser.getId());
        return ResponseEntity.noContent().build();
    }
}

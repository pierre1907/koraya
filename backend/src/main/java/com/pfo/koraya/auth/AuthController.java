package com.pfo.koraya.auth;

import com.pfo.koraya.auth.dto.AllowedDomainSummary;
import com.pfo.koraya.auth.dto.LoginRequest;
import com.pfo.koraya.auth.dto.LoginResponse;
import com.pfo.koraya.auth.dto.RegisterRequest;
import com.pfo.koraya.auth.dto.SiteSummary;
import com.pfo.koraya.domainwhitelist.AllowedEmailDomain;
import com.pfo.koraya.domainwhitelist.AllowedEmailDomainService;
import com.pfo.koraya.organization.Site;
import com.pfo.koraya.organization.SiteRepository;
import com.pfo.koraya.user.Role;
import com.pfo.koraya.user.User;
import com.pfo.koraya.user.UserRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.List;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final UserRepository userRepository;
    private final SiteRepository siteRepository;
    private final AllowedEmailDomainService allowedEmailDomainService;
    private final PasswordEncoder passwordEncoder;

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.email(), request.password())
        );

        User user = userRepository.findByEmailIgnoreCase(request.email())
                .orElseThrow(() -> new BadCredentialsException("Identifiants invalides"));

        user.setLastLoginAt(Instant.now());
        userRepository.save(user);

        String accessToken = jwtService.generateAccessToken(user);

        return ResponseEntity.ok(LoginResponse.of(accessToken, user.getFullName(), user.getRole().name()));
    }

    @GetMapping("/register/sites")
    public ResponseEntity<List<SiteSummary>> listRegistrableSites() {
        List<SiteSummary> sites = siteRepository.findByActiveTrue().stream()
                .map(SiteSummary::of)
                .toList();
        return ResponseEntity.ok(sites);
    }

    @GetMapping("/register/domains")
    public ResponseEntity<List<AllowedDomainSummary>> listRegistrableDomains() {
        List<AllowedDomainSummary> domains = allowedEmailDomainService.findAllActive().stream()
                .map(AllowedDomainSummary::of)
                .toList();
        return ResponseEntity.ok(domains);
    }

    @PostMapping("/register")
    public ResponseEntity<LoginResponse> register(@Valid @RequestBody RegisterRequest request) {
        AllowedEmailDomain domain = allowedEmailDomainService.findAllActive().stream()
                .filter(d -> d.getId().equals(request.emailDomainId()))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("Ce domaine email n'est pas autorise a creer un compte"));

        String email = allowedEmailDomainService.composeEmail(request.emailAlias(), domain.getDomain());
        if (userRepository.existsByEmailIgnoreCase(email)) {
            throw new IllegalStateException("Un compte existe deja avec cet email");
        }

        Site site = siteRepository.findById(request.siteId())
                .filter(Site::isActive)
                .orElseThrow(() -> new IllegalArgumentException("Site invalide"));

        User user = new User();
        user.setEmail(email);
        user.setPasswordHash(passwordEncoder.encode(request.password()));
        user.setFullName(request.firstName().trim() + " " + request.lastName().trim());
        user.setRole(Role.USER);
        user.setSite(site);
        userRepository.save(user);

        String accessToken = jwtService.generateAccessToken(user);

        return ResponseEntity.ok(LoginResponse.of(accessToken, user.getFullName(), user.getRole().name()));
    }
}

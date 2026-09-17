package com.pfo.koraya.user;

import com.pfo.koraya.audit.AuditLogService;
import com.pfo.koraya.domainwhitelist.AllowedEmailDomain;
import com.pfo.koraya.domainwhitelist.AllowedEmailDomainService;
import com.pfo.koraya.organization.Department;
import com.pfo.koraya.organization.DepartmentRepository;
import com.pfo.koraya.organization.JobTitle;
import com.pfo.koraya.organization.JobTitleRepository;
import com.pfo.koraya.organization.Site;
import com.pfo.koraya.organization.SiteRepository;
import com.pfo.koraya.user.dto.UserAdminCreateRequest;
import com.pfo.koraya.user.dto.UserAdminUpdateRequest;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class UserAdminService {

    private final UserRepository userRepository;
    private final SiteRepository siteRepository;
    private final DepartmentRepository departmentRepository;
    private final JobTitleRepository jobTitleRepository;
    private final AllowedEmailDomainService allowedEmailDomainService;
    private final PasswordEncoder passwordEncoder;
    private final AuditLogService auditLogService;

    public List<User> findAll() {
        return userRepository.findAll();
    }

    public User findById(UUID id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Utilisateur introuvable"));
    }

    @Transactional
    public User create(UserAdminCreateRequest request, UUID actorId) {
        AllowedEmailDomain domain = allowedEmailDomainService.findAllActive().stream()
                .filter(d -> d.getId().equals(request.emailDomainId()))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("Ce domaine email n'est pas autorise a creer un compte"));

        String email = allowedEmailDomainService.composeEmail(request.emailAlias(), domain.getDomain());
        if (userRepository.existsByEmailIgnoreCase(email)) {
            throw new IllegalStateException("Un compte existe deja avec cet email");
        }

        User user = new User();
        user.setEmail(email);
        user.setPasswordHash(passwordEncoder.encode(request.password()));
        user.setFullName(request.fullName().trim());
        user.setRole(request.role());
        user.setSite(resolveSite(request.siteId()));
        user.setDepartment(resolveDepartment(request.departmentId()));
        user.setJobTitle(resolveJobTitle(request.jobTitleId()));
        user.setPhoneNumber(request.phoneNumber());
        user.setCreatedBy(actorId);

        User saved = userRepository.save(user);
        auditLogService.record(actorId, "USER_CREATED", "User", saved.getId(), "Compte cree : " + email);
        return saved;
    }

    @Transactional
    public User update(UUID id, UserAdminUpdateRequest request, UUID actorId) {
        User user = findById(id);
        user.setFullName(request.fullName().trim());
        user.setRole(request.role());
        user.setSite(resolveSite(request.siteId()));
        user.setDepartment(resolveDepartment(request.departmentId()));
        user.setJobTitle(resolveJobTitle(request.jobTitleId()));
        user.setPhoneNumber(request.phoneNumber());
        user.setActive(request.active());

        User saved = userRepository.save(user);
        auditLogService.record(actorId, "USER_UPDATED", "User", saved.getId(), "Profil mis a jour");
        return saved;
    }

    /**
     * "Suppression" = desactivation : un user est conserve en base pour l'historique
     * (affectations d'actifs, audit) mais ne peut plus se connecter.
     */
    @Transactional
    public void deactivate(UUID id, UUID actorId) {
        User user = findById(id);
        user.setActive(false);
        userRepository.save(user);
        auditLogService.record(actorId, "USER_DELETED", "User", user.getId(), "Compte desactive : " + user.getEmail());
    }

    private Site resolveSite(UUID siteId) {
        return siteRepository.findById(siteId)
                .filter(Site::isActive)
                .orElseThrow(() -> new IllegalArgumentException("Site invalide"));
    }

    private Department resolveDepartment(UUID departmentId) {
        if (departmentId == null) {
            return null;
        }
        return departmentRepository.findById(departmentId)
                .orElseThrow(() -> new IllegalArgumentException("Departement invalide"));
    }

    private JobTitle resolveJobTitle(UUID jobTitleId) {
        if (jobTitleId == null) {
            return null;
        }
        return jobTitleRepository.findById(jobTitleId)
                .orElseThrow(() -> new IllegalArgumentException("Poste invalide"));
    }
}

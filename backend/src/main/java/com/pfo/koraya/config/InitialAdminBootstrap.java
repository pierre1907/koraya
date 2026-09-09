package com.pfo.koraya.config;

import com.pfo.koraya.organization.Site;
import com.pfo.koraya.organization.SiteRepository;
import com.pfo.koraya.user.Role;
import com.pfo.koraya.user.User;
import com.pfo.koraya.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

/**
 * Cree le tout premier compte ADMIN au demarrage si la table app_user est vide.
 * Les identifiants sont lus depuis des variables d'environnement
 * (jamais de valeur en dur en production).
 */
@Component
@RequiredArgsConstructor
public class InitialAdminBootstrap implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(InitialAdminBootstrap.class);

    private final UserRepository userRepository;
    private final SiteRepository siteRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${koraya.bootstrap.admin-email:}")
    private String bootstrapAdminEmail;

    @Value("${koraya.bootstrap.admin-password:}")
    private String bootstrapAdminPassword;

    @Value("${koraya.bootstrap.admin-full-name:Administrateur}")
    private String bootstrapAdminFullName;

    @Override
    public void run(String... args) {
        if (userRepository.count() > 0) {
            return;
        }
        if (bootstrapAdminEmail.isBlank() || bootstrapAdminPassword.isBlank()) {
            log.warn("Aucun utilisateur en base et aucune variable KORAYA_BOOTSTRAP_ADMIN_EMAIL / "
                    + "KORAYA_BOOTSTRAP_ADMIN_PASSWORD fournie : le premier admin doit etre cree manuellement.");
            return;
        }

        Site defaultSite = siteRepository.findAll().stream()
                .findFirst()
                .orElseThrow(() -> new IllegalStateException(
                        "Aucun site en base : impossible de creer le premier admin."));

        User admin = new User();
        admin.setEmail(bootstrapAdminEmail.toLowerCase());
        admin.setPasswordHash(passwordEncoder.encode(bootstrapAdminPassword));
        admin.setFullName(bootstrapAdminFullName);
        admin.setRole(Role.ADMIN);
        admin.setSite(defaultSite);
        admin.setActive(true);

        userRepository.save(admin);
        log.info("Premier compte ADMIN cree pour {}", admin.getEmail());
    }
}

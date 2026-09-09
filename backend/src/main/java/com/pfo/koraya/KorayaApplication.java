package com.pfo.koraya;

import com.pfo.koraya.config.JwtProperties;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;

/**
 * Point d'entree de l'application Koraya.
 *
 * Koraya - plateforme SaaS mono-tenant de digitalisation
 * des operations internes.
 *
 * @author Saint-Pierre KASSI
 */
@SpringBootApplication
@EnableConfigurationProperties(JwtProperties.class)
public class KorayaApplication {

    public static void main(String[] args) {
        SpringApplication.run(KorayaApplication.class, args);
    }
}

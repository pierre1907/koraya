package com.pfo.koraya.auth;

import com.pfo.koraya.config.JwtProperties;
import com.pfo.koraya.user.User;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Base64;
import java.util.HexFormat;
import java.util.Optional;

/**
 * Le refresh token est une chaine aleatoire opaque (pas un JWT) stockee hashee
 * en base : ca permet de le revoquer/rotater individuellement, ce qu'un JWT
 * auto-porteur ne permet pas sans liste de revocation.
 */
@Service
@RequiredArgsConstructor
public class RefreshTokenService {

    private final RefreshTokenRepository repository;
    private final JwtProperties jwtProperties;
    private final SecureRandom secureRandom = new SecureRandom();

    @Transactional
    public String issue(User user) {
        byte[] randomBytes = new byte[64];
        secureRandom.nextBytes(randomBytes);
        String rawToken = Base64.getUrlEncoder().withoutPadding().encodeToString(randomBytes);

        RefreshToken token = new RefreshToken();
        token.setUserId(user.getId());
        token.setTokenHash(hash(rawToken));
        token.setExpiresAt(Instant.now().plus(jwtProperties.refreshTokenExpirationDays(), ChronoUnit.DAYS));
        repository.save(token);

        return rawToken;
    }

    /**
     * Valide le refresh token et le revoque immediatement (rotation) :
     * l'appelant doit en emettre un nouveau via issue().
     */
    @Transactional
    public RefreshToken consume(String rawToken) {
        RefreshToken token = repository.findByTokenHash(hash(rawToken))
                .orElseThrow(() -> new BadCredentialsException("Refresh token invalide"));

        if (!token.isActive()) {
            throw new BadCredentialsException("Refresh token expire ou deja utilise");
        }

        token.setRevokedAt(Instant.now());
        repository.save(token);
        return token;
    }

    /**
     * Revoque le refresh token s'il existe et renvoie l'entite correspondante,
     * pour permettre a l'appelant de tracer le proprietaire en audit_log.
     */
    @Transactional
    public Optional<RefreshToken> revoke(String rawToken) {
        return repository.findByTokenHash(hash(rawToken)).map(token -> {
            token.setRevokedAt(Instant.now());
            return repository.save(token);
        });
    }

    private String hash(String rawToken) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hashed = digest.digest(rawToken.getBytes(StandardCharsets.UTF_8));
            return HexFormat.of().formatHex(hashed);
        } catch (NoSuchAlgorithmException e) {
            throw new IllegalStateException(e);
        }
    }
}

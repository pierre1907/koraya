package com.pfo.koraya.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.security.web.access.AccessDeniedHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.time.Instant;
import java.util.LinkedHashMap;
import java.util.Map;

/**
 * Sans ces handlers, Spring Security renvoie un 403 vide aussi bien pour un
 * token expire/absent (pas authentifie) que pour un role insuffisant (bien
 * authentifie), ce qui empeche le frontend de distinguer "reconnecte-toi" de
 * "tu n'as pas les droits". Ici : 401 pour le premier cas, 403 pour le second,
 * avec un message exploitable directement par le frontend.
 */
@Component
@RequiredArgsConstructor
public class SecurityErrorHandlers implements AuthenticationEntryPoint, AccessDeniedHandler {

    private final ObjectMapper objectMapper;

    @Override
    public void commence(HttpServletRequest request, HttpServletResponse response,
                          AuthenticationException authException) throws IOException {
        write(response, HttpStatus.UNAUTHORIZED,
                "Session expiree ou non authentifie. Merci de vous reconnecter.");
    }

    @Override
    public void handle(HttpServletRequest request, HttpServletResponse response,
                        AccessDeniedException accessDeniedException) throws IOException {
        write(response, HttpStatus.FORBIDDEN,
                "Vous n'avez pas les droits necessaires pour cette action.");
    }

    private void write(HttpServletResponse response, HttpStatus status, String message) throws IOException {
        response.setStatus(status.value());
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        Map<String, Object> body = new LinkedHashMap<>();
        body.put("timestamp", Instant.now().toString());
        body.put("status", status.value());
        body.put("error", message);
        objectMapper.writeValue(response.getWriter(), body);
    }
}

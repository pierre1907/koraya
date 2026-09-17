package com.pfo.koraya.audit;

import com.pfo.koraya.user.User;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

/**
 * Trace chaque consultation authentifiee (GET reussi) d'un endpoint /api/**,
 * en complement des actions de mutation deja tracees explicitement service
 * par service. Toute nouvelle route GET est ainsi auditee sans code
 * supplementaire a ecrire cote service/controller.
 */
@Component
@RequiredArgsConstructor
public class AuditViewInterceptor implements HandlerInterceptor {

    private final AuditLogService auditLogService;

    @Override
    public void afterCompletion(HttpServletRequest request, HttpServletResponse response,
                                 Object handler, Exception ex) {
        if (!"GET".equalsIgnoreCase(request.getMethod()) || response.getStatus() >= 300) {
            return;
        }

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (!(authentication != null && authentication.getPrincipal() instanceof User user)) {
            return;
        }

        String queryString = request.getQueryString();
        String details = queryString != null
                ? request.getRequestURI() + "?" + queryString
                : request.getRequestURI();

        auditLogService.record(user.getId(), "VIEWED", "Endpoint", null, details);
    }
}

package com.comicverse.auth.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

/**
 * Gateway Secret Validator Filter.
 *
 * Validates that all incoming requests contain the X-Gateway-Secret header
 * with the correct secret value.
 *
 * This prevents direct access to microservices bypassing the API Gateway.
 *
 * DEV implementation: Shared secret via environment variable.
 * PROD alternatives: mTLS, workload identity, Kubernetes NetworkPolicy.
 *   - No business logic changes required to migrate to mTLS.
 *   - Simply disable this filter and use mTLS at the infrastructure level.
 */
@Component
public class GatewaySecretFilter extends OncePerRequestFilter {

    private static final Logger log = LoggerFactory.getLogger(GatewaySecretFilter.class);

    public static final String GATEWAY_SECRET_HEADER = "X-Gateway-Secret";

    @Value("${gateway.secret:dev-gateway-secret}")
    private String expectedSecret;

    /**
     * Paths that bypass gateway secret validation (for health checks in Docker health probes).
     */
    private static final String HEALTH_PATH = "/api/v1/health";

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        return request.getRequestURI().equals(HEALTH_PATH)
                || request.getMethod().equals("OPTIONS");
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {
        String providedSecret = request.getHeader(GATEWAY_SECRET_HEADER);

        if (providedSecret == null || !providedSecret.equals(expectedSecret)) {
            // Log without revealing the actual secret value
            log.warn("Rejected request to {} — missing or invalid X-Gateway-Secret from {}",
                    request.getRequestURI(),
                    request.getRemoteAddr()
            );

            response.setStatus(HttpStatus.FORBIDDEN.value());
            response.setContentType(MediaType.APPLICATION_JSON_VALUE);
            response.getWriter().write("""
                    {
                      "status": 403,
                      "code": "FORBIDDEN",
                      "message": "Direct service access is not permitted."
                    }
                    """);
            return;
        }

        filterChain.doFilter(request, response);
    }
}

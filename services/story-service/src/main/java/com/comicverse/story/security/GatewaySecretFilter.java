package com.comicverse.story.security;

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

@Component
public class GatewaySecretFilter extends OncePerRequestFilter {

    private static final Logger log = LoggerFactory.getLogger(GatewaySecretFilter.class);
    public static final String GATEWAY_SECRET_HEADER = "X-Gateway-Secret";

    @Value("${gateway.secret:dev-gateway-secret}")
    private String expectedSecret;

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        return request.getRequestURI().startsWith("/api/v1/health")
                || request.getMethod().equals("OPTIONS");
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {
        String secret = request.getHeader(GATEWAY_SECRET_HEADER);
        if (secret == null || !secret.equals(expectedSecret)) {
            log.warn("Rejected direct access to story-service from {}", request.getRemoteAddr());
            response.setStatus(HttpStatus.FORBIDDEN.value());
            response.setContentType(MediaType.APPLICATION_JSON_VALUE);
            response.getWriter().write("{\"status\":403,\"code\":\"FORBIDDEN\",\"message\":\"Direct service access is not permitted.\"}");
            return;
        }
        filterChain.doFilter(request, response);
    }
}

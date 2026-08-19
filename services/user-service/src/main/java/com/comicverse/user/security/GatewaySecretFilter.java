package com.comicverse.user.security;

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

    @Value("${gateway.secret:dev-gateway-secret}")
    private String expectedSecret;

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        return request.getRequestURI().startsWith("/api/v1/health") || request.getMethod().equals("OPTIONS");
    }

    @Override
    protected void doFilterInternal(HttpServletRequest req, HttpServletResponse res, FilterChain chain)
            throws ServletException, IOException {
        String secret = req.getHeader("X-Gateway-Secret");
        if (secret == null || !secret.equals(expectedSecret)) {
            log.warn("Rejected direct access to user-service from {}", req.getRemoteAddr());
            res.setStatus(HttpStatus.FORBIDDEN.value());
            res.setContentType(MediaType.APPLICATION_JSON_VALUE);
            res.getWriter().write("{\"status\":403,\"code\":\"FORBIDDEN\",\"message\":\"Direct service access is not permitted.\"}");
            return;
        }
        chain.doFilter(req, res);
    }
}

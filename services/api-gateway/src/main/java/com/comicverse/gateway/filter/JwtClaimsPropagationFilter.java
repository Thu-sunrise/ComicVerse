package com.comicverse.gateway.filter;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.core.Ordered;
import org.springframework.security.core.context.ReactiveSecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

/**
 * JWT Claims Propagation Filter.
 *
 * After Spring Security validates the JWT, this filter extracts
 * claims and forwards them to downstream services as HTTP headers.
 *
 * Downstream services MUST NOT re-validate JWT tokens.
 * They trust the gateway-provided headers for identity information.
 *
 * Forwarded headers:
 *   X-Auth-User-Id    — Subject (user ID)
 *   X-Auth-Username   — Username claim
 *   X-Auth-Roles      — Roles claim (comma-separated)
 *   X-Auth-Email      — Email claim
 *
 * DEV → PROD:
 *   In production with mTLS or workload identity, this mechanism
 *   remains the same. The gateway source of truth changes but
 *   the header contract stays stable.
 */
@Component
public class JwtClaimsPropagationFilter implements GlobalFilter, Ordered {

    private static final Logger log = LoggerFactory.getLogger(JwtClaimsPropagationFilter.class);

    public static final String HEADER_USER_ID = "X-Auth-User-Id";
    public static final String HEADER_USERNAME = "X-Auth-Username";
    public static final String HEADER_ROLES = "X-Auth-Roles";
    public static final String HEADER_EMAIL = "X-Auth-Email";

    @Override
    public int getOrder() {
        return Ordered.HIGHEST_PRECEDENCE + 2;
    }

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        return ReactiveSecurityContextHolder.getContext()
                .map(ctx -> ctx.getAuthentication())
                .filter(auth -> auth != null && auth.getPrincipal() instanceof Jwt)
                .map(auth -> (Jwt) auth.getPrincipal())
                .flatMap(jwt -> {
                    String userId = jwt.getSubject();
                    String username = jwt.getClaimAsString("username");
                    String email = jwt.getClaimAsString("email");
                    Object roles = jwt.getClaim("roles");
                    String rolesStr = roles != null ? roles.toString().replace("[", "").replace("]", "") : "";

                    log.debug("Propagating JWT claims for user: {}", userId);

                    ServerWebExchange mutatedExchange = exchange.mutate()
                            .request(r -> r
                                    .header(HEADER_USER_ID, userId != null ? userId : "")
                                    .header(HEADER_USERNAME, username != null ? username : "")
                                    .header(HEADER_ROLES, rolesStr)
                                    .header(HEADER_EMAIL, email != null ? email : "")
                            )
                            .build();

                    return chain.filter(mutatedExchange);
                })
                .switchIfEmpty(chain.filter(exchange)); // Continue for unauthenticated/public routes
    }
}

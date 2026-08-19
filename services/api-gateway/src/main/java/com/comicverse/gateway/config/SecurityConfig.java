package com.comicverse.gateway.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.reactive.EnableWebFluxSecurity;
import org.springframework.security.config.web.server.ServerHttpSecurity;
import org.springframework.security.oauth2.jwt.NimbusReactiveJwtDecoder;
import org.springframework.security.oauth2.jwt.ReactiveJwtDecoder;
import org.springframework.security.web.server.SecurityWebFilterChain;

import java.security.KeyFactory;
import java.security.interfaces.RSAPublicKey;
import java.security.spec.X509EncodedKeySpec;
import java.util.Base64;

/**
 * Spring Security configuration for the API Gateway (reactive WebFlux).
 *
 * Authentication strategy:
 *   - Gateway validates JWT access tokens (RSA public key)
 *   - Auth endpoints (/api/v1/auth/**) are public — no JWT required
 *   - Health endpoints are public
 *   - All other routes require a valid JWT
 *
 * Authorization strategy:
 *   - Gateway performs coarse authorization (valid token = authenticated)
 *   - Domain services MUST perform fine-grained business authorization
 *   - Never rely on Gateway alone for authorization
 *
 * DEV → PROD migration:
 *   - Only JWT_PUBLIC_KEY_BASE64 env var changes (or use JWKS endpoint)
 *   - No code changes needed
 */
@Configuration
@EnableWebFluxSecurity
public class SecurityConfig {

    @Value("${jwt.public-key-base64:}")
    private String publicKeyBase64;

    /**
     * Public paths that do NOT require JWT authentication.
     * - Auth endpoints: login, refresh, logout
     * - Gateway health check
     * - Internal health aggregation routes
     * - OPTIONS (CORS preflight)
     */
    private static final String[] PUBLIC_PATHS = {
            "/api/v1/auth/**",
            "/api/v1/health",
            "/internal/*/health",
            "/actuator/health",
            "/actuator/info",
            "/swagger-ui.html",
            "/swagger-ui/**",
            "/v3/api-docs/**",
            "/webjars/**",
            "/api/v1/*/v3/api-docs"
    };

    @Bean
    public SecurityWebFilterChain securityWebFilterChain(ServerHttpSecurity http) {
        return http
                .csrf(ServerHttpSecurity.CsrfSpec::disable)
                // CORS handled by CorsConfig bean
                .cors(cors -> {})
                .authorizeExchange(exchanges -> exchanges
                        .pathMatchers(PUBLIC_PATHS).permitAll()
                        .pathMatchers("OPTIONS").permitAll()
                        .anyExchange().authenticated()
                )
                .oauth2ResourceServer(oauth2 -> oauth2
                        .jwt(jwt -> {
                            if (publicKeyBase64 != null && !publicKeyBase64.isBlank()) {
                                jwt.jwtDecoder(jwtDecoder());
                            }
                            // If no key configured (dev/test), Spring uses default from application.yml
                        })
                )
                .build();
    }

    @Bean
    public ReactiveJwtDecoder jwtDecoder() {
        try {
            if (publicKeyBase64 == null || publicKeyBase64.isBlank()) {
                throw new IllegalStateException(
                        "JWT_PUBLIC_KEY_BASE64 environment variable is not set. " +
                        "Run ./scripts/generate-jwt-keys.sh to generate RSA keys."
                );
            }
            // Strip PEM headers if accidentally included
            String cleanKey = publicKeyBase64
                    .replace("-----BEGIN PUBLIC KEY-----", "")
                    .replace("-----END PUBLIC KEY-----", "")
                    .replaceAll("\\s+", "");

            byte[] keyBytes = Base64.getDecoder().decode(cleanKey);
            X509EncodedKeySpec spec = new X509EncodedKeySpec(keyBytes);
            KeyFactory keyFactory = KeyFactory.getInstance("RSA");
            RSAPublicKey publicKey = (RSAPublicKey) keyFactory.generatePublic(spec);

            return NimbusReactiveJwtDecoder.withPublicKey(publicKey).build();
        } catch (Exception e) {
            throw new IllegalStateException("Failed to configure JWT decoder from RSA public key", e);
        }
    }
}

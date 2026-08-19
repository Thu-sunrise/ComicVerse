package com.comicverse.gateway.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.reactive.CorsWebFilter;
import org.springframework.web.cors.reactive.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.List;

/**
 * CORS configuration for the API Gateway.
 *
 * CORS belongs at the public edge (Gateway).
 * Downstream services must NOT configure CORS — they are internal APIs
 * not directly accessible from browsers.
 *
 * Allowed origins are driven entirely from environment variable:
 *   CORS_ALLOWED_ORIGINS=https://web-reader-dev.example.com,https://web-admin-dev.example.com
 *
 * DEV → PROD migration:
 *   Only the environment variable value changes. No code changes needed.
 */
@Configuration
public class CorsConfig {

    @Value("${cors.allowed-origins:http://localhost:5173,http://localhost:3000}")
    private String allowedOriginsConfig;

    @Bean
    public CorsWebFilter corsWebFilter() {
        CorsConfiguration corsConfig = new CorsConfiguration();

        // Parse comma-separated origins from environment
        List<String> origins = Arrays.stream(allowedOriginsConfig.split(","))
                .map(String::trim)
                .filter(s -> !s.isEmpty())
                .toList();

        corsConfig.setAllowedOrigins(origins);
        corsConfig.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS", "HEAD"));
        corsConfig.setAllowedHeaders(Arrays.asList(
                "Authorization",
                "Content-Type",
                "X-Request-ID",
                "X-Correlation-ID",
                "X-Requested-With",
                "Accept",
                "Origin"
        ));
        corsConfig.setExposedHeaders(Arrays.asList(
                "X-Request-ID",
                "X-Correlation-ID"
        ));
        corsConfig.setAllowCredentials(true);
        corsConfig.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", corsConfig);

        return new CorsWebFilter(source);
    }
}

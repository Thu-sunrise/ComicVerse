package com.comicverse.gateway.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Mono;

import java.time.Instant;
import java.util.Map;

/**
 * Gateway health endpoint.
 *
 * GET /api/v1/health
 *
 * This endpoint reflects Gateway's own health.
 * It remains UP even if downstream services are unavailable.
 * Use /internal/{service}/health to check individual service health.
 */
@RestController
@RequestMapping("/api/v1")
public class GatewayHealthController {

    @GetMapping("/health")
    public Mono<ResponseEntity<Map<String, Object>>> health() {
        Map<String, Object> response = Map.of(
                "status", "UP",
                "service", "api-gateway",
                "timestamp", Instant.now().toString()
        );
        return Mono.just(ResponseEntity.ok(response));
    }
}

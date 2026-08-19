package com.comicverse.chat.controller;

import com.comicverse.chat.service.AblyService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.Map;

/**
 * Realtime Token Controller.
 *
 * GET /api/v1/realtime/token
 *
 * Returns a signed Ably token for the authenticated frontend client.
 * The frontend uses this token to connect to Ably — NEVER the API key.
 *
 * User identity is obtained from X-Auth-User-Id header forwarded by Gateway
 * after JWT validation. The service trusts this header — no re-validation needed.
 */
@RestController
@RequestMapping("/api/v1")
public class RealtimeTokenController {

    private static final Logger log = LoggerFactory.getLogger(RealtimeTokenController.class);

    private final AblyService ablyService;

    public RealtimeTokenController(AblyService ablyService) {
        this.ablyService = ablyService;
    }

    @GetMapping("/realtime/token")
    public ResponseEntity<Map<String, Object>> getToken(
            @RequestHeader(value = "X-Auth-User-Id", required = false) String userId,
            @RequestParam(value = "roomId", required = false) String roomId) {
        try {
            String clientId = userId != null ? userId : "anonymous";
            String token = roomId != null
                    ? ablyService.generateToken(clientId, roomId)
                    : ablyService.generateGeneralToken(clientId);

            return ResponseEntity.ok(Map.of(
                    "token", token,
                    "clientId", clientId,
                    "issuedAt", Instant.now().toString()
            ));
        } catch (Exception e) {
            log.error("Failed to generate realtime token: {}", e.getMessage());
            return ResponseEntity.internalServerError().body(Map.of(
                    "status", 500,
                    "code", "REALTIME_TOKEN_ERROR",
                    "message", "Failed to generate realtime token"
            ));
        }
    }

    @GetMapping("/health")
    public ResponseEntity<Map<String, Object>> health() {
        return ResponseEntity.ok(Map.of("status", "UP", "service", "chat-service", "timestamp", Instant.now().toString()));
    }
}

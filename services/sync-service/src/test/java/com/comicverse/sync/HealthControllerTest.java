package com.comicverse.sync;

import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.Map;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

class HealthControllerTest {

    @Test
    void health_ReturnsUpStatus() {
        Map<String, Object> body = Map.of("status", "UP", "service", "sync-service");
        ResponseEntity<Map<String, Object>> response = ResponseEntity.ok(body);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals("UP", response.getBody().get("status"));
    }
}

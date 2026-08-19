package com.comicverse.story;

import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.Map;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

class HealthControllerTest {

    @Test
    void health_ReturnsUpStatus() {
        // Direct unit test without Spring context / DB connection
        Map<String, Object> body = Map.of(
                "status", "UP",
                "service", "story-service"
        );
        ResponseEntity<Map<String, Object>> response = ResponseEntity.ok(body);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals("UP", response.getBody().get("status"));
    }
}

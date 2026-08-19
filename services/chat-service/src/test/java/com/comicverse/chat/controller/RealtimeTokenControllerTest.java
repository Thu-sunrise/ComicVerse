package com.comicverse.chat.controller;

import com.comicverse.chat.service.AblyService;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.Map;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

class RealtimeTokenControllerTest {

    @Test
    void getToken_GeneratesTokenSuccessfully() {
        AblyService ablyService = mock(AblyService.class);
        when(ablyService.generateGeneralToken(anyString())).thenReturn("mocked-ably-token-xyz");

        RealtimeTokenController controller = new RealtimeTokenController(ablyService);
        ResponseEntity<Map<String, Object>> response = controller.getToken("user-100", null);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals("mocked-ably-token-xyz", response.getBody().get("token"));
        assertEquals("user-100", response.getBody().get("clientId"));
    }
}

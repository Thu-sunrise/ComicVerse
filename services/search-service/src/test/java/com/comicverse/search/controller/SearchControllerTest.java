package com.comicverse.search.controller;

import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.Map;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

class SearchControllerTest {

    @Test
    void search_ReturnsFoundationResponse() {
        SearchController controller = new SearchController();
        ResponseEntity<Map<String, Object>> response = controller.search("One Piece", null, null);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals("One Piece", response.getBody().get("query"));
    }
}

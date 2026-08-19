package com.comicverse.search.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.Instant;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1")
public class SearchController {

    @GetMapping("/health")
    public ResponseEntity<Map<String, Object>> health() {
        return ResponseEntity.ok(Map.of("status", "UP", "service", "search-service", "timestamp", Instant.now().toString()));
    }

    /**
     * GET /api/v1/search?q={query}&genre={genre}&status={status}
     * Full-text search using PostgreSQL tsvector.
     * Foundation only — implement query logic in next phase.
     */
    @GetMapping("/search")
    public ResponseEntity<Map<String, Object>> search(
            @RequestParam String q,
            @RequestParam(required = false) String genre,
            @RequestParam(required = false) String status) {
        // TODO: Implement full-text search query against story_index table
        return ResponseEntity.ok(Map.of(
                "query", q,
                "results", List.of(),
                "total", 0,
                "message", "Search foundation ready — implement query in next phase"
        ));
    }
}

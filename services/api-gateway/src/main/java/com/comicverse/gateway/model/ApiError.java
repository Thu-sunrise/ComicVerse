package com.comicverse.gateway.model;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Builder;
import lombok.Data;

/**
 * Standard API error response format.
 *
 * All error responses from the Gateway (and downstream services)
 * must follow this format for consistent client-side error handling.
 *
 * Example:
 * {
 *   "timestamp": "2026-08-17T12:34:56.789Z",
 *   "status": 401,
 *   "code": "UNAUTHORIZED",
 *   "message": "Authentication required.",
 *   "path": "/api/v1/stories",
 *   "requestId": "550e8400-e29b-41d4-a716-446655440000"
 * }
 */
@Data
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ApiError {

    /** ISO-8601 timestamp of when the error occurred */
    private String timestamp;

    /** HTTP status code */
    private int status;

    /** Machine-readable error code (UPPER_SNAKE_CASE) */
    private String code;

    /** Human-readable error message (safe to show to users) */
    private String message;

    /** The request path that caused the error */
    private String path;

    /** X-Request-ID for distributed tracing */
    private String requestId;
}

package com.comicverse.auth.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Builder;
import lombok.Data;

/**
 * Login response DTO.
 *
 * accessToken  — JWT access token (15 min), returned in response body.
 *                Client stores in memory (NOT localStorage).
 *
 * Refresh token is NOT in this response body.
 * It is set as an HttpOnly Secure SameSite=Strict cookie by the controller.
 *
 * NEVER log this object — it contains the access token.
 */
@Data
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class LoginResponse {

    private String accessToken;
    private String tokenType;         // Always "Bearer"
    private long expiresIn;           // Seconds until access token expires
    private Long userId;
    private String username;
    private String email;
    private String role;
}

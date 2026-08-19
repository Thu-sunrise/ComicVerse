package com.comicverse.auth.controller;

import com.comicverse.auth.dto.LoginRequest;
import com.comicverse.auth.dto.LoginResponse;
import com.comicverse.auth.dto.RegisterRequest;
import com.comicverse.auth.service.AuthService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * Authentication Controller.
 *
 * POST /api/v1/auth/register  — register new account, returns access token + refresh cookie
 * POST /api/v1/auth/login     — authenticate, get access token + refresh cookie
 * POST /api/v1/auth/refresh   — rotate tokens using refresh cookie
 * POST /api/v1/auth/logout    — revoke refresh tokens, clear cookie
 *
 * NEVER log request/response bodies — they may contain credentials.
 */
@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {

    private static final Logger log = LoggerFactory.getLogger(AuthController.class);

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<LoginResponse> register(@Valid @RequestBody RegisterRequest request,
                                                  HttpServletRequest httpRequest,
                                                  HttpServletResponse httpResponse) {
        log.debug("Registration attempt");
        LoginResponse response = authService.register(request, httpRequest, httpResponse);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest request,
                                               HttpServletRequest httpRequest,
                                               HttpServletResponse httpResponse) {
        log.debug("Login attempt (email masked in prod)");
        LoginResponse response = authService.login(request, httpRequest, httpResponse);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/refresh")
    public ResponseEntity<LoginResponse> refresh(HttpServletRequest httpRequest,
                                                 HttpServletResponse httpResponse) {
        LoginResponse response = authService.refresh(httpRequest, httpResponse);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/logout")
    public ResponseEntity<Map<String, String>> logout(HttpServletRequest httpRequest,
                                                      HttpServletResponse httpResponse) {
        authService.logout(httpRequest, httpResponse);
        return ResponseEntity.ok(Map.of("message", "Logged out successfully"));
    }
}

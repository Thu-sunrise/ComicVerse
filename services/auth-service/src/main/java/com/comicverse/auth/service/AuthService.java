package com.comicverse.auth.service;

import com.comicverse.auth.dto.LoginRequest;
import com.comicverse.auth.dto.LoginResponse;
import com.comicverse.auth.dto.RegisterRequest;
import com.comicverse.auth.event.EventPublisher;
import com.comicverse.auth.event.UserRegisteredEvent;
import com.comicverse.auth.model.RefreshToken;
import com.comicverse.auth.model.User;
import com.comicverse.auth.repository.RefreshTokenRepository;
import com.comicverse.auth.repository.UserRepository;
import com.comicverse.auth.security.JwtTokenProvider;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.time.Instant;
import java.util.Arrays;
import java.util.Base64;
import java.util.List;

/**
 * Authentication Service — handles register, login, token refresh, and logout.
 *
 * Security guarantees:
 *   - Passwords are hashed using BCrypt (strength 12)
 *   - Duplicate email and username checks are enforced
 *   - Refresh tokens are stored as SHA-256 hashes only
 *   - Access tokens are short-lived (15 min)
 *   - Refresh tokens are in HttpOnly Secure SameSite=Strict cookies
 *   - Logout revokes all refresh tokens for the user
 *
 * NEVER log: passwords, access tokens, refresh tokens, or hashes
 */
@Service
@Transactional
public class AuthService {

    private static final Logger log = LoggerFactory.getLogger(AuthService.class);
    private static final String REFRESH_TOKEN_COOKIE = "refresh_token";

    private final UserRepository userRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final JwtTokenProvider jwtTokenProvider;
    private final PasswordEncoder passwordEncoder;
    private final EventPublisher eventPublisher;

    @Value("${jwt.refresh-token-expiry-seconds:2592000}")
    private long refreshTokenExpirySeconds;

    @Value("${jwt.access-token-expiry-seconds:900}")
    private long accessTokenExpirySeconds;

    public AuthService(UserRepository userRepository,
                       RefreshTokenRepository refreshTokenRepository,
                       JwtTokenProvider jwtTokenProvider,
                       PasswordEncoder passwordEncoder,
                       EventPublisher eventPublisher) {
        this.userRepository = userRepository;
        this.refreshTokenRepository = refreshTokenRepository;
        this.jwtTokenProvider = jwtTokenProvider;
        this.passwordEncoder = passwordEncoder;
        this.eventPublisher = eventPublisher;
    }

    /**
     * Register a new user account.
     * Check duplicate email and username, hash password with BCrypt, save user,
     * publish UserRegisteredEvent to RabbitMQ, and return JWT login tokens.
     */
    public LoginResponse register(RegisterRequest request, HttpServletRequest httpRequest, HttpServletResponse httpResponse) {
        if (userRepository.existsByEmail(request.email())) {
            throw new IllegalArgumentException("Email is already registered");
        }
        if (userRepository.existsByUsername(request.username())) {
            throw new IllegalArgumentException("Username is already taken");
        }

        User user = new User();
        user.setUsername(request.username());
        user.setEmail(request.email());
        user.setPasswordHash(passwordEncoder.encode(request.password()));
        user.setRole("USER");
        user.setActive(true);
        user.setEmailVerified(true);

        user = userRepository.save(user);
        log.info("Registered new user: userId={} username={}", user.getId(), user.getUsername());

        // Publish domain event to RabbitMQ
        try {
            UserRegisteredEvent eventPayload = new UserRegisteredEvent(
                    user.getId(), user.getUsername(), user.getEmail(), user.getRole()
            );
            eventPublisher.publishUserRegistered(eventPayload, httpRequest.getHeader("X-Correlation-ID"));
        } catch (Exception e) {
            log.error("Failed to publish UserRegisteredEvent for userId={}: {}", user.getId(), e.getMessage());
        }

        // Auto-login after registration
        List<String> roles = List.of(user.getRole());
        String accessToken = jwtTokenProvider.generateAccessToken(
                user.getId(), user.getUsername(), user.getEmail(), roles
        );
        String refreshToken = jwtTokenProvider.generateRefreshToken(user.getId());

        storeRefreshTokenHash(user, refreshToken, httpRequest);
        setRefreshTokenCookie(httpResponse, refreshToken);

        return LoginResponse.builder()
                .accessToken(accessToken)
                .tokenType("Bearer")
                .expiresIn(accessTokenExpirySeconds)
                .userId(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .role(user.getRole())
                .build();
    }

    /**
     * Authenticate user and issue JWT tokens.
     * Access token returned in body, refresh token set as HttpOnly cookie.
     */
    public LoginResponse login(LoginRequest request, HttpServletRequest httpRequest, HttpServletResponse httpResponse) {
        // 1. Find user — same error for invalid email or wrong password (prevent enumeration)
        User user = userRepository.findByEmail(request.email())
                .orElseThrow(() -> new BadCredentialsException("Invalid email or password"));

        // 2. Verify password
        if (!passwordEncoder.matches(request.password(), user.getPasswordHash())) {
            log.warn("Failed login attempt for email: {}", maskEmail(request.email()));
            throw new BadCredentialsException("Invalid email or password");
        }

        if (!user.isActive()) {
            throw new BadCredentialsException("Account is deactivated");
        }

        // 3. Generate tokens
        List<String> roles = List.of(user.getRole());
        String accessToken = jwtTokenProvider.generateAccessToken(
                user.getId(), user.getUsername(), user.getEmail(), roles
        );
        String refreshToken = jwtTokenProvider.generateRefreshToken(user.getId());

        // 4. Store refresh token hash (NEVER store the raw token)
        storeRefreshTokenHash(user, refreshToken, httpRequest);

        // 5. Set refresh token as HttpOnly cookie
        setRefreshTokenCookie(httpResponse, refreshToken);

        log.info("User logged in: userId={}", user.getId());

        return LoginResponse.builder()
                .accessToken(accessToken)
                .tokenType("Bearer")
                .expiresIn(accessTokenExpirySeconds)
                .userId(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .role(user.getRole())
                .build();
    }

    /**
     * Refresh access token using refresh token from HttpOnly cookie.
     */
    public LoginResponse refresh(HttpServletRequest httpRequest, HttpServletResponse httpResponse) {
        String rawRefreshToken = extractRefreshTokenFromCookie(httpRequest);
        if (rawRefreshToken == null) {
            throw new BadCredentialsException("Refresh token not found");
        }

        // Validate the JWT
        Jwt jwt = jwtTokenProvider.validateToken(rawRefreshToken);

        // Verify it's actually a refresh token
        String tokenType = jwt.getClaimAsString("type");
        if (!"refresh".equals(tokenType)) {
            throw new BadCredentialsException("Invalid token type");
        }

        // Check against stored hash
        String tokenHash = hashToken(rawRefreshToken);
        RefreshToken storedToken = refreshTokenRepository.findByTokenHash(tokenHash)
                .orElseThrow(() -> new BadCredentialsException("Refresh token not found or revoked"));

        if (!storedToken.isValid()) {
            throw new BadCredentialsException("Refresh token is expired or revoked");
        }

        User user = storedToken.getUser();

        // Rotate: revoke old token, issue new ones
        storedToken.setRevoked(true);
        refreshTokenRepository.save(storedToken);

        List<String> roles = List.of(user.getRole());
        String newAccessToken = jwtTokenProvider.generateAccessToken(
                user.getId(), user.getUsername(), user.getEmail(), roles
        );
        String newRefreshToken = jwtTokenProvider.generateRefreshToken(user.getId());

        storeRefreshTokenHash(user, newRefreshToken, httpRequest);
        setRefreshTokenCookie(httpResponse, newRefreshToken);

        log.info("Token refreshed for userId={}", user.getId());

        return LoginResponse.builder()
                .accessToken(newAccessToken)
                .tokenType("Bearer")
                .expiresIn(accessTokenExpirySeconds)
                .userId(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .role(user.getRole())
                .build();
    }

    /**
     * Logout — revoke all refresh tokens for the user, clear cookie.
     */
    public void logout(HttpServletRequest httpRequest, HttpServletResponse httpResponse) {
        String rawRefreshToken = extractRefreshTokenFromCookie(httpRequest);
        if (rawRefreshToken != null) {
            try {
                Jwt jwt = jwtTokenProvider.validateToken(rawRefreshToken);
                Long userId = Long.parseLong(jwt.getSubject());
                int revoked = refreshTokenRepository.revokeAllByUserId(userId);
                log.info("Logout: revoked {} refresh tokens for userId={}", revoked, userId);
            } catch (Exception e) {
                log.debug("Could not parse refresh token during logout: {}", e.getMessage());
            }
        }
        clearRefreshTokenCookie(httpResponse);
    }

    // -------------------------------------------------------
    // Private helpers
    // -------------------------------------------------------

    private void storeRefreshTokenHash(User user, String rawToken, HttpServletRequest request) {
        RefreshToken token = new RefreshToken();
        token.setUser(user);
        token.setTokenHash(hashToken(rawToken));
        token.setExpiresAt(Instant.now().plusSeconds(refreshTokenExpirySeconds));
        token.setUserAgent(request.getHeader("User-Agent"));
        token.setIpAddress(request.getRemoteAddr());
        refreshTokenRepository.save(token);
    }

    private void setRefreshTokenCookie(HttpServletResponse response, String token) {
        Cookie cookie = new Cookie(REFRESH_TOKEN_COOKIE, token);
        cookie.setHttpOnly(true);
        cookie.setSecure(true);     // Requires HTTPS — Nginx terminates TLS
        cookie.setPath("/api/v1/auth");
        cookie.setMaxAge((int) refreshTokenExpirySeconds);
        // SameSite=Strict — set via header since Java Servlet API doesn't have setsameSite
        response.addHeader("Set-Cookie",
                String.format("%s=%s; Path=/api/v1/auth; HttpOnly; Secure; SameSite=Strict; Max-Age=%d",
                        REFRESH_TOKEN_COOKIE, token, refreshTokenExpirySeconds));
    }

    private void clearRefreshTokenCookie(HttpServletResponse response) {
        response.addHeader("Set-Cookie",
                String.format("%s=; Path=/api/v1/auth; HttpOnly; Secure; SameSite=Strict; Max-Age=0",
                        REFRESH_TOKEN_COOKIE));
    }

    private String extractRefreshTokenFromCookie(HttpServletRequest request) {
        if (request.getCookies() == null) return null;
        return Arrays.stream(request.getCookies())
                .filter(c -> REFRESH_TOKEN_COOKIE.equals(c.getName()))
                .map(Cookie::getValue)
                .findFirst()
                .orElse(null);
    }

    private String hashToken(String token) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(token.getBytes(StandardCharsets.UTF_8));
            return Base64.getEncoder().encodeToString(hash);
        } catch (Exception e) {
            throw new IllegalStateException("Failed to hash token", e);
        }
    }

    private String maskEmail(String email) {
        if (email == null || !email.contains("@")) return "***";
        String[] parts = email.split("@");
        return parts[0].substring(0, Math.min(2, parts[0].length())) + "***@" + parts[1];
    }
}

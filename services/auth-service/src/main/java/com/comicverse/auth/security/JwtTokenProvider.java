package com.comicverse.auth.security;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.oauth2.jose.jws.SignatureAlgorithm;
import org.springframework.security.oauth2.jwt.*;
import org.springframework.stereotype.Component;

import java.security.KeyFactory;
import java.security.interfaces.RSAPrivateKey;
import java.security.interfaces.RSAPublicKey;
import java.security.spec.PKCS8EncodedKeySpec;
import java.security.spec.X509EncodedKeySpec;
import java.time.Instant;
import java.util.Base64;
import java.util.List;
import java.util.UUID;

/**
 * JWT Token Provider using RSA asymmetric signing.
 *
 * Auth Service:  signs tokens with RSA PRIVATE key
 * Gateway/Services: verify tokens with RSA PUBLIC key
 *
 * Token Types:
 *   Access Token  — short-lived (15 min), included in Authorization header
 *   Refresh Token — long-lived (30 days), stored in HttpOnly Secure cookie
 *
 * Token Claims:
 *   sub      — user ID (String)
 *   username — username
 *   email    — user email
 *   roles    — List<String> of user roles (USER, EDITOR, ADMIN)
 *   iss      — issuer (comicverse-auth)
 *   iat      — issued at
 *   exp      — expiry
 *
 * Key distribution:
 *   DEV:  base64-encoded PEM via environment variable
 *   PROD: AWS Secrets Manager → env var injection (no code change)
 *
 * SECURITY:
 *   - NEVER log the private key, access token, or refresh token
 *   - Keys must NEVER appear in application logs
 */
@Component
public class JwtTokenProvider {

    private static final Logger log = LoggerFactory.getLogger(JwtTokenProvider.class);

    @Value("${jwt.private-key-base64:}")
    private String privateKeyBase64;

    @Value("${jwt.public-key-base64:}")
    private String publicKeyBase64;

    @Value("${jwt.issuer:comicverse-auth}")
    private String issuer;

    @Value("${jwt.access-token-expiry-seconds:900}")
    private long accessTokenExpirySeconds;

    @Value("${jwt.refresh-token-expiry-seconds:2592000}")
    private long refreshTokenExpirySeconds;

    /**
     * Generate an access token for a user.
     * Short-lived, sent in Authorization: Bearer header.
     */
    public String generateAccessToken(Long userId, String username, String email, List<String> roles) {
        try {
            RSAPrivateKey privateKey = loadPrivateKey();
            com.nimbusds.jose.jwk.RSAKey rsaKey = new com.nimbusds.jose.jwk.RSAKey.Builder(loadPublicKey())
                    .privateKey(privateKey)
                    .build();
            JwtEncoder encoder = new NimbusJwtEncoder(new com.nimbusds.jose.jwk.source.ImmutableJWKSet<>(new com.nimbusds.jose.jwk.JWKSet(rsaKey)));

            Instant now = Instant.now();
            JwtClaimsSet claims = JwtClaimsSet.builder()
                    .id(UUID.randomUUID().toString())
                    .issuer(issuer)
                    .subject(String.valueOf(userId))
                    .issuedAt(now)
                    .expiresAt(now.plusSeconds(accessTokenExpirySeconds))
                    .claim("username", username)
                    .claim("email", email)
                    .claim("roles", roles)
                    .claim("type", "access")
                    .build();

            JwsHeader header = JwsHeader.with(SignatureAlgorithm.RS256).build();

            return encoder.encode(JwtEncoderParameters.from(header, claims)).getTokenValue();
        } catch (Exception e) {
            log.error("Failed to generate access token for user {}: {}", userId, e.getMessage());
            throw new IllegalStateException("Failed to generate access token", e);
        }
    }

    /**
     * Generate a refresh token.
     * Long-lived, stored as HttpOnly Secure SameSite=Strict cookie.
     */
    public String generateRefreshToken(Long userId) {
        try {
            RSAPrivateKey privateKey = loadPrivateKey();
            JwtEncoder encoder = buildEncoder(privateKey);

            Instant now = Instant.now();
            JwtClaimsSet claims = JwtClaimsSet.builder()
                    .id(UUID.randomUUID().toString())
                    .issuer(issuer)
                    .subject(String.valueOf(userId))
                    .issuedAt(now)
                    .expiresAt(now.plusSeconds(refreshTokenExpirySeconds))
                    .claim("type", "refresh")
                    .build();

            JwsHeader header = JwsHeader.with(SignatureAlgorithm.RS256).build();
            return encoder.encode(JwtEncoderParameters.from(header, claims)).getTokenValue();
        } catch (Exception e) {
            log.error("Failed to generate refresh token for user {}: {}", userId, e.getMessage());
            throw new IllegalStateException("Failed to generate refresh token", e);
        }
    }

    /**
     * Validate and decode a JWT token.
     * Used for refresh token validation.
     */
    public Jwt validateToken(String token) {
        try {
            RSAPublicKey publicKey = loadPublicKey();
            NimbusJwtDecoder decoder = NimbusJwtDecoder.withPublicKey(publicKey).build();
            return decoder.decode(token);
        } catch (Exception e) {
            log.warn("JWT validation failed: {}", e.getMessage());
            throw new JwtException("Invalid or expired token");
        }
    }

    private JwtEncoder buildEncoder(RSAPrivateKey privateKey) throws Exception {
        RSAPublicKey publicKey = loadPublicKey();
        com.nimbusds.jose.jwk.RSAKey rsaKey = new com.nimbusds.jose.jwk.RSAKey.Builder(publicKey)
                .privateKey(privateKey)
                .build();
        return new NimbusJwtEncoder(
                new com.nimbusds.jose.jwk.source.ImmutableJWKSet<>(new com.nimbusds.jose.jwk.JWKSet(rsaKey))
        );
    }

    private RSAPrivateKey loadPrivateKey() throws Exception {
        if (privateKeyBase64 == null || privateKeyBase64.isBlank()) {
            throw new IllegalStateException(
                    "JWT_PRIVATE_KEY_BASE64 is not set. Run ./scripts/generate-jwt-keys.sh"
            );
        }
        String clean = privateKeyBase64
                .replace("-----BEGIN PRIVATE KEY-----", "")
                .replace("-----END PRIVATE KEY-----", "")
                .replaceAll("\\s+", "");
        byte[] keyBytes = Base64.getDecoder().decode(clean);
        PKCS8EncodedKeySpec spec = new PKCS8EncodedKeySpec(keyBytes);
        return (RSAPrivateKey) KeyFactory.getInstance("RSA").generatePrivate(spec);
    }

    private RSAPublicKey loadPublicKey() throws Exception {
        if (publicKeyBase64 == null || publicKeyBase64.isBlank()) {
            throw new IllegalStateException(
                    "JWT_PUBLIC_KEY_BASE64 is not set. Run ./scripts/generate-jwt-keys.sh"
            );
        }
        String clean = publicKeyBase64
                .replace("-----BEGIN PUBLIC KEY-----", "")
                .replace("-----END PUBLIC KEY-----", "")
                .replaceAll("\\s+", "");
        byte[] keyBytes = Base64.getDecoder().decode(clean);
        X509EncodedKeySpec spec = new X509EncodedKeySpec(keyBytes);
        return (RSAPublicKey) KeyFactory.getInstance("RSA").generatePublic(spec);
    }
}

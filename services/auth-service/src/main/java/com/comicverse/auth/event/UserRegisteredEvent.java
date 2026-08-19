package com.comicverse.auth.event;

/**
 * UserRegistered domain event payload.
 * Published when a new user successfully registers.
 *
 * Consumers: user-service (create profile), notification-service (welcome email)
 */
public record UserRegisteredEvent(
        Long userId,
        String username,
        String email,
        String role
) {}

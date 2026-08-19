package com.comicverse.shared.event;

import java.io.Serializable;

/**
 * Payload for USER_REGISTERED domain event.
 * Published by auth-service, consumed by user-service, notification-service.
 */
public record UserRegisteredEventPayload(
        Long userId,
        String username,
        String email,
        String role,
        String registeredAt
) implements Serializable {}

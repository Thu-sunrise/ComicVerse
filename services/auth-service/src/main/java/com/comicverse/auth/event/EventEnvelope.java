package com.comicverse.auth.event;

import java.time.Instant;
import java.util.UUID;

/**
 * Event envelope — wraps all domain events published to RabbitMQ.
 *
 * All events sent to RabbitMQ MUST use this envelope.
 * Consumers MUST check eventType before processing.
 * Consumers MUST check eventId for idempotency (ignore duplicates).
 *
 * Event versioning:
 *   Increment version when payload schema changes in a breaking way.
 *   Consumers must handle multiple versions gracefully.
 *
 * Example JSON:
 * {
 *   "eventId": "550e8400-e29b-41d4-a716-446655440000",
 *   "eventType": "USER_REGISTERED",
 *   "version": 1,
 *   "occurredAt": "2026-08-17T12:34:56.789Z",
 *   "producer": "auth-service",
 *   "correlationId": "req-abc123",
 *   "payload": { ... }
 * }
 */
public record EventEnvelope<T>(
        String eventId,
        String eventType,
        int version,
        String occurredAt,
        String producer,
        String correlationId,
        T payload
) {
    /**
     * Create a new event envelope with auto-generated ID and current timestamp.
     */
    public static <T> EventEnvelope<T> of(String eventType, String producer, String correlationId, T payload) {
        return new EventEnvelope<>(
                UUID.randomUUID().toString(),
                eventType,
                1,
                Instant.now().toString(),
                producer,
                correlationId,
                payload
        );
    }

    public static <T> EventEnvelope<T> of(String eventType, String producer, T payload) {
        return of(eventType, producer, null, payload);
    }
}

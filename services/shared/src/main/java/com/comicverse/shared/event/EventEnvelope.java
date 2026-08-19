package com.comicverse.shared.event;

import java.io.Serializable;
import java.time.Instant;
import java.util.UUID;

/**
 * Universal Event Envelope wrapping all domain events published to RabbitMQ / Kafka.
 *
 * Guaranteed contract across all services:
 *   - eventId: UUID v4 for idempotency deduplication
 *   - eventType: Constant string from EventTypes
 *   - version: Integer schema version (starts at 1)
 *   - occurredAt: ISO-8601 UTC timestamp
 *   - producer: Name of publishing service
 *   - correlationId: Distributed tracing ID
 *   - payload: Domain event payload object
 */
public record EventEnvelope<T>(
        String eventId,
        String eventType,
        int version,
        String occurredAt,
        String producer,
        String correlationId,
        T payload
) implements Serializable {

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

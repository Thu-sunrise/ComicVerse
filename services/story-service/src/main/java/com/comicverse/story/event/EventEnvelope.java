package com.comicverse.story.event;

import java.time.Instant;
import java.util.UUID;

public record EventEnvelope<T>(
        String eventId, String eventType, int version,
        String occurredAt, String producer, String correlationId, T payload
) {
    public static <T> EventEnvelope<T> of(String eventType, String producer, T payload) {
        return new EventEnvelope<>(UUID.randomUUID().toString(), eventType, 1,
                Instant.now().toString(), producer, null, payload);
    }
}

package com.comicverse.shared.event;

import java.io.Serializable;
import java.time.Instant;

/**
 * Common event metadata for tracing and auditing.
 */
public record EventMetadata(
        String traceId,
        String spanId,
        String userId,
        String ipAddress,
        String userAgent,
        String timestamp
) implements Serializable {

    public static EventMetadata create(String traceId, String userId) {
        return new EventMetadata(traceId, null, userId, null, null, Instant.now().toString());
    }
}

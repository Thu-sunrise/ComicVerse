package com.comicverse.chat.infrastructure;

/**
 * RealtimePublisher abstraction.
 *
 * Hides Ably implementation behind this interface.
 * DEV → PROD: Same interface. Swap implementation without touching business code.
 *
 * Future alternatives: Pusher, self-hosted WebSocket server, etc.
 */
public interface RealtimePublisher {

    /**
     * Publish a message to a realtime channel.
     *
     * @param channel  channel name (e.g., "chat:room:general")
     * @param event    event name (e.g., "message")
     * @param data     payload (will be JSON-serialized)
     */
    void publish(String channel, String event, Object data);
}

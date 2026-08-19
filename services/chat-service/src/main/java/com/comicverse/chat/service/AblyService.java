package com.comicverse.chat.service;

import com.comicverse.chat.infrastructure.RealtimePublisher;
import io.ably.lib.rest.AblyRest;
import io.ably.lib.rest.Auth;
import io.ably.lib.types.ClientOptions;
import io.ably.lib.types.Message;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

/**
 * Ably Service — implements RealtimePublisher using Ably REST + token authentication.
 *
 * Architecture decisions:
 *   - Ably REST API is used server-side for publishing messages
 *   - Clients connect using short-lived tokens (not the API key)
 *   - NEVER expose the Ably API key to any frontend client
 *
 * Channel naming convention:
 *   chat:room:{roomId}          — public chat room
 *   chat:room:{roomId}:typing   — typing indicators
 *   presence:room:{roomId}      — user presence
 *
 * DEV → PROD: Same Ably SDK and config. Only ABLY_API_KEY changes.
 */
@Service
public class AblyService implements RealtimePublisher {

    private static final Logger log = LoggerFactory.getLogger(AblyService.class);

    @Value("${ably.api-key:}")
    private String ablyApiKey;

    @Value("${ably.token-ttl:3600}")
    private long tokenTtlSeconds;

    @Value("${ably.channel-prefix:chat:room:}")
    private String channelPrefix;

    private AblyRest getAblyClient() throws Exception {
        if (ablyApiKey == null || ablyApiKey.isBlank()) {
            throw new IllegalStateException("ABLY_API_KEY is not configured");
        }
        ClientOptions options = new ClientOptions(ablyApiKey);
        return new AblyRest(options);
    }

    /**
     * Generate a signed Ably token for a frontend client.
     * Client uses this token to connect — NEVER the raw API key.
     *
     * @param clientId  The user's ID (for presence and capabilities)
     * @param roomId    The chat room the user wants to join
     * @return Ably token string
     */
    public String generateToken(String clientId, String roomId) {
        try {
            AblyRest ably = getAblyClient();
            Auth.TokenParams tokenParams = new Auth.TokenParams();
            tokenParams.clientId = clientId;
            tokenParams.ttl = tokenTtlSeconds * 1000; // Ably uses milliseconds

            // Capability: subscribe + publish to this specific room's channel
            String channelName = channelPrefix + roomId;
            tokenParams.capability = String.format("{\"%s\":[\"subscribe\",\"publish\",\"presence\"]}", channelName);

            Auth.TokenDetails token = ably.auth.requestToken(tokenParams, null);
            log.debug("Generated Ably token for clientId={} roomId={}", clientId, roomId);
            return token.token;
        } catch (Exception e) {
            log.error("Failed to generate Ably token for clientId={}: {}", clientId, e.getMessage());
            throw new IllegalStateException("Failed to generate realtime token", e);
        }
    }

    /**
     * Generate a general Ably token (for browsing, no room-specific capability).
     */
    public String generateGeneralToken(String clientId) {
        try {
            AblyRest ably = getAblyClient();
            Auth.TokenParams tokenParams = new Auth.TokenParams();
            tokenParams.clientId = clientId;
            tokenParams.ttl = tokenTtlSeconds * 1000;
            // General read capability — subscribe to public channels
            tokenParams.capability = "{\"chat:room:*\":[\"subscribe\"],\"presence:room:*\":[\"subscribe\"]}";

            Auth.TokenDetails token = ably.auth.requestToken(tokenParams, null);
            return token.token;
        } catch (Exception e) {
            log.error("Failed to generate general Ably token: {}", e.getMessage());
            throw new IllegalStateException("Failed to generate realtime token", e);
        }
    }

    @Override
    public void publish(String channel, String event, Object data) {
        try {
            AblyRest ably = getAblyClient();
            Message message = new Message(event, data);
            ably.channels.get(channel).publish(new Message[]{message});
            log.debug("Published Ably message: channel={} event={}", channel, event);
        } catch (Exception e) {
            log.error("Failed to publish to Ably channel {}: {}", channel, e.getMessage());
            // Don't fail the main flow — Ably publish is best-effort
        }
    }

    public String buildChannelName(String roomId) {
        return channelPrefix + roomId;
    }
}

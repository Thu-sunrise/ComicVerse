package com.comicverse.recommendation.event;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;
import java.util.Map;

/**
 * Consumes StoryPublished events from story-service.
 * Updates local story_catalog read model.
 *
 * Idempotency: checks processed_event_ids before processing.
 * This prevents duplicate processing if the same event is delivered twice.
 */
@Component
public class StoryEventConsumer {

    private static final Logger log = LoggerFactory.getLogger(StoryEventConsumer.class);

    @RabbitListener(queues = "recommendation.story.published")
    public void onStoryPublished(Map<String, Object> envelope) {
        String eventId = (String) envelope.get("eventId");
        String eventType = (String) envelope.get("eventType");

        log.info("Received event: type={} eventId={}", eventType, eventId);

        // TODO: Check idempotency (processed_event_ids table)
        // TODO: Extract payload and upsert into story_catalog table
        // This is the foundation for event-driven data synchronization
        // No cross-service DB queries are needed — only local read model updates
    }
}

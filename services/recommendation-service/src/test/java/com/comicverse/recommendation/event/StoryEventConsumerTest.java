package com.comicverse.recommendation.event;

import org.junit.jupiter.api.Test;

import java.util.Map;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;

class StoryEventConsumerTest {

    @Test
    void onStoryPublished_HandlesEnvelopeWithoutThrowing() {
        StoryEventConsumer consumer = new StoryEventConsumer();
        Map<String, Object> envelope = Map.of(
                "eventId", "test-event-123",
                "eventType", "STORY_PUBLISHED",
                "payload", Map.of("storyId", 1L, "title", "Test Story")
        );

        assertDoesNotThrow(() -> consumer.onStoryPublished(envelope));
    }
}

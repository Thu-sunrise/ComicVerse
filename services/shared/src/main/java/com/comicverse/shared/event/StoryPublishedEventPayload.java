package com.comicverse.shared.event;

import java.io.Serializable;

/**
 * Payload for STORY_PUBLISHED domain event.
 * Published by story-service, consumed by recommendation-service, search-service.
 */
public record StoryPublishedEventPayload(
        Long storyId,
        String title,
        String author,
        String genre,
        String status,
        String publishedAt
) implements Serializable {}

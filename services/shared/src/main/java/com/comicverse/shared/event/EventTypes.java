package com.comicverse.shared.event;

/**
 * Standard Event Type constants used across microservices.
 */
public final class EventTypes {

    private EventTypes() {}

    // Auth & User events
    public static final String USER_REGISTERED = "USER_REGISTERED";
    public static final String USER_UPDATED    = "USER_UPDATED";
    public static final String USER_DELETED    = "USER_DELETED";

    // Story events
    public static final String STORY_PUBLISHED = "STORY_PUBLISHED";
    public static final String STORY_UPDATED   = "STORY_UPDATED";
    public static final String CHAPTER_RELEASED = "CHAPTER_RELEASED";

    // Payment events
    public static final String PAYMENT_COMPLETED = "PAYMENT_COMPLETED";
    public static final String PAYMENT_FAILED    = "PAYMENT_FAILED";

    // Sync / Progress events
    public static final String PROGRESS_UPDATED  = "PROGRESS_UPDATED";

    // Notification events
    public static final String NOTIFICATION_SEND = "NOTIFICATION_SEND";

    // Exchanges & Routing
    public static final String MAIN_EXCHANGE = "comicverse.events";
    public static final String DLX_EXCHANGE  = "comicverse.dlx";
}

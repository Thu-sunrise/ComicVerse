package com.comicverse.story.event;

public record StoryPublishedEvent(Long storyId, String title, String author, String genre, String status) {}

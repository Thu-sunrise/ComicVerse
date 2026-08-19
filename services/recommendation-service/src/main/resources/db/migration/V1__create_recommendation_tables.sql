-- ============================================================
-- Recommendation Service — V1: Local read model from StoryPublished events
-- ============================================================

CREATE TABLE story_catalog (
    id          BIGSERIAL    PRIMARY KEY,
    story_id    BIGINT       NOT NULL UNIQUE,  -- From story-service (event-sourced, no FK)
    title       VARCHAR(255) NOT NULL,
    author      VARCHAR(255),
    genre       VARCHAR(100),
    status      VARCHAR(50)  NOT NULL DEFAULT 'ONGOING',
    synced_at   TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_story_catalog_genre  ON story_catalog (genre);
CREATE INDEX idx_story_catalog_status ON story_catalog (status);

CREATE TABLE user_recommendations (
    id          BIGSERIAL   PRIMARY KEY,
    user_id     BIGINT      NOT NULL,
    story_id    BIGINT      NOT NULL,
    score       FLOAT       NOT NULL DEFAULT 0.0,
    reason      VARCHAR(100),
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (user_id, story_id)
);

CREATE INDEX idx_user_recommendations_user_id ON user_recommendations (user_id);

-- Idempotency
CREATE TABLE processed_event_ids (
    event_id     VARCHAR(36) PRIMARY KEY,
    processed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

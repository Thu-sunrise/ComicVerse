-- ============================================================
-- User Service — V1: User Profiles
-- ============================================================

CREATE TABLE user_profiles (
    id              BIGSERIAL    PRIMARY KEY,
    user_id         BIGINT       NOT NULL UNIQUE,  -- References auth-service users.id (no FK across services)
    display_name    VARCHAR(100),
    avatar_url      VARCHAR(500),
    bio             TEXT,
    preferred_lang  VARCHAR(10)  NOT NULL DEFAULT 'vi',
    theme           VARCHAR(20)  NOT NULL DEFAULT 'dark',
    created_at      TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_user_profiles_user_id ON user_profiles (user_id);

INSERT INTO user_profiles (user_id, display_name, preferred_lang, theme) VALUES
  (1, 'Demo User', 'vi', 'dark'),
  (2, 'Alice',     'en', 'dark');

-- Reading Lists
CREATE TABLE reading_lists (
    id          BIGSERIAL   PRIMARY KEY,
    user_id     BIGINT      NOT NULL,
    story_id    BIGINT      NOT NULL,
    list_type   VARCHAR(30) NOT NULL DEFAULT 'READING', -- READING, COMPLETED, PLAN_TO_READ, DROPPED
    added_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (user_id, story_id)
);

CREATE INDEX idx_reading_lists_user_id ON reading_lists (user_id);

-- Idempotency
CREATE TABLE processed_event_ids (
    event_id     VARCHAR(36) PRIMARY KEY,
    processed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

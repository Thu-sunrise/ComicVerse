-- ============================================================
-- Sync Service — V1: Reading Progress (enhanced)
-- ============================================================

CREATE TABLE reading_progress (
    id               BIGSERIAL   PRIMARY KEY,
    user_id          BIGINT      NOT NULL,
    story_id         BIGINT      NOT NULL,
    chapter_id       BIGINT      NOT NULL,
    progress_percent INT         NOT NULL DEFAULT 0 CHECK (progress_percent BETWEEN 0 AND 100),
    last_read_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (user_id, story_id)
);

CREATE INDEX idx_reading_progress_user_id  ON reading_progress (user_id);
CREATE INDEX idx_reading_progress_story_id ON reading_progress (story_id);

INSERT INTO reading_progress (user_id, story_id, chapter_id, progress_percent) VALUES
  (1, 1, 10, 75),
  (2, 2, 5,  100);

-- Idempotency table for event deduplication
CREATE TABLE processed_event_ids (
    event_id     VARCHAR(36) PRIMARY KEY,
    processed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

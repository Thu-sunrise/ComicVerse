CREATE TABLE IF NOT EXISTS reading_history (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    story_id BIGINT NOT NULL,
    chapter_id BIGINT NOT NULL,
    started_at TIMESTAMPTZ NOT NULL,
    completed_at TIMESTAMPTZ,
    last_read_at TIMESTAMPTZ NOT NULL,
    UNIQUE (user_id, chapter_id)
);
CREATE INDEX IF NOT EXISTS idx_reading_history_user_last_read ON reading_history(user_id, last_read_at);
CREATE TABLE IF NOT EXISTS chapter_access (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    chapter_id BIGINT NOT NULL,
    purchase_id BIGINT,
    granted_at TIMESTAMPTZ NOT NULL,
    revoked_at TIMESTAMPTZ
);
CREATE INDEX IF NOT EXISTS idx_chapter_access_user ON chapter_access(user_id);
CREATE INDEX IF NOT EXISTS idx_chapter_access_chapter ON chapter_access(chapter_id);
CREATE INDEX IF NOT EXISTS idx_chapter_access_active ON chapter_access(user_id, chapter_id, revoked_at);

CREATE TABLE IF NOT EXISTS user_reading_projection (
    user_id BIGINT NOT NULL,
    story_id BIGINT NOT NULL,
    story_title VARCHAR(255) NOT NULL,
    cover_url VARCHAR(500),
    chapter_id BIGINT,
    chapter_title VARCHAR(255),
    progress_percent NUMERIC(5,2) DEFAULT 0,
    last_read_at TIMESTAMPTZ,
    PRIMARY KEY (user_id, story_id)
);

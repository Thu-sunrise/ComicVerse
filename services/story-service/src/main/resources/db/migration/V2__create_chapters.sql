-- ============================================================
-- Story Service — V2: Chapters table
-- ============================================================

CREATE TABLE chapters (
    id          BIGSERIAL    PRIMARY KEY,
    story_id    BIGINT       NOT NULL REFERENCES stories(id) ON DELETE CASCADE,
    chapter_num INT          NOT NULL,
    title       VARCHAR(255),
    content_url VARCHAR(500),
    is_free     BOOLEAN      NOT NULL DEFAULT TRUE,
    published_at TIMESTAMPTZ,
    created_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    UNIQUE (story_id, chapter_num)
);

CREATE INDEX idx_chapters_story_id ON chapters (story_id);
CREATE INDEX idx_chapters_is_free  ON chapters (is_free);

INSERT INTO chapters (story_id, chapter_num, title, is_free) VALUES
  (1, 1, 'Romance Dawn',       TRUE),
  (1, 2, 'They Call Him Straw Hat', TRUE),
  (2, 1, 'Uzumaki Naruto',    TRUE),
  (2, 2, 'Konoha',             TRUE);

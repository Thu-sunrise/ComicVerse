-- ============================================================
-- Chat Service — V1: Chat Rooms
-- ============================================================

CREATE TABLE chat_rooms (
    id          BIGSERIAL    PRIMARY KEY,
    name        VARCHAR(100) NOT NULL,
    slug        VARCHAR(100) NOT NULL UNIQUE,
    type        VARCHAR(30)  NOT NULL DEFAULT 'PUBLIC', -- PUBLIC, PRIVATE, STORY
    story_id    BIGINT,      -- optional: linked to a story
    created_by  BIGINT       NOT NULL,
    created_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_chat_rooms_slug     ON chat_rooms (slug);
CREATE INDEX idx_chat_rooms_story_id ON chat_rooms (story_id);

INSERT INTO chat_rooms (name, slug, type, created_by) VALUES
  ('General',   'general',   'PUBLIC', 1),
  ('One Piece', 'one-piece', 'STORY',  1);

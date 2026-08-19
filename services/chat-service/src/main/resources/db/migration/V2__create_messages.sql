-- ============================================================
-- Chat Service — V2: Messages
-- ============================================================

CREATE TABLE messages (
    id          BIGSERIAL    PRIMARY KEY,
    room_id     BIGINT       NOT NULL REFERENCES chat_rooms(id) ON DELETE CASCADE,
    user_id     BIGINT       NOT NULL,
    username    VARCHAR(100) NOT NULL,
    content     TEXT         NOT NULL,
    type        VARCHAR(30)  NOT NULL DEFAULT 'TEXT', -- TEXT, IMAGE, SYSTEM
    is_deleted  BOOLEAN      NOT NULL DEFAULT FALSE,
    created_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_messages_room_id    ON messages (room_id);
CREATE INDEX idx_messages_user_id    ON messages (user_id);
CREATE INDEX idx_messages_created_at ON messages (created_at DESC);

-- Idempotency
CREATE TABLE processed_event_ids (
    event_id     VARCHAR(36) PRIMARY KEY,
    processed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

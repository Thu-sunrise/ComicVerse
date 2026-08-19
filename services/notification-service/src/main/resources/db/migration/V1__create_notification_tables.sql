-- ============================================================
-- Notification Service — V1: Device Tokens & Notification Logs
-- ============================================================

CREATE TABLE device_tokens (
    id          BIGSERIAL    PRIMARY KEY,
    user_id     BIGINT       NOT NULL,
    fcm_token   VARCHAR(500) NOT NULL UNIQUE,
    platform    VARCHAR(20)  NOT NULL DEFAULT 'WEB', -- WEB, ANDROID, IOS
    is_active   BOOLEAN      NOT NULL DEFAULT TRUE,
    registered_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    last_used_at  TIMESTAMPTZ
);

CREATE INDEX idx_device_tokens_user_id ON device_tokens (user_id);
CREATE INDEX idx_device_tokens_active  ON device_tokens (is_active);

CREATE TABLE notification_logs (
    id          BIGSERIAL    PRIMARY KEY,
    user_id     BIGINT       NOT NULL,
    title       VARCHAR(255) NOT NULL,
    body        TEXT         NOT NULL,
    type        VARCHAR(50),
    status      VARCHAR(30)  NOT NULL DEFAULT 'SENT', -- SENT, FAILED, DELIVERED
    fcm_message_id VARCHAR(255),
    created_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_notification_logs_user_id ON notification_logs (user_id);
CREATE INDEX idx_notification_logs_status  ON notification_logs (status);

-- Idempotency
CREATE TABLE processed_event_ids (
    event_id     VARCHAR(36) PRIMARY KEY,
    processed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

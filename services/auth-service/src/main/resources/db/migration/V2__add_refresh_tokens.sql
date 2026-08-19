-- ============================================================
-- Auth Service — V2: Refresh Tokens table
-- Stores refresh token hashes for HttpOnly cookie-based rotation.
-- The actual token is in the HttpOnly Secure SameSite=Strict cookie.
-- Only the hash is stored server-side for validation.
-- ============================================================

CREATE TABLE refresh_tokens (
    id              BIGSERIAL    PRIMARY KEY,
    user_id         BIGINT       NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token_hash      VARCHAR(255) NOT NULL UNIQUE,
    issued_at       TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    expires_at      TIMESTAMPTZ  NOT NULL,
    revoked         BOOLEAN      NOT NULL DEFAULT FALSE,
    revoked_at      TIMESTAMPTZ,
    user_agent      VARCHAR(500),
    ip_address      VARCHAR(45)
);

-- Indexes for fast revocation checks
CREATE INDEX idx_refresh_tokens_user_id    ON refresh_tokens (user_id);
CREATE INDEX idx_refresh_tokens_token_hash ON refresh_tokens (token_hash);
CREATE INDEX idx_refresh_tokens_expires_at ON refresh_tokens (expires_at);

-- ============================================================
-- Auth Service — V2: Idempotency Keys table
-- Prevents duplicate event processing.
-- ============================================================
CREATE TABLE processed_event_ids (
    event_id    VARCHAR(36)  PRIMARY KEY,
    processed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

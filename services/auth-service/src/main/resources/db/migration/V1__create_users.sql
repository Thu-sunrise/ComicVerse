-- ============================================================
-- Auth Service — V1: Users table
-- Preserves existing development data while enhancing the schema.
-- ============================================================

CREATE TABLE users (
    id                  BIGSERIAL PRIMARY KEY,
    username            VARCHAR(50)  NOT NULL UNIQUE,
    email               VARCHAR(100) NOT NULL UNIQUE,
    password_hash       VARCHAR(255) NOT NULL DEFAULT '',
    role                VARCHAR(20)  NOT NULL DEFAULT 'USER',
    is_active           BOOLEAN      NOT NULL DEFAULT TRUE,
    email_verified      BOOLEAN      NOT NULL DEFAULT FALSE,
    created_at          TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- Indexes for fast lookup
CREATE INDEX idx_users_email    ON users (email);
CREATE INDEX idx_users_username ON users (username);
CREATE INDEX idx_users_role     ON users (role);

-- Seed data for local development (password: 'demo1234' hashed with BCrypt).
INSERT INTO users (username, email, password_hash, role, is_active, email_verified) VALUES
  ('demo_user', 'demo@comicverse.local',  '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iKezVLa.O5QJGnGYLn5GiLxnH1IK', 'USER',  TRUE, TRUE),
  ('alice',     'alice@comicverse.local', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iKezVLa.O5QJGnGYLn5GiLxnH1IK', 'USER',  TRUE, TRUE),
  ('admin',     'admin@comicverse.local', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iKezVLa.O5QJGnGYLn5GiLxnH1IK', 'ADMIN', TRUE, TRUE);

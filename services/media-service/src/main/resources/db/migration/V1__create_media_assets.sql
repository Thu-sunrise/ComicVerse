-- ============================================================
-- Media Service — V1: Media Assets
-- ============================================================

CREATE TABLE media_assets (
    id              BIGSERIAL    PRIMARY KEY,
    owner_id        BIGINT       NOT NULL,         -- user_id of uploader
    owner_type      VARCHAR(30)  NOT NULL DEFAULT 'STORY', -- STORY, CHAPTER, USER_AVATAR
    reference_id    BIGINT,                        -- e.g., story_id or chapter_id
    filename        VARCHAR(255) NOT NULL,
    content_type    VARCHAR(100) NOT NULL,
    size_bytes      BIGINT       NOT NULL DEFAULT 0,
    storage_provider VARCHAR(30) NOT NULL DEFAULT 'LOCAL', -- LOCAL, S3
    storage_path    VARCHAR(500) NOT NULL,
    public_url      VARCHAR(500),
    is_active       BOOLEAN      NOT NULL DEFAULT TRUE,
    uploaded_at     TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_media_assets_owner_id     ON media_assets (owner_id);
CREATE INDEX idx_media_assets_reference_id ON media_assets (reference_id);
CREATE INDEX idx_media_assets_owner_type   ON media_assets (owner_type);

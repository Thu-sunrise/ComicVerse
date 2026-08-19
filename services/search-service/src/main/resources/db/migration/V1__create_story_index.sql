-- ============================================================
-- Search Service — V1: Story Index (local read model from events)
-- ============================================================

CREATE TABLE story_index (
    id              BIGSERIAL    PRIMARY KEY,
    story_id        BIGINT       NOT NULL UNIQUE,
    title           VARCHAR(255) NOT NULL,
    description     TEXT,
    author          VARCHAR(255),
    genre           VARCHAR(100),
    status          VARCHAR(50),
    search_vector   TSVECTOR,    -- PostgreSQL full-text search vector
    synced_at       TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_story_index_search_vector ON story_index USING gin(search_vector);
CREATE INDEX idx_story_index_genre         ON story_index (genre);

-- Trigger: auto-update search_vector when title/description/author changes
CREATE FUNCTION update_story_search_vector() RETURNS trigger AS $$
BEGIN
    NEW.search_vector :=
        setweight(to_tsvector('simple', coalesce(NEW.title, '')), 'A') ||
        setweight(to_tsvector('simple', coalesce(NEW.author, '')), 'B') ||
        setweight(to_tsvector('simple', coalesce(NEW.description, '')), 'C');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER story_search_vector_update
    BEFORE INSERT OR UPDATE ON story_index
    FOR EACH ROW EXECUTE FUNCTION update_story_search_vector();

-- Idempotency
CREATE TABLE processed_event_ids (
    event_id     VARCHAR(36) PRIMARY KEY,
    processed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

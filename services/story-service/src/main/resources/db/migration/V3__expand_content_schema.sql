ALTER TABLE stories ADD COLUMN IF NOT EXISTS author_id BIGINT;
ALTER TABLE stories ADD COLUMN IF NOT EXISTS cover_url VARCHAR(500);
ALTER TABLE stories ADD COLUMN IF NOT EXISTS age_rating VARCHAR(30);
ALTER TABLE stories ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ;
ALTER TABLE chapters ADD COLUMN IF NOT EXISTS ordinal INT;
ALTER TABLE chapters ADD COLUMN IF NOT EXISTS price NUMERIC(19,4) NOT NULL DEFAULT 0;
ALTER TABLE chapters ADD COLUMN IF NOT EXISTS status VARCHAR(30) NOT NULL DEFAULT 'DRAFT';
ALTER TABLE chapters ADD COLUMN IF NOT EXISTS content TEXT;
ALTER TABLE chapters ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ;
UPDATE chapters SET ordinal = chapter_num WHERE ordinal IS NULL;

CREATE TABLE IF NOT EXISTS categories (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(120) NOT NULL UNIQUE,
    description TEXT,
    status VARCHAR(30) NOT NULL DEFAULT 'ACTIVE',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);
CREATE TABLE IF NOT EXISTS story_categories (
    story_id BIGINT NOT NULL REFERENCES stories(id),
    category_id BIGINT NOT NULL REFERENCES categories(id),
    PRIMARY KEY (story_id, category_id)
);
CREATE TABLE IF NOT EXISTS story_revisions (
    id BIGSERIAL PRIMARY KEY,
    story_id BIGINT NOT NULL REFERENCES stories(id),
    version INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    cover_url VARCHAR(500),
    status VARCHAR(30) NOT NULL DEFAULT 'PENDING_REVIEW',
    submitted_by BIGINT NOT NULL,
    reviewed_by BIGINT,
    reviewed_at TIMESTAMPTZ,
    rejection_reason TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (story_id, version)
);
CREATE TABLE IF NOT EXISTS chapter_revisions (
    id BIGSERIAL PRIMARY KEY,
    chapter_id BIGINT NOT NULL REFERENCES chapters(id),
    version INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    content TEXT,
    price NUMERIC(19,4) NOT NULL DEFAULT 0,
    status VARCHAR(30) NOT NULL DEFAULT 'PENDING_REVIEW',
    submitted_by BIGINT NOT NULL,
    reviewed_by BIGINT,
    reviewed_at TIMESTAMPTZ,
    rejection_reason TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (chapter_id, version)
);

CREATE TABLE IF NOT EXISTS story_list_projection (
    story_id BIGINT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    cover_url VARCHAR(500),
    author_id BIGINT NOT NULL,
    author_name VARCHAR(100),
    author_avatar VARCHAR(500),
    status VARCHAR(30),
    rating_avg NUMERIC(4,2) DEFAULT 0,
    rating_count BIGINT DEFAULT 0,
    view_count BIGINT DEFAULT 0,
    chapter_count INT DEFAULT 0,
    min_chapter_price NUMERIC(19,4) DEFAULT 0,
    category_ids JSONB,
    published_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ NOT NULL
);
CREATE TABLE IF NOT EXISTS story_detail_projection (
    story_id BIGINT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    cover_url VARCHAR(500),
    author_id BIGINT NOT NULL,
    author_name VARCHAR(100),
    author_avatar VARCHAR(500),
    author_bio TEXT,
    age_rating VARCHAR(30),
    rating_avg NUMERIC(4,2) DEFAULT 0,
    rating_count BIGINT DEFAULT 0,
    view_count BIGINT DEFAULT 0,
    chapter_count INT DEFAULT 0,
    follower_count BIGINT DEFAULT 0,
    status VARCHAR(30),
    published_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ NOT NULL
);
CREATE TABLE IF NOT EXISTS story_chapters_projection (
    story_id BIGINT NOT NULL,
    chapter_id BIGINT NOT NULL,
    ordinal INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    price NUMERIC(19,4) NOT NULL,
    is_free BOOLEAN NOT NULL DEFAULT FALSE,
    status VARCHAR(30),
    published_at TIMESTAMPTZ,
    PRIMARY KEY (story_id, chapter_id)
);

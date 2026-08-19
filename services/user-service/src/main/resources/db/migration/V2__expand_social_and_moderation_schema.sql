CREATE TABLE IF NOT EXISTS follows (
    follower_id BIGINT NOT NULL,
    following_id BIGINT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (follower_id, following_id),
    CHECK (follower_id <> following_id)
);
CREATE TABLE IF NOT EXISTS comments (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    story_id BIGINT NOT NULL,
    chapter_id BIGINT,
    parent_id BIGINT REFERENCES comments(id),
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);
CREATE TABLE IF NOT EXISTS comment_attachments (
    id BIGSERIAL PRIMARY KEY,
    comment_id BIGINT NOT NULL REFERENCES comments(id),
    file_url VARCHAR(500) NOT NULL,
    file_type VARCHAR(50),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS comment_likes (
    comment_id BIGINT NOT NULL REFERENCES comments(id),
    user_id BIGINT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (comment_id, user_id)
);
CREATE TABLE IF NOT EXISTS story_ratings (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    story_id BIGINT NOT NULL,
    rating SMALLINT NOT NULL CHECK (rating BETWEEN 1 AND 5),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (user_id, story_id)
);
CREATE TABLE IF NOT EXISTS read_lists (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS read_list_items (
    read_list_id BIGINT NOT NULL REFERENCES read_lists(id),
    story_id BIGINT NOT NULL,
    added_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (read_list_id, story_id)
);
CREATE TABLE IF NOT EXISTS reports (
    id BIGSERIAL PRIMARY KEY,
    reporter_id BIGINT NOT NULL,
    target_type VARCHAR(30) NOT NULL,
    target_id BIGINT NOT NULL,
    reason_code VARCHAR(50) NOT NULL,
    description TEXT,
    status VARCHAR(30) NOT NULL DEFAULT 'PENDING',
    reviewed_by BIGINT,
    reviewed_at TIMESTAMPTZ,
    resolution VARCHAR(50),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS moderation_actions (
    id BIGSERIAL PRIMARY KEY,
    report_id BIGINT REFERENCES reports(id),
    target_type VARCHAR(30) NOT NULL,
    target_id BIGINT NOT NULL,
    action_type VARCHAR(50) NOT NULL,
    performed_by BIGINT NOT NULL,
    reason TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS story_social_stats_projection (
    story_id BIGINT PRIMARY KEY,
    rating_avg NUMERIC(4,2) DEFAULT 0,
    rating_count BIGINT DEFAULT 0,
    view_count BIGINT DEFAULT 0,
    comment_count BIGINT DEFAULT 0,
    follower_count BIGINT DEFAULT 0,
    updated_at TIMESTAMPTZ NOT NULL
);
CREATE TABLE IF NOT EXISTS admin_reports_projection (
    report_id BIGINT PRIMARY KEY,
    reporter_id BIGINT NOT NULL,
    target_type VARCHAR(30),
    target_id BIGINT,
    reason_code VARCHAR(50),
    status VARCHAR(30),
    created_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ
);
CREATE TABLE IF NOT EXISTS user_profile_projection (
    user_id BIGINT PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    display_name VARCHAR(100) NOT NULL,
    avatar_url VARCHAR(500),
    background_url VARCHAR(500),
    bio TEXT,
    follower_count BIGINT DEFAULT 0,
    following_count BIGINT DEFAULT 0,
    published_story_count BIGINT DEFAULT 0,
    is_author BOOLEAN NOT NULL DEFAULT FALSE,
    author_display_name VARCHAR(100),
    updated_at TIMESTAMPTZ NOT NULL
);
CREATE TABLE IF NOT EXISTS author_profile_projection (
    user_id BIGINT PRIMARY KEY,
    display_name VARCHAR(100) NOT NULL,
    avatar_url VARCHAR(500),
    bio TEXT,
    follower_count BIGINT DEFAULT 0,
    story_count BIGINT DEFAULT 0,
    total_published_chapters BIGINT DEFAULT 0,
    updated_at TIMESTAMPTZ NOT NULL
);

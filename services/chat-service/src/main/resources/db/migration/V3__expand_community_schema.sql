ALTER TABLE messages ADD COLUMN IF NOT EXISTS community_id BIGINT;
ALTER TABLE messages ADD COLUMN IF NOT EXISTS sender_id BIGINT;
ALTER TABLE messages ADD COLUMN IF NOT EXISTS message_type VARCHAR(30);
ALTER TABLE messages ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ;
ALTER TABLE messages ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ;

CREATE TABLE IF NOT EXISTS communities (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    slug VARCHAR(180) NOT NULL UNIQUE,
    description TEXT,
    category_id BIGINT,
    visibility VARCHAR(30) NOT NULL DEFAULT 'PUBLIC',
    join_policy VARCHAR(30) NOT NULL DEFAULT 'AUTO',
    owner_id BIGINT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);
CREATE TABLE IF NOT EXISTS community_members (
    community_id BIGINT NOT NULL REFERENCES communities(id),
    user_id BIGINT NOT NULL,
    role VARCHAR(30) NOT NULL DEFAULT 'MEMBER',
    status VARCHAR(30) NOT NULL DEFAULT 'ACTIVE',
    joined_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    kicked_at TIMESTAMPTZ,
    banned_at TIMESTAMPTZ,
    PRIMARY KEY (community_id, user_id)
);
CREATE TABLE IF NOT EXISTS community_join_requests (
    id BIGSERIAL PRIMARY KEY,
    community_id BIGINT NOT NULL REFERENCES communities(id),
    user_id BIGINT NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'PENDING',
    reviewed_by BIGINT,
    reviewed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (community_id, user_id)
);
CREATE TABLE IF NOT EXISTS message_attachments (
    id BIGSERIAL PRIMARY KEY,
    message_id BIGINT NOT NULL REFERENCES messages(id),
    file_url VARCHAR(500) NOT NULL,
    file_type VARCHAR(50),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS community_list_projection (
    community_id BIGINT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    slug VARCHAR(180) NOT NULL,
    description TEXT,
    category_id BIGINT,
    visibility VARCHAR(30),
    join_policy VARCHAR(30),
    member_count BIGINT DEFAULT 0,
    owner_id BIGINT NOT NULL,
    owner_name VARCHAR(100),
    updated_at TIMESTAMPTZ NOT NULL
);
CREATE TABLE IF NOT EXISTS community_detail_projection (
    community_id BIGINT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    description TEXT,
    category_id BIGINT,
    category_name VARCHAR(100),
    owner_id BIGINT NOT NULL,
    owner_name VARCHAR(100),
    member_count BIGINT DEFAULT 0,
    visibility VARCHAR(30),
    join_policy VARCHAR(30),
    updated_at TIMESTAMPTZ NOT NULL
);

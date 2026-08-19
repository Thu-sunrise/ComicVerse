-- ============================================================
-- Story Service — V1: Stories table (enhanced)
-- ============================================================

CREATE TABLE stories (
    id              BIGSERIAL    PRIMARY KEY,
    title           VARCHAR(255) NOT NULL,
    description     TEXT,
    author          VARCHAR(255),
    cover_image_url VARCHAR(500),
    genre           VARCHAR(100),
    status          VARCHAR(50)  NOT NULL DEFAULT 'ONGOING',
    view_count      BIGINT       NOT NULL DEFAULT 0,
    published_at    TIMESTAMPTZ,
    created_at      TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_stories_status ON stories (status);
CREATE INDEX idx_stories_genre  ON stories (genre);

INSERT INTO stories (title, description, author, status, view_count) VALUES
  ('One Piece',           'Pirates and adventure on the high seas', 'Eiichiro Oda',  'ONGOING',  1000000),
  ('Naruto',              'Ninja adventure story',                  'Masashi Kishimoto', 'FINISHED', 800000),
  ('Attack on Titan',     'Humanity fights for survival',           'Hajime Isayama', 'FINISHED', 900000),
  ('Demon Slayer',        'A boy becomes a demon slayer',           'Koyoharu Gotouge', 'FINISHED', 750000),
  ('My Hero Academia',    'A world of superheroes',                 'Kohei Horikoshi',  'ONGOING',  600000);

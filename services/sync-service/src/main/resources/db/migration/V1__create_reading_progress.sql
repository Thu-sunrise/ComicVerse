CREATE TABLE reading_progress (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    story_id BIGINT NOT NULL,
    chapter_id BIGINT NOT NULL,
    progress_percent INT NOT NULL
);

INSERT INTO reading_progress (user_id, story_id, chapter_id, progress_percent) VALUES
(1, 1, 10, 75),
(2, 2, 5, 100);

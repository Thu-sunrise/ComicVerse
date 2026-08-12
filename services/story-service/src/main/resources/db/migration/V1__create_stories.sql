CREATE TABLE stories (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(50) NOT NULL
);

INSERT INTO stories (title, description, status) VALUES
('One Piece', 'Demo story', 'ONGOING'),
('Naruto', 'Ninja adventure story', 'FINISHED');

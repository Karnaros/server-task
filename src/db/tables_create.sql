CREATE TABLE genre
(
	id SERIAL PRIMARY KEY,
	genre_name VARCHAR (100) NOT NULL
);

CREATE TABLE movie
(
	id SERIAL PRIMARY KEY,
	title TEXT NOT NULL,
	release_year SMALLINT
);

CREATE TABLE movie_genre
(
	movie_id INT NOT NULL,
	genre_id INT NOT NULL,
	
	PRIMARY KEY (movie_id, genre_id),
	FOREIGN KEY (movie_id)
		REFERENCES movie (id)
		ON DELETE CASCADE,
	FOREIGN KEY (genre_id)
		REFERENCES genre (id)
		ON DELETE CASCADE
);

INSERT INTO movie (title, release_year)
VALUES
('Зеленая миля', 1999),
('Список Шиндлера', 1993),
('Побег из Шоушенка', 1994),
('Форрест Гамп', 1994),
('Тайна Коко', 2017),
('Властелин колец: Возвращение короля', 2003);

INSERT INTO genre (genre_name)
VALUES
('драма'),
('фэнтези'),
('биография'),
('комедия'),
('мультфильм'),
('приключения');

INSERT INTO movie_genre (movie_id, genre_id)
VALUES
(1, 1),
(1, 2),
(2, 1),
(2, 3),
(3, 1),
(4, 1),
(4, 4),
(5, 2),
(5, 5),
(6, 2),
(6, 6);

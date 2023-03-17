const db = require('../db/db');

const getMovies =  async (req, res) => {
    let movies;
    let queryText;
    let queryValues;

    if(req.params.id && !isNaN(req.params.id)) {
        queryValues = [req.params.id];
        queryText = `SELECT movie.*, 
        array_agg(genre_name) AS genres
        FROM movie
        LEFT JOIN movie_genre AS mg ON (movie.id = mg.movie_id)
        LEFT JOIN genre ON (mg.genre_id = genre.id)
        WHERE movie.id = $1
        GROUP BY movie.id;`;
    } else {
        queryText = `SELECT movie.*, 
        array_agg(genre_name) AS genres
        FROM movie
        LEFT JOIN movie_genre AS mg ON (movie.id = mg.movie_id)
        LEFT JOIN genre ON (mg.genre_id = genre.id)
        GROUP BY movie.id;`;
    }

    try{        
        let response = await db.query(queryText, queryValues);
        movies = response.rows;
    } catch(e) {
        console.log(e);
        res.send({}, 500);
        return;
    }

    if(movies == undefined) {
        res.send({}, 404);
    } else {
    res.send(movies, 200);
    }
}

const createMovie = async  (req, res) => {
    const {title, release_year, genres} = req.body;
    let movie;    
    let queryText = `INSERT INTO movie (title, release_year)
    VALUES ($1, $2) RETURNING *;`;
    let queryValues = [title, release_year];

    try{
        let response = await db.query(queryText, queryValues);
        movie = response.rows[0];
    } catch(e) {
        console.log(e);
        res.send({}, 500);
        return;
    }

    if(Array.isArray(genres)){
        let movieID = movie.id;
        let genreParams = [];
        for(let i = 0; i < genres.length; i++){
            genreParams.push(`\$${i+2}`);
        }
        let preparedQueries = [`INSERT INTO movie_genre
        SELECT $1 AS movie_id, id
        FROM genre
        WHERE genre_name IN (${genreParams.join(', ')});`,
        
        `SELECT movie.*, 
        array_agg(genre_name) AS genres
        FROM movie
        LEFT JOIN movie_genre AS mg ON (movie.id = mg.movie_id)
        LEFT JOIN genre ON (mg.genre_id = genre.id)
        WHERE movie.id = $1
        GROUP BY movie.id;`,]

        queryValues = [movieID, ...genres];

        try{
            await db.query(preparedQueries[0], queryValues);            
            let response = await db.query(preparedQueries[1], [movieID]);
            movie = response.rows[0];
        } catch(e) {
            console.log(e);
            res.send({}, 500);
            return;
        }  
    }

    res.send(movie, 201);
}

const updateMovie = async  (req, res) => {
    const {id, title, release_year, genres} = req.body;
    let movie;    
    let queryText = `UPDATE movie
    SET title = $2, release_year = $3
    WHERE id = $1
    RETURNING *;`;
    let queryValues = [id, title, release_year];

    try{
        let response = await db.query(queryText, queryValues);
        movie = response.rows[0];
    } catch(e) {
        console.log(e);
        res.send({}, 500);
        return;
    }

    if(Array.isArray(genres)){
        let genreParams = [];
        for(let i = 0; i < genres.length; i++){
            genreParams.push(`\$${i+2}`);
        }
        let preparedQueries = [`INSERT INTO movie_genre
        SELECT $1 AS movie_id, id
        FROM genre
        WHERE genre_name IN (${genreParams.join(', ')})
        ON CONFLICT DO NOTHING;`,
        
        `SELECT movie.*, 
        array_agg(genre_name) AS genres
        FROM movie
        LEFT JOIN movie_genre AS mg ON (movie.id = mg.movie_id)
        LEFT JOIN genre ON (mg.genre_id = genre.id)
        WHERE movie.id = $1
        GROUP BY movie.id;`,]

        queryValues = [id, ...genres];

        try{
            await db.query(preparedQueries[0], queryValues);            
            let response = await db.query(preparedQueries[1], [id]);
            movie = response.rows[0];
        } catch(e) {
            console.log(e);
            res.send({}, 500);
            return;
        }  
    }

    res.send(movie, 200);
}

const deleteMovie = async  (req, res) => {
    if(!req.params.id || isNaN(req.params.id)) {
        res.send({}, 404);
        return;
    }
    
    let movie;
    let queryValues = [req.params.id];
    let preparedQueries = [`SELECT movie.*, 
    array_agg(genre_name) AS genres
    FROM movie
    LEFT JOIN movie_genre AS mg ON (movie.id = mg.movie_id)
    LEFT JOIN genre ON (mg.genre_id = genre.id)
    WHERE movie.id = $1
    GROUP BY movie.id;`,

    `DELETE
    FROM movie
    WHERE movie.id = $1`];

    try{            
        let response = await db.query(preparedQueries[0], queryValues);
        movie = response.rows[0];
        await db.query(preparedQueries[1], queryValues);
    } catch(e) {
        console.log(e);
        res.send({}, 500);
        return;
    }

    res.send(movie, 200);
}

module.exports = {
    getMovies,
    createMovie,
    updateMovie,
    deleteMovie
}
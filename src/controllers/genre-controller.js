const db = require('../db/db');

const getGenres =  async (req, res) => {
    let genres;
    let queryText;
    let queryValues;

    if(req.params.id && !isNaN(req.params.id)) {
        queryValues = [req.params.id];
        queryText = `SELECT * 
        FROM genre
        WHERE id = $1;`;
    } else {
        queryText = `SELECT * 
        FROM genre;`;
    }

    try{        
        let response = await db.query(queryText, queryValues);
        genres = response.rows;
    } catch(e) {
        console.log(e);
        res.send({}, 500);
        return;
    }

    if(genres == undefined) {
        res.send({}, 404);
    } else {
    res.send(genres, 200);
    }

}

const createGenre =  async (req, res) => {
    const {genre_name} = req.body;
    let genre;    
    let queryText = `INSERT INTO genre (genre_name)
    VALUES ($1) RETURNING *;`;
    let queryValues = [genre_name];

    try{
        let response = await db.query(queryText, queryValues);
        genre = response.rows[0];
    } catch(e) {
        console.log(e);
        res.send({}, 500);
        return;
    }

    res.send(genre, 201);
}

const updateGenre =  async (req, res) => {
    const {id, genre_name} = req.body;
    let genre;    
    let queryText = `UPDATE genre
    SET genre_name = $2
    WHERE genre.id = $1
    RETURNING *;`;
    let queryValues = [id, genre_name];

    try{
        let response = await db.query(queryText, queryValues);
        genre = response.rows[0];
    } catch(e) {
        console.log(e);
        res.send({}, 500);
        return;
    }

    res.send(genre, 200);
}

const deleteGenre =  async (req, res) => {
    if(!req.params.id || isNaN(req.params.id)) {
        res.send({}, 404);
        return;
    }

    let genre;
    let queryText = `DELETE
    FROM genre
    WHERE genre.id = $1
    RETURNING *;`;
    let queryValues = [req.params.id];

    try{            
        let response = await db.query(queryText, queryValues);
        genre = response.rows[0];
    } catch(e) {
        console.log(e);
        res.send({}, 500);
        return;
    }

    res.send(genre, 200);

}

module.exports = {
    getGenres,
    createGenre,
    updateGenre,
    deleteGenre
}
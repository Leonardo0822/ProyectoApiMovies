import { pool } from '../config/db.js'
export default class Movie {

static getAll = async ({ genre, director, year } = {}) => {

    //Se cambio la lógica para poder realizar el filtrado de peliculas por los diferentes query params que podrían enviarse

    let query = `SELECT 
                    m.id, 
                    m.title, 
                    m.release_year,
                    m.synopsis,
                    m.poster_url,
                    GROUP_CONCAT(DISTINCT g.name SEPARATOR ', ') AS genres,
                    GROUP_CONCAT(DISTINCT d.full_name SEPARATOR ', ') AS directors
                FROM movies m
                LEFT JOIN movie_genres mg ON m.id = mg.movie_id
                LEFT JOIN genres g ON mg.genre_id = g.id
                LEFT JOIN movie_directors md ON m.id = md.movie_id
                LEFT JOIN directors d ON md.director_id = d.id`

    const conditions = []
    const values = []

    if (genre) {
        conditions.push(`g.name = ?`)
        values.push(genre)
    }

    if (director) {
        conditions.push(`d.full_name = ?`)
        values.push(director)
    }

    if (year) {
        conditions.push(`m.release_year = ?`)
        values.push(year)
    }

    if (conditions.length > 0) {
        query += ` WHERE ` + conditions.join(' AND ')
    }

    query += ` GROUP BY m.id`

    const [rows] = await pool.query(query, values)

    return rows
}


    static find = async (id) => {

        const [rows] = await pool.query(`SELECT 
                                    m.id, 
                                    m.title, 
                                    m.release_year,
                                    m.synopsis,
                                    GROUP_CONCAT(DISTINCT g.name SEPARATOR ', ') AS genres,
                                    GROUP_CONCAT(DISTINCT d.full_name SEPARATOR ', ') AS directors
                                FROM movies m
                                LEFT JOIN movie_genres mg ON m.id = mg.movie_id
                                LEFT JOIN genres g ON mg.genre_id = g.id
                                LEFT JOIN movie_directors md ON m.id = md.movie_id
                                LEFT JOIN directors d ON md.director_id = d.id
                                where m.id = :id
                                GROUP BY m.id;`, { id }); //bind param

        return rows
    }

    static create = async (movie) => {
    const newMovie = { ...movie }
    const { genre, director } = newMovie

    try {
        const [result] = await pool.query(
            `INSERT INTO movies (title, release_year, synopsis, poster_url) VALUES (?, ?, ?, ?)`,
            [newMovie.title, newMovie.release_year, newMovie.synopsis, newMovie.poster_url ?? null]
        )

        const movieId = result.insertId

        if (genre && genre.length > 0) {
            const genreValues = genre.map(genreId => [movieId, genreId])
            await pool.query(
                `INSERT INTO movie_genres (movie_id, genre_id) VALUES ?`,
                [genreValues]
            )
        }

        if (director && director.length > 0) {
            const directorValues = director.map(directorId => [movieId, directorId])
            await pool.query(
                `INSERT INTO movie_directors (movie_id, director_id) VALUES ?`,
                [directorValues]
            )
        }

        return { id: movieId, ...newMovie }
    } catch (e) {
        throw new Error('Error al guardar en la base de datos: ' + e.message)
    }
}

   static update = async (id, movie) => {

    const updateMovie = { ...movie }

    await pool.query(
        `UPDATE movies
         SET title = ?, release_year = ?, synopsis = ?, poster_url = ?
         WHERE id = ?`,
        [
            updateMovie.title,
            updateMovie.release_year,
            updateMovie.synopsis,
            updateMovie.poster_url ?? null,
            id
        ]
    )

    if (updateMovie.genre) {
        await pool.query(
            `DELETE FROM movie_genres WHERE movie_id = ?`,
            [id]
        )

        const genreValues = updateMovie.genre.map((genreId) => [id, genreId])

        await pool.query(
            `INSERT INTO movie_genres (movie_id, genre_id) VALUES ?`,
            [genreValues]
        )
    }

    if (updateMovie.director) {
        await pool.query(
            `DELETE FROM movie_directors WHERE movie_id = ?`,
            [id]
        )

        const directorValues = updateMovie.director.map((directorId) => [id, directorId])

        await pool.query(
            `INSERT INTO movie_directors (movie_id, director_id) VALUES ?`,
            [directorValues]
        )
    }

    const [rows] = await pool.query(
        `SELECT 
            m.id,
            m.title,
            m.release_year,
            m.synopsis,
            m.poster_url,
            GROUP_CONCAT(DISTINCT g.name SEPARATOR ', ') AS genres,
            GROUP_CONCAT(DISTINCT d.full_name SEPARATOR ', ') AS directors
        FROM movies m
        LEFT JOIN movie_genres mg ON m.id = mg.movie_id
        LEFT JOIN genres g ON mg.genre_id = g.id
        LEFT JOIN movie_directors md ON m.id = md.movie_id
        LEFT JOIN directors d ON md.director_id = d.id
        WHERE m.id = ?
        GROUP BY m.id`,
        [id]
    )

    return rows[0]
}


    static delete = async (id) => {
        await pool.query(
            `DELETE FROM movies WHERE id = ?`,
            [id]
        )
    }


}


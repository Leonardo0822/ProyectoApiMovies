import MOVIES from '../data/movies.json' with { type: 'json' }
import { v4 as uuidv4 } from 'uuid';
import { pool } from '../config/db.js'
export default class Movie {

    static getAll = async ({ genre, director, year } = {}) => {


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
                                GROUP BY m.id;`);


        //conectarse a la base de datos
        //hacer la consutla (query)
        // retornar los resultados

        //concatenar con un where
        if (genre) {
            //throw -> genera un error generico
            // throw Error('user not found')

            return MOVIES.filter((movie) => {
                return movie.genre.some((g) => {
                    return g.toLowerCase() === genre.toLowerCase()
                })
            })
        }
        if (director) {
            //throw -> genera un error generico
            // throw Error('user not found')

            return MOVIES.filter((movie) => {
                return movie.directors.some((d) => {
                    return d.toLowerCase() === director.toLowerCase()
                })
            })
        }
        if (year) {
            //throw -> genera un error generico
            // throw Error('user not found')

            return MOVIES.filter((movie) => {
                return movie.year === parseInt(year)
            })
        }

        //select *from 
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
            `INSERT INTO movies (title, release_year, synopsis) VALUES (?, ?, ?)`,
            [newMovie.title, newMovie.release_year, newMovie.synopsis]
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

    static update = async (id, movie) => { //movie = {}

        const idx = MOVIES.findIndex((movie) => movie.id === id)

        const movieUpdated = {
            ...MOVIES[idx],
            ...movie
        }

        MOVIES[idx] = movieUpdated

        return movieUpdated

    }

    static delete = async (id) => {

        const idx = MOVIES.findIndex((movie) => movie.id === id)
        MOVIES.splice(idx, 1)

    }

}


import Movie from '../service/movie.js'
import { validateMovieSchema, validatePartialMovieSchema } from '../schemas/movie.schema.js'

export const getAll = async (req, res) => {
    const { query } = req
    const dataFilter = {}

    if (query.genre) dataFilter.genre = query.genre
    if (query.director) dataFilter.director = query.director
    if (query.year) dataFilter.year = query.year

    try {
        const filteredMovies = await Movie.getAll(dataFilter)

        if (!filteredMovies) {
            return res.json({
                message: 'Obtener todas las peliculas',
                data: []
            })
        }

        const newList = filteredMovies.map((movie) => {
            return {
                ...movie,
                genres: movie.genres ? movie.genres.split(', ') : [],
                directors: movie.directors ? movie.directors.split(', ') : []
            }
        })

        return res.json({
            message: 'Obtener todas las peliculas',
            data: newList
        })
    } catch (e) {
        return res.status(500).json({
            message: 'Error al consultar la base de datos: ' + e.message,
            data: null
        })
    }
}

export const getById = async (req, res) => {
    const { id } = req.params

    try {
        const [movie] = await Movie.find(id)

        if (!movie) {
            return res.status(404).json({
                message: 'Pelicula no encontrada',
                data: null
            })
        }

        return res.json({
            message: 'Obtener una pelicula por su id',
            data: movie
        })
    } catch {
        return res.status(500).json({
            message: 'Error en el server',
            data: null
        })
    }
}

export const create = async (req, res) => {
    const body = req.body
    const { success, data, error, errors } = validateMovieSchema(body)

    if (!success) {
        return res.status(400).json({
            status: 'error',
            message: 'Verifique la informacion enviada',
            errors: errors?.error?.issues || JSON.parse(error.message)
        })
    }

    try {
        const newMovie = await Movie.create(data)

        return res.status(201).json({
            status: 'success',
            message: 'Pelicula creada correctamente',
            data: newMovie
        })
    } catch (e) {
        return res.status(500).json({
            status: 'error',
            message: 'Error al guardar en la base de datos: ' + e.message,
            data: null
        })
    }
}

export const update = async (req, res) => {
    const { id } = req.params
    const movie = await Movie.find(id)

    if (!movie) {
        return res.status(404).json({
            status: 'error',
            message: 'Pelicula no encontrada'
        })
    }

    const { success, errors, error, data } = validatePartialMovieSchema(req.body)

    if (!success) {
        return res.status(400).json({
            status: 'error',
            message: 'Datos incorrectos',
            errors: errors?.error?.issues || JSON.parse(error.message)
        })
    }

    const updatedMovie = await Movie.update(id, data)

    return res.json({
        status: 'success',
        message: 'Pelicula actualizada',
        data: updatedMovie
    })
}

export const deleteMovie = async (req, res) => {
    const { id } = req.params
    const movie = await Movie.find(id)

    if (!movie) {
        return res.status(404).json({
            status: 'error',
            message: 'Pelicula no encontrada'
        })
    }

    await Movie.delete(id)

    return res.json({
        status: 'success',
        message: 'Pelicula eliminada'
    })
}

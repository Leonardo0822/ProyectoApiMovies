import Genre from '../service/genre.js'
import { validateGenreSchema } from '../schemas/genre.schema.js'

export const getAllGenres = async (req, res) => {
    try {
        const genres = await Genre.getAllGenres()

        return res.json({
            status: 'success',
            data: genres
        })
    } catch (e) {
        return res.status(500).json({
            status: 'error',
            message: e.message
        })
    }
}

export const findGenre = async (req, res) => {
    const { id } = req.params

    try {
        const genre = await Genre.findGenre(id)

        if (!genre) {
            return res.status(404).json({
                status: 'error',
                message: 'Genero no encontrado'
            })
        }

        return res.json({
            status: 'success',
            data: genre
        })
    } catch (e) {
        return res.status(500).json({
            status: 'error',
            message: e.message
        })
    }
}

export const createGenre = async (req, res) => {
    const { success, data, error, errors } = validateGenreSchema(req.body)

    if (!success) {
        return res.status(400).json({
            status: 'error',
            message: 'Verifique la informacion enviada',
            errors: errors?.error?.issues || JSON.parse(error.message)
        })
    }

    try {
        const newGenre = await Genre.createGenre(data)

        return res.status(201).json({
            status: 'success',
            message: 'Genero creado correctamente',
            data: newGenre
        })
    } catch (e) {
        return res.status(500).json({
            status: 'error',
            message: e.message
        })
    }
}

export const updateGenre = async (req, res) => {
    const { id } = req.params

    const genre = await Genre.findGenre(id)

    if (!genre) {
        return res.status(404).json({
            status: 'error',
            message: 'Genero no encontrado'
        })
    }

    const { success, data, error, errors } = validateGenreSchema(req.body)

    if (!success) {
        return res.status(400).json({
            status: 'error',
            message: 'Verifique la informacion enviada',
            errors: errors?.error?.issues || JSON.parse(error.message)
        })
    }

    try {
        const updatedGenre = await Genre.updateGenre(id, data)

        return res.json({
            status: 'success',
            message: 'Genero actualizado correctamente',
            data: updatedGenre
        })
    } catch (e) {
        return res.status(500).json({
            status: 'error',
            message: e.message
        })
    }
}

export const deleteGenre = async (req, res) => {
    const { id } = req.params

    const genre = await Genre.findGenre(id)

    if (!genre) {
        return res.status(404).json({
            status: 'error',
            message: 'Genero no encontrado'
        })
    }

    try {
        await Genre.deleteGenre(id)

        return res.json({
            status: 'success',
            message: 'Genero eliminado correctamente'
        })
    } catch (e) {
        return res.status(500).json({
            status: 'error',
            message: e.message
        })
    }
}

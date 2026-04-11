import director from "../service/director.js";
import { validateDirectorSchema } from "../schemas/director.schema.js";

export const getAllDirectors = async (req, res) => {
    try {
        const directors = await director.getAllDirectors()
        return res.json({
            status: 'success',
            data: directors
        })
    } catch (e) {
        return res.status(500).json({
            status: 'error',
            message: e.message
        })
    }
}

export const findDirector = async (req, res) => {
    const { id } = req.params

    try {
        const directorFound = await director.findDirector(id)
        if (!directorFound) {
            return res.status(404).json({
                status: 'error',
                message: 'Director no encontrado'
            })
        }
        return res.json({
            status: 'success',
            data: directorFound
        })
    } catch (e) {
        return res.status(500).json({
            status: 'error',
            message: e.message
        })
    }
}

export const createDirector = async (req, res) => {
    const { success, data, error, errors } = validateDirectorSchema(req.body)
    if (!success) {
        return res.status(400).json({
            status: 'error',
            message: 'Verifique la informacion enviada',
            errors: errors?.error?.issues || JSON.parse(error.message)
        })
    }
    try {
        const newDirectorId = await director.createDirector(data.name)
        return res.status(201).json({
            status: 'success',
            data: { id: newDirectorId }
        })
    } catch (e) {
        return res.status(500).json({
            status: 'error',
            message: e.message
        })
    }
}

export const updateDirector = async (req, res) => {
    const { id } = req.params
    const { success, data, error, errors } = validateDirectorSchema(req.body)
    if (!success) {
        return res.status(400).json({
            status: 'error',
            message: 'Verifique la informacion enviada',
            errors: errors?.error?.issues || JSON.parse(error.message)
        })
    }
    try {
        const updatedDirector = await director.updateDirector(id, data.name)
        return res.json({
            status: 'success',
            data: updatedDirector
        })
    } catch (e) {
        return res.status(500).json({
            status: 'error',
            message: e.message
        })
    }
}

export const deleteDirector = async (req, res) => {
    const { id } = req.params
    try {
        await director.deleteDirector(id)
        return res.json({
            status: 'success',
            message: 'Director eliminado correctamente'
        })
    } catch (e) {
        return res.status(500).json({
            status: 'error',
            message: e.message
        })
    }
}

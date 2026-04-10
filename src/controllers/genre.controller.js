import Genre from '../service/genre.js'
import { validateGenreSchema} from '../schemas/genre.schema.js'

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
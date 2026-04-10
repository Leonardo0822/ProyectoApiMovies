
import { Router } from 'express'
import { getAllGenres, findGenre, createGenre, updateGenre, deleteGenre } from '../controllers/genre.controller.js'
import { isAuth } from '../middlewares/isAuth.js'

const genresRouter = Router()

//definición de rutas Hijas
genresRouter.get('/', isAuth, getAllGenres)
genresRouter.get('/:id', isAuth, findGenre)
genresRouter.post('/', isAuth, createGenre)
genresRouter.put('/:id', isAuth, updateGenre)
genresRouter.delete('/:id', isAuth, deleteGenre)

export default genresRouter
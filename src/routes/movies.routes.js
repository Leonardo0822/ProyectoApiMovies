
import { Router } from 'express'
import { getAll, getById, create, update, deleteMovie } from '../controllers/movie.controller.js'
import { isAuth } from '../middlewares/isAuth.js'

const moviesRouter = Router()

//definición de rutas Hijas
moviesRouter.get('/', isAuth, getAll)
moviesRouter.get('/:id', isAuth, getById)
moviesRouter.post('/', isAuth, create)
moviesRouter.put('/:id', isAuth, update)
moviesRouter.delete('/:id', isAuth, deleteMovie)

export default moviesRouter
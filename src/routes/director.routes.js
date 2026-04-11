import { Router } from "express";
import { getAllDirectors, findDirector, createDirector, updateDirector, deleteDirector } from "../controllers/director.controller.js";
import { isAuth } from "../middlewares/isAuth.js";

const directorRouter = Router()

directorRouter.get('/', isAuth, getAllDirectors)    
directorRouter.get('/:id', isAuth, findDirector)
directorRouter.post('/', isAuth, createDirector)
directorRouter.put('/:id', isAuth, updateDirector)
directorRouter.delete('/:id', isAuth, deleteDirector)

export default directorRouter
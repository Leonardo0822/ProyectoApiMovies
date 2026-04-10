import * as z from 'zod'


const movieSchema = z.object({
    "title": z.string('El titulo debe ser un string').min(2).max(100, 'no debe superar los 100 caracteres'),
    "director": z.array(z.int().positive(), "naaaa").min(1),
    "posterUrl": z.url().nullable(),
    "genre": z.array(z.int('el valor debe ser numerico').positive(), 'Los generos deben ser un arreglo de enteros').min(1).nullable(),
    "releaseYear": z.number('El año de lanzamiento debe ser un numero').int().positive().lte(new Date().getFullYear(), 'El año de lanzamiento no puede ser mayor al año actual'),
    "synopsis": z.string('La sinopsis debe ser un string').min(10, 'La sinopsis debe tener al menos 10 caracteres').max(1000, 'La sinopsis no debe superar los 1000 caracteres').nullable()
}).strict()

export const validateMovieSchema = (movie) => {
    return movieSchema.safeParse(movie)
}

export const validatePartialMovieSchema = (movie) => {

    return movieSchema.partial().safeParse(movie)
}
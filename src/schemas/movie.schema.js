import * as z from 'zod'

const currentYear = new Date().getFullYear()

const movieSchema = z.object({
    title: z.string('El titulo debe ser un string').min(2).max(100, 'No debe superar los 100 caracteres'),
    director: z.array(z.int().positive(), 'Los directores deben ser un arreglo de enteros').min(1, 'Debe tener al menos un director').max(3, 'No debe tener mas de 3 directores'),
    genre: z.array(z.int().positive(), 'Los generos deben ser un arreglo de enteros').min(1, 'Debe tener al menos un genero'),
    release_year: z.number('El año de lanzamiento debe ser un numero').int().positive().lte(currentYear, 'El año de lanzamiento no puede ser mayor al año actual'),
    synopsis: z.string('La sinopsis debe ser un string').min(10, 'La sinopsis debe tener al menos 10 caracteres').max(1000, 'La sinopsis no debe superar los 1000 caracteres'),
    poster_url: z.url('El poster debe ser una URL valida').nullable().optional()
}).strict()

export const validateMovieSchema = (movie) => {
    return movieSchema.safeParse(movie)
}

export const validatePartialMovieSchema = (movie) => {
    return movieSchema.partial().safeParse(movie)
}

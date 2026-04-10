import * as z from 'zod'


const genreSchema = z.object({
    name: z.string('El nombre del genero debe ser un string').min(2, 'El nombre del genero debe tener al menos 2 caracteres').max(50, 'El nombre del genero no debe superar los 50 caracteres')
}).strict()

export const validateGenreSchema = (genre) => {
    return genreSchema.safeParse(genre)
}
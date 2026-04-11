import * as z from 'zod'

const directorSchema = z.object({
    name: z.string('El nombre del director debe ser un string').min(2, 'El nombre del director debe tener al menos 2 caracteres').max(50, 'El nombre del director no debe superar los 50 caracteres')
}).strict()

export const validateDirectorSchema = (director) => {
    return directorSchema.safeParse(director)
}
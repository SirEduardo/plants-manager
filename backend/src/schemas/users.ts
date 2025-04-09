import z from 'zod'
import { plantSchema } from './plants'

const usersSchema = z.object({
    username: z.string(),
    password: z.string(),
    email: z.string().email(),
    plants: z.array(plantSchema).optional(),
})

export function validateUser(user) {
    return usersSchema.safeParse(user)
}

export function validatePartialUser(user) {
    return usersSchema.partial().safeParse(user)
}
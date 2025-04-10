import z from 'zod'
import { plantSchema } from './plants'

const usersSchema = z.object({
    username: z.string(),
    password: z.string(),
    email: z.string().email(),
    plants: z.array(plantSchema).optional(),
})

export function validateUser(user: unknown) {
    return usersSchema.safeParse(user)
}

export function validatePartialUser(user: unknown) {
    return usersSchema.partial().safeParse(user)
}
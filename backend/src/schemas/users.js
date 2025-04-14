import z from 'zod'
import { plantSchema } from './plants.js'

export const UserSchema = z.object({
  username: z.string(),
  password: z.string(),
  email: z.string().email(),
  plants: z.array(plantSchema).optional()
})

export function validateUser(user) {
  return UserSchema.safeParse(user)
}

export function validatePartialUser(user) {
  return UserSchema.partial().safeParse(user)
}

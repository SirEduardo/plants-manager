import z from 'zod'
import { plantSchema } from './plants.js'
import { notificationSchema } from './notifications.js'
import { locationSchema } from './locations.js'

export const UserSchema = z.object({
  username: z.string(),
  password: z.string(),
  email: z.string().email(),
  plants: z.array(plantSchema).optional(),
  notifications: z.array(notificationSchema).optional(),
  localizations: z.array(locationSchema).optional()
})

export function validateUser(user) {
  return UserSchema.safeParse(user)
}

export function validatePartialUser(user) {
  return UserSchema.partial().safeParse(user)
}

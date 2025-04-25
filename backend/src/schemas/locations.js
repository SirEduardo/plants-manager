import { z } from 'zod'

export const locationSchema = z.object({
  name: z.string(),
  image: z.string().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional()
})

export function validateLocation(location) {
  return locationSchema.safeParse(location)
}

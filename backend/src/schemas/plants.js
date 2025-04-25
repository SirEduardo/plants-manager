import z from 'zod'

export const plantSchema = z.object({
  commonName: z.string(),
  image: z.string().optional(),
  last_watering_date: z.string().optional(),
  last_fertilize_date: z.string().optional(),
  location_id: z.string().optional()
})

export function validatePlant(plant) {
  return plantSchema.safeParse(plant)
}

export function validatePartialPlant(plant) {
  return plantSchema.partial().safeParse(plant)
}

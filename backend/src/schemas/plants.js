import z from 'zod'

export const plantSchema = z.object({
  name: z.string(),
  image: z.string().optional(),
  last_watering_date: z.string(),
  watering_frequency: z.preprocess((val) => Number(val), z.number()),
  last_fertilize_date: z.string(),
  fertilize_frequency: z.preprocess((val) => Number(val), z.number()),
  min_temperature: z.preprocess((val) => Number(val), z.number()),
  max_temperature: z.preprocess((val) => Number(val), z.number())
})

export function validatePlant(plant) {
  return plantSchema.safeParse(plant)
}

export function validatePartialPlant(plant) {
  return plantSchema.partial().safeParse(plant)
}

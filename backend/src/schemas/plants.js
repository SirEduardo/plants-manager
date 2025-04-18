import z from 'zod'

export const plantSchema = z.object({
  commonName: z.string(),
  image: z.string().optional(),
  last_watering_date: z.string().optional(),
  last_fertilize_date: z.string().optional(),
  summer_watering: z.string().optional().default('unknown'),
  winter_watering: z.string().optional().default('unknown'),
  sunlight: z.string().optional().default('unknown'),
  location: z.string().optional().default('unknown'),
  edible: z.string().optional().default('unknown'),
  human_toxicity: z.string().optional().default('unknown'),
  animal_toxicity: z.string().optional().default('unknown'),
  description: z.string().optional().default('No description available')
})

export function validatePlant(plant) {
  return plantSchema.safeParse(plant)
}

export function validatePartialPlant(plant) {
  return plantSchema.partial().safeParse(plant)
}

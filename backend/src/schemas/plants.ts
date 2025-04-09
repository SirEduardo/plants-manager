import z from 'zod';

export const plantSchema = z.object({
    name: z.string(),
    image: z.string().optional(),
    last_watering_date: z.date().optional(),
    watering_frequency: z.number().optional(),
    last_fertilize_date: z.date().optional(),
    fertilize_frequency: z.number().optional(),
    min_temperature: z.number().optional(),
    max_temperature: z.number().optional(),
  });

  export function validatePlant(plant:any) {
    return plantSchema.safeParse(plant)
  }

  export function validatePartialPlant(plant: any) {
    return plantSchema.partial().safeParse(plant)
  }
import { z } from 'zod'

export const notificationSchema = z.object({
  title: z.string(),
  message: z.string(),
  status: z.boolean().optional()
})

export function validateNotification(notification) {
  return notificationSchema.safeParse(notification)
}

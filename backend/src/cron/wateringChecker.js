import cron from 'node-cron'
import { PlantsModel } from '../models/plants.js'
import { shouldWater } from '../services/plantService.js'
import { NotificationModel } from '../models/notification.js'

cron.schedule('* 9 * * *', async () => {
  const plants = await PlantsModel.getPlantsWithWateringInfo()

  plants.forEach((plant) => {
    const result = shouldWater(plant)
    if (result.needsWatering) {
      console.log(
        `🌱 La planta ${plant.common_name} del usuario ${plant.user_id} necesita riego hoy.`
      )
      sendWateringNotification(plant.user_id, plant.common_name)
    }
  })
})

async function sendWateringNotification(userId, plantName) {
  await NotificationModel.createNotification(
    userId,
    'Riego',
    `Tu planta ${plantName} necesita riego hoy!🌱💧`
  )
}

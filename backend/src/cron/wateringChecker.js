import cron from 'node-cron'
import { PlantsModel } from '../models/plants.js'
import { shouldWater } from '../services/plantService.js'
import { NotificationModel } from '../models/notification.js'
import { shouldFertilize } from '../services/fertilizeService.js'

cron.schedule(
  '* 9 * * *',
  async () => {
    try {
      const plants = await PlantsModel.getPlantsWithInfo()
      console.log(plants)

      plants.forEach((plant) => {
        const waterResult = shouldWater(plant)
        if (waterResult.needsWatering) {
          console.log(
            `🌱 La planta ${plant.common_name} del usuario ${plant.user_id} necesita riego hoy.`
          )
          sendWateringNotification(plant.user_id, plant.common_name)
        }
        const fertilizeResult = shouldFertilize(plant)
        if (fertilizeResult.needsFertilizing) {
          console.log(
            `🌱 La planta ${plant.common_name} del usuario ${plant.user_id} necesita riego hoy.`
          )
          sendFertilizeNotification(plant.user_id, plant.common_name)
        }
      })
    } catch (err) {
      console.error('❌ Error en cron job:', err)
    }
  },
  {
    timezone: 'Europe/Madrid'
  }
)

async function sendWateringNotification(userId, plantName) {
  await NotificationModel.createNotification(
    userId,
    'Riego',
    `Tu planta ${plantName} necesita riego hoy!🌱💧`
  )
}

async function sendFertilizeNotification(userId, plantName) {
  await NotificationModel.createNotification(
    userId,
    'Fertilización',
    `Tu planta ${plantName} necesita que la fertilices hoy!🌱`
  )
}

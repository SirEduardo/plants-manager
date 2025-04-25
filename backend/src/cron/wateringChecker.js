import cron from 'node-cron'
import { PlantsModel } from '../models/plants.js'
import { shouldWater } from '../services/waterService.js'
import { NotificationModel } from '../models/notification.js'
import { LocationModel } from '../models/location.js'
import { temperature } from '../services/temperatureService.js'
import checkFertilizing from '../services/fertilizeService.js'

cron.schedule(
  '* 8 * * *',
  async () => {
    try {
      const plants = (await PlantsModel.getPlantsWithInfo()) || []

      const locations = await LocationModel.getLocation()

      plants.forEach((plant) => {
        const waterResult = shouldWater(plant)
        if (waterResult.needsWatering) {
          console.log(
            `🌱 La planta ${plant.common_name} del usuario ${plant.user_id} necesita riego hoy.`
          )
          sendWateringNotification(plant.user_id, plant.common_name)
        }
      })
      const plantsToFertilize = checkFertilizing(plants)
      plantsToFertilize.forEach((plant) => {
        console.log(
          `🌱 La planta ${plant.common_name} del usuario ${plant.user_id} necesita riego hoy.`
        )
        sendFertilizeNotification(plant.user_id, plant.common_name)
      })

      locations.forEach((location) => {
        const temperatureResult = temperature(location)
        if (temperatureResult.warningTemperature)
          console.log(
            `Las plantas que hay en ${location.name} tienen riesgo de heladas`
          )
        SendTemperatureNotification(location.name, location.user_id)
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

async function SendTemperatureNotification(localization, userId) {
  await NotificationModel.createNotification(
    userId,
    'Aviso de helada!!',
    `Tus plantas en ${localization} están en peligro de helada!❄️`
  )
}

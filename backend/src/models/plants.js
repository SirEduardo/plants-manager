import { db } from '../database/db.js'
import {
  fetchExternalDataId,
  fetchExternalDetails
} from '../services/perenualService.js'
import { translateField } from '../utils/translatedFields.js'
import { NotificationModel } from './notification.js'

export class PlantsModel {
  static async getAll(userId) {
    const { rows: plants } = await db.query(
      `SELECT * FROM user_plants WHERE user_id = $1`,
      [userId]
    )
    return Array.isArray(plants) ? plants : []
  }

  static async getById(id) {
    try {
      const { rows: userPlantRows } = await db.query(
        `SELECT * FROM user_plants WHERE id = $1;`,
        [id]
      )
      if (userPlantRows.length > 0) {
        const userPlant = userPlantRows[0]
        // obtener datos externos si existen
        const { rows: externalDataRows } = await db.query(
          'SELECT * FROM plants WHERE common_name ILIKE $1',
          [`%${userPlant.common_name}%`]
        )
        const externalData =
          externalDataRows.length > 0 ? externalDataRows[0] : {}
        return { userPlant, externalData }
      } else {
        res.status(404).json({ error: 'Planta no encontrada' })
      }
    } catch (error) {
      res
        .status(500)
        .json({ error: 'Error al obtener la planta' + error.message })
    }
  }

  static async addPlants(input, user_id) {
    if (!input) {
      throw new Error('No se recibió ningún dato para añadir la planta')
    }

    const { commonName, image, last_watering_date, last_fertilize_date } = input // Destructuramos los datos enviados por el frontend

    try {
      // Verificamos si la planta ya existe en la base de datos del usuario
      const { rows: existingPlant } = await db.query(
        'SELECT * FROM user_plants WHERE user_id = $1 AND common_name ILIKE $2',
        [user_id, `%${commonName}%`]
      )

      let plantId

      // Si no existe, la insertamos
      if (existingPlant.length > 0) {
        plantId = existingPlant[0].id
      } else {
        const insertResult = await db.query(
          'INSERT INTO user_plants (user_id, common_name, image, last_watering_date, last_fertilize_date) VALUES ($1, $2, $3, $4, $5) RETURNING id',
          [user_id, commonName, image, last_watering_date, last_fertilize_date]
        )
        plantId = insertResult.rows[0].id
        console.log('📬 Creando notificación...')
        await NotificationModel.createNotification(
          user_id,
          'Nueva planta añadida',
          `Has añadido correctamente ${commonName}`
        )
      }

      let { rows: existingExternalData } = await db.query(
        'SELECT * FROM plants WHERE common_name ILIKE $1',
        [`%${commonName}%`]
      )

      // Guardamos los datos externos que nos vienen del frontend (que fueron obtenidos de la API externa) si no existiera
      if (existingExternalData.length === 0) {
        console.log(
          `📡 La información de "${commonName}" no existía localmente. Obteniendo desde API externa...`
        )
        const plantIdFromApi = await fetchExternalDataId(commonName)
        const externalDetails = await fetchExternalDetails(plantIdFromApi)

        const rawWatering =
          externalDetails?.watering?.toLowerCase() ?? 'unknown'
        const rawSunlight = Array.isArray(externalDetails?.sunlight)
          ? externalDetails.sunlight.map((s) => s.toLowerCase())
          : [externalDetails?.sunlight?.toLowerCase() ?? 'unknown']

        const rawLocation = externalDetails?.indoor ? 'indoor' : 'outdoor'

        const summer_watering =
          translateField.watering[rawWatering] ?? 'desconocido'
        const winter_watering =
          translateField.watering[rawWatering] ?? 'desconocido'
        const sunlight = rawSunlight
          .map((s) => translateField.sunlight[s] ?? s)
          .join(', ')
        const location = translateField.location[rawLocation] ?? 'desconocido'

        const edible = externalDetails?.edible_fruit ?? false
        const human_toxicity =
          externalDetails?.poisonous_to_humans ?? 'desconocido'
        const animal_toxicity =
          externalDetails?.poisonous_to_humans ?? 'desconocido'
        const description =
          externalDetails?.description ?? 'No hay descripción disponible.'

        await db.query(
          'INSERT INTO plants (common_name, summer_watering, winter_watering, sunlight, location, edible, human_toxicity, animal_toxicity, description) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)',
          [
            commonName,
            summer_watering,
            winter_watering,
            sunlight,
            location,
            edible,
            human_toxicity,
            animal_toxicity,
            description
          ]
        )

        // Refrescamos el resultado para devolverlo
        const result = await db.query(
          'SELECT * FROM plants WHERE common_name ILIKE $1',
          [`%${commonName}%`]
        )
        existingExternalData = result.rows
      } else {
        console.log(
          `💾 Información de "${commonName}" obtenida desde la base de datos local.`
        )
      }
      const { rows: joinedData } = await db.query(
        `SELECT 
          up.id AS plantId,
          up.common_name,
          up.image,
          up.last_watering_date,
          up.last_fertilize_date,
          p.summer_watering,
          p.winter_watering,
          p.fertilize,
          p.sunlight,
          p.location,
          p.edible,
          p.human_toxicity,
          p.animal_toxicity,
          p.description
        FROM user_plants up
        LEFT JOIN plants p ON up.common_name = p.common_name
        WHERE up.id = $1`,
        [plantId]
      )

      return {
        success: true,
        data: joinedData
      }
    } catch (error) {
      console.error('Error al añadir planta:', error)
      throw error
    }
  }

  static async deletePLants(id) {
    const { rows: plantRows } = await db.query(
      `SELECT * FROM user_plants WHERE id = $1`,
      [id]
    )
    const plant = plantRows[0]
    if (!plant) return null
    await db.query(`DELETE FROM user_plants WHERE id = $1`, [id])
    return plant
  }

  static async getPlantsWithWateringInfo() {
    const { rows: plantRows } = await db.query(
      `SELECT up.id AS plantId, up.user_id, up.common_name, up.last_watering_date, epd.watering FROM user_plants up LEFT JOIN external_plant_data epd ON up.common_name = epd.common_name`
    )
    return plantRows
  }
}

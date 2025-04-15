import { db } from '../database/db.js'
import {
  fetchExternalDataId,
  fetchExternalDetails
} from '../server/perenualService.js'

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
          'SELECT * FROM external_plant_data WHERE common_name = $1',
          [userPlant.common_name]
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
        'SELECT * FROM user_plants WHERE user_id = $1 AND common_name = $2',
        [user_id, commonName]
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
      }

      let { rows: existingExternalData } = await db.query(
        'SELECT * FROM external_plant_data WHERE common_name = $1',
        [commonName]
      )

      // Guardamos los datos externos que nos vienen del frontend (que fueron obtenidos de la API externa) si no existiera
      if (existingExternalData.length === 0) {
        console.log(
          `📡 La información de "${commonName}" no existía localmente. Obteniendo desde API externa...`
        )
        const plantIdFromApi = await fetchExternalDataId(commonName)
        const externalDetails = await fetchExternalDetails(plantIdFromApi)

        const watering = externalDetails?.watering ?? 'unknown'
        const sunlight = Array.isArray(externalDetails?.sunlight)
          ? externalDetails.sunlight.join(', ')
          : externalDetails?.sunlight ?? 'unknown'
        const location = externalDetails?.indoor ? 'indoor' : 'outdoor'
        const edible = externalDetails?.edible_fruit ?? false
        const toxicity = externalDetails?.poisonous_to_humans ?? 'unknown'
        const description =
          externalDetails?.description ?? 'No description available.'

        await db.query(
          'INSERT INTO external_plant_data (common_name, watering, sunlight, location, edible, toxicity, description, source) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)',
          [
            commonName,
            watering,
            sunlight,
            location,
            edible,
            toxicity,
            description,
            'API externa'
          ]
        )

        // Refrescamos el resultado para devolverlo
        const result = await db.query(
          'SELECT * FROM external_plant_data WHERE common_name = $1',
          [commonName]
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
          epd.watering,
          epd.sunlight,
          epd.location,
          epd.edible,
          epd.toxicity,
          epd.description,
          epd.source
        FROM user_plants up
        LEFT JOIN external_plant_data epd ON up.common_name = epd.common_name
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
}

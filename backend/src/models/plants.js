import { db } from '../database/db.js'

export class PlantsModel {
  static async getAll() {
    const [plants] = await db.query(`SELECT * FROM user_plants;`)
    return Array.isArray(plants) ? plants : []
  }

  static async getById(id) {
    try {
      const [userPlantRows] = await db.query(
        `SELECT * FROM user_plants WHERE id = ?;`,
        [id]
      )
      if (userPlantRows.length > 0) {
        const userPlant = userPlantRows[0]
        // obtener datos externos si existen
        const [externalDataRows] = await db.query(
          'SELECT * FROM external_plant_data WHERE common_name = ?',
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

  static async addPlants(input) {
    if (!input) {
      throw new Error('No se recibió ningún dato para añadir la planta')
    }

    const {
      commonName,
      image,
      last_watering_date,
      last_fertilize_date,
      watering,
      sunlight,
      location,
      edible,
      toxicity,
      description
    } = input // Destructuramos los datos enviados por el frontend

    try {
      // Verificamos si la planta ya existe en la base de datos del usuario
      const [existingPlant] = await db.query(
        'SELECT * FROM user_plants WHERE common_name = ?',
        [commonName]
      )

      let plantId

      // Si no existe, la insertamos
      if (existingPlant.length > 0) {
        plantId = existingPlant[0].id
      } else {
        const [insertResult] = await db.query(
          'INSERT INTO user_plants (common_name, image, last_watering_date, last_fertilize_date) VALUES (?, ?, ?, ?)',
          [commonName, image, last_watering_date, last_fertilize_date]
        )
        plantId = insertResult.insertId
      }

      const [existingExternalData] = await db.query(
        'SELECT * FROM external_plant_data WHERE common_name = ?',
        [commonName]
      )

      // Guardamos los datos externos que nos vienen del frontend (que fueron obtenidos de la API externa) si no existiera
      if (existingExternalData.length === 0) {
        await db.query(
          'INSERT INTO external_plant_data (common_name, watering, sunlight, location, edible, toxicity, description, source) VALUES ( ?, ?, ?, ?, ?, ?, ?, ?)',
          [
            commonName,
            watering,
            sunlight,
            location,
            edible,
            toxicity,
            description,
            'Frontend' // Fuente de los datos
          ]
        )
      }

      const externalData =
        existingExternalData.length > 0 ? existingExternalData[0] : {}

      return {
        success: true,
        data: {
          plantId,
          commonName,
          ...externalData
        }
      }
    } catch (error) {
      console.error('Error al añadir planta:', error)
      throw error
    }
  }

  static async deletePLants() {
    await db.query(`DELETE FROM user_plants WHERE id = ?`, [id])
  }
}

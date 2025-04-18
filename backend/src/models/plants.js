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
          'SELECT * FROM plants WHERE unaccent(common_name) ILIKE unaccent($1)',
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
      // verificamos si la planta existe en la base de datos
      const { rows: externalMatch } = await db.query(
        'SELECT * FROM plants WHERE unaccent(common_name) ILIKE unaccent($1)',
        [`%${commonName}%`]
      )

      if (externalMatch.length === 0) {
        // Si no existe, lanzamos error personalizado
        throw new Error('La planta no se encontró en la base de datos')
      }

      // Verificamos si la planta ya existe en la base de datos del usuario
      const { rows: existingPlant } = await db.query(
        'SELECT * FROM user_plants WHERE user_id = $1 AND unaccent(common_name) ILIKE unaccent($2)',
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

        await NotificationModel.createNotification(
          user_id,
          'Nueva planta añadida',
          `Has añadido correctamente ${commonName}`
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
        LEFT JOIN plants p ON unaccent(up.common_name) ILIKE unaccent(p.common_name)
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

  static async getPlantsWithInfo() {
    const { rows: plantRows } = await db.query(
      `SELECT up.id AS plantId, up.user_id, up.common_name, up.last_watering_date, up.last_fertilize_date, p.summer_watering, p.winter_watering, p.fertilize FROM user_plants up LEFT JOIN plants p ON up.common_name = p.common_name`
    )
    return plantRows
  }

  static async updatePlant(id, data) {
    const keys = Object.keys(data)
    const values = Object.values(data)

    values.push(id)
    const setClause = keys
      .map((key, index) => `${key} = $${index + 1}`)
      .join(', ')

    const query = `
      UPDATE user_plants
      SET ${setClause}
      WHERE id = $${keys.length + 1}
      RETURNING *;
    `

    const { rows: plantRows } = await db.query(query, values)

    return plantRows[0]
  }
}

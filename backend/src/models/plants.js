import mysql from 'mysql2/promise'

const config = mysql.createPool({
  host: 'localhost',
  user: 'root',
  port: 3306,
  password: '',
  database: 'plantsmanagerdb',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 10
})

export class PlantsModel {
  static async getAll() {
    const [plants] = await config.query(`SELECT * FROM plants;`)
    return Array.isArray(plants) ? plants : []
  }

  static async getById(id) {
    const [plant] = await config.query(`SELECT * FROM plants WHERE id = ?;`, [
      id
    ])
    return plant[0]
  }

  static async addPlants(input) {
    if (!input) {
      throw new Error('No se recibió ningún dato para añadir la planta')
    }

    const {
      name,
      image,
      last_watering_date,
      watering_frequency,
      last_fertilize_date,
      fertilize_frequency,
      min_temperature,
      max_temperature
    } = input

    if (!image || typeof image !== 'string') {
      console.warn(
        'Advertencia: No se proporcionó una imagen válida, se asignará un valor por defecto.'
      )
    }

    const [uuidResult] = await config.query(`SELECT UUID() uuid;`)
    const [{ uuid }] = uuidResult

    try {
      await config.query(
        `INSERT INTO plants (id, name, image, last_watering_date, watering_frequency, last_fertilize_date, fertilize_frequency, min_temperature, max_temperature)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);`,
        [
          uuid,
          name,
          image || '',
          last_watering_date,
          watering_frequency,
          last_fertilize_date,
          fertilize_frequency,
          min_temperature,
          max_temperature
        ]
      )
    } catch (error) {
      console.error('Error al insertar en la base de datos:', error)
      throw new Error('Error añadiendo planta')
    }
    const [plants] = await config.query(`SELECT * FROM plants WHERE id = ?;`, [
      uuid
    ])
    return plants[0]
  }
}

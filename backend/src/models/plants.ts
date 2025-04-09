import mysql from 'mysql2/promise'

const config = mysql.createPool({
    host: 'localhost',
    user: 'root',
    port: 3306,
    password: '',
    database: 'PlantsManagerdb',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 10
})



export class PlantsModel {
    static async getAll () {
        const [ plants ] = await config.query(
            `SELECT * FROM plants;`
        )
        return plants
    }
    static async addPlants({ input}) {
        const { name, image, last_watering_date, watering_frequency, last_fertilize_date, fertilize_frequency, min_temperature, max_temperature } = input

        const [uuidResult] = await config.query(`SELECT UUID() uuid;`)
        const [{ uuid }] = uuidResult

        try {
            await config.query(
                `INSERT INTO plants (id, name, image,last_watering_date, watering_frequency, last_fertilize_date, fertilize_frequency, min_temperature, max_temperature)
                VALUES (UUID_TO_BIN("${uuid}"), ?, ?, ?, ?, ?, ?, ?, ?);`,
                [name, image, last_watering_date, watering_frequency, last_fertilize_date, fertilize_frequency, min_temperature, max_temperature]
            )
        } catch (error) {
            throw new Error('Error añadiendo planta')
        }
        const [ plants ] = await config.query(
            `SELECT * FROM plants;`
        )
        return plants[0]
    }
}
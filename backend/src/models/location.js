import { db } from '../database/db.js'

export class LocationModel {
  static async create(input) {
    const { name, image, user_id, latitude, longitude } = input

    const { rows: location } = await db.query(
      `INSERT INTO locations (name, image, user_id, latitude, longitude) VALUES ($1, $2, $3, $4, $5)`,
      [name, image, user_id, latitude, longitude]
    )
    return location
  }
  static async getLocation(id) {
    const { rows: location } = await db.query(
      `SELECT * FROM locations WHERE user_id = $1`,
      [id]
    )
    return location
  }
  static async delete(id) {
    const { rows: location } = await db.query(
      `DELETE FROM locations WHERE id = $1`,
      [id]
    )
    return location
  }
}

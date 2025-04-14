import { UserSchema } from '../schemas/users.js'
import { db } from '../database/db.js'
import bcrypt from 'bcryptjs'
import crypto from 'crypto'

export class UserModel {
  static async createUser(username, password, email) {
    const id = crypto.randomUUID()
    const hashedPassword = await bcrypt.hash(password, 10)
    const [existingUser] = await db.query(
      'SELECT * FROM users WHERE username = ? OR email = ?',
      [username, email]
    )
    if (existingUser.length > 0) {
      throw new Error(
        'El nombre de usuario o el correo electrónico ya está en uso'
      )
    }

    const userQuery = `INSERT INTO users (id, username, password, email) VALUES (?, ?, ?, ?)`
    const [userResult] = await db.query(userQuery, [
      id,
      username,
      hashedPassword,
      email
    ])
    if (userResult.affectedRows === 0) {
      throw new Error('Error al guardar el usuario en la base de datos')
    }
    return id
  }

  static async loginUser(username, password) {
    const [user] = await db.query('SELECT * FROM users WHERE username = ?', [
      username
    ])
    if (user.length === 0) throw new Error('Username or password are incorrect')

    const isValid = await bcrypt.compare(password, user[0].password)
    if (!isValid) throw new Error('Username or password are incorrect')

    const { password: _, ...publicUser } = user[0]
    return publicUser
  }
}

import { UserModel } from '../models/users.js'
import jwt from 'jsonwebtoken'
import { validatePartialUser, validateUser } from '../schemas/users.js'
import { generateToken } from '../utils/token.js'

export class UserController {
  static async register(req, res) {
    const result = validateUser(req.body)
    if (!result.success) {
      console.log('Detalles del error:', result.error.errors)
      return res.status(400).json({ error: result.error.errors })
    }
    const { username, password, email } = req.body

    try {
      const id = await UserModel.createUser(username, password, email)
      res.status(201).send({ id })
    } catch (error) {
      // No mandar error al cliente
      console.log(error)
      res.status(400).send({ message: error.message })
    }
  }
  static async login(req, res) {
    const result = validatePartialUser(req.body)
    if (!result.success) {
      console.log('Detalles del error:', result.error.errors)
      return res.status(400).json({ error: result.error.errors })
    }
    const { username, password } = req.body
    try {
      const user = await UserModel.loginUser(username, password)

      const token = jwt.sign(
        { id: user.id, username: user.username },
        process.env.JWT_SECRET,
        {
          expiresIn: '1y'
        }
      )
      res
        .cookie('access_token', token, {
          httpOnly: true,
          secure: (process.env.NODE_ENV === 'production'),
          sameSite: 'None'
        })
        .status(200)
        .send({ user, token })
    } catch (error) {
      res.status(401).send({ error: error.message })
    }
  }

  static async logout(req, res) {
    res
      .clearCookie('token', {
        httpOnly: true,
        secure: (process.env.NODE_ENV = 'production'),
        sameSite: 'None'
      })
      .status(200)
      .send({ message: 'Sessión cerrada correctamente' })
  }
}

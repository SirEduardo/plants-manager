import { verifyToken } from './token.js'

const authenticateUser = (req, res, next) => {
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res
      .status(401)
      .json({ message: 'Acceso denegado. Token no proporcionado.' })
  }

  const token = authHeader.split(' ')[1]

  try {
    const decoded = verifyToken(token) // Verificar el token
    req.userId = decoded.id // Guardamos el user_id en el request
    next()
  } catch (error) {
    return res.status(400).json({ message: 'Token inválido' })
  }
}
export default authenticateUser

import { verifyToken } from './token.js'

const authenticateUser = (req, res, next) => {
  const token = req.cookies.access_token
  if (!token) {
    return res
      .status(401)
      .json({ message: 'Acceso denegado. No se encontró el token.' })
  }

  try {
    const decoded = verifyToken(token) // Verificar el token
    req.userId = decoded.id // Guardamos el user_id en el request
    next()
  } catch (error) {
    return res.status(400).json({ message: 'Token inválido' })
  }
}
export default authenticateUser

import { LocationModel } from '../models/location.js'
import { validateLocation } from '../schemas/locations.js'
import { cityCoordenades } from '../services/coordenades.js'

export class LocationController {
  static async create(req, res) {
    const result = validateLocation(req.body)

    const data = result.data
    try {
      if (!data) {
        return res.status(400).json({ message: 'Datos inválidos' })
      }
      if (req.file) {
        data.image = req.file.path
      }
      data.user_id = req.userId
      const coord = await cityCoordenades(data.name)
      data.latitude = coord.lat
      data.longitude = coord.lon
      console.log(data)

      const location = await LocationModel.create(data)
      return res
        .status(201)
        .json({ message: 'Localización creada éxitosamente', location })
    } catch (error) {
      return res
        .status(400)
        .json({ message: 'Error creando la localización', error })
    }
  }
  static async getLocation(req, res) {
    const userId = req.userId

    try {
      if (!userId) {
        return res.status(404).json({ message: 'Usuario no encontrado' })
      }
      const location = await LocationModel.getLocation(userId)
      return res.status(200).json(location)
    } catch (error) {
      return res
        .status(500)
        .json({ message: 'Error al encontrar la ubicación', error })
    }
  }
}

import dotenv from 'dotenv'
dotenv.config()
import axios from 'axios'

const key = process.env.PLANT_API_KEY
const plantApiUrl = 'https://perenual.com/api/v2'

export const fetchExternalDataId = async (commonName) => {
  try {
    const response = await axios.get(
      `${plantApiUrl}/species-list?key=${key}&q=${commonName}`
    )

    if (response.data && response.data.data && response.data.data.length > 0) {
      const plantId = response.data.data[0].id
      return plantId
    } else {
      throw new Error('No se encontraron resultados para la planta.')
    }
  } catch (error) {
    console.error('Error al obtener datos de la API externa', error)
    throw new Error('No se pudieron obtener los datos de la API externa.')
  }
}
export const fetchExternalDetails = async (plantId) => {
  try {
    const response = await axios.get(
      `${plantApiUrl}/species/details/${plantId}?key=${key}`
    )
    if (response.data) {
      return response.data
    } else {
      throw new Error('No se encontraron detalles para esta planta.')
    }
  } catch (error) {
    console.error('Error al obtener detalles de la planta', error)
    throw new Error('No se pudieron obtener los detalles de la planta.')
  }
}

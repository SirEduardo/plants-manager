import axios from 'axios'

const Key = import.meta.env.VITE_PLANT_API_KEY
const plantApiUrl = 'https://perenual.com/api/v2'

export const fetchExternalDataId = async (commonName: string) => {
  try {
    const response = await axios.get(
      `${plantApiUrl}/species-list?key=${Key}&q=${commonName}`
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
export const fetchExternalDetails = async (plantId: string) => {
  try {
    const response = await axios.get(
      `${plantApiUrl}/species/details/${plantId}?key=${Key}`
    )
    if (response.data) {
      console.log(response.data)

      return response.data
    } else {
      throw new Error('No se encontraron detalles para esta planta.')
    }
  } catch (error) {
    console.error('Error al obtener detalles de la planta', error)
    throw new Error('No se pudieron obtener los detalles de la planta.')
  }
}

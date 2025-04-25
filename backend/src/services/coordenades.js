import fetch from 'node-fetch'
import { db } from '../database/db.js'

export async function cityCoordenades(city) {
  const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
    city
  )}`

  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'my-app-nodejs/1.0'
      }
    })
    const data = await response.json()
    if (data && data.length > 0) {
      const lat = parseFloat(data[0].lat)
      const lon = parseFloat(data[0].lon)
      return { lat, lon }
    } else {
      return null
    }
  } catch (error) {
    console.error('Error al obtener coordenadas:', error)
    return null
  }
}

export async function getLocationSlug(city) {
  const location = await db.query(
    `SELECT id FROM locations WHERE LOWER(name) = $1`,
    [city.toLowerCase()]
  )
  return location.rows[0] ? location.rows[0].id : null
}

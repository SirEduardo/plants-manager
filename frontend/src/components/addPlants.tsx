'use client'

import { useState } from 'react'
import { Calendar, Droplets, Leaf, Thermometer } from 'lucide-react'
import { Header } from './Header'
import { useNavigate } from 'react-router'
import axios from 'axios'

const apiUrl = import.meta.env.VITE_API_URL ?? 'http://localhost:3000'
const Key = import.meta.env.VITE_PLANT_API_KEY
const plantApiUrl = 'https://perenual.com/api/v2'

export default function AddPlants() {
  const [formData, setFormData] = useState({
    commonName: '',
    image: null as File | null,
    externalData: null as any,
    last_watering_date: '',
    watering_frequency: '',
    last_fertilize_date: '',
    fertilize_frequency: '',
    min_temperature: '',
    max_temperature: ''
  })

  const navigate = useNavigate()

  // Función para manejar cambios en los inputs
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    setFormData((prev) => ({ ...prev, [id]: value }))
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target
    if (files && files[0]) {
      setFormData((prev) => ({ ...prev, image: files[0] }))
    }
  }

  const fetchExternalDataId = async (commonName: string) => {
    try {
      const response = await axios.get(
        `${plantApiUrl}/species-list?key=${Key}&q=${commonName}`
      )

      if (
        response.data &&
        response.data.data &&
        response.data.data.length > 0
      ) {
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
  const fetchExternalDetails = async (plantId: string) => {
    try {
      const response = await axios.get(
        `${plantApiUrl}/species/details/${plantId}?key=${Key}`
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

  // Manejador del formulario
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    try {
      const localResponse = await axios.get(
        `http://localhost:3000/plants/external?commonName=${formData.commonName}`
      )

      let plantDetails
      if (localResponse.data && localResponse.data.exists === true) {
        plantDetails = localResponse.data.data
      } else {
        const plantId = await fetchExternalDataId(formData.commonName)
        plantDetails = await fetchExternalDetails(plantId)
      }
      setFormData((prev) => ({ ...prev, plantDetails }))

      const form = new FormData()
      form.append('commonName', formData.commonName)

      if (formData.image) {
        form.append('image', formData.image)
      }
      console.log('DETALLES COMPLETOS DE LA PLANTA', plantDetails)

      if (plantDetails) {
        form.append('watering', plantDetails.watering || 'unknown')
        form.append('sunlight', plantDetails.sunlight[0] || 'unknown')
        form.append('cycle', plantDetails.cycle || 'unknown')
        form.append('edible', plantDetails.edible_fruit || false)
        form.append('toxicity', plantDetails.poisonous_to_humans || 'unknown')
        form.append(
          'description',
          plantDetails.description || 'No description available.'
        )
        form.append(
          'last_watering_date',
          formData.last_watering_date || new Date().toISOString()
        )
        form.append('watering_frequency', formData.watering_frequency)
        form.append(
          'last_fertilize_date',
          formData.last_fertilize_date || new Date().toISOString()
        )
        form.append('fertilize_frequency', formData.fertilize_frequency)
        form.append('min_temperature', formData.min_temperature)
        form.append('max_temperature', formData.max_temperature)
      }

      const response = await axios.post(`http://localhost:3000/plants`, form, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      console.log('Response from backend:', response)
      if (response.status === 201) {
        console.log('Planta añadida exitosamente', response.data)
        navigate('/')
      } else {
        console.error('Error al añadir la planta en el front', response.data)
      }
    } catch (error) {
      console.error('Hubo un error al enviar la solicitud', error)
    }
  }

  return (
    <main className="min-h-svh bg-gradient-to-b from-gray-800 to-gray-900 text-white p-6">
      <Header />
      <div className="flex flex-col items-center pt-20">
        <section className="w-full max-w-2xl mx-auto shadow-lg border-green-100 rounded-lg  text-black">
          <div className="bg-green-50 rounded-t-lg p-6">
            <div className="text-green-800 flex items-center gap-2 text-2xl font-semibold">
              <Leaf className="h-5 w-5 text-green-600" />
              Información de la planta
            </div>
            <p className="text-gray-500 text-sm mt-1">
              Ingresa los detalles de tu planta para un mejor seguimiento de
              cuidados
            </p>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="p-6 space-y-6 bg-white">
              <div>
                <div className="space-y-2">
                  <label
                    htmlFor="commonName"
                    className="text-green-700 text-sm font-medium block"
                  >
                    Nombre
                  </label>
                  <input
                    id="commonName"
                    placeholder="Nombre de tu planta"
                    value={formData.commonName}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-green-200 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="image"
                  className="text-green-700 text-sm font-medium block"
                >
                  Imagen (URL)
                </label>
                <input
                  type="file"
                  id="image"
                  onChange={handleImageChange}
                  className="w-full px-3 py-2 border border-green-200 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label
                    htmlFor="last_watering_date"
                    className="text-green-700 flex items-center gap-1 text-sm font-medium"
                  >
                    <Calendar className="h-4 w-4" />
                    Último Riego
                  </label>
                  <input
                    id="last_watering_date"
                    type="date"
                    value={formData.last_watering_date}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-green-200 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
                <div className="space-y-2">
                  <label
                    htmlFor="watering_frequency"
                    className="text-green-700 flex items-center gap-1 text-sm font-medium"
                  >
                    <Droplets className="h-4 w-4" />
                    Frecuencia de Riego (días)
                  </label>
                  <input
                    id="watering_frequency"
                    type="number"
                    placeholder="7"
                    value={formData.watering_frequency}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-green-200 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label
                    htmlFor="last_fertilize_date"
                    className="text-green-700 flex items-center gap-1 text-sm font-medium"
                  >
                    <Calendar className="h-4 w-4" />
                    Última Fertilización
                  </label>
                  <input
                    id="last_fertilize_date"
                    type="date"
                    value={formData.last_fertilize_date}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-green-200 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
                <div className="space-y-2">
                  <label
                    htmlFor="fertilize_frequency"
                    className="text-green-700 flex items-center gap-1 text-sm font-medium"
                  >
                    <Droplets className="h-4 w-4" />
                    Frecuencia de Fertilización (días)
                  </label>
                  <input
                    id="fertilize_frequency"
                    type="number"
                    placeholder="7"
                    value={formData.fertilize_frequency}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-green-200 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label
                    htmlFor="min_temperature"
                    className="text-green-700 flex items-center gap-1 text-sm font-medium"
                  >
                    <Thermometer className="h-4 w-4" />
                    Temperatura Mínima (°C)
                  </label>
                  <input
                    id="min_temperature"
                    type="number"
                    placeholder="15"
                    value={formData.min_temperature}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-green-200 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
                <div className="space-y-2">
                  <label
                    htmlFor="max_temperature"
                    className="text-green-700 flex items-center gap-1 text-sm font-medium"
                  >
                    <Thermometer className="h-4 w-4" />
                    Temperatura Máxima (°C)
                  </label>
                  <input
                    id="max_temperature"
                    type="number"
                    placeholder="25"
                    value={formData.max_temperature}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-green-200 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
            <div className="bg-green-50 rounded-b-lg p-6 flex justify-end">
              <button
                type="submit"
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md font-medium transition-colors"
              >
                Guardar Planta
              </button>
            </div>
          </form>
        </section>
      </div>
    </main>
  )
}

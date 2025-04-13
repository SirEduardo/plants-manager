'use client'

import { useState } from 'react'
import { Calendar, Droplets, Leaf } from 'lucide-react'
import { Header } from './Header'
import { useNavigate } from 'react-router'
import axios from 'axios'
import {
  fetchExternalDataId,
  fetchExternalDetails
} from './fetch/getExternalData'
import { Form } from './form'
import { translateToEnglish } from './fetch/translateToEnglish'

const apiUrl = import.meta.env.VITE_API_URL ?? 'http://localhost:3000'

export default function AddPlants() {
  const [formData, setFormData] = useState({
    commonName: '',
    image: null as File | null,
    externalData: null as any,
    last_watering_date: '',
    watering_frequency: '',
    last_fertilize_date: '',
    fertilize_frequency: ''
  })

  const navigate = useNavigate()

  const isSpanish = (text: string): boolean => {
    // Chequeamos si el texto contiene letras típicas del español, como 'á', 'é', 'í', 'ó', 'ú'
    const spanishCharacters = /[áéíóúñ]/i
    return spanishCharacters.test(text)
  }

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

  // Manejador del formulario
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    try {
      let plantDetails = {
        watering: 'unknown',
        sunlight: ['unknown'],
        cycle: 'unknown',
        edible_fruit: false,
        poisonous_to_humans: 'unknown',
        description: 'No description available.',
        location: 'unknown'
      }

      try {
        let plantNameInEnglish = formData.commonName

        // Si el nombre se introdujo en español, lo traducimos a inglés
        if (isSpanish(formData.commonName)) {
          plantNameInEnglish = await translateToEnglish(formData.commonName)
          console.log(`Nombre traducido a inglés: ${plantNameInEnglish}`)
        }

        // Intentamos obtener el ID de la planta con el nombre traducido
        const plantId = await fetchExternalDataId(plantNameInEnglish)

        const externalDetails = await fetchExternalDetails(plantId)
        if (externalDetails) {
          plantDetails = {
            watering: externalDetails.watering ?? 'unknown',
            sunlight: externalDetails.sunlight ?? ['unknown'],
            cycle: externalDetails.cycle ?? 'unknown',
            edible_fruit: externalDetails.edible_fruit ?? false,
            location: externalDetails.indoor ?? false,
            poisonous_to_humans:
              externalDetails.poisonous_to_humans ?? 'unknown',
            description:
              externalDetails.description ?? 'No description available.'
          }
        }
      } catch (error) {
        console.warn(
          'No se pudieron obtener detalles externos, se usan valores por defecto.'
        )
      }
      setFormData((prev) => ({ ...prev, plantDetails }))

      const form = Form(formData, plantDetails)
      const response = await axios.post(`${apiUrl}/plants`, form, {
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

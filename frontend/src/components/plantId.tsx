import { useNavigate, useParams } from 'react-router'
import { Plants } from '../types'
import { useEffect, useState } from 'react'

//import plantsData from '../plants.json'
const apiUrl = import.meta.env.VITE_API_URL

export function PlantId() {
  const { id } = useParams<{ id: string }>()
  const [plant, setPlant] = useState<Plants | null>(null)

  const navigate = useNavigate()

  useEffect(() => {
    const fetchPlantById = async () => {
      const response = await fetch(`${apiUrl}/plants/${id}`)
      const res = await response.json()
      setPlant(res)
    }
    fetchPlantById()
  }, [id])

  const handleBack = () => {
    navigate('/')
  }

  const formatDate = (date: string) => {
    const d = new Date(date)
    return d.toLocaleDateString('es-ES') // "dd/mm/yyyy"
  }
  return (
    <div className="h-svh bg-gray-700 text-white">
      <button
        onClick={handleBack}
        className="relative top-10 left-5 cursor-pointer"
      >
        Atrás
      </button>
      <div className="flex items-center flex-col pt-20 gap-2">
        {plant ? (
          <>
            <img
              src={plant.image}
              alt={plant.name}
              className="w-48 h-48 object-cover rounded-lg"
            />
            <h2 className="text-xl font-bold text-green-400">{plant.name}</h2>
            <p>Último riego: {formatDate(plant.last_watering_date)}</p>
            <p>Frecuencia de riego: {plant.watering_frequency}</p>
            <p>Temperatura mínima: {plant.min_temperature}°C</p>
            <p>Temperatura máxima: {plant.max_temperature}°C</p>
          </>
        ) : (
          <p>Cargando...</p> // Muestra un mensaje de carga mientras se obtiene la planta
        )}
      </div>
    </div>
  )
}

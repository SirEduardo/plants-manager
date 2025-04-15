import { useNavigate, useParams } from 'react-router'
import { Plants } from '../types'
import { useEffect, useState } from 'react'
import { ArrowLeft, Trash2Icon } from 'lucide-react'
import axios from 'axios'
import { apiUrl } from '../api/url'

export function PlantId() {
  const { id } = useParams<{ id: string }>()
  const [plant, setPlant] = useState<Plants | null>(null)
  const [plantDetail, setPlantDetail] = useState<Plants | null>(null)

  const navigate = useNavigate()

  useEffect(() => {
    const fetchPlantById = async () => {
      const response = await fetch(`${apiUrl}/plants/${id}`)
      const res = await response.json()
      console.log(res)

      setPlant(res.userPlant)
      setPlantDetail(res.externalData)
      console.log(res)
    }
    fetchPlantById()
  }, [id])

  const handleBack = () => {
    navigate('/plantsList')
  }
  const handleDelete = async () => {
    await axios.delete(`${apiUrl}/plants/${id}`)
    navigate('/plantsList')
  }

  const formatDate = (date: string) => {
    const d = new Date(date)
    return d.toLocaleDateString('es-ES') // "dd/mm/yyyy"
  }
  return (
    <div className="min-h-svh bg-gradient-to-b from-gray-800 to-gray-900 text-white p-6">
      <button
        onClick={handleBack}
        className="flex items-center gap-2 text-green-400 hover:text-green-300 transition-colors mb-8 cursor-pointer"
      >
        <ArrowLeft size={20} />
        <span>Atrás</span>
      </button>

      {plant && plantDetail ? (
        <div className="max-w-md mx-auto">
          <div className="bg-gray-800/50 rounded-2xl overflow-hidden shadow-xl border border-gray-700">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent opacity-50"></div>
              <img
                src={plant.image || '/placeholder.svg'}
                alt={plant.common_name}
                className="w-full h-64 object-cover"
              />
            </div>

            <div className="p-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-green-400 mb-4">
                  {plant.common_name}
                </h2>
                <Trash2Icon
                  onClick={handleDelete}
                  className="text-red-400 cursor-pointer"
                ></Trash2Icon>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-700/50 p-3 rounded-lg">
                    <p className="text-xs text-gray-400">Último riego</p>
                    <p className="font-medium">
                      {formatDate(plant.last_watering_date)}
                    </p>
                  </div>
                  <div className="bg-gray-700/50 p-3 rounded-lg">
                    <p className="text-xs text-gray-400">Frecuencia de riego</p>
                    <p className="font-medium">{plantDetail.watering} días</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-700/50 p-3 rounded-lg">
                    <p className="text-xs text-gray-400">Luz solar</p>
                    <p className="font-medium">{plantDetail.sunlight}</p>
                  </div>
                  <div className="bg-gray-700/50 p-3 rounded-lg">
                    <p className="text-xs text-gray-400">Localización</p>
                    <p className="font-medium">
                      {plantDetail.location === true ? 'Interior' : 'Exterior'}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-700/50 p-3 rounded-lg">
                    <p className="text-xs text-gray-400">
                      Última fertilización
                    </p>
                    <p className="font-medium">
                      {formatDate(plant.last_fertilize_date)}
                    </p>
                  </div>
                  <div className="bg-gray-700/50 p-3 rounded-lg">
                    <p className="text-xs text-gray-400">Frecuencia</p>
                    <p className="font-medium">
                      {plant.fertilize_frequency} días
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-700/50 p-3 rounded-lg flex items-center">
                    <div>
                      <p className="text-xs text-gray-400">Comestible</p>
                      <p className="font-medium">
                        {plantDetail.edible === 0 ? 'No' : 'Sí'}
                      </p>
                    </div>
                    <div
                      className={`ml-auto w-3 h-3 rounded-full ${
                        plantDetail.edible === 0 ? 'bg-red-500' : 'bg-green-500'
                      }`}
                    ></div>
                  </div>
                  <div className="bg-gray-700/50 p-3 rounded-lg flex items-center">
                    <div>
                      <p className="text-xs text-gray-400">Tóxica</p>
                      <p className="font-medium">
                        {plantDetail.toxicity === '0' ? 'No' : 'Sí'}
                      </p>
                    </div>
                    <div
                      className={`ml-auto w-3 h-3 rounded-full ${
                        plantDetail.toxicity === '0'
                          ? 'bg-green-500'
                          : 'bg-red-500'
                      }`}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-[70vh]">
          <div className="w-16 h-16 border-4 border-green-400 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-green-400 font-medium">
            Cargando detalles de la planta...
          </p>
        </div>
      )}
    </div>
  )
}

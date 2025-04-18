'use client'

import { useNavigate, useParams } from 'react-router'
import type { Plants } from '../../types'
import { useEffect, useState } from 'react'
import {
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  Trash2Icon,
  Droplet,
  Sun,
  Home,
  Leaf,
  Calendar,
  Info,
  Snowflake,
  AlertTriangle
} from 'lucide-react'
import axios from 'axios'
import { apiUrl } from '../../api/url'

export function PlantId() {
  const { id } = useParams<{ id: string }>()
  const [plant, setPlant] = useState<Plants | null>(null)
  const [plantDetail, setPlantDetail] = useState<Plants | null>(null)
  const [showMoreInfo, setShowMoreInfo] = useState(false)
  const [deleteModal, setDeleteModal] = useState(false)

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
  const abrirModal = () => setDeleteModal(true)
  const cerrarModal = () => setDeleteModal(false)
  const confirmarEliminacion = () => {
    handleDelete()
    cerrarModal()
  }

  const toggleMoreInfo = () => {
    setShowMoreInfo(!showMoreInfo)
  }

  const formatDate = (date: string) => {
    const d = new Date(date)
    return d.toLocaleDateString('es-ES') // "dd/mm/yyyy"
  }

  const capitalize = (val: string) => {
    return String(val).charAt(0).toUpperCase() + String(val).slice(1)
  }

  return (
    <div className="min-h-svh bg-gradient-to-b from-gray-800 via-gray-850 to-gray-900 text-white p-6">
      <button
        onClick={handleBack}
        className="flex items-center gap-2 text-green-400 hover:text-green-300 transition-colors mb-8 cursor-pointer group"
      >
        <ArrowLeft
          size={20}
          className="group-hover:-translate-x-1 transition-transform duration-200"
        />
        <span>Atrás</span>
      </button>

      {plant && plantDetail ? (
        <div className="max-w-md mx-auto">
          <div className="bg-gray-800/50 rounded-2xl overflow-hidden shadow-xl border border-gray-700 backdrop-blur-sm">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent opacity-70"></div>
              <img
                src={plant.image || '/placeholder.svg'}
                alt={plant.common_name}
                className="w-full h-64 object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <div className="bg-gray-900/80 backdrop-blur-sm p-3 rounded-xl border border-gray-700/50 shadow-lg">
                  <h2 className="text-2xl font-bold text-green-400">
                    {capitalize(plant.common_name)}
                  </h2>
                </div>
              </div>
            </div>

            <div className="p-6">
              <div className="flex justify-end mb-4">
                <button
                  onClick={abrirModal}
                  className="bg-gray-700/50 hover:bg-red-900/30 p-2 rounded-full transition-colors duration-200 group cursor-pointer"
                >
                  <Trash2Icon
                    className="text-red-400 group-hover:text-red-300"
                    size={18}
                  />
                </button>
              </div>

              {deleteModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
                  <div className="bg-gray-800 rounded-xl shadow-xl p-6 max-w-sm w-full text-center">
                    <h2 className="text-lg font-semibold mb-4">
                      ¿Eliminar planta?
                    </h2>
                    <p className="opacity-70 mb-6">
                      ¿Estás seguro que deseas eliminar esta planta?
                    </p>
                    <div className="flex justify-center gap-4">
                      <button
                        onClick={confirmarEliminacion}
                        className="bg-red-800 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors cursor-pointer"
                      >
                        Sí, eliminar
                      </button>
                      <button
                        onClick={cerrarModal}
                        className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400 transition-colors"
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-700/50 p-3 rounded-lg border border-gray-600/30 hover:border-green-500/20 transition-colors duration-200 shadow-sm hover:shadow-md hover:shadow-green-900/10">
                    <div className="flex items-center gap-2 mb-1">
                      <Calendar size={14} className="text-green-400" />
                      <p className="text-xs text-gray-400">Último riego</p>
                    </div>
                    <p className="font-medium">
                      {formatDate(plant.last_watering_date)}
                    </p>
                  </div>
                  <div className="bg-gray-700/50 p-3 rounded-lg border border-gray-600/30 hover:border-green-500/20 transition-colors duration-200 shadow-sm hover:shadow-md hover:shadow-green-900/10">
                    <div className="flex items-center gap-2 mb-1">
                      <Droplet size={14} className="text-green-400" />
                      <p className="text-xs text-gray-400">Riego verano</p>
                    </div>
                    <p className="font-medium">
                      {capitalize(plantDetail.summer_watering)}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-700/50 p-3 rounded-lg border border-gray-600/30 hover:border-green-500/20 transition-colors duration-200 shadow-sm hover:shadow-md hover:shadow-green-900/10">
                    <div className="flex items-center gap-2 mb-1">
                      <Sun size={14} className="text-green-400" />
                      <p className="text-xs text-gray-400">Luz solar</p>
                    </div>
                    <p className="font-medium">
                      {capitalize(plantDetail.sunlight)}
                    </p>
                  </div>
                  <div className="bg-gray-700/50 p-3 rounded-lg border border-gray-600/30 hover:border-green-500/20 transition-colors duration-200 shadow-sm hover:shadow-md hover:shadow-green-900/10">
                    <div className="flex items-center gap-2 mb-1">
                      <Home size={14} className="text-green-400" />
                      <p className="text-xs text-gray-400">Ubicación</p>
                    </div>
                    <p className="font-medium">
                      {capitalize(plantDetail.location)}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-700/50 p-3 rounded-lg border border-gray-600/30 hover:border-green-500/20 transition-colors duration-200 shadow-sm hover:shadow-md hover:shadow-green-900/10">
                    <div className="flex items-center gap-2 mb-1">
                      <Calendar size={14} className="text-green-400" />
                      <p className="text-xs text-gray-400">
                        Última fertilización
                      </p>
                    </div>
                    <p className="font-medium">
                      {formatDate(plant.last_fertilize_date)}
                    </p>
                  </div>
                  <div className="bg-gray-700/50 p-3 rounded-lg border border-gray-600/30 hover:border-green-500/20 transition-colors duration-200 shadow-sm hover:shadow-md hover:shadow-green-900/10">
                    <div className="flex items-center gap-2 mb-1">
                      <Leaf size={14} className="text-green-400" />
                      <p className="text-xs text-gray-400">Fertilización</p>
                    </div>
                    <p className="font-medium">
                      {capitalize(plantDetail.fertilize)}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-700/50 p-3 rounded-lg border border-gray-600/30 hover:border-green-500/20 transition-colors duration-200 shadow-sm hover:shadow-md hover:shadow-green-900/10 flex items-center">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Leaf size={14} className="text-green-400" />
                        <p className="text-xs text-gray-400">Comestible</p>
                      </div>
                      <p className="font-medium">
                        {plantDetail.edible === false ? 'No' : 'Sí'}
                      </p>
                    </div>
                    <div
                      className={`ml-auto w-3 h-3 rounded-full ${
                        plantDetail.edible === false
                          ? 'bg-red-500'
                          : 'bg-green-500'
                      } shadow-md ${
                        plantDetail.edible === false
                          ? 'shadow-red-500/30'
                          : 'shadow-green-500/30'
                      }`}
                    ></div>
                  </div>
                  <div className="bg-gray-700/50 p-3 rounded-lg border border-gray-600/30 hover:border-green-500/20 transition-colors duration-200 shadow-sm hover:shadow-md hover:shadow-green-900/10 flex items-center">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <AlertTriangle size={14} className="text-green-400" />
                        <p className="text-xs text-gray-400">Tóxica</p>
                      </div>
                      <p className="font-medium">
                        {plantDetail.human_toxicity === false ? 'No' : 'Sí'}
                      </p>
                    </div>
                    <div
                      className={`ml-auto w-3 h-3 rounded-full ${
                        plantDetail.human_toxicity === false
                          ? 'bg-green-500'
                          : 'bg-red-500'
                      } shadow-md ${
                        plantDetail.human_toxicity === false
                          ? 'shadow-green-500/30'
                          : 'shadow-red-500/30'
                      }`}
                    ></div>
                  </div>
                </div>

                {/* Botón para mostrar más información */}
                <button
                  onClick={toggleMoreInfo}
                  className="w-full bg-gray-700/50 hover:bg-gray-600/50 p-3 rounded-lg flex items-center justify-center gap-2 text-green-400 transition-all duration-200 border border-gray-600/30 hover:border-green-500/30 shadow-sm hover:shadow-md hover:shadow-green-900/10 cursor-pointer"
                >
                  <span>
                    {showMoreInfo
                      ? 'Ocultar información'
                      : 'Mostrar más información'}
                  </span>
                  {showMoreInfo ? (
                    <ChevronUp
                      size={18}
                      className="transition-transform duration-300"
                    />
                  ) : (
                    <ChevronDown
                      size={18}
                      className="transition-transform duration-300"
                    />
                  )}
                </button>
                <div
                  className={`space-y-4 bg-gray-700/30 p-4 rounded-xl border border-gray-600/50 backdrop-blur-sm transition-all duration-500 ease-in-out transform origin-top 
                    ${
                      showMoreInfo
                        ? 'opacity-100 max-h-[500px] scale-100 mt-4'
                        : 'opacity-0 max-h-0 scale-95 overflow-hidden mt-0'
                    }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Info size={16} className="text-green-400" />
                    <h3 className="text-lg font-semibold text-green-400">
                      Información adicional
                    </h3>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-700/50 p-3 rounded-lg border border-gray-600/30 hover:border-green-500/20 transition-colors duration-200 shadow-sm hover:shadow-md hover:shadow-green-900/10">
                      <div className="flex items-center gap-2 mb-1">
                        <Snowflake size={14} className="text-green-400" />
                        <p className="text-xs text-gray-400">Riego invierno</p>
                      </div>
                      <p className="font-medium">
                        {capitalize(plantDetail.winter_watering)}
                      </p>
                    </div>
                    <div className="bg-gray-700/50 p-3 rounded-lg border border-gray-600/30 hover:border-green-500/20 transition-colors duration-200 shadow-sm hover:shadow-md hover:shadow-green-900/10 ">
                      <div className="flex items-center gap-2 mb-1">
                        <AlertTriangle size={14} className="text-green-400" />
                        <p className="text-xs text-gray-400">Tóxica animales</p>
                      </div>
                      <div className="flex items-center">
                        <p className="font-medium">
                          {plantDetail.human_toxicity === false ? 'No' : 'Sí'}
                        </p>

                        <div
                          className={`ml-auto w-3 h-3 rounded-full ${
                            plantDetail.human_toxicity === false
                              ? 'bg-green-500'
                              : 'bg-red-500'
                          } shadow-md ${
                            plantDetail.human_toxicity === false
                              ? 'shadow-green-500/30'
                              : 'shadow-red-500/30'
                          }`}
                        ></div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-700/50 p-3 rounded-lg border border-gray-600/30 hover:border-green-500/20 transition-colors duration-200 shadow-sm hover:shadow-md hover:shadow-green-900/10">
                    <div className="flex items-center gap-2 mb-1">
                      <Info size={14} className="text-green-400" />
                      <p className="text-xs text-gray-400">Descripción</p>
                    </div>
                    <p className="font-medium leading-relaxed">
                      {plantDetail.description}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-[70vh]">
          <div className="w-16 h-16 border-4 border-green-400 border-t-transparent rounded-full animate-spin mb-4 shadow-lg shadow-green-500/20"></div>
          <p className="text-green-400 font-medium">
            Cargando detalles de la planta...
          </p>
        </div>
      )}
    </div>
  )
}

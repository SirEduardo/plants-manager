'use client'

import type React from 'react'

import axios from 'axios'
import { useEffect, useState, useRef } from 'react'
import { apiUrl } from '../api/url'
import type { Notification } from '../types'
import { formatDistanceToNow } from 'date-fns'
import { es } from 'date-fns/locale'
import { Bell, Trash2, X, Check, AlertCircle } from 'lucide-react'

export function Notifications() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [showNotifications, setShowNotifications] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const notificationRef = useRef<HTMLDivElement>(null)

  // Cerrar notificaciones al hacer clic fuera
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target as Node)
      ) {
        setShowNotifications(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  useEffect(() => {
    const getNotifications = async () => {
      try {
        setIsLoading(true)
        setError(null)
        const response = await axios.get(`${apiUrl}/notifications`, {
          withCredentials: true
        })
        setNotifications(response.data.notification)
      } catch (err) {
        console.error('Error al cargar notificaciones:', err)
        setError('No se pudieron cargar las notificaciones')
      } finally {
        setIsLoading(false)
      }
    }
    getNotifications()
  }, [])

  const handleNotifications = async (id: number, e: React.MouseEvent) => {
    // Evitar que el clic se propague al contenedor padre
    e.stopPropagation()

    try {
      const response = await axios.patch(`${apiUrl}/notifications/${id}`, {
        withCredentials: true
      })
      console.log(response)

      setNotifications((prev) =>
        prev.map((notification) =>
          notification.id === id
            ? { ...notification, status: true }
            : notification
        )
      )
    } catch (err) {
      console.error('Error al marcar notificación como leída:', err)
    }
  }

  const markAllAsRead = async () => {
    try {
      // Aquí iría la llamada a la API para marcar todas como leídas
      // Por ahora solo actualizamos el estado local
      setNotifications((prev) =>
        prev.map((notification) => ({ ...notification, status: true }))
      )
    } catch (err) {
      console.error('Error al marcar todas como leídas:', err)
    }
  }

  const toggleNotifications = () => {
    setShowNotifications((prev) => !prev)
  }

  // Esta función será implementada por el usuario
  const handleDeleteNotification = (id: number, e: React.MouseEvent) => {
    e.stopPropagation() // Evitar que el clic se propague
    console.log('Eliminar notificación:', id)
    // La lógica de eliminación será implementada por el usuario
  }

  const unreadCount = notifications.filter(
    (notification) => !notification.status
  ).length

  return (
    <div className="relative" ref={notificationRef}>
      <button
        className="flex items-center justify-center w-9 h-9 rounded-lg text-gray-300 hover:bg-gray-700/70 hover:text-green-300 transition-all duration-300 relative cursor-pointer transform hover:translate-y-[-1px]"
        onClick={toggleNotifications}
        aria-label="Notificaciones"
      >
        <div className="relative">
          <Bell className="w-5 h-5" />

          {/* Notification Badge */}
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-green-500 text-[10px] font-medium text-white shadow-lg shadow-green-500/30 animate-pulse">
              {unreadCount}
            </span>
          )}
        </div>
      </button>

      {/* Notification Panel */}
      {showNotifications && (
        <div className="absolute right-0 mt-2 w-80 max-h-[28rem] overflow-hidden rounded-xl bg-gray-800/90 backdrop-blur-sm shadow-xl border border-gray-700/50 z-50 transform origin-top-right transition-all duration-200 animate-in fade-in slide-in-from-top-5">
          <div className="p-3 border-b border-gray-700/50 bg-gradient-to-r from-gray-800 via-gray-750 to-gray-800">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-green-400 flex items-center gap-2">
                <Bell className="w-4 h-4" />
                Notificaciones
              </h3>
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="text-xs font-medium text-green-400 hover:text-green-300 transition-colors duration-200 flex items-center gap-1 cursor-pointer"
                >
                  <Check className="w-3 h-3" />
                  <span>Marcar todas como leídas</span>
                </button>
              )}
            </div>
          </div>

          <div className="overflow-y-auto max-h-[calc(28rem-3rem)]">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-8">
                <div className="w-8 h-8 border-2 border-green-500 border-t-transparent rounded-full animate-spin mb-2"></div>
                <p className="text-sm text-gray-400">
                  Cargando notificaciones...
                </p>
              </div>
            ) : error ? (
              <div className="p-4 text-center">
                <AlertCircle className="w-8 h-8 text-red-400 mx-auto mb-2" />
                <p className="text-sm text-red-400">{error}</p>
              </div>
            ) : notifications.length > 0 ? (
              <div className="divide-y divide-gray-700/30">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    onClick={(e) => handleNotifications(notification.id, e)}
                    className={`p-4 hover:bg-gray-700/50 cursor-pointer transition-all duration-200 relative group ${
                      !notification.status ? 'bg-gray-700/30' : 'bg-transparent'
                    }`}
                  >
                    <div className="flex gap-3">
                      {/* Indicador de no leído */}
                      <div className="flex-shrink-0 mt-0.5">
                        <div
                          className={`w-2 h-2 rounded-full transition-all duration-300 ${
                            !notification.status
                              ? 'bg-green-500 shadow-sm shadow-green-500/50'
                              : 'bg-gray-600'
                          }`}
                        ></div>
                      </div>

                      {/* Contenido de la notificación */}
                      <div className="flex-1 min-w-0 pr-6">
                        <p
                          className={`text-sm font-medium transition-colors duration-200 ${
                            !notification.status
                              ? 'text-white'
                              : 'text-gray-300'
                          }`}
                        >
                          {notification.title}
                        </p>
                        <p className="text-xs text-gray-400 mt-1 line-clamp-2">
                          {notification.message}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {formatDistanceToNow(
                            new Date(notification.created_at),
                            {
                              addSuffix: true,
                              locale: es
                            }
                          )}
                        </p>
                      </div>

                      {/* Botón de eliminar */}
                      <button
                        onClick={(e) =>
                          handleDeleteNotification(notification.id, e)
                        }
                        className="absolute right-3 top-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-1 rounded-full hover:bg-red-500/20 text-gray-400 hover:text-red-400"
                        aria-label="Eliminar notificación"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center">
                <div className="w-12 h-12 rounded-full bg-gray-700/50 flex items-center justify-center mx-auto mb-3">
                  <Bell className="w-6 h-6 text-gray-500" />
                </div>
                <p className="text-gray-400 text-sm">
                  No hay notificaciones pendientes.
                </p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-2 border-t border-gray-700/50 bg-gray-800/50">
            <button
              onClick={() => setShowNotifications(false)}
              className="w-full py-1.5 text-xs text-gray-400 hover:text-gray-300 flex items-center justify-center gap-1 rounded-md hover:bg-gray-700/50 transition-colors duration-200 cursor-pointer"
            >
              <X className="w-3 h-3" />
              <span>Cerrar</span>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

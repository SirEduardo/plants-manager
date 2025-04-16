import axios from 'axios'
import { useEffect, useState } from 'react'
import { apiUrl } from '../api/url'
import { Notification } from '../types'
import { formatDistanceToNow } from 'date-fns'
import { es } from 'date-fns/locale'

export function Notifications() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [showNotifications, setShowNotifications] = useState(false)

  useEffect(() => {
    const getNotifications = async () => {
      const response = await axios.get(`${apiUrl}/notifications`, {
        withCredentials: true
      })
      setNotifications(response.data.notification)
    }
    getNotifications()
  }, [])

  const handleNotifications = async (id: number) => {
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
  }

  const toggleNotifications = () => {
    setShowNotifications((prev) => !prev)
  }

  return (
    <div className="relative">
      <button
        className="flex items-center justify-center w-9 h-9 rounded-lg text-gray-300 hover:bg-gray-700 transition-colors relative cursor-pointer"
        onClick={toggleNotifications}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-5 h-5"
        >
          <path d="M12.02 2.90991C8.70997 2.90991 6.01997 5.59991 6.01997 8.90991V11.7999C6.01997 12.4099 5.75997 13.3399 5.44997 13.8599L4.29997 15.7699C3.58997 16.9499 4.07997 18.2599 5.37997 18.6999C9.68997 20.1399 14.34 20.1399 18.65 18.6999C19.86 18.2999 20.39 16.8699 19.73 15.7699L18.58 13.8599C18.28 13.3399 18.02 12.4099 18.02 11.7999V8.90991C18.02 5.60991 15.32 2.90991 12.02 2.90991Z" />
          <path d="M13.87 3.19994C13.56 3.10994 13.24 3.03994 12.91 2.99994C11.95 2.87994 11.03 2.94994 10.17 3.19994C10.46 2.45994 11.18 1.93994 12.02 1.93994C12.86 1.93994 13.58 2.45994 13.87 3.19994Z" />
          <path d="M15.02 19.0601C15.02 20.7101 13.67 22.0601 12.02 22.0601C11.2 22.0601 10.44 21.7201 9.90002 21.1801C9.36002 20.6401 9.02002 19.8801 9.02002 19.0601" />
        </svg>

        {/* Notification Badge */}
        {notifications.filter((notification) => !notification.status).length >
        0 ? (
          <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-green-500 text-[10px] font-medium text-white">
            {
              notifications.filter((notification) => !notification.status)
                .length
            }
          </span>
        ) : null}
      </button>

      {showNotifications ? (
        <div className="absolute right-0 mt-2 w-80 max-h-96 overflow-y-auto rounded-lg bg-gray-800 shadow-lg border border-gray-700 z-50">
          <div className="p-3 border-b border-gray-700">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-white">Notificaciones</h3>
              <span className="text-xs font-medium text-green-400 cursor-pointer hover:text-green-300">
                Marcar todas como leídas
              </span>
            </div>
          </div>

          <div className="divide-y divide-gray-700">
            {notifications && notifications.length > 0 ? (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  onClick={() => handleNotifications(notification.id)}
                  className="p-4 bg-gray-700/30 hover:bg-gray-700/50 cursor-pointer transition-colors"
                >
                  <div className="flex gap-3">
                    <div className="flex-shrink-0 mt-0.5">
                      <div
                        className={`w-2 h-2 rounded-full ${
                          notification.status === false ? 'bg-green-500' : ''
                        }`}
                      ></div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white">
                        {notification.title}
                      </p>
                      <p className="text-xs text-gray-400 mt-1 line-clamp-2">
                        {notification.message}.
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
                  </div>
                </div>
              ))
            ) : (
              <div className="p-4 text-gray-500">
                No hay notificaciones pendientes.
              </div>
            )}
          </div>
        </div>
      ) : null}
    </div>
  )
}

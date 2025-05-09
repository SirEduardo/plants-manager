import { useEffect, useState } from 'react'
import { Navigate, Outlet } from 'react-router'
import { apiUrl } from '../../api/url'

export function ProtectedRoute() {
  const [isAuthenticate, setIsAuthenticate] = useState<Boolean | null>(null)

  useEffect(() => {
    const token = localStorage.getItem('token')

    if (!token) {
      setIsAuthenticate(false)
      return
    }
    fetch(`${apiUrl}/auth`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then((res) => {
        if (res.status === 200) {
          setIsAuthenticate(true) // El usuario está autenticado
        } else {
          setIsAuthenticate(false) // El usuario no está autenticado
        }
      })
      .catch(() => setIsAuthenticate(false))
  }, [])

  if (isAuthenticate === null) return <div>Loading...</div>
  return isAuthenticate ? <Outlet /> : <Navigate to="/plantsList" />
}

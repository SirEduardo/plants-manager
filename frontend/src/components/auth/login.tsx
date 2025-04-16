import { Eye, EyeOff, Lock, User } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router'
import { AuthTab } from '../../types'
import axios from 'axios'
import { apiUrl } from '../../api/url'
interface LoginProps {
  activeTab: AuthTab
}

export function Login({ activeTab }: LoginProps) {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      const loginResponse = await axios.post(
        `${apiUrl}/users/login`,
        formData,
        {
          headers: {
            'Content-Type': 'application/json'
          },
          withCredentials: true // También es importante para enviar cookies en el login
        }
      )
      console.log('respuesta del login', loginResponse)

      // Si el login es exitoso, redirigimos a la lista de plantas
      if (loginResponse.status === 200) {
        console.log('Usuario autenticado, verificando token...')

        // Esperamos a que la cookie esté disponible verificando con /auth
        const authResponse = await fetch(`${apiUrl}/auth`, {
          method: 'GET',
          credentials: 'include'
        })

        if (authResponse.status === 200) {
          console.log('Token verificado. Redirigiendo...')
          navigate('/plantsList')
        } else {
          console.error('El token no fue verificado aún. No redirigimos.')
        }
      } else {
        console.error(
          'Error al iniciar sesión después del login',
          loginResponse
        )
      }
    } catch (error: any) {
      if (axios.isAxiosError(error) && error.response) {
        const errorMessage = error.response.data.message || 'Error desconocido'
        setError(errorMessage)
        console.error('Error del backend:', errorMessage)
      } else {
        console.error('Error inesperado:', error)
        alert('Ocurrió un error inesperado')
      }
    }
  }
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    setFormData((prev) => ({ ...prev, [id]: value }))
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }
  return (
    <div>
      {activeTab === 'login' && (
        <form onSubmit={handleLogin} className="p-6">
          <div className="mb-6 text-center">
            <h2 className="text-xl font-bold text-green-800">Bienvenido</h2>
            <p className="text-sm text-green-600">
              Inicia sesión para ver tus plantas
            </p>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-green-700"
              >
                Email
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-green-500" />
                <input
                  id="email"
                  type="text"
                  placeholder="name@example.com"
                  className="w-full rounded-md border border-green-200 bg-white py-2 pl-10 pr-4 text-green-900 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-green-700"
                >
                  Contraseña
                </label>
                <a
                  href="#"
                  className="text-xs font-medium text-green-600 hover:text-green-800 hover:underline"
                >
                  Forgot password?
                </a>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-green-500" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  className="w-full rounded-md border border-green-200 bg-white py-2 pl-10 pr-10 text-green-900 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500"
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full rounded-md bg-green-600 py-2 text-white transition-colors hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 cursor-pointer"
            >
              Iniciar Sesión
            </button>
          </div>
          {error ? (
            <p className="text-center text-red-500 pt-5">{error}</p>
          ) : (
            ''
          )}
        </form>
      )}
    </div>
  )
}

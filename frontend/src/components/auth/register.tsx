import { Eye, EyeOff, Lock, Mail, User } from 'lucide-react'
import { useState } from 'react'
import { AuthTab } from '../../types'
import axios from 'axios'
import { useNavigate } from 'react-router'
import { apiUrl } from '../../api/url'

interface RegisterProps {
  activeTab: AuthTab
}

export function Register({ activeTab }: RegisterProps) {
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  })
  const navigate = useNavigate()

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    try {
      console.log('Datos del formulario:', formData)
      // Realizamos el registro
      const registerResponse = await axios.post(
        `${apiUrl}/users/register`,
        formData,
        {
          headers: {
            'Content-Type': 'application/json'
          },
          withCredentials: true // Importante para enviar y recibir cookies
        }
      )

      if (registerResponse.status === 201) {
        console.log('Usuario registrado')

        // Intentamos hacer login automáticamente después del registro
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

        // Si el login es exitoso, redirigimos a la lista de plantas
        if (loginResponse.status === 200) {
          console.log('Usuario autenticado, redirigiendo...')
          navigate('/plantsList')
        } else {
          console.error(
            'Error al iniciar sesión después del registro',
            loginResponse
          )
        }
      } else {
        console.error('Error al registrar el usuario', registerResponse)
        alert('Error al registrar el usuario: ' + registerResponse.data.message)
      }
    } catch (error) {
      console.error('Error en el envío del formulario', error)
    }
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    setFormData((prev) => ({ ...prev, [id]: value }))
  }

  return (
    <div>
      {/* Register Form */}
      {activeTab === 'register' && (
        <form onSubmit={handleRegister} className="p-6">
          <div className="mb-6 text-center">
            <h2 className="text-xl font-bold text-green-800">Create Account</h2>
            <p className="text-sm text-green-600">
              Join us to start tracking your plants
            </p>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <label
                htmlFor="username"
                className="block text-sm font-medium text-green-700"
              >
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-green-500" />
                <input
                  id="username"
                  type="text"
                  placeholder="John Doe"
                  className="w-full rounded-md border border-green-200 bg-white py-2 pl-10 pr-4 text-green-900 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                  value={formData.username}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-green-700"
              >
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-green-500" />
                <input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  className="w-full rounded-md border border-green-200 bg-white py-2 pl-10 pr-4 text-green-900 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-green-700"
              >
                Password
              </label>
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
              Create Account
            </button>
          </div>
        </form>
      )}
    </div>
  )
}

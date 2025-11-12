import axios from 'axios'
import { store } from '../redux/store'
import { logout } from '../lib/auth'
import { toast } from 'sonner'

const apiUrl = import.meta.env.VITE_API_URL

// ============================================
// INSTANCIA PARA LLAMADAS AUTENTICADAS (api)
// ============================================
const api = axios.create({
    baseURL: apiUrl,
    // NO establecemos Content-Type aquí porque puede ser JSON o FormData
    // axios lo manejará automáticamente según el tipo de dato
})

// Interceptor de solicitudes para api (agrega token)
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token')
        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }

        // IMPORTANTE: Si es FormData, NO establecer Content-Type
        // El navegador lo establecerá automáticamente con el boundary correcto
        if (config.data instanceof FormData) {
            // Eliminar Content-Type si fue establecido previamente
            // axios lo establecerá automáticamente con el boundary
            delete config.headers['Content-Type']
        } else if (!config.headers['Content-Type']) {
            // Solo establecer Content-Type para JSON si no está presente
            config.headers['Content-Type'] = 'application/json'
        }

        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)

// Interceptor de respuestas para api (maneja errores 401/403)
api.interceptors.response.use(
    (response) => {
        return response
    },
    (error) => {
        const status = error.response?.status

        // Manejar errores de autenticación
        if (status === 401 || status === 403) {
            // Evitar múltiples redirecciones
            if (window.location.pathname !== '/login') {
                // Mostrar mensaje al usuario
                toast.error('Sesión expirada', {
                    description: 'Tu sesión ha expirado. Por favor, inicia sesión nuevamente.',
                    duration: 5000,
                })

                // Llamar función logout (sin navigate, usa window.location)
                logout()
            }
        }

        return Promise.reject(error)
    }
)

// ============================================
// INSTANCIA PARA LLAMADAS PÚBLICAS (publicApi)
// ============================================
const publicApi = axios.create({
    baseURL: apiUrl,
    // NO establecemos Content-Type aquí
})

// Interceptor de solicitudes para publicApi (sin token, maneja FormData)
publicApi.interceptors.request.use(
    (config) => {
        // Si es FormData, NO establecer Content-Type
        if (config.data instanceof FormData) {
            delete config.headers['Content-Type']
        } else if (!config.headers['Content-Type']) {
            config.headers['Content-Type'] = 'application/json'
        }

        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)

// publicApi NO tiene interceptor de respuestas para manejar 401/403
// porque esas llamadas no deberían tener problemas de autenticación

export default api
export { publicApi }


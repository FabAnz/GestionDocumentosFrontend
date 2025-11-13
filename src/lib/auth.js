import { store } from '../redux/store'
import { logout as logoutAction } from '../redux/reducers/userSlice'

export const logout = (navigate = null) => {
    // Limpiar datos de autenticación del localStorage
    localStorage.removeItem('token')
    localStorage.removeItem('userId')

    // Despachar acción de logout en Redux
    store.dispatch(logoutAction())

    // Redirigir al login
    if (navigate) {
        // Usar navigate de react-router-dom (sin recargar página)
        navigate('/login')
    } else {
        // Usar window.location.href (recarga completa, útil para interceptores)
        window.location.href = '/login'
    }
}


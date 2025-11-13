import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Login } from '../components/pages/Login'
import { Register } from '../components/pages/Register'
import { Dashboard } from '../components/pages/Dashboard'
import { ProtectedRoute } from './ProtectedRoute'

const AppRoutes = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/registro" element={<Register />} />
                <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
        </BrowserRouter >
    )
}

export default AppRoutes
import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { publicApi } from '../../services/api'
import { useDispatch } from 'react-redux'
import { setUser, setLoading as setUserLoading } from '../../redux/reducers/userSlice'
import { toast } from 'sonner'
import { LogIn } from 'lucide-react'
import { Card } from '../ui/card'
import { CardTitle } from '../atoms/CardTitle'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Button } from '../ui/button'
import { Spinner } from '../ui/spinner'
import { Toaster } from '../ui/sonner'

export const Login = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [loading, setLoading] = useState(false)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const emptyFields = email === '' || password === ''

    useEffect(() => {
        const token = localStorage.getItem('token')
        if (token) {
            navigate('/dashboard', { replace: true })
        }
    }, [navigate])

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)

        try {
            dispatch(setUserLoading(true))
            const response = await publicApi.post('/usuarios/login', {
                email: email,
                password: password
            })

            localStorage.setItem('token', response.data.token)
            localStorage.setItem('userId', response.data.usuario.id)

            dispatch(setUser(response.data.usuario))
            dispatch(setUserLoading(false))

            // Redirigir al dashboard después del login exitoso
            navigate('/dashboard', { replace: true })
        } catch (error) {
            const errors = error.response?.data?.errors
            const message = error.response?.data?.message
            
            // Si viene un array de errores, mostrar cada uno
            if (Array.isArray(errors) && errors.length > 0) {
                errors.forEach((errorMsg) => {
                    toast.error('Error al iniciar sesión', {
                        description: errorMsg,
                        duration: 10000,
                    })
                })
            } 
            // Si viene un mensaje de error (string), mostrarlo
            if (message) {
                toast.error('Error al iniciar sesión', {
                    description: message,
                    duration: 10000,
                })
            } 
            // Si no hay ningún error específico, usar mensaje por defecto
            else {
                toast.error('Error al iniciar sesión', {
                    description: error.message || 'Error al iniciar sesión',
                    duration: 10000,
                })
            }
            
            dispatch(setUserLoading(false))
            setLoading(false)
        }
    }

    return (
        <div className="w-full h-screen bg-background flex items-center justify-center px-4">
            <Card className="w-full max-w-md shadow-md">
                <div className="space-y-6">
                    <div className="text-center space-y-2">
                        <CardTitle icon={LogIn} size="lg" className="justify-center">
                            Iniciar Sesión
                        </CardTitle>
                        <p className="text-muted-foreground text-sm">
                            Ingresa tus credenciales para acceder
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">
                                Email
                            </Label>
                            <Input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="tu@email.com"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password">
                                Contraseña
                            </Label>
                            <Input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                required
                            />
                        </div>

                        <Button
                            type="submit"
                            disabled={loading || emptyFields}
                            className="w-full"
                        >
                            {loading ? (
                                <>
                                    <Spinner className="h-4 w-4" />
                                    <span>Iniciando sesión...</span>
                                </>
                            ) : (
                                <>
                                    <LogIn className="w-4 h-4" />
                                    <span>Iniciar Sesión</span>
                                </>
                            )}
                        </Button>
                    </form>

                    <div className="text-center">
                        <p className="text-sm text-muted-foreground">
                            ¿No tienes una cuenta?{' '}
                            <button
                                type="button"
                                onClick={() => navigate('/registro')}
                                className="text-primary hover:underline font-medium"
                            >
                                Regístrate
                            </button>
                        </p>
                    </div>
                </div>
            </Card>
            <Toaster />
        </div>
    )
}

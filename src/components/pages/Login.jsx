import React, { useState } from 'react'
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

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)

        try {
            dispatch(setUserLoading(true))
            const response = await publicApi.post('/usuarios/login', {
                email: "fabian@gmail.com",
                password: "12345678Test@!"
            })

            localStorage.setItem('token', response.data.token)
            localStorage.setItem('userId', response.data.usuario.id)

            dispatch(setUser(response.data.usuario))
            dispatch(setUserLoading(false))

            // Redirigir al dashboard después del login exitoso
            navigate('/dashboard', { replace: true })
        } catch (error) {
            const errorMessage = error.response?.data?.message || error.message || 'Error al iniciar sesión'
            toast.error('Error al iniciar sesión', {
                description: errorMessage,
                duration: 5000,
            })
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
                                value="fabian@gmail.com"
                                disabled
                                placeholder="tu@email.com"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password">
                                Contraseña
                            </Label>
                            <Input
                                id="password"
                                type="password"
                                value="12345678Test@!"
                                disabled
                                placeholder="••••••••"
                            />
                        </div>

                        <Button
                            type="submit"
                            disabled={loading}
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
                </div>
            </Card>
            <Toaster />
        </div>
    )
}

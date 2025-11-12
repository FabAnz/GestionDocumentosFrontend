import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { publicApi } from '../../services/api'
import { useDispatch } from 'react-redux'
import { setUser, setLoading as setUserLoading } from '../../redux/reducers/userSlice'
import { toast } from 'sonner'
import { UserPlus } from 'lucide-react'
import { Card } from '../ui/card'
import { CardTitle } from '../atoms/CardTitle'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Button } from '../ui/button'
import { Spinner } from '../ui/spinner'
import { Toaster } from '../ui/sonner'

export const Register = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [loading, setLoading] = useState(false)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [repeatPassword, setRepeatPassword] = useState('')
    const [nombre, setNombre] = useState('')
    const [apellido, setApellido] = useState('')

    // Validar que las contraseñas coincidan
    const passwordsMatch = password === repeatPassword && password !== ''

    useEffect(() => {
        const token = localStorage.getItem('token')
        if (token) {
            navigate('/dashboard', { replace: true })
        }
    }, [navigate])

    const handleSubmit = async (e) => {
        e.preventDefault()
        
        // Validar que las contraseñas coincidan antes de enviar
        if (password !== repeatPassword) {
            toast.error('Error de validación', {
                description: 'Las contraseñas no coinciden',
                duration: 5000,
            })
            return
        }

        setLoading(true)

        try {
            dispatch(setUserLoading(true))
            const response = await publicApi.post('/usuarios/registro', {
                email: email,
                password: password,
                nombre: nombre,
                apellido: apellido
            })

            localStorage.setItem('token', response.data.token)
            localStorage.setItem('userId', response.data.usuario._id || response.data.usuario.id)

            dispatch(setUser(response.data.usuario))
            dispatch(setUserLoading(false))

            // Redirigir al dashboard después del registro exitoso
            navigate('/dashboard', { replace: true })
        } catch (error) {
            const errors = error.response?.data?.errors
            const message = error.response?.data?.message
            
            // Si viene un array de errores, mostrar cada uno
            if (Array.isArray(errors) && errors.length > 0) {
                errors.forEach((errorMsg) => {
                    toast.error('Error al registrarse', {
                        description: errorMsg,
                        duration: 5000,
                    })
                })
            } 
            // Si viene un mensaje de error (string), mostrarlo
            else if (message) {
                toast.error('Error al registrarse', {
                    description: message,
                    duration: 5000,
                })
            } 
            // Si no hay ningún error específico, usar mensaje por defecto
            else {
                toast.error('Error al registrarse', {
                    description: error.message || 'Error al registrarse',
                    duration: 5000,
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
                        <CardTitle icon={UserPlus} size="lg" className="justify-center">
                            Registrarse
                        </CardTitle>
                        <p className="text-muted-foreground text-sm">
                            Crea una cuenta para comenzar
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Input
                                id="nombre"
                                type="text"
                                value={nombre}
                                onChange={(e) => setNombre(e.target.value)}
                                placeholder="Tu nombre"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Input
                                id="apellido"
                                type="text"
                                value={apellido}
                                onChange={(e) => setApellido(e.target.value)}
                                placeholder="Tu apellido"
                                required
                            />
                        </div>

                        <div className="space-y-2">
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
                            <Input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Password"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                                                        <Input
                                id="repeatPassword"
                                type="password"
                                value={repeatPassword}
                                onChange={(e) => setRepeatPassword(e.target.value)}
                                placeholder="Confirmar Password"
                                required
                            />
                            {repeatPassword && !passwordsMatch && (
                                <p className="text-sm text-destructive">
                                    Las contraseñas no coinciden
                                </p>
                            )}
                        </div>

                        <Button
                            type="submit"
                            disabled={loading || !passwordsMatch}
                            className="w-full"
                        >
                            {loading ? (
                                <>
                                    <Spinner className="h-4 w-4" />
                                    <span>Registrando...</span>
                                </>
                            ) : (
                                <>
                                    <UserPlus className="w-4 h-4" />
                                    <span>Registrarse</span>
                                </>
                            )}
                        </Button>
                    </form>

                    <div className="text-center">
                        <p className="text-sm text-muted-foreground">
                            ¿Ya tienes una cuenta?{' '}
                            <button
                                type="button"
                                onClick={() => navigate('/login')}
                                className="text-primary hover:underline font-medium"
                            >
                                Inicia sesión
                            </button>
                        </p>
                    </div>
                </div>
            </Card>
            <Toaster />
        </div>
    )
}


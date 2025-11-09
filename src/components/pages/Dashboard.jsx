import React, { useEffect, useState } from 'react'
import { Navbar } from '../organisms/Navbar'
import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux'
import { setUser, setLoading } from '../../redux/reducers/userSlice'
import { setCategories, setLoading as setCategoriesLoading } from '../../redux/reducers/categorySlice'
import { FloatingActionButton } from '../ui/floating-action-button'
import { UserPlan } from '../organisms/UserPlan'
import { Documents } from '../organisms/Documents'
import { QueryChart } from '../organisms/QueryChart'
import { Chat } from '../organisms/Chat'
import { Spinner } from '../ui/spinner'
import { Toaster } from '../ui/sonner'
import { toast } from 'sonner'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { ChatContainer } from '../molecules/ChatContainer'
import { CardTitle } from '../atoms/CardTitle'
import { MessageSquare } from 'lucide-react'


const apiUrl = import.meta.env.VITE_API_URL

export const Dashboard = () => {
    const dispatch = useDispatch()
    const loading = useSelector((state) => state.user.loading)
    const [isChatOpen, setIsChatOpen] = useState(false)

    useEffect(() => {
        // TODO: Pasar esto a login component
        const fetchData = async () => {
            try {
                dispatch(setLoading(true))
                const response = await axios.post(`${apiUrl}/usuarios/login`, {
                    email: "fabian@gmail.com",
                    password: "12345678Test@!"
                })

                localStorage.setItem('token', response.data.token)
                localStorage.setItem('userId', response.data.usuario.id)

                dispatch(setUser(response.data.usuario))
                dispatch(setLoading(false))
            } catch (error) {
                const errorMessage = error.response?.data?.message || error.message || 'Error al iniciar sesión'
                toast.error('Error al iniciar sesión', {
                    description: errorMessage,
                    duration: 5000,
                })
                dispatch(setLoading(false))
            }
        }

        fetchData()
    }, [dispatch])

    useEffect(() => {
        const fetchCategories = async () => {
            const token = localStorage.getItem('token')
            if (!token) return

            try {
                dispatch(setCategoriesLoading(true))
                const response = await axios.get(`${apiUrl}/categorias`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })
                dispatch(setCategories(response.data))
                dispatch(setCategoriesLoading(false))
            } catch (error) {
                // Si es un 404, es normal que no haya categorías, no es un error
                if (error.response?.status === 404) {
                    dispatch(setCategories([]))
                    dispatch(setCategoriesLoading(false))
                    return
                }

                // Solo mostrar error si no es un 404
                const errorMessage = error.response?.data?.message || error.message || 'Error al cargar las categorías'
                toast.error('Error al cargar categorías', {
                    description: errorMessage,
                    duration: 5000,
                })
                dispatch(setCategoriesLoading(false))
            }
        }

        fetchCategories()
    }, [dispatch])

    if (loading) {
        return (
            <div className="w-full h-screen bg-background flex flex-col items-center justify-center gap-4">
                <Spinner className="h-12 w-12 text-primary" />
                <p className="text-muted-foreground">Cargando página...</p>
            </div>
        )
    }

    return (
        <div className="w-full h-screen bg-background">
            <Navbar />
            <div className="w-full mx-auto px-6 py-8">
                <div className="grid grid-cols-12 gap-6">
                    {/* Primera columna: 4 columnas */}
                    <div className="col-span-12 md:col-span-6 lg:col-span-6 xl:col-span-4 flex flex-col gap-6">
                        <UserPlan />
                        <QueryChart />
                    </div>
                    {/* Segunda columna: 5 columnas */}
                    <div className="col-span-12 md:col-span-6 lg:col-span-6 xl:col-span-5 flex flex-col gap-6">
                        <Documents />
                    </div>
                    {/* Tercera columna: 3 columnas */}
                    <div className="hidden xl:col-span-3 xl:flex flex-col gap-6">
                        <Chat />
                    </div>
                </div>
            </div>

            {/* Botón flotante para abrir chat en pantallas menores a xl */}
            <FloatingActionButton onClick={() => setIsChatOpen(true)} />

            {/* Overlay y drawer del chat para pantallas menores a xl */}
            {isChatOpen && (
                <>
                    {/* Overlay oscuro */}
                    <div
                        className="fixed inset-0 z-40 bg-black/80 xl:hidden"
                        onClick={() => setIsChatOpen(false)}
                    />

                    {/* Drawer del chat */}
                    <div className={cn(
                        "fixed right-0 top-0 z-50 h-full w-full max-w-md",
                        "bg-background shadow-lg",
                        "xl:hidden",
                        "transform transition-transform duration-300 ease-in-out",
                        isChatOpen ? "translate-x-0" : "translate-x-full"
                    )}>
                        <div className="flex h-full flex-col">
                            {/* Header del drawer */}
                            <div className="flex items-center justify-between border-b p-4">
                                <CardTitle icon={MessageSquare}>Chat de Prueba</CardTitle>
                                <button
                                    onClick={() => setIsChatOpen(false)}
                                    className="rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                                >
                                    <X className="h-5 w-5" />
                                    <span className="sr-only">Cerrar</span>
                                </button>
                            </div>

                            {/* Contenido del chat */}
                            <div className="flex-1 overflow-hidden flex flex-col">
                                <ChatContainer />
                            </div>
                        </div>
                    </div>
                </>
            )}

            <Toaster />
        </div>
    )
}


import React, { useEffect } from 'react'
import { CardTitle } from '../atoms/CardTitle'
import { MessageSquare } from 'lucide-react'
import { UserMessage } from './UserMessage'
import { AssistantMessage } from './AssistantMessage'
import { ChatInput } from './ChatInput'
import { useDispatch, useSelector } from 'react-redux'
import { addMessage, setMessages, setLoading } from '../../redux/reducers/chatSlice'
import axios from 'axios'
import { toast } from 'sonner'
import { Spinner } from '../ui/spinner'

const apiUrl = import.meta.env.VITE_API_URL

export const ChatContainer = () => {
    const dispatch = useDispatch()
    const messages = useSelector((state) => state.chat.messages)
    const loading = useSelector((state) => state.chat.loading)

    useEffect(() => {
        const fetchMessages = async () => {
            const token = localStorage.getItem('token')
            if (!token) return

            try {
                dispatch(setLoading(true))
                const response = await axios.get(`${apiUrl}/mensajes/probar-chat`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })

                // Transformar mensajes del formato del servidor al formato del slice
                const mensajesTransformados = response.data.mensajes.map((mensaje) => ({
                    id: mensaje._id,
                    text: mensaje.contenido,
                    sender: mensaje.remitente === 'cliente' ? 'user' : 'assistant',
                    timestamp: mensaje.createdAt
                }))

                dispatch(setMessages(mensajesTransformados))
                dispatch(setLoading(false))
            } catch (error) {
                // Si es un 404, no mostrar error al usuario
                if (error.response?.status === 404) {
                    dispatch(setLoading(false))
                    return
                }

                // Otros errores: mostrar toast
                const errorMessage = error.response?.data?.message || error.message || 'Error al cargar los mensajes'
                toast.error('Error al cargar mensajes', {
                    description: errorMessage,
                    duration: 5000,
                })
                dispatch(setLoading(false))
            }
        }

        fetchMessages()
    }, [dispatch])

    const handleSendMessage = (message) => {
        
    }

    return (
        <div className="flex flex-col h-full">
            <CardTitle icon={MessageSquare} className="hidden xl:flex mb-4 px-4 pt-4">Chat de Prueba</CardTitle>
            {/* Área de mensajes con scroll */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
                {loading ? (
                    <div className="flex items-center justify-center h-full">
                        <Spinner className="h-8 w-8 text-primary" />
                    </div>
                ) : (
                    messages.map((message) => {
                        if (message.sender === 'user') {
                            return (
                                <UserMessage 
                                    key={message.id} 
                                    text={message.text} 
                                    timestamp={message.timestamp} 
                                />
                            )
                        } else {
                            return (
                                <AssistantMessage 
                                    key={message.id} 
                                    text={message.text} 
                                    timestamp={message.timestamp} 
                                />
                            )
                        }
                    })
                )}
            </div>
            {/* Input fijo en la parte inferior */}
            <div className="px-4 pb-4 pt-2 bg-background xl:p-0 xl:bg-transparent">
                <ChatInput onSend={handleSendMessage} placeholder="Escribe tu pregunta..." />
            </div>
        </div>
    )
}

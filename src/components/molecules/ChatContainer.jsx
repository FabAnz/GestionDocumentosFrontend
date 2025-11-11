import React, { useEffect, useRef, useState } from 'react'
import { CardTitle } from '../atoms/CardTitle'
import { MessageSquare } from 'lucide-react'
import { UserMessage } from './UserMessage'
import { AssistantMessage } from './AssistantMessage'
import { ChatInput } from './ChatInput'
import { TypingIndicator } from './TypingIndicator'
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
    const messagesEndRef = useRef(null)
    const [loadingResponse, setLoadingResponse] = useState(false)

    // Función para hacer scroll al final
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }

    // Scroll al final cuando cambian los mensajes o termina de cargar
    useEffect(() => {
        if (!loading) {
            scrollToBottom()
        }
    }, [messages, loading])

    // Scroll al final cuando aparece/desaparece el indicador de escritura
    useEffect(() => {
        if (loadingResponse) {
            scrollToBottom()
        }
    }, [loadingResponse])

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
    //TODO: Cargar imagenes en las respuestas de la IA
    const handleSendMessage = async (message) => {
        const token = localStorage.getItem('token')
        if (!token) {
            toast.error('Error', {
                description: 'No se encontró el token de autenticación',
                duration: 5000,
            })
            return
        }

        // Crear mensaje del usuario para mostrarlo inmediatamente
        const userMessage = {
            id: `temp-${Date.now()}`,
            text: message,
            sender: 'user',
            timestamp: new Date().toISOString()
        }

        // Agregar mensaje del usuario al estado inmediatamente
        dispatch(addMessage(userMessage))
        setLoadingResponse(true)

        try {
            // Enviar mensaje al servidor
            const response = await axios.post(
                `${apiUrl}/mensajes/probar-chat`,
                {
                    idCliente: "cliente-prueba",
                    contenido: message
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            )

            // Transformar respuesta de la IA al formato del slice
            const assistantMessage = {
                id: response.data.mensajeIA._id,
                text: response.data.mensajeIA.contenido,
                sender: 'assistant',
                timestamp: response.data.mensajeIA.createdAt
            }

            // Agregar mensaje de la IA al estado
            dispatch(addMessage(assistantMessage))
            setLoadingResponse(false)
        } catch (error) {
            const errorMessage = error.response?.data?.message || error.message || 'Error al enviar el mensaje'
            toast.error('Error al enviar mensaje', {
                description: errorMessage,
                duration: 5000,
            })
            setLoadingResponse(false)
        }
    }

    return (
        <div className="flex flex-col h-full min-h-0">
            <CardTitle icon={MessageSquare} className="hidden xl:flex mb-4 px-4 pt-4 flex-shrink-0">Chat de Prueba</CardTitle>
            {/* Área de mensajes con scroll */}
            <div className="flex-1 min-h-0 overflow-y-auto px-4 py-4 space-y-4">
                {loading ? (
                    <div className="flex items-center justify-center h-full">
                        <Spinner className="h-8 w-8 text-primary" />
                    </div>
                ) : (
                    <>
                        {messages.map((message) => {
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
                        })}
                        {loadingResponse && <TypingIndicator />}
                        <div ref={messagesEndRef} />
                    </>
                )}
            </div>
            {/* Input fijo en la parte inferior */}
            <div className="px-4 pb-4 pt-2 bg-background xl:p-0 xl:bg-transparent flex-shrink-0">
                <ChatInput onSend={handleSendMessage} placeholder="Escribe tu pregunta..." />
            </div>
        </div>
    )
}

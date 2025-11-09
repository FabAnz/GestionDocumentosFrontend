import React from 'react'
import { CardTitle } from '../atoms/CardTitle'
import { MessageSquare } from 'lucide-react'
import { UserMessage } from './UserMessage'
import { AssistantMessage } from './AssistantMessage'
import { ChatInput } from './ChatInput'
import { useDispatch } from 'react-redux'
import { addMessage } from '../../redux/reducers/chatSlice'

export const ChatContainer = () => {

    const handleSendMessage = (message) => {
        
    }

    return (
        <div className="flex flex-col h-full">
            <CardTitle icon={MessageSquare} className="hidden xl:flex mb-4 px-4 pt-4">Chat de Prueba</CardTitle>
            {/* Área de mensajes con scroll */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
                <UserMessage text="Hola, ¿cómo estás?" timestamp="2025-01-01 10:00:00" />
                <AssistantMessage text="Hola, ¿cómo estás?" timestamp="2025-01-01 10:00:00" />
            </div>
            {/* Input fijo en la parte inferior */}
            <div className="px-4 pb-4 pt-2 bg-background xl:p-0 xl:bg-transparent">
                <ChatInput onSend={handleSendMessage} placeholder="Escribe tu pregunta..." />
            </div>
        </div>
    )
}

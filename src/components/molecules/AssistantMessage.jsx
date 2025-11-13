import React from 'react'
import { AssistantAvatar } from '../atoms/AssistantAvatar'
import { cn } from '@/lib/utils'

/**
 * Componente para mostrar un mensaje del asistente IA en el chat
 * 
 * @param {Object} props
 * @param {string} props.text - Texto del mensaje
 * @param {string} props.timestamp - Timestamp del mensaje (formato HH:MM)
 */
export const AssistantMessage = ({ text, timestamp }) => {
    const formatTime = (timestamp) => {
        if (!timestamp) return ''
        
        // Si ya está en formato HH:MM, retornar tal cual
        if (/^\d{2}:\d{2}$/.test(timestamp)) {
            return timestamp
        }
        
        // Si es un string ISO (con T) o formato "YYYY-MM-DD HH:MM:SS", convertir a HH:MM
        try {
            const date = new Date(timestamp.replace(' ', 'T'))
            if (!isNaN(date.getTime())) {
                return date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })
            }
        } catch (e) {
            // Si falla el parseo, intentar extraer HH:MM directamente
            const timeMatch = timestamp.match(/(\d{2}):(\d{2})/)
            if (timeMatch) {
                return `${timeMatch[1]}:${timeMatch[2]}`
            }
        }
        
        return timestamp
    }

    return (
        <div className="flex justify-start gap-2 mb-4">
            <AssistantAvatar size="default" />
            <div className={cn(
                "max-w-[70%] rounded-lg px-4 py-2 shadow-sm",
                "bg-purple-100 text-gray-800"
            )}>
                <p className="text-sm whitespace-pre-wrap break-words text-left">{text}</p>
                <p className="text-xs text-gray-500 mt-1 text-left">{formatTime(timestamp)}</p>
            </div>
        </div>
    )
}


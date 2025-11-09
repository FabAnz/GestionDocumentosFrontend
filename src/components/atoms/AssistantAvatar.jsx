import React from 'react'
import { Avatar, AvatarFallback } from '../ui/avatar'
import { Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'

/**
 * Componente de avatar del asistente IA para mensajes del chat
 * Similar al UserAvatar pero con icono de sparkles y fondo púrpura claro
 */
export const AssistantAvatar = ({ className, size = 'default' }) => {
    const sizeClasses = {
        default: 'h-8 w-8',
        sm: 'h-6 w-6',
        lg: 'h-10 w-10'
    }

    const iconSizeClasses = {
        default: 'h-4 w-4',
        sm: 'h-3 w-3',
        lg: 'h-5 w-5'
    }

    return (
        <Avatar className={cn('shadow-md', sizeClasses[size], className)}>
            <AvatarFallback className="bg-purple-200 text-purple-700">
                <Sparkles className={iconSizeClasses[size]} />
            </AvatarFallback>
        </Avatar>
    )
}


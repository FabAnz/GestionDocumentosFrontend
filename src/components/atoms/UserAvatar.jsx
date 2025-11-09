import React from 'react'
import { Avatar, AvatarFallback } from '../ui/avatar'
import { User } from 'lucide-react'
import { cn } from '@/lib/utils'

/**
 * Componente de avatar del usuario para mensajes del chat
 * Similar al usado en el Navbar
 */
export const UserAvatar = ({ className, size = 'default' }) => {
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
        <Avatar className={cn('bg-primary shadow-md', sizeClasses[size], className)}>
            <AvatarFallback className="bg-primary text-primary-foreground">
                <User className={iconSizeClasses[size]} />
            </AvatarFallback>
        </Avatar>
    )
}


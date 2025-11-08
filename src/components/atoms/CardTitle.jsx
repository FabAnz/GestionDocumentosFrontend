import React from 'react'
import { cn } from '@/lib/utils'

/**
 * Componente reutilizable para títulos con icono
 * Se usa en todas las cards del dashboard
 * 
 * @param {Object} props
 * @param {React.ComponentType} props.icon - Componente de icono de lucide-react
 * @param {React.ReactNode} props.children - Texto del título
 * @param {string} props.className - Clases CSS adicionales
 * @param {string} props.size - Tamaño del título: 'sm', 'md', 'lg', 'xl' (default: 'md')
 */
export const CardTitle = ({ 
    icon: Icon, 
    children, 
    className,
    size = 'md'
}) => {
    const sizeClasses = {
        sm: 'text-lg',
        md: 'text-xl',
        lg: 'text-2xl',
        xl: 'text-3xl'
    }

    const iconSizeClasses = {
        sm: 'w-4 h-4',
        md: 'w-6 h-6',
        lg: 'w-6 h-6',
        xl: 'w-7 h-7'
    }

    return (
        <div className={cn(
            'flex items-center gap-2',
            className
        )}>
            {Icon && (
                <Icon 
                    className={cn(
                        'text-primary',
                        iconSizeClasses[size]
                    )} 
                />
            )}
            <h2 className={cn(
                'font-semibold text-foreground',
                sizeClasses[size]
            )}>
                {children}
            </h2>
        </div>
    )
}


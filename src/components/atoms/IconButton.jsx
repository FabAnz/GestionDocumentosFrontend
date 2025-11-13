import React from 'react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export const IconButton = ({ 
    icon: Icon, 
    onClick, 
    variant = 'outline',
    size = 'default',
    className,
    ...props 
}) => {
    if (!Icon) {
        console.warn('IconButton: Se requiere un icono')
        return null
    }

    // Variantes específicas para iconos outline
    const iconVariants = {
        default: 'border-blue-500 text-blue-500 hover:bg-blue-500/10 hover:border-blue-600',
        destructive: 'border-red-500 text-red-500 hover:bg-red-500/10 hover:border-red-600',
        outline: 'border-border text-foreground hover:bg-accent hover:text-accent-foreground',
    }

    const iconSizes = {
        sm: 'h-8 w-8',
        default: 'h-10 w-10',
        lg: 'h-12 w-12',
    }

    const iconClassSizes = {
        sm: 'h-3.5 w-3.5',
        default: 'h-4 w-4',
        lg: 'h-5 w-5',
    }

    return (
        <Button
            variant="outline"
            size="icon"
            onClick={onClick}
            className={cn(
                'border rounded-md p-0 bg-transparent shadow-none',
                'hover:shadow-sm transition-all',
                iconVariants[variant] || iconVariants.outline,
                iconSizes[size] || iconSizes.default,
                className
            )}
            {...props}
        >
            <Icon className={iconClassSizes[size] || iconClassSizes.default} />
        </Button>
    )
}


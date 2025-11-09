import React from 'react'
import { cn } from '@/lib/utils'

export const FilterPill = ({ 
    active = false, 
    children, 
    className,
    onClick,
    ...props 
}) => {
    return (
        <button
            onClick={onClick}
            className={cn(
                'px-4 py-2 rounded-full font-medium text-sm',
                'transition-all duration-200',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
                active 
                    ? 'bg-primary text-primary-foreground shadow-sm' 
                    : 'bg-muted text-muted-foreground hover:bg-muted/80',
                className
            )}
            {...props}
        >
            {children}
        </button>
    )
}


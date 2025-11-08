import * as React from "react"
import { cn } from "@/lib/utils"

const Button = React.forwardRef(({ 
    className,
    variant = "default",
    size = "default",
    children,
    icon: Icon,
    ...props 
}, ref) => {
    const variants = {
        default: "btn-primary-gradient text-primary-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
    }

    const sizes = {
        default: "h-10 px-4 py-2",
        sm: "h-9 px-3 text-sm",
        lg: "h-11 px-8",
        icon: "h-10 w-10",
    }

    return (
        <button
            ref={ref}
            className={cn(
                "inline-flex items-center justify-center gap-2",
                "rounded-full font-medium",
                "transition-all duration-200",
                "shadow-md hover:shadow-lg",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                "disabled:pointer-events-none disabled:opacity-50",
                variants[variant],
                sizes[size],
                className
            )}
            {...props}
        >
            {Icon && <Icon className="w-4 h-4" />}
            {children}
        </button>
    )
})
Button.displayName = "Button"

export { Button }


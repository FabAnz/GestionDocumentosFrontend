import React, { useState } from 'react'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { cn } from '@/lib/utils'

/**
 * Componente de icono de avión de papel personalizado
 */
const SendIcon = ({ className }) => (
    <svg
        className={className}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <path d="M22 2L11 13" />
        <path d="M22 2l-7 20-4-9-9-4 20-7z" />
    </svg>
)

export const ChatInput = ({ onSend, placeholder = "Escribe tu pregunta...", className }) => {
    const [message, setMessage] = useState('')

    const handleSubmit = (e) => {
        e.preventDefault()
        if (message.trim()) {
            onSend?.(message.trim())
            setMessage('')
        }
    }

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            handleSubmit(e)
        }
    }

    return (
        <form 
            onSubmit={handleSubmit}
            className={cn("flex gap-2", className)}
        >
            <Input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={placeholder}
                className="flex-1 rounded-full bg-gray-100 border-primary focus-visible:ring-2 focus-visible:ring-primary h-12"
            />
            <Button
                type="submit"
                variant={message.trim() ? "default" : "secondary"}
                size="icon"
                disabled={!message.trim()}
                className="rounded-full shadow-sm h-12 w-12"
            >
                <SendIcon className="w-4 h-4" />
            </Button>
        </form>
    )
}


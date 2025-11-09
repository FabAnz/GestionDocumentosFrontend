import React from 'react'
import { AssistantAvatar } from '../atoms/AssistantAvatar'
import { cn } from '@/lib/utils'

/**
 * Componente que muestra un indicador de "escribiendo" con 3 puntos animados
 * Similar al de WhatsApp
 */
export const TypingIndicator = () => {
    return (
        <div className="flex items-end justify-start gap-2 mb-4">
            <AssistantAvatar size="default" />
            <div className={cn(
                "rounded-lg px-4 py-2 shadow-sm",
                "bg-purple-100 text-gray-800"
            )}>
                <div className="flex gap-1 items-center">
                    <span 
                        className="w-2 h-2 bg-gray-500 rounded-full"
                        style={{
                            animation: 'typing 1.4s infinite',
                            animationDelay: '0ms'
                        }}
                    ></span>
                    <span 
                        className="w-2 h-2 bg-gray-500 rounded-full"
                        style={{
                            animation: 'typing 1.4s infinite',
                            animationDelay: '200ms'
                        }}
                    ></span>
                    <span 
                        className="w-2 h-2 bg-gray-500 rounded-full"
                        style={{
                            animation: 'typing 1.4s infinite',
                            animationDelay: '400ms'
                        }}
                    ></span>
                </div>
                <style>{`
                    @keyframes typing {
                        0%, 60%, 100% {
                            transform: translateY(0);
                            opacity: 0.7;
                        }
                        30% {
                            transform: translateY(-10px);
                            opacity: 1;
                        }
                    }
                `}</style>
            </div>
        </div>
    )
}


import * as React from "react"
import { useTranslation } from "react-i18next"
import { MessageCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import { Tooltip, TooltipContent, TooltipTrigger } from "./tooltip"

const FloatingActionButton = React.forwardRef(({ 
    className, 
    onClick,
    ...props 
}, ref) => {
    const { t } = useTranslation()
    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <button
                    ref={ref}
                    onClick={onClick}
                    className={cn(
                        "fixed bottom-6 right-6 z-50",
                        "w-14 h-14 rounded-full",
                        "bg-primary text-primary-foreground",
                        "flex items-center justify-center",
                        "shadow-lg hover:shadow-xl",
                        "transition-all duration-200",
                        "hover:scale-105 active:scale-95",
                        "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
                        "xl:hidden",
                        className
                    )}
                    {...props}
                >
                    <MessageCircle className="w-6 h-6 stroke-[2]" />
                </button>
            </TooltipTrigger>
            <TooltipContent>
                {t('chat.openChat')}
            </TooltipContent>
        </Tooltip>
    )
})
FloatingActionButton.displayName = "FloatingActionButton"

export { FloatingActionButton }


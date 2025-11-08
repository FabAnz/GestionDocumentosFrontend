import * as React from "react"
import { cn } from "@/lib/utils"

const Card = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-[var(--radius)] bg-card shadow-sm p-6",
      className
    )}
    {...props}
  />
))
Card.displayName = "Card"

export { Card }


import React from 'react'

export const ProgressBar = ({ total, used }) => {
    // Calcular el porcentaje de progreso
    const progressPercentage = total > 0
        ? (used / total) * 100
        : 0
    return (
        <div className="w-full h-4 bg-muted rounded-full overflow-hidden mb-6">
            <div
                className="h-full bg-primary rounded-full transition-all duration-300 ease-out"
                style={{ width: `${progressPercentage}%` }}
                role="progressbar"
                aria-valuenow={used}
                aria-valuemin={0}
                aria-valuemax={total}
                aria-label={`${used} de ${total}`}
            />
        </div>
    )
}

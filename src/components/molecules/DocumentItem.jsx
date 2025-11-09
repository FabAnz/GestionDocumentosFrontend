import React from 'react'
import { FileText, Image, Calendar } from 'lucide-react'
import { cn } from '@/lib/utils'


export const DocumentItem = ({ document }) => {
    // Formatear fecha
    const formatDate = (dateString) => {
        if (!dateString) return ''
        const date = new Date(dateString)
        return date.toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        })
    }

    return (
        <div className="p-4 border border-border rounded-lg hover:bg-accent/50 transition-colors">
            <div className="flex gap-4">
                {/* Preview o Icono */}
                <div className="flex-shrink-0">
                    {document.urlImagen ? (
                        <img 
                            src={document.urlImagen} 
                            alt={document.titulo}
                            className="w-16 h-16 object-cover rounded-md"
                        />
                    ) : (
                        <div className="w-16 h-16 bg-muted rounded-md flex items-center justify-center">
                            <FileText className="w-8 h-8 text-muted-foreground" />
                        </div>
                    )}
                </div>

                {/* Contenido */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-2">
                        <h3 className="font-semibold text-foreground truncate">
                            {document.titulo}
                        </h3>
                        <span className={cn(
                            'px-2 py-1 rounded-full text-xs font-medium flex-shrink-0',
                            'bg-primary/10 text-primary'
                        )}>
                            {document.categoria.nombre}
                        </span>
                    </div>

                    {/* Preview del contenido */}
                    {document.contenido && (
                        <p className="text-sm text-muted-foreground line-clamp-2 mb-2 text-start">
                            {document.contenido}
                        </p>
                    )}

                    {/* Información adicional */}
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                            {document.urlImagen ? (
                                <Image className="w-3 h-3" />
                            ) : (
                                <FileText className="w-3 h-3" />
                            )}
                            <span className="capitalize">{document.tipo}</span>
                        </div>
                        {document.updatedAt && (
                            <div className="flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                <span>{formatDate(document.updatedAt)}</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}


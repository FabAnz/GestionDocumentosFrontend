import React from 'react'
import { useDispatch } from 'react-redux'
import { FileText, Image, Calendar, Pencil, Trash2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { IconButton } from '@/components/atoms/IconButton'
import { setEditingDocument } from '../../redux/reducers/documentSlice'


export const DocumentItem = ({ document }) => {
    const dispatch = useDispatch()
    
    // Formatear fecha
    //todo: PASAR A UTILITIES
    const formatDate = (dateString) => {
        if (!dateString) return ''
        const date = new Date(dateString)
        return date.toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        })
    }

    const handleEdit = () => {
        dispatch(setEditingDocument(document))
    }

    // TODO: Implementar función de eliminación
    const handleDelete = () => {
        console.log('Eliminar documento:', document.id)
    }

    return (
        <div className="group p-4 border border-border rounded-lg hover:bg-accent/50 transition-colors">
            <div className="flex gap-4 items-center">
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
                        <div className="flex items-center gap-2 flex-shrink-0">
                            <span className={cn(
                                'px-2 py-1 rounded-full text-xs font-medium',
                                'bg-primary/10 text-primary'
                            )}>
                                {document.categoria.nombre}
                            </span>
                        </div>
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

                {/* Botones de acción - lado derecho, apilados verticalmente */}
                <div className="flex flex-col gap-2 flex-shrink-0 justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <IconButton
                        icon={Pencil}
                        onClick={handleEdit}
                        variant="default"
                        size="sm"
                        aria-label="Editar documento"
                    />
                    <IconButton
                        icon={Trash2}
                        onClick={handleDelete}
                        variant="destructive"
                        size="sm"
                        aria-label="Eliminar documento"
                    />
                </div>
            </div>
        </div>
    )
}


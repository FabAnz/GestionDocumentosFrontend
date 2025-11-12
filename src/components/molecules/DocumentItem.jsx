import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
import { FileText, Image, Calendar, Pencil, Trash2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { IconButton } from '@/components/atoms/IconButton'
import { setEditingDocument, deleteDocument } from '../../redux/reducers/documentSlice'
import api from '../../services/api'
import { toast } from 'sonner'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from '../ui/dialog'
import { Button } from '../ui/button'
import { Spinner } from '../ui/spinner'


export const DocumentItem = ({ document }) => {
    const dispatch = useDispatch()
    const { t } = useTranslation()
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)
    
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

    const handleDelete = () => {
        setIsDeleteDialogOpen(true)
    }

    const confirmDelete = async () => {
        setIsDeleting(true)
        try {
            const documentId = document.id || document._id
            await api.delete(`/documentos/${documentId}`)

            // Cerrar el diálogo
            setIsDeleteDialogOpen(false)

            // Eliminar documento del estado de Redux
            dispatch(deleteDocument(documentId))

            // Mostrar notificación de éxito
            toast.success(t('documents.success.deleted'), {
                description: t('documents.success.deletedDesc', { title: document.titulo }),
                duration: 5000,
            })
        } catch (error) {
            // Manejo de errores
            let errorMessage = t('documents.errors.delete')

            if (error.response?.data?.message) {
                errorMessage = error.response.data.message

                if (error.response.data.errors && Array.isArray(error.response.data.errors)) {
                    const errorsList = error.response.data.errors.join(', ')
                    errorMessage = `${errorMessage}: ${errorsList}`
                }
            } else if (error.message) {
                errorMessage = error.message
            }

            toast.error(t('documents.errors.delete'), {
                description: errorMessage,
                duration: 5000,
            })
        } finally {
            setIsDeleting(false)
        }
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
                        aria-label={t('common.edit')}
                    />
                    <IconButton
                        icon={Trash2}
                        onClick={handleDelete}
                        variant="destructive"
                        size="sm"
                        aria-label={t('common.delete')}
                    />
                </div>
            </div>

            {/* Diálogo de confirmación de eliminación */}
            <Dialog open={isDeleteDialogOpen} onOpenChange={(open) => !isDeleting && setIsDeleteDialogOpen(open)}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle className="mb-2">{t('documents.delete.title')}</DialogTitle>
                        <DialogDescription>
                            {t('documents.delete.message', { title: document.titulo })}
                            <br />
                            <br />
                            {t('documents.delete.warning')}
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setIsDeleteDialogOpen(false)}
                            disabled={isDeleting}
                        >
                            {t('documents.delete.cancel')}
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={confirmDelete}
                            disabled={isDeleting}
                        >
                            {isDeleting ? (
                                <span className="flex items-center gap-2">
                                    <Spinner className="h-4 w-4" />
                                    {t('common.deleting')}
                                </span>
                            ) : (
                                t('documents.delete.confirm')
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}


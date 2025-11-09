import React from 'react'
import { useSelector } from 'react-redux'
import { FileText } from 'lucide-react'
import { Spinner } from '../ui/spinner'
import { DocumentItem } from './DocumentItem'

/**
 * Componente DocumentList - Lista de documentos con estados de carga y vacío
 */
export const DocumentList = () => {
    const { documents, loading } = useSelector((state) => state.documents)

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="flex flex-col items-center gap-3">
                    <Spinner className="w-8 h-8 text-primary" />
                    <p className="text-sm text-muted-foreground">Cargando documentos...</p>
                </div>
            </div>
        )
    }

    if (!documents || documents.length === 0) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="text-center">
                    <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-50" />
                    <p className="text-sm text-muted-foreground">
                        No hay documentos disponibles
                    </p>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-3 max-h-[600px] overflow-y-auto">
            {documents.map((document) => (
                <DocumentItem key={document.id} document={document} />
            ))}
        </div>
    )
}


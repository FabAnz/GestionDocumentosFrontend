import React, { useEffect, useState, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { toast } from 'sonner'
import { Folder, Plus } from 'lucide-react'
import { Card } from '../ui/card'
import { CardTitle } from '../atoms/CardTitle'
import { FilterPill } from '../molecules/FilterPill'
import { setDocuments, setLoading, setDocumentCount, clearEditingDocument } from '../../redux/reducers/documentSlice'
import { DocumentList } from '../molecules/DocumentList'
import { Button } from '../ui/button'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '../ui/dialog'
import { AddDocumentForm } from '../molecules/AddDocumentForm'

const apiUrl = import.meta.env.VITE_API_URL

export const Documents = () => {
    const dispatch = useDispatch()
    const editingDocument = useSelector(state => state.documents.editingDocument)
    const isSubmitting = useSelector(state => state.documents.isSubmitting)
    const [activeFilter, setActiveFilter] = useState('Todo')
    const [isModalOpen, setIsModalOpen] = useState(false)
    const toastIdRef = useRef(null)
    const isEditingRef = useRef(false)

    useEffect(() => {
        const fetchDocuments = async () => {
            const token = localStorage.getItem('token')
            if (!token) return

            try {
                dispatch(setLoading(true))
                const response = await axios.get(`${apiUrl}/documentos`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })
                dispatch(setDocuments(response.data))
                dispatch(setDocumentCount(response.data.length))
                dispatch(setLoading(false))
            } catch (error) {
                // Si es un 404, es normal que no haya documentos, no es un error
                if (error.response?.status === 404) {
                    dispatch(setDocuments([]))
                    dispatch(setDocumentCount(0))
                    dispatch(setLoading(false))
                    return
                }

                // Solo mostrar error si no es un 404
                const errorMessage = error.response?.data?.message || error.message || 'Error al cargar los documentos'
                toast.error('Error al cargar documentos', {
                    description: errorMessage,
                    duration: 5000,
                })
                dispatch(setLoading(false))
            }
        }

        fetchDocuments()
    }, [])

    // Actualizar ref cuando cambia editingDocument
    useEffect(() => {
        isEditingRef.current = editingDocument !== null
    }, [editingDocument])

    // Abrir modal cuando hay un documento en edición
    useEffect(() => {
        if (editingDocument) {
            setIsModalOpen(true)
        }
    }, [editingDocument])

    // Escuchar cambios en isSubmitting desde Redux
    useEffect(() => {
        if (isSubmitting) {
            // Evitar crear múltiples toasts
            if (toastIdRef.current !== null) {
                return
            }
            
            // Cerrar el modal
            setIsModalOpen(false)
            
            // Usar la ref para determinar el modo
            const isEditing = isEditingRef.current
            const message = isEditing ? 'Guardando cambios...' : 'Subiendo archivo...'
            const description = isEditing 
                ? 'Por favor espera mientras se guardan los cambios' 
                : 'Por favor espera mientras se procesa tu documento'
            
            // Mostrar toast de carga (sonner tiene un spinner integrado)
            toastIdRef.current = toast.loading(message, {
                description: description,
                duration: Infinity,
            })
        } else {
            // Cerrar el toast cuando termine la carga
            if (toastIdRef.current !== null) {
                toast.dismiss(toastIdRef.current)
                toastIdRef.current = null
            }
        }
    }, [isSubmitting])

    const handleAddDocument = () => {
        dispatch(clearEditingDocument())
        setIsModalOpen(true)
    }

    const handleCloseModal = (open) => {
        setIsModalOpen(open)
        if (!open) {
            dispatch(clearEditingDocument())
        }
    }

    return (
        <Card>
            <div className="flex flex-row justify-between items-center mb-6">
                <CardTitle icon={Folder}>Documentos</CardTitle>
                <Button
                    icon={Plus}
                    className="w-auto"
                    onClick={handleAddDocument}
                >
                    Agregar
                </Button>
            </div>

            {/* Filtros */}
            <div className="flex gap-2 mt-4">
                <FilterPill
                    active={activeFilter === 'Todo'}
                    onClick={() => setActiveFilter('Todo')}
                >
                    Todo
                </FilterPill>
                <FilterPill
                    active={activeFilter === 'Ultima Semana'}
                    onClick={() => setActiveFilter('Ultima Semana')}
                >
                    Ultima Semana
                </FilterPill>
                <FilterPill
                    active={activeFilter === 'Ultimo Mes'}
                    onClick={() => setActiveFilter('Ultimo Mes')}
                >
                    Ultimo Mes
                </FilterPill>
            </div>

            {/* Lista de documentos */}
            <div className="mt-4">
                <DocumentList />
            </div>

            {/* Modal para agregar/editar documento */}
            <Dialog open={isModalOpen} onOpenChange={handleCloseModal}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto rounded-lg">
                    <DialogHeader>
                        <DialogTitle>
                            {editingDocument ? 'Editar Documento' : 'Agregar Documento'}
                        </DialogTitle>
                    </DialogHeader>
                    <AddDocumentForm 
                        editingDocument={editingDocument}
                    />
                </DialogContent>
            </Dialog>
        </Card>
    )
}


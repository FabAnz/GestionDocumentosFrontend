import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import axios from 'axios'
import { toast } from 'sonner'
import { Folder } from 'lucide-react'
import { Card } from '../ui/card'
import { CardTitle } from '../atoms/CardTitle'
import { FilterPill } from '../molecules/FilterPill'
import { setDocuments, setLoading, setDocumentCount } from '../../redux/reducers/documentSlice'
import { DocumentList } from '../molecules/DocumentList'

const apiUrl = import.meta.env.VITE_API_URL

export const Documents = () => {
    const dispatch = useDispatch()
    const [activeFilter, setActiveFilter] = useState('Todo')

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

    return (
        <Card>
            <CardTitle icon={Folder}>Documentos</CardTitle>

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
        </Card>
    )
}


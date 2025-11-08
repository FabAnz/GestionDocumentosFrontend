import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import axios from 'axios'
import { toast } from 'sonner'
import { Card } from '../ui/card'
import { setDocuments, setLoading, setDocumentCount } from '../../redux/reducers/documentSlice'

const apiUrl = import.meta.env.VITE_API_URL

export const Documents = () => {
    const dispatch = useDispatch()

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
            <div className="text-2xl font-semibold">Document List</div>
        </Card>
    )
}


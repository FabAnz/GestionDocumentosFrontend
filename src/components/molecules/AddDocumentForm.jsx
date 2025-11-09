import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import axios from 'axios'
import { toast } from 'sonner'
import { FileUploadArea } from './FileUploadArea'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select'
import { Button } from '../ui/button'
import { addDocument, setDocumentCount } from '../../redux/reducers/documentSlice'

const apiUrl = import.meta.env.VITE_API_URL

export const AddDocumentForm = ({ onSubmittingChange }) => {
  const dispatch = useDispatch()
  const [selectedFile, setSelectedFile] = useState(null)
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const categories = useSelector(state => state.categories.categories)
  const user = useSelector(state => state.user.user)
  const documentCount = useSelector(state => state.documents.documentCount)

  // Notificar al componente padre cuando cambia el estado de envío
  React.useEffect(() => {
    if (onSubmittingChange) {
      onSubmittingChange(isSubmitting)
    }
  }, [isSubmitting, onSubmittingChange])

  const handleFileSelect = (file) => {
    setSelectedFile(file)
  }

  const handleFileRemove = () => {
    setSelectedFile(null)
  }

  const isFormValid = selectedFile !== null && title.trim() !== '' && category !== ''

  const checkPlanLimit = () => {
    if (!user?.plan) return true

    const limit = user.plan.cantidadMaximaDocumentos
    // Si el límite es -1, es ilimitado
    if (limit === -1) return true

    // Verificar si se alcanzó el límite
    if (documentCount >= limit) {
      toast.error('Límite de documentos alcanzado', {
        description: `Has alcanzado el límite de ${limit} documentos para tu plan ${user.plan.nombre}.`,
        duration: 5000,
      })
      return false
    }

    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!isFormValid) return

    // Verificar límite del plan
    if (!checkPlanLimit()) return

    setIsSubmitting(true)

    try {
      const token = localStorage.getItem('token')
      if (!token) {
        throw new Error('No hay token de autenticación')
      }

      // Crear FormData
      const formData = new FormData()
      formData.append('archivo', selectedFile)
      formData.append('titulo', title.trim())
      formData.append('categoria', category)

      // Enviar con axios
      const response = await axios.post(
        `${apiUrl}/documentos`,
        formData,
        {
          headers: {
            'Authorization': `Bearer ${token}`
            // NO establecer Content-Type - axios lo hace automáticamente para FormData
          }
        }
      )

      // Éxito: mostrar notificación
      toast.success('Documento creado exitosamente', {
        description: `"${title}" ha sido agregado correctamente.`,
        duration: 5000,
      })

      // Agregar documento a Redux
      dispatch(addDocument(response.data))
      dispatch(setDocumentCount(documentCount + 1))

      // Limpiar formulario
      setSelectedFile(null)
      setTitle('')
      setCategory('')

      // Limpiar el input de archivo si existe referencia
      const fileInput = document.querySelector('input[type="file"]')
      if (fileInput) {
        fileInput.value = ''
      }

    } catch (error) {
      // Manejo de errores usando mensajes del backend
      let errorMessage = 'Error al subir el archivo'

      if (error.response?.data?.message) {
        // Usar el mensaje del backend directamente
        errorMessage = error.response.data.message

        // Si hay errores adicionales (array de errores), agregarlos
        if (error.response.data.errors && Array.isArray(error.response.data.errors)) {
          const errorsList = error.response.data.errors.join(', ')
          errorMessage = `${errorMessage}: ${errorsList}`
        }
      } else if (error.message) {
        errorMessage = error.message
      }

      toast.error('Error al crear documento', {
        description: errorMessage,
        duration: 5000,
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full h-full space-y-6 bg-card p-6">
      {/* Área de carga de archivos */}
      <FileUploadArea
        onFileSelect={handleFileSelect}
        selectedFile={selectedFile}
        onFileRemove={handleFileRemove}
        isSubmitting={isSubmitting}
      />

      {/* Campo de título */}
      <div className="space-y-2">
        <Label htmlFor="title">Título del documento</Label>
        <Input
          id="title"
          type="text"
          placeholder="Ej: Manual de usuario"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          disabled={isSubmitting}
        />
      </div>

      {/* Campo de categoría */}
      <div className="space-y-2">
        <Label htmlFor="category">Categoría</Label>
        <Select
          value={category}
          onValueChange={setCategory}
          disabled={isSubmitting}
        >
          <SelectTrigger id="category">
            <SelectValue placeholder="Selecciona una categoría" />
          </SelectTrigger>
          <SelectContent>
            {categories.map(cat => (
              <SelectItem key={cat._id} value={cat._id}>
                {cat.nombre}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Botón de agregar */}
      <Button
        type="submit"
        className="w-full rounded-md !rounded-md shadow-sm"
        variant={isFormValid ? "default" : "secondary"}
        disabled={!isFormValid || isSubmitting}
      >
        {isSubmitting ? 'Subiendo...' : 'Agregar Documento'}
      </Button>
    </form>
  )
}


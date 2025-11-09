import React, { useState, useEffect } from 'react'
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
import { addDocument, setDocumentCount, clearEditingDocument, updateDocument, setSubmitting } from '../../redux/reducers/documentSlice'

const apiUrl = import.meta.env.VITE_API_URL

export const AddDocumentForm = ({ editingDocument }) => {
  const dispatch = useDispatch()
  const [selectedFile, setSelectedFile] = useState(null)
  const [title, setTitle] = useState(editingDocument?.titulo || '')
  const [category, setCategory] = useState(editingDocument?.categoria?._id || '')
  const isSubmitting = useSelector(state => state.documents.isSubmitting)
  const categories = useSelector(state => state.categories.categories)
  const user = useSelector(state => state.user.user)
  const documentCount = useSelector(state => state.documents.documentCount)

  // Actualizar el formulario cuando cambie el documento a editar
  useEffect(() => {
    if (editingDocument) {
      setTitle(editingDocument.titulo || '')
      setCategory(editingDocument.categoria?._id || '')
      setSelectedFile(null) // No pre-cargamos el archivo en edición
    } else {
      // Limpiar formulario cuando no hay documento a editar
      setTitle('')
      setCategory('')
      setSelectedFile(null)
    }
  }, [editingDocument])

  const handleFileSelect = (file) => {
    setSelectedFile(file)
  }

  const handleFileRemove = () => {
    setSelectedFile(null)
  }

  // En modo edición, el archivo no es obligatorio si ya existe uno
  const isFormValid = editingDocument 
    ? title.trim() !== '' && category !== ''
    : selectedFile !== null && title.trim() !== '' && category !== ''

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

    // Verificar límite del plan (solo para creación, no para edición)
    if (!editingDocument && !checkPlanLimit()) return

    dispatch(setSubmitting(true))

    try {
      const token = localStorage.getItem('token')
      if (!token) {
        throw new Error('No hay token de autenticación')
      }

      // Crear FormData
      const formData = new FormData()
      formData.append('titulo', title.trim())
      formData.append('categoria', category)
      
      // Solo agregar archivo si hay uno seleccionado (en edición puede no haber archivo nuevo)
      if (selectedFile) {
        formData.append('archivo', selectedFile)
      }

      let response
      
      if (editingDocument) {
        // Modo edición: PUT
        const documentId = editingDocument.id || editingDocument._id
        response = await axios.put(
          `${apiUrl}/documentos/${documentId}`,
          formData,
          {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }
        )

        // Éxito: mostrar notificación
        toast.success('Documento actualizado exitosamente', {
          description: `"${title}" ha sido actualizado correctamente.`,
          duration: 5000,
        })

        // Actualizar documento en Redux
        dispatch(updateDocument(response.data))
      } else {
        // Modo creación: POST
        response = await axios.post(
          `${apiUrl}/documentos`,
          formData,
          {
            headers: {
              'Authorization': `Bearer ${token}`
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
      }

      // Limpiar estado de edición en Redux
      dispatch(clearEditingDocument())

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
      let errorMessage = editingDocument ? 'Error al actualizar el documento' : 'Error al subir el archivo'

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

      toast.error(editingDocument ? 'Error al actualizar documento' : 'Error al crear documento', {
        description: errorMessage,
        duration: 5000,
      })
    } finally {
      dispatch(setSubmitting(false))
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full min-w-0 h-full space-y-6 bg-card p-6 rounded-lg overflow-hidden">
      {/* Área de carga de archivos */}
      <FileUploadArea
        onFileSelect={handleFileSelect}
        selectedFile={selectedFile}
        onFileRemove={handleFileRemove}
        isSubmitting={isSubmitting}
        editingDocument={editingDocument}
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

      {/* Botón de agregar/editar */}
      <Button
        type="submit"
        className="w-full rounded-md !rounded-md shadow-sm"
        variant={isFormValid ? "default" : "secondary"}
        disabled={!isFormValid || isSubmitting}
      >
        {isSubmitting 
          ? (editingDocument ? 'Guardando...' : 'Subiendo...') 
          : (editingDocument ? 'Guardar Cambios' : 'Agregar Documento')
        }
      </Button>
    </form>
  )
}


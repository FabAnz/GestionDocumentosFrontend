import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Formik, Field } from 'formik'
import { useSelector, useDispatch } from 'react-redux'
import api from '../../services/api'
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
import { getDocumentSchema } from '../../schemas/documentSchemas'

export const AddDocumentForm = ({ editingDocument }) => {
  const dispatch = useDispatch()
  const { t, i18n } = useTranslation()
  const isSubmitting = useSelector(state => state.documents.isSubmitting)
  const categories = useSelector(state => state.categories.categories)
  const user = useSelector(state => state.user.user)
  const documentCount = useSelector(state => state.documents.documentCount)

  // Valores iniciales basados en editingDocument
  const initialValues = useMemo(() => ({
    titulo: editingDocument?.titulo || '',
    categoria: editingDocument?.categoria?._id || '',
    archivo: null
  }), [editingDocument])

  // Esquema de validación dinámico según si es edición o creación
  const validationSchema = useMemo(() => {
    return getDocumentSchema(t, !!editingDocument)
  }, [editingDocument, i18n.language, t])

  const checkPlanLimit = () => {
    if (!user?.plan) return true

    const limit = user.plan.cantidadMaximaDocumentos
    // Si el límite es -1, es ilimitado
    if (limit === -1) return true

    // Verificar si se alcanzó el límite
    if (documentCount >= limit) {
      toast.error(t('documents.errors.limitReached'), {
        description: t('documents.errors.limitReachedDesc', { limit, plan: user.plan.nombre }),
        duration: 5000,
      })
      return false
    }

    return true
  }

  const onSubmit = async (values, actions) => {
    // Verificar límite del plan (solo para creación, no para edición)
    if (!editingDocument && !checkPlanLimit()) {
      actions.setSubmitting(false)
      return
    }

    dispatch(setSubmitting(true))

    try {
      // Crear FormData
      const formData = new FormData()
      formData.append('titulo', values.titulo.trim())
      formData.append('categoria', values.categoria)
      
      // Solo agregar archivo si hay uno seleccionado (en edición puede no haber archivo nuevo)
      if (values.archivo) {
        formData.append('archivo', values.archivo)
      }

      let response
      
      if (editingDocument) {
        // Modo edición: PUT
        const documentId = editingDocument.id || editingDocument._id
        response = await api.put(
          `/documentos/${documentId}`,
          formData
        )

        // Éxito: mostrar notificación
        toast.success(t('documents.success.updated'), {
          description: t('documents.success.updatedDesc', { title: values.titulo }),
          duration: 5000,
        })

        // Actualizar documento en Redux
        dispatch(updateDocument(response.data))
      } else {
        // Modo creación: POST
        response = await api.post(
          '/documentos',
          formData
        )

        // Éxito: mostrar notificación
        toast.success(t('documents.success.created'), {
          description: t('documents.success.createdDesc', { title: values.titulo }),
          duration: 5000,
        })

        // Agregar documento a Redux
        dispatch(addDocument(response.data))
        dispatch(setDocumentCount(documentCount + 1))
      }

      // Limpiar estado de edición en Redux
      dispatch(clearEditingDocument())

      // Resetear formulario
      actions.resetForm()

      // Limpiar el input de archivo si existe referencia
      const fileInput = document.querySelector('input[type="file"]')
      if (fileInput) {
        fileInput.value = ''
      }

    } catch (error) {
      // Manejo de errores usando mensajes del backend
      let errorMessage = editingDocument ? t('documents.errors.update') : t('documents.errors.create')

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

      toast.error(editingDocument ? t('documents.errors.update') : t('documents.errors.create'), {
        description: errorMessage,
        duration: 5000,
      })
    } finally {
      dispatch(setSubmitting(false))
      actions.setSubmitting(false)
    }
  }

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
      enableReinitialize
    >
      {({ values, errors, touched, handleSubmit, setFieldValue, isSubmitting: formikSubmitting }) => {
        const isFormSubmitting = isSubmitting || formikSubmitting

        const handleFileSelect = (file) => {
          setFieldValue('archivo', file)
        }

        const handleFileRemove = () => {
          setFieldValue('archivo', null)
          // Limpiar el input de archivo
          const fileInput = document.querySelector('input[type="file"]')
          if (fileInput) {
            fileInput.value = ''
          }
        }

        return (
          <form onSubmit={handleSubmit} className="w-full min-w-0 h-full space-y-6 bg-card p-6 rounded-lg overflow-hidden">
            {/* Área de carga de archivos */}
            <FileUploadArea
              onFileSelect={handleFileSelect}
              selectedFile={values.archivo}
              onFileRemove={handleFileRemove}
              isSubmitting={isFormSubmitting}
              editingDocument={editingDocument}
            />
            {errors.archivo && touched.archivo && (
              <p className="text-sm text-destructive">{errors.archivo}</p>
            )}

            {/* Campo de título */}
            <div className="space-y-2">
              <Label htmlFor="titulo">{t('documents.form.titleLabel')}</Label>
              <Field
                as={Input}
                id="titulo"
                name="titulo"
                type="text"
                placeholder={t('documents.form.titlePlaceholder')}
                disabled={isFormSubmitting}
              />
              {errors.titulo && touched.titulo && (
                <p className="text-sm text-destructive">{errors.titulo}</p>
              )}
            </div>

            {/* Campo de categoría */}
            <div className="space-y-2">
              <Label htmlFor="categoria">{t('documents.form.categoryLabel')}</Label>
              <Select
                value={values.categoria}
                onValueChange={(value) => setFieldValue('categoria', value)}
                disabled={isFormSubmitting}
              >
                <SelectTrigger id="categoria">
                  <SelectValue placeholder={t('documents.form.categoryPlaceholder')} />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(cat => (
                    <SelectItem key={cat._id} value={cat._id}>
                      {cat.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.categoria && touched.categoria && (
                <p className="text-sm text-destructive">{errors.categoria}</p>
              )}
            </div>

            {/* Botón de agregar/editar */}
            <Button
              type="submit"
              className="w-full rounded-md !rounded-md shadow-sm"
              disabled={isFormSubmitting}
            >
              {isFormSubmitting 
                ? (editingDocument ? t('documents.form.saving') : t('documents.form.uploading')) 
                : (editingDocument ? t('documents.form.saveChanges') : t('documents.addNew'))
              }
            </Button>
          </form>
        )
      }}
    </Formik>
  )
}


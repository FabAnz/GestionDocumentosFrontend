import React, { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { FileText, Image as ImageIcon, Check, X, AlertTriangle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import { Spinner } from '../ui/spinner'

export const FileUploadArea = ({ onFileSelect, selectedFile, onFileRemove, isSubmitting = false, className, editingDocument }) => {
  const { t } = useTranslation()
  const fileInputRef = useRef(null)
  const [isDragging, setIsDragging] = useState(false)

  // Extensiones permitidas según el texto mostrado: TXT, PDF, JPG, PNG
  const ALLOWED_EXTENSIONS = ['.txt', '.pdf', '.jpg', '.jpeg', '.png']
  const ALLOWED_MIME_TYPES = [
    'text/plain',
    'application/pdf',
    'image/jpeg',
    'image/jpg',
    'image/png'
  ]

  // Función para validar el tipo de archivo
  const validateFile = (file) => {
    if (!file) return false

    // Obtener la extensión del archivo
    const fileName = file.name.toLowerCase()
    const fileExtension = fileName.substring(fileName.lastIndexOf('.'))
    
    // Validar extensión
    const isValidExtension = ALLOWED_EXTENSIONS.includes(fileExtension)
    
    // Validar tipo MIME (si está disponible)
    const isValidMimeType = !file.type || ALLOWED_MIME_TYPES.includes(file.type.toLowerCase())

    return isValidExtension && isValidMimeType
  }

  const handleClick = (e) => {
    // No abrir el selector si está subiendo o si se hace clic en el botón de eliminar
    if (isSubmitting || e.target.closest('button')) return
    fileInputRef.current?.click()
  }

  const handleFileChange = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      if (validateFile(file)) {
        if (onFileSelect) {
          onFileSelect(file)
        }
      } else {
        // Limpiar el input
        e.target.value = ''
        // Mostrar error
        toast.error(t('documents.upload.fileTypeError'), {
          description: t('documents.upload.fileTypeErrorDesc')
        })
      }
    }
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files?.[0]
    if (file) {
      if (validateFile(file)) {
        if (onFileSelect) {
          onFileSelect(file)
        }
      } else {
        // Mostrar error
        toast.error(t('documents.upload.fileTypeError'), {
          description: t('documents.upload.fileTypeErrorDesc')
        })
      }
    }
  }

  const handleRemove = (e) => {
    e.stopPropagation()
    // No permitir eliminar mientras se está subiendo
    if (isSubmitting) return
    
    // Si hay un archivo seleccionado, eliminarlo
    if (selectedFile) {
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
      if (onFileRemove) {
        onFileRemove()
      }
    } else if (editingDocument) {
      // Si estamos en modo edición y no hay archivo seleccionado, abrir selector para reemplazar
      fileInputRef.current?.click()
    }
  }

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
  }

  // Función para verificar si el archivo es PDF
  const isPdfFile = (file) => {
    if (!file) return false
    const fileName = file.name.toLowerCase()
    const fileExtension = fileName.substring(fileName.lastIndexOf('.'))
    return fileExtension === '.pdf' || file.type === 'application/pdf'
  }

  // Determinar si hay un archivo para mostrar (seleccionado o existente)
  const hasFile = selectedFile || editingDocument
  // El área es clickeable cuando no hay archivo seleccionado y no está subiendo
  const isClickable = !selectedFile && !isSubmitting

  return (
    <div
      className={cn(
        "w-full min-w-0 rounded-md border-2 border-dashed p-8",
        "flex flex-col items-center justify-center gap-4",
        "transition-all duration-200",
        hasFile 
          ? (selectedFile ? "border-primary/40 bg-accent/20 cursor-default" : "border-primary/40 bg-accent/20 cursor-pointer hover:border-primary/60")
          : "border-input bg-muted/50 cursor-pointer hover:border-primary/60 hover:bg-accent/30 hover:shadow-sm",
        isDragging && "border-primary bg-accent/50",
        isSubmitting && "opacity-60 pointer-events-none",
        className
      )}
      onClick={isClickable ? handleClick : undefined}
      onDragOver={isClickable ? handleDragOver : undefined}
      onDragLeave={isClickable ? handleDragLeave : undefined}
      onDrop={isClickable ? handleDrop : undefined}
    >
      {selectedFile ? (
        <>
          <div className="flex items-center gap-3">
            {isSubmitting ? (
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10">
                <Spinner className="h-6 w-6 text-primary" />
              </div>
            ) : (
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10">
                <Check className="h-6 w-6 text-primary" />
              </div>
            )}
          </div>
          <div className="text-center w-full min-w-0 px-2">
            <p className="text-sm font-medium text-foreground mb-1 truncate" title={selectedFile.name}>
              {selectedFile.name}
            </p>
            <p className="text-xs text-muted-foreground">
              {formatFileSize(selectedFile.size)}
            </p>
          </div>
          
          {/* Advertencia para archivos PDF */}
          {isPdfFile(selectedFile) && (
            <div className="w-full min-w-0 px-4 py-3 rounded-md bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-yellow-800 dark:text-yellow-200 text-left min-w-0 break-words">
                <span className="font-semibold">{t('documents.upload.pdfWarning')}</span> {t('documents.upload.pdfWarningDesc')}
              </p>
            </div>
          )}
          
          <button
            type="button"
            onClick={handleRemove}
            disabled={isSubmitting}
            className="mt-2 px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors duration-200 flex items-center gap-2 hover:bg-accent/50 rounded-md disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent"
          >
            <X className="h-4 w-4" />
            {t('documents.upload.removeFile')}
          </button>
        </>
      ) : editingDocument ? (
        <>
          <div className="flex items-center gap-3">
            {editingDocument.urlImagen ? (
              <img
                src={editingDocument.urlImagen}
                alt={editingDocument.titulo}
                className="w-16 h-16 object-cover rounded-md"
              />
            ) : (
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10">
                <FileText className="h-6 w-6 text-primary" />
              </div>
            )}
          </div>
          <div className="text-center w-full min-w-0 px-2">
            <p className="text-sm font-medium text-foreground mb-1 truncate" title={editingDocument.titulo}>
              {editingDocument.titulo}
            </p>
            <p className="text-xs text-muted-foreground">
              {t('documents.upload.existingFile')}
            </p>
          </div>
          
          <button
            type="button"
            onClick={handleRemove}
            disabled={isSubmitting}
            className="mt-2 px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors duration-200 flex items-center gap-2 hover:bg-accent/50 rounded-md disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent"
          >
            <X className="h-4 w-4" />
            {t('documents.upload.replaceFile')}
          </button>
        </>
      ) : (
        <>
          <div className="flex items-center gap-4">
            <FileText className="h-8 w-8 text-muted-foreground" />
            <ImageIcon className="h-8 w-8 text-muted-foreground" />
          </div>
          <div className="text-center">
            <p className="text-sm font-medium text-foreground mb-1">
              {t('documents.upload.dragDrop')}
            </p>
            <p className="text-xs text-muted-foreground">
              {t('documents.upload.supported')}
            </p>
          </div>
        </>
      )}
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        accept=".txt,.pdf,.jpg,.jpeg,.png"
        onChange={handleFileChange}
      />
    </div>
  )
}


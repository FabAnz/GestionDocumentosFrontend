import * as Yup from 'yup'

// Esquema dinámico para documentos (acepta función de traducción y determina si es edición)
export const getDocumentSchema = (t, isEditing = false) => {
    const baseSchema = {
        titulo: Yup.string()
            .trim()
            .min(1, t('validations.title_empty'))
            .required(t('validations.title_required')),
        categoria: Yup.string()
            .required(t('validations.category_required')),
    }

    // Si no es edición, el archivo es obligatorio
    if (!isEditing) {
        baseSchema.archivo = Yup.mixed()
            .required(t('validations.file_required'))
            .test('fileType', t('validations.file_type_invalid'), (value) => {
                if (!value) return false
                const allowedTypes = [
                    'text/plain',      // .txt
                    'image/jpeg',      // .jpg, .jpeg
                    'image/jpg',       // .jpg
                    'image/png'        // .png
                ]
                return allowedTypes.includes(value.type)
            })
    }

    return Yup.object(baseSchema)
}


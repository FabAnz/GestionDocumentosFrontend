import * as Yup from 'yup'

// Expresión regular para validación de email
const emailReg = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i

// Patrón de contraseña según requerimientos de la API:
const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/

// Esquema dinámico para registro que recibe la función de traducción
export const getRegisterSchema = (t) => {
    return Yup.object({
        nombre: Yup.string()
            .trim()
            .min(2, t('validations.name_min', { min: 2 }))
            .required(t('validations.name_required')),
        apellido: Yup.string()
            .trim()
            .min(2, t('validations.lastName_min', { min: 2 }))
            .required(t('validations.lastName_required')),
        email: Yup.string()
            .email(t('validations.email_invalid'))
            .matches(emailReg, t('validations.email_invalid'))
            .required(t('validations.email_required')),
        password: Yup.string()
            .min(8, t('validations.password_min', { min: 8 }))
            .max(128, t('validations.password_max', { max: 128 }))
            .matches(
                passwordPattern,
                t('validations.password_pattern')
            )
            .required(t('validations.password_required')),
        repeatPassword: Yup.string()
            .oneOf([Yup.ref('password')], t('validations.password_match'))
            .required(t('validations.confirm_password_required')),
    })
}


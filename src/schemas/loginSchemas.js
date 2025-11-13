import * as Yup from 'yup'

// Expresión regular para validación de email
const emailReg = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i

// Esquema dinámico para login que recibe la función de traducción
export const getLoginSchema = (t) => {
    return Yup.object({
        email: Yup.string()
            .email(t('validations.email_invalid'))
            .matches(emailReg, t('validations.email_invalid'))
            .required(t('validations.email_required')),
        password: Yup.string()
            .required(t('validations.password_required')),
    })
}


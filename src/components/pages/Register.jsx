import React, { useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Formik, Field } from 'formik'
import { useTranslation } from 'react-i18next'
import { publicApi } from '../../services/api'
import { useDispatch } from 'react-redux'
import { setUser, setLoading as setUserLoading } from '../../redux/reducers/userSlice'
import { toast } from 'sonner'
import { UserPlus } from 'lucide-react'
import { Card } from '../ui/card'
import { CardTitle } from '../atoms/CardTitle'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { Spinner } from '../ui/spinner'
import { Toaster } from '../ui/sonner'
import { LanguageSwitcher } from '../molecules/LanguageSwitcher'
import { getRegisterSchema } from '../../schemas/registerSchemas'

const initialValues = { 
    nombre: '', 
    apellido: '', 
    email: '', 
    password: '', 
    repeatPassword: '' 
}

const isSubmitDisabled = (values, isSubmitting, errors) => {
    return isSubmitting || !values.email || !values.password || !values.repeatPassword || !values.nombre || !values.apellido || values.password !== values.repeatPassword || errors.nombre || errors.apellido || errors.email || errors.password || errors.repeatPassword
}

export const Register = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { t, i18n } = useTranslation()

    const validationSchema = useMemo(() => {
        return getRegisterSchema(t)
    }, [i18n.language, t])

    useEffect(() => {
        const token = localStorage.getItem('token')
        if (token) {
            navigate('/dashboard', { replace: true })
        }
    }, [navigate])

    const onSubmit = async (values, actions) => {
        try {
            dispatch(setUserLoading(true))
            const response = await publicApi.post('/usuarios/registro', {
                email: values.email,
                password: values.password,
                nombre: values.nombre,
                apellido: values.apellido
            })

            localStorage.setItem('token', response.data.token)
            localStorage.setItem('userId', response.data.usuario._id || response.data.usuario.id)

            dispatch(setUser(response.data.usuario))
            dispatch(setUserLoading(false))

            // Redirigir al dashboard después del registro exitoso
            navigate('/dashboard', { replace: true })
            
            // Resetear formulario después del envío exitoso
            actions.resetForm()
        } catch (error) {
            const errors = error.response?.data?.errors
            const message = error.response?.data?.message

            // Si viene un array de errores, mostrar cada uno
            if (Array.isArray(errors) && errors.length > 0) {
                errors.forEach((errorMsg) => {
                    toast.error(t('auth.register.error'), {
                        description: errorMsg,
                        duration: 5000,
                    })
                })
            }
            // Si viene un mensaje de error (string), mostrarlo
            else if (message) {
                toast.error(t('auth.register.error'), {
                    description: message,
                    duration: 5000,
                })
            }
            // Si no hay ningún error específico, usar mensaje por defecto
            else {
                toast.error(t('auth.register.error'), {
                    description: error.message || t('auth.register.error'),
                    duration: 5000,
                })
            }

            dispatch(setUserLoading(false))
        } finally {
            actions.setSubmitting(false)
        }
    }

    return (
        <div className="w-full h-screen bg-background flex items-center justify-center px-4">
            <Card className="w-full max-w-md shadow-md">
                <div className="space-y-6">
                    <div className="flex justify-end">
                        <LanguageSwitcher />
                    </div>
                    <div className="text-center space-y-2">
                        <CardTitle icon={UserPlus} size="lg" className="justify-center">
                            {t('auth.register.title')}
                        </CardTitle>
                        <p className="text-muted-foreground text-sm">
                            {t('auth.register.subtitle')}
                        </p>
                    </div>

                    <Formik
                        initialValues={initialValues}
                        validationSchema={validationSchema}
                        onSubmit={onSubmit}
                    >
                        {({ values, errors, touched, handleSubmit, handleChange, isSubmitting }) => (
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="space-y-2">
                                    <Field
                                        as={Input}
                                        id="nombre"
                                        name="nombre"
                                        type="text"
                                        value={values.nombre}
                                        onChange={handleChange}
                                        placeholder={t('auth.register.namePlaceholder')}
                                    />
                                    {errors.nombre && touched.nombre && (
                                        <p className="text-sm text-destructive">{errors.nombre}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Field
                                        as={Input}
                                        id="apellido"
                                        name="apellido"
                                        type="text"
                                        value={values.apellido}
                                        onChange={handleChange}
                                        placeholder={t('auth.register.lastNamePlaceholder')}
                                    />
                                    {errors.apellido && touched.apellido && (
                                        <p className="text-sm text-destructive">{errors.apellido}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Field
                                        as={Input}
                                        id="email"
                                        name="email"
                                        type="email"
                                        value={values.email}
                                        onChange={handleChange}
                                        placeholder={t('auth.register.emailPlaceholder')}
                                    />
                                    {errors.email && touched.email && (
                                        <p className="text-sm text-destructive">{errors.email}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Field
                                        as={Input}
                                        id="password"
                                        name="password"
                                        type="password"
                                        value={values.password}
                                        onChange={handleChange}
                                        placeholder={t('auth.register.passwordPlaceholder')}
                                    />
                                    {errors.password && touched.password && (
                                        <p className="text-sm text-destructive">{errors.password}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Field
                                        as={Input}
                                        id="repeatPassword"
                                        name="repeatPassword"
                                        type="password"
                                        value={values.repeatPassword}
                                        onChange={handleChange}
                                        placeholder={t('auth.register.confirmPasswordPlaceholder')}
                                    />
                                    {errors.repeatPassword && touched.repeatPassword && (
                                        <p className="text-sm text-destructive">{errors.repeatPassword}</p>
                                    )}
                                </div>

                                <Button
                                    type="submit"
                                    disabled={isSubmitDisabled(values, isSubmitting, errors)}
                                    className="w-full"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <Spinner className="h-4 w-4" />
                                            <span>{t('auth.register.buttonLoading')}</span>
                                        </>
                                    ) : (
                                        <>
                                            <UserPlus className="w-4 h-4" />
                                            <span>{t('auth.register.button')}</span>
                                        </>
                                    )}
                                </Button>
                            </form>
                        )}
                    </Formik>

                    <div className="text-center">
                        <p className="text-sm text-muted-foreground">
                            {t('auth.register.hasAccount')}{' '}
                            <button
                                type="button"
                                onClick={() => navigate('/login')}
                                className="text-primary hover:underline font-medium"
                            >
                                {t('auth.register.loginLink')}
                            </button>
                        </p>
                    </div>
                </div>
            </Card>
            <Toaster />
        </div>
    )
}


import React, { useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Formik, Field } from 'formik'
import { useTranslation } from 'react-i18next'
import { publicApi } from '../../services/api'
import { useDispatch } from 'react-redux'
import { setUser, setLoading as setUserLoading } from '../../redux/reducers/userSlice'
import { toast } from 'sonner'
import { LogIn } from 'lucide-react'
import { Card } from '../ui/card'
import { CardTitle } from '../atoms/CardTitle'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { Spinner } from '../ui/spinner'
import { Toaster } from '../ui/sonner'
import { LanguageSwitcher } from '../molecules/LanguageSwitcher'
import { getLoginSchema } from '../../schemas/loginSchemas'

const initialValues = { email: '', password: '' }
const isSubmitDisabled = (values, isSubmitting, errors) => {
    return isSubmitting || !values.email || !values.password || errors.email || errors.password
}

export const Login = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { t, i18n } = useTranslation()

    const validationSchema = useMemo(() => {
        return getLoginSchema(t)
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
            const response = await publicApi.post('/usuarios/login', {
                email: values.email,
                password: values.password
            })

            localStorage.setItem('token', response.data.token)
            localStorage.setItem('userId', response.data.usuario.id)

            dispatch(setUser(response.data.usuario))
            dispatch(setUserLoading(false))

            // Redirigir al dashboard después del login exitoso
            navigate('/dashboard', { replace: true })
            
            // Resetear formulario después del envío exitoso
            actions.resetForm()
        } catch (error) {
            const errors = error.response?.data?.errors
            const message = error.response?.data?.message
            
            // Si viene un array de errores, mostrar cada uno
            if (Array.isArray(errors) && errors.length > 0) {
                errors.forEach((errorMsg) => {
                    toast.error(t('auth.login.error'), {
                        description: errorMsg,
                        duration: 10000,
                    })
                })
            } 
            // Si viene un mensaje de error (string), mostrarlo
            if (message) {
                toast.error(t('auth.login.error'), {
                    description: message,
                    duration: 10000,
                })
            } 
            // Si no hay ningún error específico, usar mensaje por defecto
            else {
                toast.error(t('auth.login.error'), {
                    description: error.message || t('auth.login.error'),
                    duration: 10000,
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
                        <CardTitle icon={LogIn} size="lg" className="justify-center">
                            {t('auth.login.title')}
                        </CardTitle>
                        <p className="text-muted-foreground text-sm">
                            {t('auth.login.subtitle')}
                        </p>
                    </div>

                    <Formik
                        initialValues={initialValues}
                        validationSchema={validationSchema}
                        onSubmit={onSubmit}
                    >
                        {({ values, errors, touched, handleSubmit, handleChange, isSubmitting }) => (
                            <form onSubmit={handleSubmit}>
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Field
                                            as={Input}
                                            id="email"
                                            name="email"
                                            type="text"
                                            value={values.email}
                                            onChange={handleChange}
                                            placeholder={t('auth.login.emailPlaceholder')}
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
                                            placeholder={t('auth.login.passwordPlaceholder')}
                                        />
                                        {errors.password && touched.password && (
                                            <p className="text-sm text-destructive">{errors.password}</p>
                                        )}
                                    </div>
                                </div>

                                <div className="mt-10">
                                    <Button
                                        type="submit"
                                        disabled={isSubmitDisabled(values, isSubmitting, errors)}
                                        className="w-full"
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <Spinner className="h-4 w-4" />
                                                <span>{t('auth.login.buttonLoading')}</span>
                                            </>
                                        ) : (
                                            <>
                                                <LogIn className="w-4 h-4" />
                                                <span>{t('auth.login.button')}</span>
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </form>
                        )}
                    </Formik>

                    <div className="text-center">
                        <p className="text-sm text-muted-foreground">
                            {t('auth.login.noAccount')}{' '}
                            <button
                                type="button"
                                onClick={() => navigate('/registro')}
                                className="text-primary hover:underline font-medium"
                            >
                                {t('auth.login.registerLink')}
                            </button>
                        </p>
                    </div>
                </div>
            </Card>
            <Toaster />
        </div>
    )
}

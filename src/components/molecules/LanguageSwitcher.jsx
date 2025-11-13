import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/utils'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import Flag from 'react-world-flags'

export const LanguageSwitcher = ({ className }) => {
    const { i18n } = useTranslation()

    // Cargar idioma guardado al montar (solo una vez)
    useEffect(() => {
        if (typeof window !== 'undefined' && localStorage) {
            const savedLanguage = localStorage.getItem('idioma')
            // Solo cambiar si hay un idioma guardado y es diferente del actual
            if (savedLanguage && (savedLanguage === 'es' || savedLanguage === 'en') && savedLanguage !== i18n.language) {
                i18n.changeLanguage(savedLanguage)
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []) // Ejecutar solo una vez al montar

    const changeLanguage = (lng) => {
        i18n.changeLanguage(lng)
        if (typeof window !== 'undefined' && localStorage) {
            localStorage.setItem('idioma', lng)
        }
    }

    const languages = [
        { code: 'es', countryCode: 'ES' },
        { code: 'en', countryCode: 'GB' },
    ]

    const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[0]

    return (
        <div className={cn("flex items-center", className)}>
            <Select value={i18n.language} onValueChange={changeLanguage}>
                <SelectTrigger className="w-[100px] h-9">
                    <div className="flex items-center gap-2">
                        <Flag 
                            code={currentLanguage.countryCode} 
                            className="h-4 w-6 object-cover rounded-sm flex-shrink-0"
                        />
                        <SelectValue>
                            <span className="uppercase">{i18n.language}</span>
                        </SelectValue>
                    </div>
                </SelectTrigger>
                <SelectContent>
                    {languages.map((lang) => (
                        <SelectItem key={lang.code} value={lang.code}>
                            <div className="flex items-center gap-2">
                                <Flag 
                                    code={lang.countryCode} 
                                    className="h-4 w-6 object-cover rounded-sm flex-shrink-0"
                                />
                                <span className="uppercase">{lang.code}</span>
                            </div>
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    )
}


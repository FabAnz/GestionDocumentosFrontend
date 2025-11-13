import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { LogOut, User } from "lucide-react"
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { logout } from '@/lib/auth'
import api from '@/services/api'
import { setUser } from '@/redux/reducers/userSlice'
import { toast } from 'sonner'
import { LanguageSwitcher } from '../molecules/LanguageSwitcher'

export function Navbar() {
  const user = useSelector((state) => state.user.user)
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { t } = useTranslation()

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!user && token) {
      const fetchUser = async () => {
        try {
          const response = await api.get('/usuarios/usuario')
          dispatch(setUser(response.data))
        } catch (error) {
          const errorMessage = error.response?.data?.message || error.message || t('errors.loadUser')
          toast.error(t('errors.loadUser'), {
            description: errorMessage,
            duration: 5000,
          })
        }
      }
      fetchUser()
    }
  }, [user, dispatch])

  const handleLogout = () => {
    logout(navigate)
  }

  return (
    <nav className="w-full bg-card border-b border-border shadow-xs">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Logo y título */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-muted-foreground flex items-center justify-center shadow-md">
            <span className="text-primary-foreground font-semibold text-lg">IA</span>
          </div>
          <h1 className="text-xl font-semibold text-foreground">DocuChat</h1>
        </div>

        {/* Perfil de usuario y botón de logout */}
        <div className="flex items-center gap-4">
          <LanguageSwitcher />
          {/* Información del usuario */}
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10 bg-primary shadow-md">
              <AvatarFallback className="bg-primary text-primary-foreground">
                <User className="h-5 w-5" />
              </AvatarFallback>
            </Avatar>
            <div className="text-left hidden sm:block">
              <p className="text-sm font-semibold text-foreground">
                {user?.nombre}
              </p>
              <p className="text-xs text-muted-foreground">{user?.email}</p>
            </div>
          </div>

          {/* Botón de logout con tooltip */}
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={handleLogout}
                className="h-10 w-10 rounded-full hover:scale-110 active:scale-95 transition-all duration-200 flex items-center justify-center hover:shadow-md hover:bg-accent"
                aria-label={t('auth.logout')}
              >
                <LogOut className="h-5 w-5 text-foreground" />
              </button>
            </TooltipTrigger>
            <TooltipContent>{t('auth.logout')}</TooltipContent>
          </Tooltip>
        </div>
      </div>
    </nav>
  )
}



import React from 'react'
import { CardTitle } from '../atoms/CardTitle'
import { Crown, TrendingUp, Sparkles } from 'lucide-react'
import { capitalize } from '@/lib/utils'
import { Button } from '../ui/button'
import { Card } from '../ui/card'
import { useSelector, useDispatch } from 'react-redux'
import { ProgressBar } from '../atoms/ProgressBar'
import { upgradeToPremium } from '@/redux/reducers/userSlice'
import axios from 'axios'
import { toast } from 'sonner'

const apiUrl = import.meta.env.VITE_API_URL

export const UserPlan = () => {
  const dispatch = useDispatch()
  const plan = useSelector((state) => state.user.user?.plan)
  const documentsCount = useSelector((state) => state.documents.documentCount)

  const documentsLimit = plan?.cantidadMaximaDocumentos
  const isPlus = plan?.nombre === 'plus'
  const isPremium = plan?.nombre === 'premium'

  const handleUpgrade = async () => {
    const token = localStorage.getItem('token')
    if (!token) return
    try {
      const response = await axios.put(`${apiUrl}/usuarios/upgrade-plan`, null,{
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      console.log(response.data.plan)
      dispatch(upgradeToPremium(response.data.plan))
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Error al actualizar el plan'
      toast.error('Error al actualizar plan', {
        description: errorMessage,
        duration: 5000,
      })
    }
  }

  return (
    <Card>
      <div className="flex flex-row justify-between items-center mb-6">
        <CardTitle icon={Crown}>Plan {capitalize(plan?.nombre)}</CardTitle>
        {isPlus && (
          <span className="text-muted-foreground text-sm">
            {documentsCount}/{documentsLimit} documentos
          </span>
        )}
        {isPremium && (
          <div className="text-muted-foreground text-sm">
            Total de documentos: {documentsCount}
          </div>
        )}
      </div>

      {isPremium && (
        <div className="space-y-4">
          {/* Pill con información de documentos ilimitados */}
          <div className="flex justify-center items-center gap-2 px-4 py-3 rounded-full w-full" style={{ backgroundColor: '#F0E6F5' }}>
            <Sparkles className="w-5 h-5 text-orange-500" />
            <span className="text-sm font-medium text-gray-800">
              Documentos ilimitados y acceso completo
            </span>
          </div>


        </div>
      )}
      {isPlus && (
        <>
          <ProgressBar total={documentsLimit} used={documentsCount} />

          <div className="flex justify-end mt-auto">
            <Button
              icon={TrendingUp}
              className="w-full sm:w-auto"
              onClick={handleUpgrade}
            >
              Mejorar Plan
            </Button>
          </div>
        </>
      )}
    </Card>
  )
}

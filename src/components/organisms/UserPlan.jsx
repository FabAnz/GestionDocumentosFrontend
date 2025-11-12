import React from 'react'
import { useTranslation } from 'react-i18next'
import { CardTitle } from '../atoms/CardTitle'
import { Crown, TrendingUp, Sparkles } from 'lucide-react'
import { capitalize } from '@/lib/utils'
import { Button } from '../ui/button'
import { Card } from '../ui/card'
import { useSelector, useDispatch } from 'react-redux'
import { ProgressBar } from '../atoms/ProgressBar'
import { upgradeToPremium } from '@/redux/reducers/userSlice'
import api from '../../services/api'
import { toast } from 'sonner'

export const UserPlan = () => {
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const plan = useSelector((state) => state.user.user?.plan)
  const documentsCount = useSelector((state) => state.documents.documentCount)

  const documentsLimit = plan?.cantidadMaximaDocumentos
  const isPlus = plan?.nombre === 'plus'
  const isPremium = plan?.nombre === 'premium'

  const handleUpgrade = async () => {
    try {
      const response = await api.put('/usuarios/upgrade-plan')
      dispatch(upgradeToPremium(response.data.plan))
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || t('plans.error')
      toast.error(t('plans.error'), {
        description: errorMessage,
        duration: 5000,
      })
    }
  }

  return (
    <Card>
      <div className="flex flex-row justify-between items-center mb-6">
        <CardTitle icon={Crown}>{t('plans.title', { plan: capitalize(plan?.nombre) })}</CardTitle>
        {isPlus && (
          <span className="text-muted-foreground text-sm">
            {t('plans.documentsCount', { count: documentsCount, limit: documentsLimit })}
          </span>
        )}
        {isPremium && (
          <div className="text-muted-foreground text-sm">
            {t('plans.totalDocuments', { count: documentsCount })}
          </div>
        )}
      </div>

      {isPremium && (
        <div className="space-y-4">
          {/* Pill con información de documentos ilimitados */}
          <div className="flex justify-center items-center gap-2 px-4 py-3 rounded-full w-full" style={{ backgroundColor: '#F0E6F5' }}>
            <Sparkles className="w-5 h-5 text-orange-500" />
            <span className="text-sm font-medium text-gray-800">
              {t('plans.unlimited')}
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
              {t('plans.upgrade')}
            </Button>
          </div>
        </>
      )}
    </Card>
  )
}

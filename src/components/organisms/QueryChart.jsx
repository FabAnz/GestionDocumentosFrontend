import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import api from '../../services/api'
import { Card } from '../ui/card'
import { CardTitle } from '../atoms/CardTitle'
import { TrendingUp } from 'lucide-react'
import { Spinner } from '../ui/spinner'
import { toast } from 'sonner'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts'
import {
  setCategoryMessages,
  setLoading
} from '../../redux/reducers/categoryMessagesSlice'

export const QueryChart = () => {
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const { categoryMessages, loading } = useSelector((state) => state.categoryMessages)

  useEffect(() => {
    const fetchCategoryMessages = async () => {
      try {
        dispatch(setLoading(true))
        const response = await api.get('/categoria-mensajes')
        
        // Transformar datos si es necesario (asumiendo que vienen con estructura correcta)
        const data = response.data || []
        dispatch(setCategoryMessages(data))
        dispatch(setLoading(false))
      } catch (error) {
        // Si es un 404, es normal que no haya datos, no es un error
        if (error.response?.status === 404) {
          dispatch(setCategoryMessages([]))
          dispatch(setLoading(false))
          return
        }

        // Solo mostrar error si no es un 404
        const errorMessage = error.response?.data?.message || error.message || t('charts.statsError')
        toast.error(t('charts.statsError'), {
          description: errorMessage,
          duration: 5000,
        })
        dispatch(setLoading(false))
      }
    }

    fetchCategoryMessages()
  }, [dispatch])

  // Transformar datos del formato del backend al formato del gráfico
  // Backend: { categoria: { nombre }, contador }
  // Gráfico: { nombre, consultas }
  const transformedData = categoryMessages.map(item => ({
    nombre: item.categoria?.nombre || '',
    consultas: item.contador || 0
  })).filter(item => item.nombre) // Filtrar items sin nombre

  // Ordenar datos por consultas de mayor a menor
  const sortedData = [...transformedData].sort((a, b) => b.consultas - a.consultas)

  return (
    <Card>
      <CardTitle icon={TrendingUp}>{t('charts.mostConsulted')}</CardTitle>
      <div className="mt-4">
        {loading ? (
          <div className="flex items-center justify-center h-[300px]">
            <Spinner className="h-8 w-8 text-primary" />
          </div>
        ) : sortedData.length === 0 ? (
          <div className="flex items-center justify-center h-[300px]">
            <p className="text-muted-foreground">{t('charts.noData')}</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={sortedData}
              layout="vertical"
              margin={{ top: 5, right: 5, left: 0, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis
                dataKey="nombre"
                type="category"
                width={80}
                tick={{ fontSize: 12 }}
              />
              <Tooltip />
              <Bar
                dataKey="consultas"
                fill="var(--primary)"
                radius={[0, 4, 4, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </Card>
  )
}


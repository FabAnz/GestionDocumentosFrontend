import React from 'react'
import { Card } from '../ui/card'
import { CardTitle } from '../atoms/CardTitle'
import { TrendingUp } from 'lucide-react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts'

// Datos ficticios para el gráfico
const datosFicticios = [
  { nombre: 'F. A. Q.', consultas: 15 },
  { nombre: 'Políticas', consultas: 12 },
  { nombre: 'Soporte Técnico', consultas: 8 },
  { nombre: 'Ventas', consultas: 6 },
  { nombre: 'Marketing', consultas: 4 }
].sort((a, b) => b.consultas - a.consultas) // Ordenar de mayor a menor

export const QueryChart = () => {
  return (
    <Card>
      <CardTitle icon={TrendingUp}>Temas Más Consultados</CardTitle>
      <div className="mt-4">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={datosFicticios}
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
      </div>
    </Card>
  )
}


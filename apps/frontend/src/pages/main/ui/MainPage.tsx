import { Truck, Clock, CheckCircle, XCircle, Package } from 'lucide-react'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { useShipmentStats } from '@/entities/shipment/hooks/useShipments'
import { useShipments } from '@/entities/shipment/hooks/useShipments'
import { ShipmentCard } from '@/pages/shipments/ui/ShipmentCard'
import { useRemoveShipment } from '@/entities/shipment/hooks/useShipments'

const statCards = (stats: {
  total: number
  pending: number
  inTransit: number
  delivered: number
  cancelled: number
}) => [
  {
    label: 'Всего перевозок',
    value: stats.total,
    icon: Package,
    className: 'text-blue-500',
  },
  {
    label: 'Новые',
    value: stats.pending,
    icon: Clock,
    className: 'text-yellow-500',
  },
  {
    label: 'В пути',
    value: stats.inTransit,
    icon: Truck,
    className: 'text-blue-500',
  },
  {
    label: 'Доставлены',
    value: stats.delivered,
    icon: CheckCircle,
    className: 'text-green-500',
  },
  {
    label: 'Отменены',
    value: stats.cancelled,
    icon: XCircle,
    className: 'text-red-500',
  },
]

const MainPage = () => {
  const { data: stats, isLoading: statsLoading } = useShipmentStats()
  const { data: shipments } = useShipments()
  const { mutate: remove } = useRemoveShipment()

  const recentShipments = shipments?.slice(0, 5) ?? []

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold">Дашборд</h1>

      {/* Карточки статистики */}
      {statsLoading ? (
        <div className="text-muted-foreground">Загрузка...</div>
      ) : (
        stats && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {statCards(stats).map(({ label, value, icon: Icon, className }) => (
              <div
                key={label}
                className="border rounded-xl p-4 flex flex-col gap-2 bg-card"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">{label}</span>
                  <Icon className={`size-4 ${className}`} />
                </div>
                <span className="text-2xl font-semibold">{value}</span>
              </div>
            ))}
          </div>
        )
      )}

      {/* График */}
      {stats && (
        <div className="border rounded-xl p-4 bg-card">
          <h2 className="text-sm font-medium mb-4">
            Перевозки за последние 7 дней
          </h2>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={stats.chartData}>
              <defs>
                <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 12 }}
                className="text-muted-foreground"
              />
              <YAxis
                allowDecimals={false}
                tick={{ fontSize: 12 }}
                className="text-muted-foreground"
              />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="count"
                stroke="#3b82f6"
                fill="url(#colorCount)"
                strokeWidth={2}
                name="Перевозки"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Последние перевозки */}
      <div className="flex flex-col gap-3">
        <h2 className="text-sm font-medium">Последние перевозки</h2>
        {recentShipments.length === 0 ? (
          <p className="text-muted-foreground text-sm">Нет перевозок</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recentShipments.map((shipment) => (
              <ShipmentCard
                key={shipment.id}
                shipment={shipment}
                onRemove={() => remove(shipment.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default MainPage

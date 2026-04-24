import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Plus, Search, LayoutGrid, List } from 'lucide-react'
import {
  useShipments,
  useRemoveShipment,
} from '@/entities/shipment/hooks/useShipments'
import { useShipmentsStore } from '@/entities/shipment/model/shipmentsStore'
import { ShipmentStatus } from '@/entities/shipment/api/shipmentsApi'
import { ShipmentCard } from './ShipmentCard'
import { CreateShipmentModal } from './CreateShipmentModal'
import { KanbanBoard } from './KanbanBoard'

const statusLabels: Record<ShipmentStatus, string> = {
  [ShipmentStatus.PENDING]: 'Новые',
  [ShipmentStatus.IN_TRANSIT]: 'В пути',
  [ShipmentStatus.DELIVERED]: 'Доставлены',
  [ShipmentStatus.CANCELLED]: 'Отменены',
}

type ViewMode = 'list' | 'kanban'

const ShipmentsPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [viewMode, setViewMode] = useState<ViewMode>('list')
  const { data, isLoading } = useShipments()
  const { mutate: remove } = useRemoveShipment()
  const { search, status, setSearch, setStatus } = useShipmentsStore()

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Перевозки</h1>
        <div className="flex items-center gap-2">
          <div className="flex border rounded-lg overflow-hidden">
            <Button
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="icon"
              className="rounded-none"
              onClick={() => setViewMode('list')}
            >
              <List className="size-4" />
            </Button>
            <Button
              variant={viewMode === 'kanban' ? 'default' : 'ghost'}
              size="icon"
              className="rounded-none"
              onClick={() => setViewMode('kanban')}
            >
              <LayoutGrid className="size-4" />
            </Button>
          </div>
          <Button onClick={() => setIsModalOpen(true)}>
            <Plus className="size-4 mr-2" />
            Создать
          </Button>
        </div>
      </div>

      <div className="flex gap-3 flex-wrap">
        <div className="relative flex-1 min-w-60">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            placeholder="Поиск по названию или адресу..."
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {viewMode === 'list' && (
          <div className="flex gap-2 flex-wrap">
            <Button
              variant={status === null ? 'default' : 'outline'}
              size="sm"
              onClick={() => setStatus(null)}
            >
              Все
            </Button>
            {Object.entries(statusLabels).map(([key, label]) => (
              <Button
                key={key}
                variant={status === key ? 'default' : 'outline'}
                size="sm"
                onClick={() => setStatus(key)}
              >
                {label}
              </Button>
            ))}
          </div>
        )}
      </div>

      {isLoading ? (
        <div className="text-muted-foreground">Загрузка...</div>
      ) : !data?.length ? (
        <div className="text-muted-foreground">Перевозок нет</div>
      ) : viewMode === 'list' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.map((shipment) => (
            <ShipmentCard
              key={shipment.id}
              shipment={shipment}
              onRemove={() => remove(shipment.id)}
            />
          ))}
        </div>
      ) : (
        <KanbanBoard shipments={data} />
      )}

      <CreateShipmentModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  )
}

export default ShipmentsPage

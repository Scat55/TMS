import { useDroppable } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import type { Shipment } from '@/entities/shipment/api/shipmentsApi'
import { ShipmentStatus } from '@/entities/shipment/api/shipmentsApi'
import { cn } from '@/lib/utils'
import { ShipmentCard } from './ShipmentCard'

const columnColors: Record<ShipmentStatus, string> = {
  [ShipmentStatus.PENDING]: 'border-t-yellow-400',
  [ShipmentStatus.IN_TRANSIT]: 'border-t-blue-400',
  [ShipmentStatus.DELIVERED]: 'border-t-green-400',
  [ShipmentStatus.CANCELLED]: 'border-t-red-400',
}

interface KanbanColumnProps {
  status: ShipmentStatus
  label: string
  shipments: Shipment[]
  onRemove: (id: number) => void
}

export const KanbanColumn = ({
  status,
  label,
  shipments,
  onRemove,
}: KanbanColumnProps) => {
  const { setNodeRef, isOver } = useDroppable({ id: status })

  return (
    <div
      ref={setNodeRef}
      className={cn(
        'flex flex-col gap-3 rounded-xl border border-t-4 p-4 min-h-96 transition-colors',
        columnColors[status],
        isOver && 'bg-muted'
      )}
    >
      <div className="flex items-center justify-between">
        <h3 className="font-medium text-sm">{label}</h3>
        <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
          {shipments.length}
        </span>
      </div>

      <SortableContext
        items={shipments.map((s) => s.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="flex flex-col gap-2">
          {shipments.map((shipment) => (
            <ShipmentCard
              key={shipment.id}
              shipment={shipment}
              onRemove={() => onRemove(shipment.id)}
              draggable
            />
          ))}
        </div>
      </SortableContext>

      {shipments.length === 0 && (
        <div className="flex-1 flex items-center justify-center">
          <p className="text-xs text-muted-foreground">Нет перевозок</p>
        </div>
      )}
    </div>
  )
}

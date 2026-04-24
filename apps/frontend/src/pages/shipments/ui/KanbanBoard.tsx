import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from '@dnd-kit/core'
import { useState } from 'react'
import type { Shipment } from '@/entities/shipment/types/'
import { ShipmentStatus } from '@/entities/shipment/types/'
import { useUpdateShipmentStatus } from '@/entities/shipment/hooks/useShipments'
import { KanbanColumn } from './KanbanColumn'
import { ShipmentCard } from './ShipmentCard'
import { useRemoveShipment } from '@/entities/shipment/hooks/useShipments'

const statusLabels: Record<ShipmentStatus, string> = {
  [ShipmentStatus.PENDING]: 'Новые',
  [ShipmentStatus.IN_TRANSIT]: 'В пути',
  [ShipmentStatus.DELIVERED]: 'Доставлены',
  [ShipmentStatus.CANCELLED]: 'Отменены',
}

interface KanbanBoardProps {
  shipments: Shipment[]
}

export const KanbanBoard = ({ shipments }: KanbanBoardProps) => {
  const [activeShipment, setActiveShipment] = useState<Shipment | null>(null)
  const { mutate: updateStatus } = useUpdateShipmentStatus()
  const { mutate: remove } = useRemoveShipment()

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    })
  )

  const handleDragStart = (event: DragStartEvent) => {
    const shipment = shipments.find((s) => s.id === event.active.id)
    if (shipment) setActiveShipment(shipment)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    setActiveShipment(null)

    if (!over) return

    const shipment = shipments.find((s) => s.id === active.id)
    if (!shipment) return

    const newStatus = over.id as ShipmentStatus
    if (shipment.status === newStatus) return

    updateStatus({ id: shipment.id, status: newStatus })
  }

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 overflow-x-auto">
        {Object.values(ShipmentStatus).map((status) => (
          <KanbanColumn
            key={status}
            status={status}
            label={statusLabels[status]}
            shipments={shipments.filter((s) => s.status === status)}
            onRemove={(id) => remove(id)}
          />
        ))}
      </div>

      <DragOverlay>
        {activeShipment && (
          <ShipmentCard shipment={activeShipment} onRemove={() => {}} />
        )}
      </DragOverlay>
    </DndContext>
  )
}

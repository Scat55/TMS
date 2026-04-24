import { Trash2, MapPin, Weight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { Shipment } from '@/entities/shipment/api/shipmentsApi'
import { ShipmentStatus } from '@/entities/shipment/api/shipmentsApi'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

const statusConfig: Record<
  ShipmentStatus,
  { label: string; className: string }
> = {
  [ShipmentStatus.PENDING]: {
    label: 'Новая',
    className:
      'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  },
  [ShipmentStatus.IN_TRANSIT]: {
    label: 'В пути',
    className: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  },
  [ShipmentStatus.DELIVERED]: {
    label: 'Доставлена',
    className:
      'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  },
  [ShipmentStatus.CANCELLED]: {
    label: 'Отменена',
    className: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
  },
}

interface ShipmentCardProps {
  shipment: Shipment
  onRemove: () => void
  draggable?: boolean
}

export const ShipmentCard = ({
  shipment,
  onRemove,
  draggable,
}: ShipmentCardProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: shipment.id })

  const style = draggable
    ? {
        transform: CSS.Transform.toString(transform),
        transition,
      }
    : {}

  const { label, className } = statusConfig[shipment.status]

  return (
    <div
      ref={draggable ? setNodeRef : undefined}
      style={style}
      {...(draggable ? attributes : {})}
      {...(draggable ? listeners : {})}
      className={cn(
        'border rounded-xl p-4 flex flex-col gap-3 bg-card',
        isDragging && 'opacity-50 cursor-grabbing',
        draggable && 'cursor-grab'
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-medium leading-tight">{shipment.title}</h3>
        <span
          className={cn('text-xs px-2 py-1 rounded-full shrink-0', className)}
        >
          {label}
        </span>
      </div>

      {shipment.description && (
        <p className="text-sm text-muted-foreground">{shipment.description}</p>
      )}

      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin className="size-3.5 shrink-0" />
          <span>{shipment.address}</span>
        </div>

        {shipment.weight && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Weight className="size-3.5 shrink-0" />
            <span>{shipment.weight} кг</span>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between mt-auto pt-2 border-t">
        <span className="text-xs text-muted-foreground">
          {new Date(shipment.createdAt).toLocaleDateString('ru-RU')}
        </span>
        <Button
          variant="ghost"
          size="icon"
          className="size-7 text-muted-foreground hover:text-destructive"
          onClick={onRemove}
        >
          <Trash2 className="size-3.5" />
        </Button>
      </div>
    </div>
  )
}

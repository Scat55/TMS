import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useUpdateShipment } from '@/entities/shipment/hooks/useShipments'
import { getErrorMessage } from '@/shared/lib/getErrorMessage'
import { YandexMap } from '@/shared/ui/YandexMap'
import type { Shipment } from '@/entities/shipment/types'

const editShipmentSchema = z.object({
  title: z.string().min(2, 'Минимум 2 символа'),
  description: z.string().optional(),
  address: z.string().min(2, 'Минимум 2 символа'),
  weight: z.number().optional(),
})

type EditShipmentFormData = z.infer<typeof editShipmentSchema>

interface EditShipmentModalProps {
  shipment: Shipment
  open: boolean
  onClose: () => void
}

export const EditShipmentModal = ({
  shipment,
  open,
  onClose,
}: EditShipmentModalProps) => {
  const { mutate: update, isPending, isError, error } = useUpdateShipment()

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<EditShipmentFormData>({
    resolver: zodResolver(editShipmentSchema),
    defaultValues: {
      title: shipment.title,
      description: shipment.description,
      address: shipment.address,
      weight: shipment.weight,
    },
  })

  const address = watch('address')

  const handleAddressSelect = (selectedAddress: string) => {
    setValue('address', selectedAddress)
  }

  const onSubmit = (data: EditShipmentFormData) => {
    update(
      { id: shipment.id, data },
      {
        onSuccess: () => {
          onClose()
        },
      }
    )
  }

  const handleClose = () => {
    reset()
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Редактировать перевозку</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="edit-title">Название</Label>
            <Input id="edit-title" {...register('title')} />
            {errors.title && (
              <p className="text-destructive text-sm">{errors.title.message}</p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="edit-description">Описание</Label>
            <Input id="edit-description" {...register('description')} />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="edit-address">Адрес доставки</Label>
            <Input id="edit-address" {...register('address')} />
            {errors.address && (
              <p className="text-destructive text-sm">
                {errors.address.message}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <Label>Выберите адрес на карте</Label>
            <YandexMap
              address={address}
              onAddressSelect={handleAddressSelect}
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="edit-weight">Вес (кг)</Label>
            <Input
              id="edit-weight"
              type="number"
              {...register('weight', { valueAsNumber: true })}
            />
          </div>

          {isError && (
            <p className="text-destructive text-sm text-center">
              {getErrorMessage(error)}
            </p>
          )}

          <div className="flex gap-2 justify-end">
            <Button type="button" variant="outline" onClick={handleClose}>
              Отмена
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? 'Сохранение...' : 'Сохранить'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

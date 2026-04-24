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
import { useCreateShipment } from '@/entities/shipment/hooks/useShipments'
import { getErrorMessage } from '@/shared/lib/getErrorMessage'

const createShipmentSchema = z.object({
  title: z.string().min(2, 'Минимум 2 символа'),
  description: z.string().optional(),
  address: z.string().min(2, 'Минимум 2 символа'),
  weight: z.number().optional(),
})

type CreateShipmentFormData = z.infer<typeof createShipmentSchema>

interface CreateShipmentModalProps {
  open: boolean
  onClose: () => void
}

export const CreateShipmentModal = ({ open, onClose }: CreateShipmentModalProps) => {
  const { mutate: create, isPending, isError, error } = useCreateShipment()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<CreateShipmentFormData>({
    resolver: zodResolver(createShipmentSchema)
  })

  const onSubmit = (data: CreateShipmentFormData) => {
    create(data, {
      onSuccess: () => {
        reset()
        onClose()
      }
    })
  }

  const handleClose = () => {
    reset()
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Новая перевозка</DialogTitle>
  </DialogHeader>

  <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
  <div className="flex flex-col gap-2">
  <Label htmlFor="title">Название</Label>
    <Input
  id="title"
  placeholder="Перевозка груза"
  {...register('title')}
  />
  {errors.title && (
    <p className="text-destructive text-sm">{errors.title.message}</p>
  )}
  </div>

  <div className="flex flex-col gap-2">
  <Label htmlFor="description">Описание</Label>
    <Input
  id="description"
  placeholder="Описание груза"
  {...register('description')}
  />
  </div>

  <div className="flex flex-col gap-2">
  <Label htmlFor="address">Адрес доставки</Label>
  <Input
  id="address"
  placeholder="Москва, ул. Ленина 1"
  {...register('address')}
  />
  {errors.address && (
    <p className="text-destructive text-sm">{errors.address.message}</p>
  )}
  </div>

  <div className="flex flex-col gap-2">
  <Label htmlFor="weight">Вес (кг)</Label>
    <Input
  id="weight"
  type="number"
  placeholder="100"
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
    {isPending ? 'Создание...' : 'Создать'}
    </Button>
    </div>
    </form>
    </DialogContent>
    </Dialog>
)
}

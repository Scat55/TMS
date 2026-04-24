import { api } from '@/shared/api/instance'
import {
  type Shipment,
  type ShipmentStats,
  ShipmentStatus,
} from '@/entities/shipment/types'

export interface CreateShipmentDto {
  title: string
  description?: string
  address: string
  weight?: number
}

export const shipmentsApi = {
  getAll: (params?: { search?: string; status?: string }) =>
    api.get<Shipment[]>('/shipments', { params }).then((res) => res.data),

  getById: (id: number) =>
    api.get<Shipment>(`/shipments/${id}`).then((res) => res.data),

  create: (data: CreateShipmentDto) =>
    api.post<Shipment>('/shipments', data).then((res) => res.data),

  updateStatus: (id: number, status: ShipmentStatus) =>
    api
      .patch<Shipment>(`/shipments/${id}/status`, { status })
      .then((res) => res.data),

  remove: (id: number) => api.delete(`/shipments/${id}`),

  getStats: () =>
    api.get<ShipmentStats>('/shipments/stats').then((res) => res.data),
}

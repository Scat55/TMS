import { api } from '@/shared/api/instance'

export enum ShipmentStatus {
  PENDING = 'PENDING',
  IN_TRANSIT = 'IN_TRANSIT',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED',
}

export interface Shipment {
  id: number
  title: string
  description?: string
  address: string
  weight?: number
  status: ShipmentStatus
  createdAt: string
  updatedAt: string
  userId: number
}

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
}

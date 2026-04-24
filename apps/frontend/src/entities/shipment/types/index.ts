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

export interface ShipmentStats {
  total: number
  pending: number
  inTransit: number
  delivered: number
  cancelled: number
  chartData: { date: string; count: number }[]
}

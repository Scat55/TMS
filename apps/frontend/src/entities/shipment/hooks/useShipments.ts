import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { shipmentsApi } from '@/entities/shipment/api/shipmentsApi'
import type { CreateShipmentDto } from '@/entities/shipment/api/shipmentsApi'
import { useShipmentsStore } from '../model/shipmentsStore'
import { useDebounce } from '@/shared/hooks/useDebounce'

import { ShipmentStatus } from '@/entities/shipment/types/'

export const shipmentsKeys = {
  all: ['shipments'] as const,
  filtered: (params: object) => ['shipments', params] as const,
  detail: (id: number) => ['shipments', id] as const,
}

export const useShipments = () => {
  const search = useShipmentsStore((state) => state.search)
  const status = useShipmentsStore((state) => state.status)
  const debouncedSearch = useDebounce(search, 500)

  const params = {
    search: debouncedSearch,
    status: status ?? undefined,
  }

  return useQuery({
    queryKey: shipmentsKeys.filtered(params),
    queryFn: () => shipmentsApi.getAll(params),
  })
}

export const useShipment = (id: number) => {
  return useQuery({
    queryKey: shipmentsKeys.detail(id),
    queryFn: () => shipmentsApi.getById(id),
    enabled: !!id,
  })
}

export const useCreateShipment = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateShipmentDto) => shipmentsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: shipmentsKeys.all })
    },
  })
}

export const useUpdateShipmentStatus = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, status }: { id: number; status: ShipmentStatus }) =>
      shipmentsApi.updateStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: shipmentsKeys.all })
    },
  })
}

export const useRemoveShipment = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => shipmentsApi.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: shipmentsKeys.all })
    },
  })
}

export const useShipmentStats = () => {
  return useQuery({
    queryKey: ['shipments', 'stats'],
    queryFn: () => shipmentsApi.getStats(),
  })
}

export const useUpdateShipment = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number
      data: Partial<CreateShipmentDto>
    }) => shipmentsApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: shipmentsKeys.all })
    },
  })
}

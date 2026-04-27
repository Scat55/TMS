import { useEffect, useRef, useState } from 'react'
import { loadYandexMaps } from '@/shared/lib/loadYandexMaps'
import { useDebounce } from '@/shared/hooks/useDebounce.ts'

interface YandexMapProps {
  address?: string
  onAddressSelect?: (address: string, coords: [number, number]) => void
  readonly?: boolean
}

export const YandexMap = ({
  address,
  onAddressSelect,
  readonly = false,
}: YandexMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<any>(null)
  const markerRef = useRef<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  const debouncedAddress = useDebounce(address, 800)

  useEffect(() => {
    let destroyed = false

    const init = async () => {
      try {
        await loadYandexMaps()
        await window.ymaps3.ready

        if (destroyed || !mapRef.current) return

        const {
          YMap,
          YMapDefaultSchemeLayer,
          YMapDefaultFeaturesLayer,
          YMapMarker,
          YMapListener,
        } = window.ymaps3

        // Начальные координаты — Москва
        let center: [number, number] = [37.617617, 55.755864]

        // Если есть адрес — геокодируем через HTTP геокодер
        if (address) {
          try {
            const response = await fetch(
              `https://geocode-maps.yandex.ru/1.x/?apikey=${import.meta.env.VITE_YANDEX_MAPS_API_KEY}&geocode=${encodeURIComponent(address)}&format=json`
            )
            const data = await response.json()
            const point =
              data.response.GeoObjectCollection.featureMember[0]?.GeoObject
                ?.Point?.pos

            if (point) {
              const [lon, lat] = point.split(' ').map(Number)
              center = [lon, lat]
            }
          } catch {}
        }

        const map = new YMap(mapRef.current, {
          location: { center, zoom: 12 },
        })

        map.addChild(new YMapDefaultSchemeLayer())
        map.addChild(new YMapDefaultFeaturesLayer())

        mapInstanceRef.current = map

        // Добавляем маркер если есть адрес
        if (address) {
          const markerElement = document.createElement('div')
          markerElement.innerHTML = '📍'
          markerElement.style.fontSize = '24px'

          const marker = new YMapMarker({ coordinates: center }, markerElement)
          map.addChild(marker)
          markerRef.current = marker
        }

        // Клик по карте — только в режиме редактирования
        if (!readonly && onAddressSelect) {
          map.addChild(
            new YMapListener({
              onClick: async (object: any, event: any) => {
                const coords: [number, number] = event.coordinates

                try {
                  const response = await fetch(
                    `https://geocode-maps.yandex.ru/1.x/?apikey=${import.meta.env.VITE_YANDEX_MAPS_API_KEY}&geocode=${coords[0]},${coords[1]}&format=json`
                  )
                  const data = await response.json()
                  const foundAddress =
                    data.response.GeoObjectCollection.featureMember[0]
                      ?.GeoObject?.metaDataProperty?.GeocoderMetaData?.text ??
                    `${coords[1].toFixed(6)}, ${coords[0].toFixed(6)}`

                  if (markerRef.current) {
                    map.removeChild(markerRef.current)
                  }

                  const markerElement = document.createElement('div')
                  markerElement.innerHTML = '📍'
                  markerElement.style.fontSize = '24px'

                  const marker = new YMapMarker(
                    { coordinates: coords },
                    markerElement
                  )
                  map.addChild(marker)
                  markerRef.current = marker

                  onAddressSelect(foundAddress, coords)
                } catch (e) {
                  console.error(e)
                }
              },
            })
          )
        }

        setIsLoading(false)
      } catch (error) {
        console.error('Ошибка загрузки карты:', error)
        setIsLoading(false)
      }
    }

    init()

    return () => {
      destroyed = true
      if (mapInstanceRef.current) {
        mapInstanceRef.current.destroy?.()
      }
    }
  }, [])

  useEffect(() => {
    if (!mapInstanceRef.current || !address) return

    const { YMapMarker } = window.ymaps3

    const updateMarker = async () => {
      try {
        const response = await fetch(
          `https://geocode-maps.yandex.ru/1.x/?apikey=${import.meta.env.VITE_YANDEX_MAPS_API_KEY}&geocode=${encodeURIComponent(address)}&format=json`
        )
        const data = await response.json()
        const point =
          data.response.GeoObjectCollection.featureMember[0]?.GeoObject?.Point
            ?.pos

        if (!point) return

        const [lon, lat] = point.split(' ').map(Number)
        const coords: [number, number] = [lon, lat]

        // Обновляем маркер
        if (markerRef.current) {
          mapInstanceRef.current.removeChild(markerRef.current)
        }

        const markerElement = document.createElement('div')
        markerElement.innerHTML = '📍'
        markerElement.style.fontSize = '24px'

        const marker = new YMapMarker({ coordinates: coords }, markerElement)
        mapInstanceRef.current.addChild(marker)
        markerRef.current = marker

        // Центрируем карту
        mapInstanceRef.current.setLocation({ center: coords, zoom: 12 })
      } catch (e) {
        console.error(e)
      }
    }

    updateMarker()
  }, [debouncedAddress])

  return (
    <div className="relative w-full h-64 rounded-lg overflow-hidden border">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted">
          <span className="text-sm text-muted-foreground">
            Загрузка карты...
          </span>
        </div>
      )}
      <div ref={mapRef} className="w-full h-full" />
    </div>
  )
}

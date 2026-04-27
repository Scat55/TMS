export const loadYandexMaps = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (window.ymaps3) {
      resolve()
      return
    }

    const script = document.createElement('script')
    script.src = `https://api-maps.yandex.ru/v3/?apikey=${import.meta.env.VITE_YANDEX_MAPS_API_KEY}&lang=ru_RU`
    script.onload = () => resolve()
    script.onerror = () => reject(new Error('Яндекс карты не загрузились'))
    document.head.appendChild(script)
  })
}

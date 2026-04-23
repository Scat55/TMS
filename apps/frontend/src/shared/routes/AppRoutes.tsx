import { Suspense } from 'react'
import { useRoutes } from 'react-router-dom'
import { routeConfig } from '@/shared/routes/routerConfig.tsx'

const AppRoutes = () => {
  return (
    <Suspense fallback={<div>...Loading</div>}>
      {useRoutes(routeConfig)}
    </Suspense>
  )
}

export default AppRoutes

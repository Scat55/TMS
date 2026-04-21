import { Suspense } from 'react'
import { Route, Routes } from 'react-router-dom'
import { routeConfig } from '@/app/routes/routerConfig.tsx'

const AppRoutes = () => {
  return (
    <Suspense fallback={<div>...Loading</div>}>
      <Routes>
        {Object.values(routeConfig).map(({ element, path }) => (
          <Route element={element} path={path} key={path} />
        ))}
      </Routes>
    </Suspense>
  )
}

export default AppRoutes

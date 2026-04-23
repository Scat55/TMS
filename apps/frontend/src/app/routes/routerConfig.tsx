import type { RouteProps } from 'react-router-dom'
import { lazy } from 'react'
import { PrivateRoute } from '@/shared/ui/PrivateRoute.tsx'

const MainPage = lazy(() => import('@/pages/main'))
const AuthPage = lazy(() => import('@/pages/auth'))

export enum RouterConfig {
  MAIN = 'main',
  AUTH = 'auth',
}

export const RoutePath: Record<RouterConfig, string> = {
  [RouterConfig.MAIN]: '/',
  [RouterConfig.AUTH]: '/auth',
}

export const routeConfig: Record<RouterConfig, RouteProps> = {
  [RouterConfig.MAIN]: {
    path: RoutePath[RouterConfig.MAIN],
    element: (
      <PrivateRoute>
        <MainPage />
      </PrivateRoute>
    ),
  },
  [RouterConfig.AUTH]: {
    path: RoutePath[RouterConfig.AUTH],
    element: <AuthPage />,
  },
}

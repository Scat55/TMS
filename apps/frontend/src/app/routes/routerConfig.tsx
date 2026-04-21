import type { RouteProps } from 'react-router-dom'
import { MainPage } from '@/pages/main'

export enum RouterConfig {
  MAIN = 'main',
}

export const RoutePath: Record<RouterConfig, string> = {
  [RouterConfig.MAIN]: '/',
}

export const routeConfig: Record<RouterConfig, RouteProps> = {
  [RouterConfig.MAIN]: {
    path: RoutePath.main,
    element: <MainPage />,
  },
}

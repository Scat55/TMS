import { lazy } from 'react'
import type { RouteObject } from 'react-router-dom'
import { PrivateRoute } from '@/shared/ui/PrivateRoute.tsx'
import { PublicRoute } from '@/shared/ui/PublicRoute.tsx'
import { Layout } from '@/widgets/layout/ui/Layout.tsx'

const MainPage = lazy(() => import('@/pages/main'))
const AuthPage = lazy(() => import('@/pages/auth'))
const ShipmentsPage = lazy(() => import('@/pages/shipments'))

export const routeConfig: RouteObject[] = [
  {
    path: '/',
    element: (
      <PrivateRoute>
        <Layout />
      </PrivateRoute>
    ),
    children: [
      {
        index: true,
        element: <MainPage />,
      },
      {
        path: 'shipments',
        element: <ShipmentsPage />,
      },
    ],
  },
  {
    path: '/auth',
    element: (
      <PublicRoute>
        <AuthPage />
      </PublicRoute>
    ),
  },
]

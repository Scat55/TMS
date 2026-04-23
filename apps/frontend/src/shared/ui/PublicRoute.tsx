import { Navigate } from 'react-router-dom'
import { RoutePath, RouterConfig } from '@/shared/routes/routePaths'
import { useAuthStore } from '@/entities/user/model/authStore'

export const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuth = useAuthStore((state) => state.isAuth)
  return isAuth ? (
    <Navigate to={RoutePath[RouterConfig.MAIN]} replace />
  ) : (
    children
  )
}

import { Navigate } from 'react-router-dom'
import { RoutePath, RouterConfig } from '@/app/routes/routerConfig'
import { useAuthStore } from '@/entities/user/model/authStore'

export const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuth = useAuthStore((state) => state.isAuth)
  return isAuth ? (
    children
  ) : (
    <Navigate to={RoutePath[RouterConfig.AUTH]} replace />
  )
}

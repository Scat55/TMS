import { useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { authApi } from '@/entities/user/api/authApi.ts'
import { RoutePath, RouterConfig } from '@/shared/routes/routePaths'
import { useAuthStore } from '@/entities/user/model/authStore.ts'

export const useRegister = () => {
  const navigate = useNavigate()
  const setIsAuth = useAuthStore((state) => state.setIsAuth)

  return useMutation({
    mutationFn: authApi.register,
    onSuccess: () => {
      setIsAuth(true)
      navigate(RoutePath[RouterConfig.MAIN])
    },
  })
}

export const useLogin = () => {
  const navigate = useNavigate()
  const setIsAuth = useAuthStore((state) => state.setIsAuth)

  return useMutation({
    mutationFn: authApi.login,
    onSuccess: () => {
      setIsAuth(true)
      navigate(RoutePath[RouterConfig.MAIN])
    },
  })
}

export const useLogout = () => {
  const navigate = useNavigate()
  const setIsAuth = useAuthStore((state) => state.setIsAuth)

  return useMutation({
    mutationFn: authApi.logout,
    onSuccess: () => {
      setIsAuth(false)
      navigate(RoutePath[RouterConfig.AUTH])
    },
  })
}

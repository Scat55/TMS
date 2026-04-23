import { api } from '@/shared/api/instance.ts'

interface RegisterDto {
  email: string
  password: string
  name: string
}

interface LoginDto {
  email: string
  password: string
}

export const authApi = {
  register: (data: RegisterDto) => api.post('auth/register', data),
  login: (data: LoginDto) => api.post('auth/login', data),
  logout: () => api.post('auth/logout'),
  refresh: () => api.post('auth/refresh'),
}

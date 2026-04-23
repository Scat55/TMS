export type Theme = 'light' | 'dark'

export const getTheme = (): Theme => {
  return (localStorage.getItem('theme') as Theme) ?? 'light'
}

export const setTheme = (theme: Theme) => {
  localStorage.setItem('theme', theme)
  document.documentElement.classList.toggle('dark', theme === 'dark')
}

export const initTheme = () => {
  const theme = getTheme()
  document.documentElement.classList.toggle('dark', theme === 'dark')
}

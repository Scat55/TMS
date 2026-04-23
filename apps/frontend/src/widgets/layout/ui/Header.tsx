import { Moon, Sun, LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useThemeStore } from '@/shared/model/themeStore'
import { useLogout } from '@/entities/user/hooks/useAuth'

export const Header = () => {
  const { theme, toggleTheme } = useThemeStore()
  const { mutate: logout } = useLogout()

  return (
    <header className="h-14 border-b flex items-center justify-between px-6 shrink-0">
      <div className="text-sm text-muted-foreground">
        TMS — система управления перевозками
      </div>

      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={toggleTheme}>
          {theme === 'light' ? (
            <Moon className="size-4" />
          ) : (
            <Sun className="size-4" />
          )}
        </Button>

        <Button variant="ghost" size="icon" onClick={() => logout()}>
          <LogOut className="size-4" />
        </Button>
      </div>
    </header>
  )
}

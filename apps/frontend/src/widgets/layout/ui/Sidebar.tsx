import { NavLink } from 'react-router-dom'
import { Truck, LayoutDashboard } from 'lucide-react'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'
import { RoutePath, RouterConfig } from '@/shared/routes/routePaths'
import { useIsMobile } from '@/hooks/use-mobile'

const navItems = [
  {
    label: 'Главная',
    icon: LayoutDashboard,
    path: RoutePath[RouterConfig.MAIN],
  },
  {
    label: 'Перевозки',
    icon: Truck,
    path: '/shipments',
  },
]

export const Sidebar = () => {
  const isMobile = useIsMobile()

  if (isMobile) {
    return (
      <nav className="fixed bottom-0 left-0 right-0 h-14 border-t bg-background flex items-center justify-around px-4 z-50">
        {navItems.map(({ label, icon: Icon, path }) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) =>
              cn(
                'flex flex-col items-center gap-1 text-xs transition-colors',
                isActive
                  ? 'text-primary'
                  : 'text-muted-foreground hover:text-foreground'
              )
            }
          >
            <Icon className="size-5" />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>
    )
  }

  return (
    <aside className="w-14 border-r flex flex-col items-center py-4 gap-2 shrink-0">
      {navItems.map(({ label, icon: Icon, path }) => (
        <Tooltip key={path}>
          <TooltipTrigger asChild>
            <NavLink
              to={path}
              className={({ isActive }) =>
                cn(
                  'flex items-center justify-center w-9 h-9 rounded-lg transition-colors',
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                )
              }
            >
              <Icon className="size-4 shrink-0 mx-auto" />
            </NavLink>
          </TooltipTrigger>
          <TooltipContent side="right">{label}</TooltipContent>
        </Tooltip>
      ))}
    </aside>
  )
}

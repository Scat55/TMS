import { NavLink } from 'react-router-dom'
import { Truck, LayoutDashboard } from 'lucide-react'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'
import { RoutePath, RouterConfig } from '@/shared/routes/routePaths'

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
              <Icon className="size-4" />
            </NavLink>
          </TooltipTrigger>
          <TooltipContent side="right">{label}</TooltipContent>
        </Tooltip>
      ))}
    </aside>
  )
}

import { Outlet } from 'react-router-dom'
import { Header } from './Header'
import { Sidebar } from './Sidebar'
import { useIsMobile } from '@/hooks/use-mobile'
import { cn } from '@/lib/utils.ts'

export const Layout = () => {
  const isMobile = useIsMobile()

  return (
    <div className="flex h-screen bg-background">
      {!isMobile && <Sidebar />}
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header />
        <main className={cn('flex-1 overflow-auto p-6', isMobile && 'pb-20')}>
          <Outlet />
        </main>
      </div>
      {isMobile && <Sidebar />}
    </div>
  )
}

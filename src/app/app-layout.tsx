import type { ReactNode } from 'react'
import { AppHeader } from '@/features/navigation/app-header'
import { AppSidebar } from '@/features/navigation/app-sidebar'

interface AppLayoutProps {
  children: ReactNode
}

/**
 * The shell every route renders inside: sidebar, header, then the route content.
 *
 * The sidebar is hidden below the medium breakpoint rather than squeezed. At
 * 232px fixed it would leave a phone under 140px for the board, which is not a
 * usable board — and the same two destinations are one tap away from the header
 * on those sizes once navigation lands there.
 */
export function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="min-h-dvh p-4 md:p-8">
      <div className="mx-auto flex max-w-[1440px] gap-8">
        <div className="hidden md:block">
          <AppSidebar />
        </div>

        <div className="flex min-w-0 flex-1 flex-col gap-8">
          <AppHeader />
          {children}
        </div>
      </div>
    </div>
  )
}

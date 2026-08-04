import type { ReactNode } from 'react'
import { AppHeader } from '@/features/navigation/app-header'
import { AppSidebar } from '@/features/navigation/app-sidebar'

interface AppLayoutProps {
  children: ReactNode
}

/**
 * The shell every route renders inside: navigation, header, then the route content.
 *
 * The navigation stacks above the content below the medium breakpoint and sits
 * beside it from there up — rather than being squeezed, which at 232px fixed would
 * leave a phone under 140px for the board, or hidden, which would leave a phone
 * with no way to reach the settings route at all.
 */
export function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="min-h-dvh p-4 md:p-8">
      <div className="mx-auto flex max-w-[1440px] flex-col gap-4 md:flex-row md:gap-8">
        <AppSidebar />

        <div className="flex min-w-0 flex-1 flex-col gap-4 md:gap-8">
          <AppHeader />
          {children}
        </div>
      </div>
    </div>
  )
}

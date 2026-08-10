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
 *
 * **There is deliberately no width cap here, and the obvious `mx-auto max-w-[1440px]`
 * is what was removed.** The design is drawn at 1440px, so capping at 1440px reads as
 * faithfulness to it. It is not: at 1440px the cap is already slack — the page gutter
 * leaves 1376px of content — so the cap never shapes the design width. It only takes
 * effect on screens the mockup says nothing about, and there it does harm.
 *
 * What it did: everything centred together, sidebar included, so at 1920px the sidebar
 * sat 240px from the left edge with dead margin either side while the board — the one
 * thing on the page with more to show than fits — was starved to 1176px. And 1176px was
 * the answer at 1600, 1920, 2200 *and* 2600, because the cap bound long before the
 * viewport did: three of the five columns visible at every one of them, `Done` and
 * `Cancelled` cut at all of them, and a 1024px window showing all five where a 2600px
 * one showed three. Widening the window could not help.
 *
 * Uncapped, the freed width goes to the board: 1592px at 1920 and 1872px at 2200, which
 * is the whole 1868px board with no horizontal scroll left at all. Below ~1504px nothing
 * moves, because that is where the cap stopped binding — so every width the design
 * actually specifies renders exactly as before.
 *
 * **The full-width header was looked at and kept, so do not cap it "for readability".**
 * That is the obvious objection — a 2560px line of text is genuinely bad — and it does
 * not apply, because nothing here is a line of text. The header holds a search *control*
 * and two icon buttons, and the filter bar is a row of left-aligned pills; neither has a
 * measure to run long. Reviewed at 2560px against a production build and approved as it
 * renders. A `max-w` added back to the header would undo that on a theory the layout
 * does not contain.
 */
export function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="min-h-dvh p-4 md:p-8">
      <div className="flex flex-col gap-4 md:flex-row md:gap-8">
        <AppSidebar />

        <div className="flex min-w-0 flex-1 flex-col gap-4 md:gap-8">
          <AppHeader />
          {children}
        </div>
      </div>
    </div>
  )
}

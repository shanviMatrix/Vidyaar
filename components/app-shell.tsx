'use client'

import {
  BarChart3,
  BookOpen,
  ClipboardList,
  LayoutDashboard,
  Menu,
  Settings,
  Sparkles,
  Timer,
  X,
} from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { ModeToggle } from '@/components/mode-toggle'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'

const nav = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/subjects', label: 'Subjects', icon: BookOpen },
  { href: '/assignments', label: 'Assignments', icon: ClipboardList },
  { href: '/study', label: 'Study session', icon: Timer },
  { href: '/analytics', label: 'Analytics', icon: BarChart3 },
  { href: '/planner', label: 'AI planner', icon: Sparkles },
]

function Wordmark() {
  return (
    <Link href="/dashboard" className="flex items-center gap-2.5">
      <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
        <svg viewBox="0 0 24 24" className="size-4.5" fill="none" aria-hidden="true">
          <path d="M4 6.5C4 5.67 4.67 5 5.5 5H11a2 2 0 0 1 2 2v11a1.5 1.5 0 0 0-1.5-1.5h-6A1.5 1.5 0 0 1 4 15V6.5Z" fill="currentColor" opacity="0.55" />
          <path d="M20 6.5C20 5.67 19.33 5 18.5 5H13a2 2 0 0 0-2 2v11a1.5 1.5 0 0 1 1.5-1.5h6A1.5 1.5 0 0 0 20 15V6.5Z" fill="currentColor" />
        </svg>
      </span>
      <span className="text-[0.95rem] font-semibold tracking-tight">Vidyaar</span>
    </Link>
  )
}

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname()
  return (
    <nav className="flex flex-col gap-0.5">
      {nav.map((item) => {
        const active = pathname === item.href || pathname.startsWith(item.href + '/')
        const Icon = item.icon
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            aria-current={active ? 'page' : undefined}
            className={cn(
              'group flex items-center gap-3 rounded-lg px-2.5 py-2 text-sm font-medium transition-colors',
              active
                ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                : 'text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground',
            )}
          >
            <Icon
              className={cn(
                'size-4.5 shrink-0 transition-colors',
                active ? 'text-primary' : 'text-sidebar-foreground/50 group-hover:text-sidebar-foreground/80',
              )}
            />
            {item.label}
          </Link>
        )
      })}
    </nav>
  )
}

function SidebarBody({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname()
  const settingsActive = pathname.startsWith('/settings')
  return (
    <div className="flex h-full flex-col gap-6 p-4">
      <div className="px-1.5 pt-1.5">
        <Wordmark />
      </div>

      <div className="flex-1">
        <p className="px-2.5 pb-2 text-[0.7rem] font-medium uppercase tracking-wider text-sidebar-foreground/45">
          Workspace
        </p>
        <NavLinks onNavigate={onNavigate} />
      </div>

      <div className="flex flex-col gap-1">
        <Link
          href="/settings"
          onClick={onNavigate}
          className={cn(
            'flex items-center gap-3 rounded-lg px-2.5 py-2 text-sm font-medium transition-colors',
            settingsActive
              ? 'bg-sidebar-accent text-sidebar-accent-foreground'
              : 'text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground',
          )}
        >
          <Settings className={cn('size-4.5', settingsActive ? 'text-primary' : 'text-sidebar-foreground/50')} />
          Settings
        </Link>

        <div className="mt-1 flex items-center justify-between rounded-xl border border-sidebar-border bg-card/60 p-2">
          <Link href="/settings" onClick={onNavigate} className="flex items-center gap-2.5 overflow-hidden">
            <Avatar className="size-8">
              <AvatarFallback className="bg-primary/12 text-xs font-semibold text-primary">AK</AvatarFallback>
            </Avatar>
            <span className="flex min-w-0 flex-col leading-tight">
              <span className="truncate text-sm font-medium">Aditya K.</span>
              <span className="truncate text-xs text-muted-foreground">Semester 5</span>
            </span>
          </Link>
        </div>

        <div className="flex justify-center pt-1">
          <ModeToggle />
        </div>
      </div>
    </div>
  )
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    setOpen(false)
  }, [pathname])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  return (
    <div className="min-h-screen bg-background">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 border-r border-sidebar-border bg-sidebar lg:block">
        <SidebarBody />
      </aside>

      {/* Mobile top bar */}
      <div className="sticky top-0 z-20 flex items-center justify-between border-b border-border bg-background/80 px-4 py-3 backdrop-blur-md lg:hidden">
        <Wordmark />
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Open navigation"
          className="flex size-9 items-center justify-center rounded-lg border border-border bg-card text-foreground"
        >
          <Menu className="size-4.5" />
        </button>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            className="absolute inset-0 bg-foreground/30 backdrop-blur-sm animate-in fade-in-0"
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />
          <div className="absolute inset-y-0 left-0 w-72 border-r border-sidebar-border bg-sidebar shadow-lg animate-in slide-in-from-left duration-200">
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close navigation"
              className="absolute right-3 top-3 flex size-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-sidebar-accent"
            >
              <X className="size-4" />
            </button>
            <SidebarBody onNavigate={() => setOpen(false)} />
          </div>
        </div>
      )}

      <main className="lg:pl-64">
        <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 lg:px-10 lg:py-10">
          {children}
        </div>
      </main>
    </div>
  )
}

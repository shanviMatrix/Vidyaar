'use client'

import Link from 'next/link'
import { ModeToggle } from '@/components/mode-toggle'
import { Button } from '@/components/ui/button'

export function LandingNav() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/75 backdrop-blur-md">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <svg viewBox="0 0 24 24" className="size-4.5" fill="none" aria-hidden="true">
              <path d="M4 6.5C4 5.67 4.67 5 5.5 5H11a2 2 0 0 1 2 2v11a1.5 1.5 0 0 0-1.5-1.5h-6A1.5 1.5 0 0 1 4 15V6.5Z" fill="currentColor" opacity="0.55" />
              <path d="M20 6.5C20 5.67 19.33 5 18.5 5H13a2 2 0 0 0-2 2v11a1.5 1.5 0 0 1 1.5-1.5h6A1.5 1.5 0 0 0 20 15V6.5Z" fill="currentColor" />
            </svg>
          </span>
          <span className="text-[0.95rem] font-semibold tracking-tight">Vidyaar</span>
        </Link>

        <nav className="hidden items-center gap-8 text-sm text-muted-foreground md:flex">
          <a href="#how" className="transition-colors hover:text-foreground">How it works</a>
          <a href="#features" className="transition-colors hover:text-foreground">Features</a>
          <a href="#intelligence" className="transition-colors hover:text-foreground">Intelligence</a>
        </nav>

        <div className="flex items-center gap-3">
          <div className="hidden sm:block">
            <ModeToggle />
          </div>
          <Button size="lg" render={<Link href="/dashboard" />}>
            Open app
          </Button>
        </div>
      </div>
    </header>
  )
}

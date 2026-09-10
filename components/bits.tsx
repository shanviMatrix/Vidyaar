import type { ReactNode } from 'react'
import type { AssignmentStatus, AssignmentType, ChartIndex } from '@/lib/data'
import { typeLabels } from '@/lib/data'
import { chartColor } from '@/lib/colors'
import { cn } from '@/lib/utils'

export function MiniBar({
  value,
  chart,
  className,
}: {
  value: number
  chart?: ChartIndex
  className?: string
}) {
  return (
    <div className={cn('h-1.5 w-full overflow-hidden rounded-full bg-muted', className)}>
      <div
        className="h-full rounded-full transition-[width] duration-700 ease-out"
        style={{
          width: `${Math.max(0, Math.min(100, value))}%`,
          backgroundColor: chart ? chartColor(chart) : 'var(--primary)',
        }}
      />
    </div>
  )
}

const statusStyles: Record<AssignmentStatus, string> = {
  'not-started': 'bg-muted text-muted-foreground',
  'in-progress': 'bg-primary/12 text-primary',
  done: 'bg-accent text-accent-foreground',
}
const statusLabels: Record<AssignmentStatus, string> = {
  'not-started': 'Not started',
  'in-progress': 'In progress',
  done: 'Done',
}

export function StatusBadge({ status }: { status: AssignmentStatus }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[0.7rem] font-medium',
        statusStyles[status],
      )}
    >
      <span className="size-1.5 rounded-full bg-current opacity-80" />
      {statusLabels[status]}
    </span>
  )
}

export function TypeBadge({ type }: { type: AssignmentType }) {
  return (
    <span className="inline-flex items-center rounded-md border border-border px-1.5 py-0.5 text-[0.7rem] font-medium text-muted-foreground">
      {typeLabels[type]}
    </span>
  )
}

export function DueBadge({ days, className }: { days: number; className?: string }) {
  const tone =
    days < 0
      ? 'bg-destructive/12 text-destructive'
      : days <= 1
        ? 'bg-destructive/12 text-destructive'
        : days <= 3
          ? 'bg-warning/15 text-warning-foreground'
          : 'bg-muted text-muted-foreground'
  const label =
    days < 0 ? `${Math.abs(days)}d overdue` : days === 0 ? 'Due today' : days === 1 ? 'Due tomorrow' : `${days} days`
  return (
    <span className={cn('inline-flex items-center rounded-full px-2 py-0.5 text-[0.7rem] font-medium', tone, className)}>
      {label}
    </span>
  )
}

export function Metric({
  label,
  value,
  sub,
  icon,
}: {
  label: string
  value: ReactNode
  sub?: ReactNode
  icon?: ReactNode
}) {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
        {icon}
        {label}
      </div>
      <div className="font-mono text-2xl font-semibold leading-none tabular">{value}</div>
      {sub && <div className="text-xs text-muted-foreground">{sub}</div>}
    </div>
  )
}

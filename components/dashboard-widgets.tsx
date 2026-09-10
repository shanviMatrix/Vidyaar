import { CheckCircle2, ChevronRight, Clock3, Sparkles } from 'lucide-react'
import Link from 'next/link'
import { DueBadge, MiniBar } from '@/components/bits'
import { SubjectGlyph } from '@/components/subject-glyph'
import {
  assignments,
  daysUntil,
  formatMinutes,
  recentActivity,
  relativeTime,
  subjectById,
  subjectProgress,
  subjects,
  type Recommendation,
} from '@/lib/data'

export function SubjectProgressList() {
  return (
    <ul className="flex flex-col gap-4">
      {subjects.map((s) => {
        const pct = subjectProgress(s.id)
        return (
          <li key={s.id}>
            <Link
              href={`/subjects/${s.id}`}
              className="group flex items-center gap-3 rounded-lg -mx-2 px-2 py-1 transition-colors hover:bg-accent/50"
            >
              <SubjectGlyph code={s.code} chart={s.chart} size="sm" />
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <span className="truncate text-sm font-medium">{s.name}</span>
                  <span className="font-mono text-xs tabular text-muted-foreground">{pct}%</span>
                </div>
                <MiniBar value={pct} chart={s.chart} className="mt-1.5" />
              </div>
            </Link>
          </li>
        )
      })}
    </ul>
  )
}

export function UpcomingDeadlines({ limit = 5 }: { limit?: number }) {
  const items = assignments
    .filter((a) => a.status !== 'done')
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
    .slice(0, limit)

  return (
    <ul className="flex flex-col">
      {items.map((a, i) => {
        const s = subjectById(a.subjectId)!
        return (
          <li key={a.id}>
            <Link
              href={`/assignments/${a.id}`}
              className="group flex items-center gap-3 py-2.5"
              style={{ borderTop: i === 0 ? undefined : '1px solid var(--border)' }}
            >
              <SubjectGlyph code={s.code} chart={s.chart} size="sm" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{a.title}</p>
                <p className="text-xs text-muted-foreground">{s.code} · {a.progress}% complete</p>
              </div>
              <DueBadge days={daysUntil(a.dueDate)} />
            </Link>
          </li>
        )
      })}
    </ul>
  )
}

export function NextUpList({ recs }: { recs: Recommendation[] }) {
  return (
    <ul className="flex flex-col gap-2">
      {recs.map((r) => (
        <li key={r.assignment.id}>
          <Link
            href={`/assignments/${r.assignment.id}`}
            className="group flex items-center gap-3 rounded-xl border border-border bg-background px-3 py-2.5 transition-colors hover:border-primary/40"
          >
            <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Sparkles className="size-4" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{r.assignment.title}</p>
              <p className="text-xs text-muted-foreground">
                {r.subject.code} · {formatMinutes(r.recommendedMinutes)} suggested
              </p>
            </div>
            <ChevronRight className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
          </Link>
        </li>
      ))}
    </ul>
  )
}

export function ActivityFeed() {
  const items = recentActivity()
  return (
    <ul className="flex flex-col">
      {items.map((a, i) => {
        const s = subjectById(a.subjectId)!
        const Icon = a.kind === 'completed' ? CheckCircle2 : Clock3
        return (
          <li
            key={a.id}
            className="flex items-start gap-3 py-2.5"
            style={{ borderTop: i === 0 ? undefined : '1px solid var(--border)' }}
          >
            <span
              className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full"
              style={{
                backgroundColor:
                  a.kind === 'completed' ? 'var(--accent)' : 'var(--muted)',
              }}
            >
              <Icon
                className="size-3.5"
                style={{ color: a.kind === 'completed' ? 'var(--primary)' : 'var(--muted-foreground)' }}
              />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-sm leading-snug">{a.text}</p>
              <p className="text-xs text-muted-foreground">{s.name} · {relativeTime(a.dateIso)}</p>
            </div>
          </li>
        )
      })}
    </ul>
  )
}

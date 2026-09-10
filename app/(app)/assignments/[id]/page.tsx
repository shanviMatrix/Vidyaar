import {
  AlarmClock,
  ArrowLeft,
  ArrowRight,
  Brain,
  Clock,
  Play,
  Sparkles,
  Target,
  TrendingUp,
} from 'lucide-react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { DueBadge, Metric, StatusBadge, TypeBadge } from '@/components/bits'
import { EffortRing } from '@/components/effort-ring'
import { Panel } from '@/components/panel'
import { SubjectGlyph } from '@/components/subject-glyph'
import { Button } from '@/components/ui/button'
import {
  assignments,
  daysUntil,
  formatMinutes,
  recommend,
  relativeDue,
  subjectById,
} from '@/lib/data'

export function generateStaticParams() {
  return assignments.map((a) => ({ id: a.id }))
}

const signalMeta: { key: 'urgency' | 'stakes' | 'effort' | 'gap'; label: string; icon: any; hint: string }[] = [
  { key: 'urgency', label: 'Urgency', icon: AlarmClock, hint: 'Closeness of the deadline' },
  { key: 'stakes', label: 'Stakes', icon: TrendingUp, hint: 'Share of your final grade' },
  { key: 'effort', label: 'Remaining effort', icon: Clock, hint: 'Modelled hours still needed' },
  { key: 'gap', label: 'Mastery gap', icon: Brain, hint: 'How much this subject needs work' },
]

export default async function AssignmentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const assignment = assignments.find((a) => a.id === id)
  if (!assignment) notFound()

  const subject = subjectById(assignment.subjectId)!
  const rec = recommend(assignment)
  const isDone = assignment.status === 'done'

  // suggest a simple block plan from recommended minutes
  const blocks: number[] = []
  let left = rec.recommendedMinutes
  while (left > 0) {
    const b = Math.min(50, left)
    blocks.push(b)
    left -= b
  }

  return (
    <div className="flex flex-col gap-6">
      <Link
        href="/assignments"
        className="inline-flex w-fit items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Assignments
      </Link>

      <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-4">
          <SubjectGlyph code={subject.code} chart={subject.chart} size="lg" />
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <TypeBadge type={assignment.type} />
              <StatusBadge status={assignment.status} />
            </div>
            <h1 className="mt-1.5 text-2xl font-semibold tracking-tight text-balance">
              {assignment.title}
            </h1>
            <Link
              href={`/subjects/${subject.id}`}
              className="mt-0.5 inline-block text-sm text-muted-foreground hover:text-foreground"
            >
              {subject.code} · {subject.name}
            </Link>
          </div>
        </div>
        {!isDone && (
          <Button className="h-9 w-fit" render={<Link href="/study" />}>
            <Play className="size-4" />
            Start session
          </Button>
        )}
      </header>

      <div className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-4">
        <div className="bg-card p-5">
          <Metric label="Complete" value={`${assignment.progress}%`} icon={<Target className="size-3.5" />} />
        </div>
        <div className="bg-card p-5">
          <Metric label="Remaining" value={`${rec.remainingHours}h`} sub={`of ${assignment.estimatedTotalHours}h total`} icon={<Clock className="size-3.5" />} />
        </div>
        <div className="bg-card p-5">
          <Metric label="Grade weight" value={`${Math.round(assignment.weight * 100)}%`} icon={<TrendingUp className="size-3.5" />} />
        </div>
        <div className="bg-card p-5">
          <Metric label="Due" value={isDone ? 'Done' : `${Math.max(0, daysUntil(assignment.dueDate))}d`} sub={relativeDue(assignment.dueDate)} icon={<AlarmClock className="size-3.5" />} />
        </div>
      </div>

      {!isDone ? (
        <div className="grid gap-6 lg:grid-cols-3">
          <Panel className="lg:col-span-2" title="Why Vidyaar recommends this" description={`${rec.confidence}% model confidence`}>
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
              <div className="flex items-center gap-4">
                <EffortRing value={assignment.progress} size={96} stroke={8} label={`${assignment.progress}% complete`}>
                  <span className="font-mono text-xl font-semibold tabular">{assignment.progress}%</span>
                </EffortRing>
                <div className="sm:hidden">
                  <p className="text-2xl font-semibold">{formatMinutes(rec.recommendedMinutes)}</p>
                  <p className="text-xs text-muted-foreground">suggested today</p>
                </div>
              </div>
              <div className="flex-1 rounded-xl bg-primary/[0.06] p-4">
                <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary">
                  <Sparkles className="size-3.5" />
                  Today&apos;s recommendation
                </p>
                <p className="mt-1.5 text-lg font-semibold">
                  Study {formatMinutes(rec.recommendedMinutes)}
                </p>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{rec.reason}</p>
              </div>
            </div>

            <div className="mt-5 flex flex-col gap-3">
              <p className="text-xs font-medium text-muted-foreground">Signal breakdown</p>
              {signalMeta.map((m) => {
                const val = rec.signals[m.key]
                const Icon = m.icon
                return (
                  <div key={m.key} className="flex items-center gap-3">
                    <span className="flex w-32 shrink-0 items-center gap-2 text-sm">
                      <Icon className="size-4 text-muted-foreground" />
                      {m.label}
                    </span>
                    <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full rounded-full bg-primary transition-[width] duration-700"
                        style={{ width: `${Math.max(4, Math.min(100, val))}%` }}
                      />
                    </div>
                    <span className="w-8 shrink-0 text-right font-mono text-xs tabular text-muted-foreground">
                      {val}
                    </span>
                  </div>
                )
              })}
            </div>
          </Panel>

          <Panel title="Suggested session plan" description={`${formatMinutes(rec.recommendedMinutes)} split into focused blocks`}>
            <div className="flex flex-col gap-3">
              {blocks.map((b, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 rounded-xl border border-border bg-background px-3 py-2.5"
                >
                  <span className="flex size-8 items-center justify-center rounded-lg bg-primary/10 font-mono text-sm font-semibold text-primary tabular">
                    {i + 1}
                  </span>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Focus block {i + 1}</p>
                    <p className="text-xs text-muted-foreground">{formatMinutes(b)} · then a short break</p>
                  </div>
                  <Clock className="size-4 text-muted-foreground" />
                </div>
              ))}
              <Button className="mt-1 w-full" render={<Link href="/study" />}>
                <Play className="size-4" />
                Start first block
              </Button>
            </div>
          </Panel>
        </div>
      ) : (
        <Panel>
          <div className="flex flex-col items-center gap-2 py-6 text-center">
            <span className="flex size-12 items-center justify-center rounded-full bg-accent text-primary">
              <Target className="size-6" />
            </span>
            <p className="text-base font-semibold">This assignment is complete</p>
            <p className="max-w-sm text-sm text-muted-foreground">
              Nice work. Vidyaar has removed it from your recommendations and folded the effort into
              your analytics.
            </p>
            <Button variant="outline" className="mt-2" render={<Link href="/assignments" />}>
              Back to assignments
              <ArrowRight className="size-4" />
            </Button>
          </div>
        </Panel>
      )}
    </div>
  )
}

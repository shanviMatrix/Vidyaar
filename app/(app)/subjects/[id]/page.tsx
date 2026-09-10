import { ArrowLeft, Brain, Clock, ListChecks, Play, Target } from 'lucide-react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { AssignmentRow } from '@/components/assignment-row'
import { Metric, MiniBar } from '@/components/bits'
import { StudyAreaChart } from '@/components/charts/study-area-chart'
import { EffortRing } from '@/components/effort-ring'
import { Panel } from '@/components/panel'
import { SubjectGlyph } from '@/components/subject-glyph'
import { Button } from '@/components/ui/button'
import {
  assignmentsForSubject,
  dailyStudyData,
  formatMinutes,
  minutesInRange,
  recommend,
  relativeDue,
  subjectById,
  subjectProgress,
} from '@/lib/data'

export function generateStaticParams() {
  return ['dbms', 'os', 'ml', 'maths', 'networks'].map((id) => ({ id }))
}

export default async function SubjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const subject = subjectById(id)
  if (!subject) notFound()

  const list = assignmentsForSubject(id)
  const active = list
    .filter((a) => a.status !== 'done')
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
  const done = list.filter((a) => a.status === 'done')
  const pct = subjectProgress(id)
  const hours = +(minutesInRange(14, id) / 60).toFixed(1)
  const next = active[0]
  const topRec = active.length ? recommend(active[0]) : null

  return (
    <div className="flex flex-col gap-6">
      <Link
        href="/subjects"
        className="inline-flex w-fit items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Subjects
      </Link>

      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <SubjectGlyph code={subject.code} chart={subject.chart} size="lg" />
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">{subject.name}</h1>
            <p className="mt-0.5 text-sm text-muted-foreground">
              {subject.code} · {subject.instructor} · {subject.credits} credits
            </p>
          </div>
        </div>
        <Button className="h-9 w-fit" render={<Link href="/study" />}>
          <Play className="size-4" />
          Start session
        </Button>
      </header>

      <div className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-4">
        <div className="bg-card p-5">
          <Metric label="Completion" value={`${pct}%`} icon={<Target className="size-3.5" />} />
        </div>
        <div className="bg-card p-5">
          <Metric label="Studied (2 wk)" value={`${hours}h`} icon={<Clock className="size-3.5" />} />
        </div>
        <div className="bg-card p-5">
          <Metric label="Mastery" value={`${subject.mastery}%`} icon={<Brain className="size-3.5" />} />
        </div>
        <div className="bg-card p-5">
          <Metric label="Active tasks" value={active.length} icon={<ListChecks className="size-3.5" />} />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="flex flex-col gap-6 lg:col-span-2">
          <Panel title="Study time" description="Hours on this subject per day, last 14 days">
            <StudyAreaChart data={dailyStudyData(14, id)} height={200} />
          </Panel>

          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold tracking-tight">Assignments</h2>
              <span className="text-xs text-muted-foreground">
                {active.length} active · {done.length} done
              </span>
            </div>
            <div className="flex flex-col gap-2">
              {active.map((a) => (
                <AssignmentRow key={a.id} assignment={a} showSubject={false} />
              ))}
              {done.map((a) => (
                <AssignmentRow key={a.id} assignment={a} showSubject={false} />
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          {topRec && (
            <Panel title="Recommended focus">
              <div className="flex flex-col items-center gap-3 text-center">
                <EffortRing
                  value={topRec.assignment.progress}
                  size={96}
                  stroke={8}
                  label={`${topRec.assignment.progress}% complete`}
                >
                  <span className="font-mono text-xl font-semibold tabular">
                    {topRec.assignment.progress}%
                  </span>
                </EffortRing>
                <div>
                  <p className="text-sm font-medium">{topRec.assignment.title}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">{relativeDue(topRec.assignment.dueDate)}</p>
                </div>
                <p className="rounded-lg bg-accent/50 px-3 py-2 text-sm leading-relaxed">
                  <span className="font-medium">Study {formatMinutes(topRec.recommendedMinutes)} today.</span>{' '}
                  <span className="text-muted-foreground">{topRec.reason}</span>
                </p>
              </div>
            </Panel>
          )}

          <Panel title="Mastery insight">
            <div className="flex flex-col gap-3">
              <div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Self-rated mastery</span>
                  <span className="font-mono tabular font-medium">{subject.mastery}%</span>
                </div>
                <MiniBar value={subject.mastery} chart={subject.chart} className="mt-1.5" />
              </div>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {subject.mastery >= 75
                  ? 'You are comfortable here. Vidyaar keeps sessions short and spaced to protect the gains.'
                  : subject.mastery >= 55
                    ? 'Solid footing with room to grow. Steady, regular blocks will lift this fastest.'
                    : 'This is a weaker area — Vidyaar front-loads earlier, more frequent sessions to close the gap before deadlines cluster.'}
              </p>
              <p className="text-xs text-muted-foreground">
                Target: {subject.targetHoursPerWeek}h / week · {next ? `next due ${relativeDue(next.dueDate).toLowerCase()}` : 'no active deadlines'}
              </p>
            </div>
          </Panel>
        </div>
      </div>
    </div>
  )
}

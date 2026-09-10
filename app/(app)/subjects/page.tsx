import { ArrowUpRight, Plus } from 'lucide-react'
import Link from 'next/link'
import { MiniBar } from '@/components/bits'
import { PageHeader } from '@/components/page-header'
import { SubjectGlyph } from '@/components/subject-glyph'
import { Button } from '@/components/ui/button'
import {
  assignmentsForSubject,
  daysUntil,
  minutesInRange,
  relativeDue,
  subjectProgress,
  subjects,
} from '@/lib/data'

export default function SubjectsPage() {
  return (
    <div className="flex flex-col">
      <PageHeader
        eyebrow="Workspace"
        title="Subjects"
        description="Every subject carries its own workload, momentum and mastery — so recommendations stay in context."
        actions={
          <Button className="h-9">
            <Plus className="size-4" />
            Add subject
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2">
        {subjects.map((s) => {
          const pct = subjectProgress(s.id)
          const list = assignmentsForSubject(s.id)
          const active = list.filter((a) => a.status !== 'done')
          const hours = +(minutesInRange(14, s.id) / 60).toFixed(1)
          const next = active
            .slice()
            .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())[0]

          return (
            <Link
              key={s.id}
              href={`/subjects/${s.id}`}
              className="group flex flex-col gap-4 rounded-2xl border border-border bg-card p-5 transition-all hover:border-primary/40 hover:shadow-sm"
            >
              <div className="flex items-start gap-3">
                <SubjectGlyph code={s.code} chart={s.chart} size="lg" />
                <div className="min-w-0 flex-1">
                  <h2 className="truncate text-base font-semibold leading-tight">{s.name}</h2>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {s.code} · {s.instructor}
                  </p>
                </div>
                <ArrowUpRight className="size-4 text-muted-foreground transition-colors group-hover:text-primary" />
              </div>

              <div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Completion</span>
                  <span className="font-mono tabular font-medium">{pct}%</span>
                </div>
                <MiniBar value={pct} chart={s.chart} className="mt-1.5" />
              </div>

              <div className="grid grid-cols-3 gap-2 border-t border-border pt-3 text-center">
                <div>
                  <p className="font-mono text-sm font-semibold tabular">{s.mastery}%</p>
                  <p className="text-[0.7rem] text-muted-foreground">Mastery</p>
                </div>
                <div>
                  <p className="font-mono text-sm font-semibold tabular">{hours}h</p>
                  <p className="text-[0.7rem] text-muted-foreground">2-wk study</p>
                </div>
                <div>
                  <p className="font-mono text-sm font-semibold tabular">{active.length}</p>
                  <p className="text-[0.7rem] text-muted-foreground">Active</p>
                </div>
              </div>

              {next && (
                <p className="text-xs text-muted-foreground">
                  Next:{' '}
                  <span className="text-foreground">{next.title}</span>{' '}
                  · {relativeDue(next.dueDate)}
                </p>
              )}
            </Link>
          )
        })}
      </div>
    </div>
  )
}

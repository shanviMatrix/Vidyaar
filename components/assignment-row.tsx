import { ChevronRight } from 'lucide-react'
import Link from 'next/link'
import { DueBadge, MiniBar, StatusBadge, TypeBadge } from '@/components/bits'
import { SubjectGlyph } from '@/components/subject-glyph'
import {
  daysUntil,
  remainingHours,
  subjectById,
  type Assignment,
} from '@/lib/data'
import { cn } from '@/lib/utils'

export function AssignmentRow({
  assignment,
  showSubject = true,
  className,
}: {
  assignment: Assignment
  showSubject?: boolean
  className?: string
}) {
  const s = subjectById(assignment.subjectId)!
  const rem = remainingHours(assignment)
  return (
    <Link
      href={`/assignments/${assignment.id}`}
      className={cn(
        'group flex items-center gap-4 rounded-xl border border-border bg-card px-4 py-3 transition-all hover:border-primary/40 hover:shadow-sm',
        className,
      )}
    >
      {showSubject && <SubjectGlyph code={s.code} chart={s.chart} />}
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <p className="truncate text-sm font-medium">{assignment.title}</p>
          <TypeBadge type={assignment.type} />
        </div>
        <div className="mt-1 flex items-center gap-3">
          <p className="text-xs text-muted-foreground">{s.code}</p>
          <span className="text-border">·</span>
          <p className="text-xs text-muted-foreground">
            {assignment.status === 'done' ? 'Completed' : `${rem}h left`}
          </p>
        </div>
      </div>

      <div className="hidden w-28 shrink-0 sm:block">
        <div className="flex items-center justify-between">
          <span className="text-[0.7rem] text-muted-foreground">{assignment.progress}%</span>
        </div>
        <MiniBar value={assignment.progress} chart={s.chart} className="mt-1" />
      </div>

      <div className="hidden shrink-0 md:block">
        {assignment.status === 'done' ? (
          <StatusBadge status="done" />
        ) : (
          <DueBadge days={daysUntil(assignment.dueDate)} />
        )}
      </div>

      <ChevronRight className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
    </Link>
  )
}

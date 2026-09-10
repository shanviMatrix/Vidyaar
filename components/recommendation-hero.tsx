import { ArrowRight, Clock, Play, Sparkles, Target, TrendingUp } from 'lucide-react'
import Link from 'next/link'
import { EffortRing } from '@/components/effort-ring'
import { DueBadge } from '@/components/bits'
import { Button } from '@/components/ui/button'
import type { Recommendation } from '@/lib/data'
import { formatMinutes } from '@/lib/data'

export function RecommendationHero({ rec }: { rec: Recommendation }) {
  const { assignment, subject } = rec
  return (
    <section className="overflow-hidden rounded-2xl border border-border bg-card">
      <div className="flex items-center gap-2 border-b border-border bg-primary/[0.06] px-5 py-2.5">
        <Sparkles className="size-4 text-primary" />
        <span className="text-xs font-semibold uppercase tracking-wider text-primary">
          Study this next
        </span>
        <span className="ml-auto flex items-center gap-1.5 text-xs text-muted-foreground">
          <span className="flex size-1.5 rounded-full bg-primary" />
          {rec.confidence}% confidence
        </span>
      </div>

      <div className="flex flex-col gap-6 p-5 sm:flex-row sm:items-center sm:gap-7">
        <EffortRing value={assignment.progress} size={104} stroke={9} label={`${assignment.progress}% complete`}>
          <span className="font-mono text-2xl font-semibold tabular">{assignment.progress}%</span>
          <span className="text-[0.65rem] uppercase tracking-wide text-muted-foreground">done</span>
        </EffortRing>

        <div className="flex min-w-0 flex-1 flex-col gap-3">
          <div className="flex flex-col gap-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-medium text-muted-foreground">
                {subject.code} · {subject.name}
              </span>
              <DueBadge days={rec.daysLeft} />
            </div>
            <h2 className="text-xl font-semibold tracking-tight text-balance">
              {assignment.title}
            </h2>
          </div>

          <p className="flex items-start gap-2 rounded-lg bg-accent/50 px-3 py-2 text-sm leading-relaxed">
            <Target className="mt-0.5 size-4 shrink-0 text-primary" />
            <span>
              <span className="font-medium">Study {formatMinutes(rec.recommendedMinutes)} today.</span>{' '}
              <span className="text-muted-foreground">{rec.reason}</span>
            </span>
          </p>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 pt-0.5">
            <span className="flex items-center gap-1.5 text-sm">
              <Clock className="size-4 text-muted-foreground" />
              <span className="font-mono font-semibold tabular">{rec.remainingHours}h</span>
              <span className="text-muted-foreground">remaining</span>
            </span>
            <span className="flex items-center gap-1.5 text-sm">
              <TrendingUp className="size-4 text-muted-foreground" />
              <span className="font-mono font-semibold tabular">{Math.round(assignment.weight * 100)}%</span>
              <span className="text-muted-foreground">of grade</span>
            </span>
          </div>
        </div>

        <div className="flex flex-row gap-2 sm:flex-col">
          <Button size="lg" className="h-10 flex-1 px-4" render={<Link href="/study" />}>
            <Play className="size-4" />
            Start session
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="h-10 flex-1 px-4"
            render={<Link href={`/assignments/${assignment.id}`} />}
          >
            Details
            <ArrowRight className="size-4" />
          </Button>
        </div>
      </div>
    </section>
  )
}

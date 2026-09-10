import { Clock, Sparkles, TrendingUp } from 'lucide-react'
import { EffortRing } from '@/components/effort-ring'

export function RecommendationPreview() {
  return (
    <div className="relative w-full max-w-md">
      <div
        aria-hidden="true"
        className="absolute -inset-6 -z-10 rounded-[2rem] opacity-70 blur-2xl"
        style={{
          background:
            'radial-gradient(60% 60% at 70% 20%, color-mix(in oklch, var(--primary) 22%, transparent), transparent)',
        }}
      />
      <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-lg">
        <div className="flex items-center justify-between border-b border-border px-5 py-3.5">
          <span className="flex items-center gap-2 text-xs font-medium text-primary">
            <Sparkles className="size-3.5" />
            Recommended for today
          </span>
          <span className="rounded-full bg-warning/15 px-2 py-0.5 text-[0.7rem] font-medium text-warning-foreground">
            Due in 2 days
          </span>
        </div>

        <div className="flex items-center gap-4 px-5 py-5">
          <EffortRing value={65} size={76} stroke={7} label="65 percent complete">
            <span className="font-mono text-lg font-semibold tabular">65%</span>
          </EffortRing>
          <div className="min-w-0">
            <p className="text-[0.72rem] font-medium uppercase tracking-wider text-muted-foreground">
              CS-304 · Database Systems
            </p>
            <h3 className="mt-0.5 text-base font-semibold leading-tight text-balance">
              Normalization &amp; ER Modelling Report
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">65% complete · 2.4h of work left</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-px bg-border">
          <div className="flex items-center gap-2.5 bg-card px-5 py-3">
            <Clock className="size-4 text-muted-foreground" />
            <div className="leading-tight">
              <p className="font-mono text-sm font-semibold tabular">2.4h</p>
              <p className="text-xs text-muted-foreground">Est. remaining</p>
            </div>
          </div>
          <div className="flex items-center gap-2.5 bg-card px-5 py-3">
            <TrendingUp className="size-4 text-muted-foreground" />
            <div className="leading-tight">
              <p className="font-mono text-sm font-semibold tabular">91%</p>
              <p className="text-xs text-muted-foreground">Model confidence</p>
            </div>
          </div>
        </div>

        <div className="border-t border-border bg-accent/40 px-5 py-4">
          <p className="text-[0.72rem] font-medium uppercase tracking-wider text-primary">
            Vidyaar recommends
          </p>
          <p className="mt-1 text-sm leading-relaxed">
            Study for <span className="font-semibold">90 minutes</span> today. High-stakes report
            due soon — a focused block now keeps the workload from piling up before your mid-term.
          </p>
        </div>
      </div>
    </div>
  )
}

import {
  ArrowRight,
  BarChart3,
  BookOpen,
  Brain,
  ClipboardList,
  Sparkles,
  Timer,
} from 'lucide-react'
import Link from 'next/link'
import { LandingNav } from '@/components/landing/landing-nav'
import { RecommendationPreview } from '@/components/landing/recommendation-preview'
import { Button } from '@/components/ui/button'

const steps = [
  {
    n: '01',
    title: 'Add your world',
    body: 'Subjects, assignments, weights and deadlines. A few minutes of setup, then Vidyaar keeps the picture current.',
  },
  {
    n: '02',
    title: 'Study, and log it',
    body: 'A calm timer tracks focused sessions. Every session teaches the model how you actually work.',
  },
  {
    n: '03',
    title: 'Get told what matters',
    body: 'Each morning Vidyaar ranks everything by urgency, stakes and effort — and hands you a plan.',
  },
]

const features = [
  { icon: BookOpen, title: 'Subjects that stay in context', body: 'Every subject carries its workload, mastery and momentum — not just a name and a color.' },
  { icon: ClipboardList, title: 'Assignments with real effort', body: 'Completion percentage plus a modelled effort estimate, so "65% done" means something.' },
  { icon: Timer, title: 'Frictionless study tracking', body: 'One tap to start a focused block. Focus and time feed the recommendation engine.' },
  { icon: BarChart3, title: 'Analytics you act on', body: 'See where hours go, when you focus best, and which subjects are drifting.' },
  { icon: Sparkles, title: 'A daily plan, not a to-do list', body: 'A time-boxed schedule for today, balanced across deadlines and grades.' },
  { icon: Brain, title: 'Adapts to your history', body: 'The more you study, the sharper the estimates. It learns your pace, not a generic average.' },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <LandingNav />

      {/* Hero */}
      <section className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 py-16 lg:grid-cols-[1.05fr_0.95fr] lg:py-24">
          <div className="flex flex-col items-start gap-6">
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground">
              <span className="flex size-1.5 rounded-full bg-primary" />
              Personalized study intelligence
            </span>
            <h1 className="text-balance text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
              Know exactly what to study next.
            </h1>
            <p className="max-w-xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
              Vidyaar turns your subjects, deadlines and study habits into one clear answer to the
              only question that matters each morning:{' '}
              <span className="text-foreground">what should I study today?</span>
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button size="lg" className="h-11 px-5 text-sm" render={<Link href="/dashboard" />}>
                Open the dashboard
                <ArrowRight className="size-4" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="h-11 px-5 text-sm"
                render={<a href="#how" />}
              >
                See how it works
              </Button>
            </div>
            <dl className="mt-2 flex flex-wrap gap-x-8 gap-y-3 text-sm">
              <div className="flex flex-col">
                <dt className="text-muted-foreground">Daily plan in</dt>
                <dd className="font-mono text-lg font-semibold tabular">&lt; 30s</dd>
              </div>
              <div className="flex flex-col">
                <dt className="text-muted-foreground">Effort accuracy</dt>
                <dd className="font-mono text-lg font-semibold tabular">±0.4h</dd>
              </div>
              <div className="flex flex-col">
                <dt className="text-muted-foreground">Built for</dt>
                <dd className="font-mono text-lg font-semibold tabular">students</dd>
              </div>
            </dl>
          </div>

          <div className="flex justify-center lg:justify-end">
            <RecommendationPreview />
          </div>
        </div>
      </section>

      {/* The one question */}
      <section id="how" className="border-y border-border bg-card/40">
        <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          <div className="max-w-2xl">
            <h2 className="text-balance text-2xl font-semibold tracking-tight sm:text-3xl">
              Most study apps show you everything. Vidyaar tells you what to do.
            </h2>
            <p className="mt-3 text-pretty leading-relaxed text-muted-foreground">
              Behind every recommendation is a simple, honest chain of reasoning. No black box —
              you always see the why.
            </p>
          </div>

          <div className="mt-12 grid gap-8 sm:grid-cols-3">
            {steps.map((s) => (
              <div key={s.n} className="flex flex-col gap-3">
                <span className="font-mono text-sm font-medium text-primary">{s.n}</span>
                <div className="h-px w-full bg-border" />
                <h3 className="text-base font-semibold">{s.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="max-w-2xl">
          <span className="text-xs font-medium uppercase tracking-wider text-primary">Features</span>
          <h2 className="mt-2 text-balance text-2xl font-semibold tracking-tight sm:text-3xl">
            Everything an academic workload needs — and nothing it doesn&apos;t.
          </h2>
        </div>
        <div className="mt-12 grid gap-x-10 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => {
            const Icon = f.icon
            return (
              <div key={f.title} className="flex flex-col gap-3">
                <span className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Icon className="size-5" />
                </span>
                <h3 className="text-base font-semibold">{f.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{f.body}</p>
              </div>
            )
          })}
        </div>
      </section>

      {/* Intelligence */}
      <section id="intelligence" className="border-t border-border bg-card/40">
        <div className="mx-auto grid w-full max-w-6xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:px-8 lg:py-24">
          <div className="flex flex-col gap-5">
            <span className="text-xs font-medium uppercase tracking-wider text-primary">
              The intelligence
            </span>
            <h2 className="text-balance text-2xl font-semibold tracking-tight sm:text-3xl">
              A recommendation engine that reasons like a good study partner.
            </h2>
            <p className="text-pretty leading-relaxed text-muted-foreground">
              Vidyaar weighs four signals for every task, then converts them into a concrete
              suggestion: how many minutes to spend today, and why.
            </p>
            <ul className="flex flex-col gap-3 text-sm">
              {[
                ['Urgency', 'How close the deadline is'],
                ['Stakes', 'How much of your grade rides on it'],
                ['Remaining effort', 'Modelled hours left, not just percentage'],
                ['Your mastery', 'Weaker subjects get earlier, steadier time'],
              ].map(([k, v]) => (
                <li key={k} className="flex items-baseline gap-3">
                  <span className="mt-1 size-1.5 shrink-0 rounded-full bg-primary" />
                  <span>
                    <span className="font-medium text-foreground">{k}.</span>{' '}
                    <span className="text-muted-foreground">{v}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <div className="flex justify-center lg:justify-end">
            <RecommendationPreview />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto w-full max-w-6xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-6 rounded-3xl border border-border bg-primary/[0.06] px-6 py-16 text-center">
          <h2 className="max-w-2xl text-balance text-2xl font-semibold tracking-tight sm:text-3xl">
            Stop guessing what to study. Start knowing.
          </h2>
          <p className="max-w-xl text-pretty leading-relaxed text-muted-foreground">
            Open the Vidyaar workspace and see your personalized plan for today.
          </p>
          <Button size="lg" className="h-11 px-6 text-sm" render={<Link href="/dashboard" />}>
            Open the dashboard
            <ArrowRight className="size-4" />
          </Button>
        </div>
      </section>

      <footer className="border-t border-border">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-3 px-4 py-8 text-sm text-muted-foreground sm:flex-row sm:px-6 lg:px-8">
          <p>Vidyaar — study smarter, not longer.</p>
          <p>A product design concept.</p>
        </div>
      </footer>
    </div>
  )
}

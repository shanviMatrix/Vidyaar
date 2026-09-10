'use client'

import { Check, Pause, Play, RotateCcw, Timer as TimerIcon } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { Panel } from '@/components/panel'
import { SubjectDot, SubjectGlyph } from '@/components/subject-glyph'
import { Button } from '@/components/ui/button'
import { chartColor } from '@/lib/colors'
import { formatMinutes, subjects, type ChartIndex } from '@/lib/data'
import { cn } from '@/lib/utils'

const presets = [25, 50, 90]

type Logged = { id: string; subjectId: string; minutes: number; focus: number }

function fmt(sec: number) {
  const m = Math.floor(sec / 60)
  const s = sec % 60
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

export function StudyTracker() {
  const [subjectId, setSubjectId] = useState(subjects[0].id)
  const [target, setTarget] = useState(50)
  const [remaining, setRemaining] = useState(50 * 60)
  const [running, setRunning] = useState(false)
  const [done, setDone] = useState(false)
  const [logged, setLogged] = useState<Logged[]>([
    { id: 'seed1', subjectId: 'os', minutes: 45, focus: 82 },
    { id: 'seed2', subjectId: 'ml', minutes: 60, focus: 74 },
  ])
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const subject = subjects.find((s) => s.id === subjectId)!
  const total = target * 60
  const elapsed = total - remaining
  const pct = total > 0 ? (elapsed / total) * 100 : 0

  const stop = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current)
    intervalRef.current = null
  }, [])

  useEffect(() => {
    if (!running) return
    intervalRef.current = setInterval(() => {
      setRemaining((r) => {
        if (r <= 1) {
          setRunning(false)
          setDone(true)
          return 0
        }
        return r - 1
      })
    }, 1000)
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [running])

  function selectTarget(mins: number) {
    stop()
    setRunning(false)
    setDone(false)
    setTarget(mins)
    setRemaining(mins * 60)
  }

  function reset() {
    stop()
    setRunning(false)
    setDone(false)
    setRemaining(target * 60)
  }

  function logSession() {
    const minutes = Math.max(1, Math.round(elapsed / 60))
    setLogged((prev) => [
      { id: `log-${Date.now()}`, subjectId, minutes, focus: 78 + Math.floor(Math.random() * 16) },
      ...prev,
    ])
    reset()
  }

  const size = 264
  const stroke = 12
  const r = (size - stroke) / 2
  const c = 2 * Math.PI * r
  const offset = c - (Math.min(100, pct) / 100) * c

  const todayMinutes = logged.reduce((s, l) => s + l.minutes, 0)

  return (
    <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
      {/* Timer */}
      <Panel bodyClassName="flex flex-col items-center gap-7 py-8">
        <div className="flex flex-wrap items-center justify-center gap-2">
          {subjects.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => setSubjectId(s.id)}
              className={cn(
                'inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm font-medium transition-colors',
                subjectId === s.id
                  ? 'border-primary/40 bg-primary/10 text-foreground'
                  : 'border-border text-muted-foreground hover:text-foreground',
              )}
            >
              <SubjectDot chart={s.chart} />
              {s.code}
            </button>
          ))}
        </div>

        <div className="relative" style={{ width: size, height: size }}>
          <svg width={size} height={size} className="-rotate-90">
            <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--muted)" strokeWidth={stroke} />
            <circle
              cx={size / 2}
              cy={size / 2}
              r={r}
              fill="none"
              stroke={chartColor(subject.chart as ChartIndex)}
              strokeWidth={stroke}
              strokeLinecap="round"
              strokeDasharray={c}
              strokeDashoffset={offset}
              style={{ transition: 'stroke-dashoffset 1s linear' }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="font-mono text-5xl font-semibold tabular">{fmt(remaining)}</span>
            <span className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
              <SubjectDot chart={subject.chart} />
              {subject.name}
            </span>
            {done && (
              <span className="mt-2 rounded-full bg-primary/12 px-2.5 py-0.5 text-xs font-medium text-primary">
                Session complete
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1 rounded-full border border-border bg-background p-1">
          {presets.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => selectTarget(p)}
              className={cn(
                'rounded-full px-3 py-1 text-sm font-medium transition-colors',
                target === p ? 'bg-secondary text-secondary-foreground shadow-xs' : 'text-muted-foreground hover:text-foreground',
              )}
            >
              {p}m
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline" size="icon-lg" onClick={reset} aria-label="Reset timer">
            <RotateCcw className="size-4.5" />
          </Button>
          {done ? (
            <Button size="lg" className="h-11 px-6" onClick={logSession}>
              <Check className="size-4.5" />
              Log session
            </Button>
          ) : (
            <Button size="lg" className="h-11 px-6" onClick={() => setRunning((v) => !v)}>
              {running ? <Pause className="size-4.5" /> : <Play className="size-4.5" />}
              {running ? 'Pause' : elapsed > 0 ? 'Resume' : 'Start focus'}
            </Button>
          )}
          {!done && elapsed > 0 && (
            <Button variant="outline" size="lg" className="h-11 px-5" onClick={logSession}>
              <Check className="size-4.5" />
              End &amp; log
            </Button>
          )}
        </div>
      </Panel>

      {/* Side */}
      <div className="flex flex-col gap-6">
        <Panel title="Today" description="Logged focus time">
          <div className="flex items-end justify-between">
            <div>
              <p className="font-mono text-3xl font-semibold tabular">{formatMinutes(todayMinutes)}</p>
              <p className="text-xs text-muted-foreground">{logged.length} sessions</p>
            </div>
            <span className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <TimerIcon className="size-5" />
            </span>
          </div>
        </Panel>

        <Panel title="Session log">
          {logged.length ? (
            <ul className="flex flex-col">
              {logged.map((l, i) => {
                const s = subjects.find((x) => x.id === l.subjectId)!
                return (
                  <li
                    key={l.id}
                    className="flex items-center gap-3 py-2.5"
                    style={{ borderTop: i === 0 ? undefined : '1px solid var(--border)' }}
                  >
                    <SubjectGlyph code={s.code} chart={s.chart} size="sm" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{s.name}</p>
                      <p className="text-xs text-muted-foreground">{l.focus}% focus</p>
                    </div>
                    <span className="font-mono text-sm tabular font-medium">{formatMinutes(l.minutes)}</span>
                  </li>
                )
              })}
            </ul>
          ) : (
            <p className="py-6 text-center text-sm text-muted-foreground">
              No sessions yet — start the timer to log your first focus block.
            </p>
          )}
        </Panel>
      </div>
    </div>
  )
}

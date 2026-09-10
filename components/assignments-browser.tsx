'use client'

import { ClipboardList, Search } from 'lucide-react'
import { useMemo, useState } from 'react'
import { AssignmentRow } from '@/components/assignment-row'
import { cn } from '@/lib/utils'
import {
  assignments,
  daysUntil,
  recommend,
  subjectById,
  type AssignmentStatus,
} from '@/lib/data'

type Filter = 'all' | AssignmentStatus
type Sort = 'priority' | 'deadline' | 'progress'

const filters: { key: Filter; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'in-progress', label: 'In progress' },
  { key: 'not-started', label: 'Not started' },
  { key: 'done', label: 'Completed' },
]

const sorts: { key: Sort; label: string }[] = [
  { key: 'priority', label: 'Priority' },
  { key: 'deadline', label: 'Deadline' },
  { key: 'progress', label: 'Progress' },
]

export function AssignmentsBrowser() {
  const [filter, setFilter] = useState<Filter>('all')
  const [sort, setSort] = useState<Sort>('priority')
  const [query, setQuery] = useState('')

  const counts = useMemo(
    () => ({
      all: assignments.length,
      'in-progress': assignments.filter((a) => a.status === 'in-progress').length,
      'not-started': assignments.filter((a) => a.status === 'not-started').length,
      done: assignments.filter((a) => a.status === 'done').length,
    }),
    [],
  )

  const rows = useMemo(() => {
    let list = assignments.slice()
    if (filter !== 'all') list = list.filter((a) => a.status === filter)
    if (query.trim()) {
      const q = query.toLowerCase()
      list = list.filter((a) => {
        const s = subjectById(a.subjectId)!
        return a.title.toLowerCase().includes(q) || s.name.toLowerCase().includes(q) || s.code.toLowerCase().includes(q)
      })
    }
    list.sort((a, b) => {
      if (sort === 'deadline') return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
      if (sort === 'progress') return b.progress - a.progress
      // priority: done last, otherwise by model priority
      if (a.status === 'done' && b.status !== 'done') return 1
      if (b.status === 'done' && a.status !== 'done') return -1
      if (a.status === 'done' && b.status === 'done') return daysUntil(b.dueDate) - daysUntil(a.dueDate)
      return recommend(b).priority - recommend(a).priority
    })
    return list
  }, [filter, sort, query])

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap items-center gap-1 rounded-lg border border-border bg-card p-1">
          {filters.map((f) => (
            <button
              key={f.key}
              type="button"
              onClick={() => setFilter(f.key)}
              className={cn(
                'inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-sm font-medium transition-colors',
                filter === f.key
                  ? 'bg-secondary text-secondary-foreground shadow-xs'
                  : 'text-muted-foreground hover:text-foreground',
              )}
            >
              {f.label}
              <span className="font-mono text-[0.7rem] tabular text-muted-foreground">
                {counts[f.key]}
              </span>
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <div className="relative flex-1 lg:w-56">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search assignments"
              className="h-9 w-full rounded-lg border border-input bg-card pl-8 pr-3 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-ring focus:ring-3 focus:ring-ring/30"
            />
          </div>
          <div className="flex items-center gap-1 rounded-lg border border-border bg-card p-1">
            {sorts.map((s) => (
              <button
                key={s.key}
                type="button"
                onClick={() => setSort(s.key)}
                className={cn(
                  'rounded-md px-2 py-1 text-xs font-medium transition-colors',
                  sort === s.key
                    ? 'bg-secondary text-secondary-foreground shadow-xs'
                    : 'text-muted-foreground hover:text-foreground',
                )}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {rows.length > 0 ? (
        <div className="flex flex-col gap-2">
          {rows.map((a) => (
            <AssignmentRow key={a.id} assignment={a} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-border bg-card/50 py-16 text-center">
          <span className="flex size-11 items-center justify-center rounded-full bg-muted text-muted-foreground">
            <ClipboardList className="size-5" />
          </span>
          <div>
            <p className="text-sm font-medium">No assignments found</p>
            <p className="text-xs text-muted-foreground">
              Try a different filter or clear your search.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

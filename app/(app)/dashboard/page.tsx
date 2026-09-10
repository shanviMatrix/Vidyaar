import { Clock, Flame, ListChecks, Play, Target } from 'lucide-react'
import Link from 'next/link'
import { Metric } from '@/components/bits'
import { StudyAreaChart } from '@/components/charts/study-area-chart'
import {
  ActivityFeed,
  NextUpList,
  SubjectProgressList,
  UpcomingDeadlines,
} from '@/components/dashboard-widgets'
import { Panel } from '@/components/panel'
import { RecommendationHero } from '@/components/recommendation-hero'
import { Button } from '@/components/ui/button'
import {
  assignments,
  averageFocus,
  dailyStudyData,
  hoursThisWeek,
  NOW,
  overallCompletion,
  rankedRecommendations,
} from '@/lib/data'

export default function DashboardPage() {
  const recs = rankedRecommendations()
  const top = recs[0]
  const nextUp = recs.slice(1, 4)
  const dateLabel = NOW.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  })
  const activeCount = assignments.filter((a) => a.status !== 'done').length
  const attention = recs.filter((r) => r.priority >= 55).length

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex flex-col gap-1">
          <span className="text-xs font-medium text-muted-foreground">{dateLabel}</span>
          <h1 className="text-2xl font-semibold tracking-tight sm:text-[1.75rem]">
            Good morning, Aditya
          </h1>
          <p className="text-sm text-muted-foreground">
            {attention} {attention === 1 ? 'task needs' : 'tasks need'} your attention today.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="h-9" render={<Link href="/planner" />}>
            <Target className="size-4" />
            Plan today
          </Button>
          <Button className="h-9" render={<Link href="/study" />}>
            <Play className="size-4" />
            Start session
          </Button>
        </div>
      </header>

      <RecommendationHero rec={top} />

      {/* Metric strip */}
      <div className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-4">
        <div className="bg-card p-5">
          <Metric
            label="Overall completion"
            value={`${overallCompletion()}%`}
            sub="Across all assignments"
            icon={<Target className="size-3.5" />}
          />
        </div>
        <div className="bg-card p-5">
          <Metric
            label="Studied this week"
            value={`${hoursThisWeek()}h`}
            sub="Last 7 days"
            icon={<Clock className="size-3.5" />}
          />
        </div>
        <div className="bg-card p-5">
          <Metric
            label="Avg. focus"
            value={`${averageFocus()}%`}
            sub="14-day average"
            icon={<Flame className="size-3.5" />}
          />
        </div>
        <div className="bg-card p-5">
          <Metric
            label="Active assignments"
            value={activeCount}
            sub={`${assignments.length - activeCount} completed`}
            icon={<ListChecks className="size-3.5" />}
          />
        </div>
      </div>

      {/* Main grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="flex flex-col gap-6 lg:col-span-2">
          <Panel
            title="Study this fortnight"
            description="Hours of focused study per day"
            action={
              <Link href="/analytics" className="text-xs font-medium text-primary hover:underline">
                Analytics
              </Link>
            }
          >
            <StudyAreaChart data={dailyStudyData(14)} />
          </Panel>

          <Panel
            title="Subject progress"
            description="Average completion by subject"
            action={
              <Link href="/subjects" className="text-xs font-medium text-primary hover:underline">
                All subjects
              </Link>
            }
          >
            <SubjectProgressList />
          </Panel>
        </div>

        <div className="flex flex-col gap-6">
          <Panel
            title="Upcoming deadlines"
            action={
              <Link href="/assignments" className="text-xs font-medium text-primary hover:underline">
                View all
              </Link>
            }
          >
            <UpcomingDeadlines />
          </Panel>

          <Panel title="Up next" description="What Vidyaar suggests after this">
            <NextUpList recs={nextUp} />
          </Panel>

          <Panel title="Recent activity">
            <ActivityFeed />
          </Panel>
        </div>
      </div>
    </div>
  )
}

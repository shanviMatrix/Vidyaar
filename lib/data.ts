// Vidyaar demo dataset + a small deterministic "study intelligence" engine.
// Everything is derived from the data below so the recommendations feel real
// without requiring a backend.

export const NOW = new Date('2026-09-09T09:00:00')

export type ChartIndex = 1 | 2 | 3 | 4 | 5

export type Subject = {
  id: string
  name: string
  code: string
  instructor: string
  credits: number
  chart: ChartIndex
  /** self-reported comfort with the material, 0-100 */
  mastery: number
  targetHoursPerWeek: number
}

export type AssignmentStatus = 'not-started' | 'in-progress' | 'done'
export type AssignmentType = 'assignment' | 'lab' | 'project' | 'exam' | 'reading'

export type Assignment = {
  id: string
  title: string
  subjectId: string
  type: AssignmentType
  status: AssignmentStatus
  /** completion percentage 0-100 */
  progress: number
  /** modelled total effort in hours */
  estimatedTotalHours: number
  /** contribution to final grade, 0-1 */
  weight: number
  dueDate: string // ISO
}

export type StudySession = {
  id: string
  subjectId: string
  date: string // ISO
  minutes: number
  /** self-rated focus 0-100 */
  focus: number
}

export const subjects: Subject[] = [
  { id: 'dbms', name: 'Database Management Systems', code: 'CS-304', instructor: 'Dr. Anitha Rao', credits: 4, chart: 1, mastery: 62, targetHoursPerWeek: 6 },
  { id: 'os', name: 'Operating Systems', code: 'CS-311', instructor: 'Prof. Karan Mehta', credits: 4, chart: 3, mastery: 71, targetHoursPerWeek: 5 },
  { id: 'ml', name: 'Machine Learning', code: 'CS-402', instructor: 'Dr. Leena Fernandes', credits: 3, chart: 5, mastery: 48, targetHoursPerWeek: 7 },
  { id: 'maths', name: 'Discrete Mathematics', code: 'MA-208', instructor: 'Prof. S. Iyer', credits: 3, chart: 2, mastery: 80, targetHoursPerWeek: 3 },
  { id: 'networks', name: 'Computer Networks', code: 'CS-309', instructor: 'Dr. Vikram Nair', credits: 4, chart: 4, mastery: 55, targetHoursPerWeek: 4 },
]

function iso(daysFromNow: number, hour = 23, minute = 59) {
  const d = new Date(NOW)
  d.setDate(d.getDate() + daysFromNow)
  d.setHours(hour, minute, 0, 0)
  return d.toISOString()
}

export const assignments: Assignment[] = [
  { id: 'a1', title: 'Normalization & ER Modelling Report', subjectId: 'dbms', type: 'assignment', status: 'in-progress', progress: 65, estimatedTotalHours: 7, weight: 0.15, dueDate: iso(2) },
  { id: 'a2', title: 'Process Scheduling Simulator', subjectId: 'os', type: 'lab', status: 'in-progress', progress: 40, estimatedTotalHours: 9, weight: 0.2, dueDate: iso(4) },
  { id: 'a3', title: 'Linear Regression from Scratch', subjectId: 'ml', type: 'project', status: 'in-progress', progress: 25, estimatedTotalHours: 12, weight: 0.25, dueDate: iso(6) },
  { id: 'a4', title: 'Graph Theory Problem Set 4', subjectId: 'maths', type: 'assignment', status: 'not-started', progress: 0, estimatedTotalHours: 4, weight: 0.1, dueDate: iso(1) },
  { id: 'a5', title: 'TCP/IP Layered Model Essay', subjectId: 'networks', type: 'reading', status: 'in-progress', progress: 55, estimatedTotalHours: 3.5, weight: 0.08, dueDate: iso(5) },
  { id: 'a6', title: 'Mid-Term: Transactions & Concurrency', subjectId: 'dbms', type: 'exam', status: 'in-progress', progress: 30, estimatedTotalHours: 10, weight: 0.3, dueDate: iso(9) },
  { id: 'a7', title: 'Virtual Memory Case Study', subjectId: 'os', type: 'reading', status: 'not-started', progress: 0, estimatedTotalHours: 2.5, weight: 0.05, dueDate: iso(7) },
  { id: 'a8', title: 'Gradient Descent Worksheet', subjectId: 'ml', type: 'assignment', status: 'in-progress', progress: 15, estimatedTotalHours: 5, weight: 0.12, dueDate: iso(3) },
  { id: 'a9', title: 'Subnetting Practice Lab', subjectId: 'networks', type: 'lab', status: 'done', progress: 100, estimatedTotalHours: 3, weight: 0.1, dueDate: iso(-2) },
  { id: 'a10', title: 'Relational Algebra Quiz Prep', subjectId: 'dbms', type: 'reading', status: 'done', progress: 100, estimatedTotalHours: 2, weight: 0.05, dueDate: iso(-1) },
]

// ~5 weeks of study sessions, weighted toward recent days.
function buildSessions(): StudySession[] {
  const out: StudySession[] = []
  const plan: Record<string, [number, number]> = {
    // subjectId: [avgMinutes, spreadMinutes]
    dbms: [55, 40],
    os: [45, 35],
    ml: [70, 45],
    maths: [30, 25],
    networks: [35, 30],
  }
  let seed = 42
  const rand = () => {
    seed = (seed * 1103515245 + 12345) & 0x7fffffff
    return seed / 0x7fffffff
  }
  for (let day = 34; day >= 0; day--) {
    const dow = new Date(NOW.getTime() - day * 86400000).getDay()
    const busy = dow === 0 ? 0.35 : dow === 6 ? 0.7 : 1
    for (const s of subjects) {
      const [avg, spread] = plan[s.id]
      if (rand() > 0.55 * busy) continue
      const minutes = Math.max(15, Math.round((avg + (rand() - 0.5) * spread) * busy))
      out.push({
        id: `${s.id}-${day}`,
        subjectId: s.id,
        date: iso(-day, 9 + Math.floor(rand() * 10), 0),
        minutes,
        focus: Math.round(58 + rand() * 38),
      })
    }
  }
  return out
}

export const sessions: StudySession[] = buildSessions()

/* ------------------------------------------------------------------ */
/* Derived helpers                                                     */
/* ------------------------------------------------------------------ */

export function subjectById(id: string) {
  return subjects.find((s) => s.id === id)
}

export function assignmentsForSubject(id: string) {
  return assignments.filter((a) => a.subjectId === id)
}

export function daysUntil(dateIso: string) {
  const d = new Date(dateIso)
  return Math.ceil((d.getTime() - NOW.getTime()) / 86400000)
}

export function remainingHours(a: Assignment) {
  return +(a.estimatedTotalHours * (1 - a.progress / 100)).toFixed(1)
}

export type Recommendation = {
  assignment: Assignment
  subject: Subject
  daysLeft: number
  remainingHours: number
  /** minutes Vidyaar suggests studying today */
  recommendedMinutes: number
  /** 0-100 urgency/priority score used for ranking */
  priority: number
  /** model confidence 0-100 */
  confidence: number
  reason: string
  /** normalized 0-100 contributions used to explain the recommendation */
  signals: { urgency: number; stakes: number; effort: number; gap: number }
}

// The "ML" recommendation: blends urgency (days left), stakes (grade weight),
// remaining effort, and the student's mastery of the subject.
export function recommend(a: Assignment): Recommendation {
  const subject = subjectById(a.subjectId)!
  const daysLeft = Math.max(0, daysUntil(a.dueDate))
  const rem = remainingHours(a)

  const urgency = 1 / Math.max(1, daysLeft) // sooner => higher
  const stakes = a.weight // heavier => higher
  const gap = (100 - subject.mastery) / 100 // weaker subject => higher
  const effort = Math.min(1, rem / 12)

  const priority = Math.round(
    Math.min(100, (urgency * 42 + stakes * 120 + gap * 22 + effort * 20)),
  )

  // spread remaining effort across available days, front-loaded, capped.
  const daysToSpread = Math.max(1, Math.min(daysLeft, 4))
  const rawMinutes = (rem * 60) / daysToSpread
  const urgencyBoost = daysLeft <= 1 ? 1.5 : daysLeft <= 2 ? 1.25 : 1
  const recommendedMinutes = Math.min(
    150,
    Math.max(20, Math.round((rawMinutes * urgencyBoost) / 15) * 15),
  )

  const confidence = Math.round(
    72 + Math.min(20, sessions.filter((s) => s.subjectId === a.subjectId).length) * 0.9,
  )

  let reason: string
  if (daysLeft <= 1) reason = `Due ${daysLeft === 0 ? 'today' : 'tomorrow'} and worth ${Math.round(a.weight * 100)}% of your grade.`
  else if (a.weight >= 0.25) reason = `High-stakes (${Math.round(a.weight * 100)}% of grade) with ${rem}h of work left.`
  else if (subject.mastery < 55) reason = `${subject.name.split(' ')[0]} is a weaker area — steady practice compounds.`
  else reason = `On track — a focused block keeps ${rem}h from piling up.`

  const signals = {
    urgency: Math.round(Math.min(100, urgency * 100)),
    stakes: Math.round(Math.min(100, stakes * 100 * 2.2)),
    effort: Math.round(effort * 100),
    gap: Math.round(gap * 100),
  }

  return { assignment: a, subject, daysLeft, remainingHours: rem, recommendedMinutes, priority, confidence, reason, signals }
}

export function rankedRecommendations() {
  return assignments
    .filter((a) => a.status !== 'done')
    .map(recommend)
    .sort((x, y) => y.priority - x.priority)
}

export function subjectProgress(id: string) {
  const list = assignmentsForSubject(id)
  if (!list.length) return 0
  return Math.round(list.reduce((sum, a) => sum + a.progress, 0) / list.length)
}

export function overallCompletion() {
  const active = assignments
  return Math.round(active.reduce((s, a) => s + a.progress, 0) / active.length)
}

export function minutesInRange(days: number, subjectId?: string) {
  const cutoff = NOW.getTime() - days * 86400000
  return sessions
    .filter((s) => new Date(s.date).getTime() >= cutoff && (!subjectId || s.subjectId === subjectId))
    .reduce((sum, s) => sum + s.minutes, 0)
}

export function hoursThisWeek() {
  return +(minutesInRange(7) / 60).toFixed(1)
}

export function averageFocus(days = 14) {
  const cutoff = NOW.getTime() - days * 86400000
  const rel = sessions.filter((s) => new Date(s.date).getTime() >= cutoff)
  if (!rel.length) return 0
  return Math.round(rel.reduce((s, x) => s + x.focus, 0) / rel.length)
}

// Study minutes per day for the last N days (for the analytics chart).
export function dailyStudyData(days = 14, subjectId?: string) {
  const out: { date: string; label: string; minutes: number; hours: number }[] = []
  for (let d = days - 1; d >= 0; d--) {
    const day = new Date(NOW.getTime() - d * 86400000)
    const dayStr = day.toISOString().slice(0, 10)
    const minutes = sessions
      .filter((s) => s.date.slice(0, 10) === dayStr && (!subjectId || s.subjectId === subjectId))
      .reduce((sum, s) => sum + s.minutes, 0)
    out.push({
      date: dayStr,
      label: day.toLocaleDateString('en-US', { weekday: 'short' }),
      minutes,
      hours: +(minutes / 60).toFixed(1),
    })
  }
  return out
}

// Study distribution by subject for the last N days.
export function subjectDistribution(days = 14) {
  return subjects
    .map((s) => ({
      id: s.id,
      name: s.name,
      code: s.code,
      chart: s.chart,
      minutes: minutesInRange(days, s.id),
      hours: +(minutesInRange(days, s.id) / 60).toFixed(1),
    }))
    .sort((a, b) => b.minutes - a.minutes)
}

// Weekly totals for the last 5 weeks (trend view).
export function weeklyTrend() {
  const out: { week: string; hours: number }[] = []
  for (let w = 4; w >= 0; w--) {
    const startDay = w * 7 + 6
    const endDay = w * 7
    let minutes = 0
    for (const s of sessions) {
      const diff = Math.floor((NOW.getTime() - new Date(s.date).getTime()) / 86400000)
      if (diff >= endDay && diff <= startDay) minutes += s.minutes
    }
    out.push({ week: w === 0 ? 'This wk' : `${w}w ago`, hours: +(minutes / 60).toFixed(1) })
  }
  return out
}

export type Activity = {
  id: string
  kind: 'session' | 'completed' | 'started' | 'recommendation'
  subjectId: string
  text: string
  dateIso: string
}

export function recentActivity(): Activity[] {
  const items: Activity[] = []
  sessions
    .slice(-6)
    .reverse()
    .forEach((s) => {
      const subj = subjectById(s.subjectId)!
      items.push({
        id: `act-${s.id}`,
        kind: 'session',
        subjectId: s.subjectId,
        text: `Logged ${s.minutes} min on ${subj.code} · ${s.focus}% focus`,
        dateIso: s.date,
      })
    })
  items.push({ id: 'act-c1', kind: 'completed', subjectId: 'networks', text: 'Completed Subnetting Practice Lab', dateIso: iso(-2, 16) })
  items.push({ id: 'act-c2', kind: 'completed', subjectId: 'dbms', text: 'Completed Relational Algebra Quiz Prep', dateIso: iso(-1, 20) })
  return items.sort((a, b) => new Date(b.dateIso).getTime() - new Date(a.dateIso).getTime()).slice(0, 7)
}

/* ------------------------------------------------------------------ */
/* Formatting                                                          */
/* ------------------------------------------------------------------ */

export function formatMinutes(mins: number) {
  const h = Math.floor(mins / 60)
  const m = mins % 60
  if (h === 0) return `${m}m`
  if (m === 0) return `${h}h`
  return `${h}h ${m}m`
}

export function formatHours(h: number) {
  return `${h}h`
}

export function relativeDue(dateIso: string) {
  const days = daysUntil(dateIso)
  if (days < 0) return `${Math.abs(days)}d overdue`
  if (days === 0) return 'Due today'
  if (days === 1) return 'Due tomorrow'
  return `Due in ${days} days`
}

export function relativeTime(dateIso: string) {
  const diff = NOW.getTime() - new Date(dateIso).getTime()
  const mins = Math.round(diff / 60000)
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.round(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  const days = Math.round(hrs / 24)
  return `${days}d ago`
}

export const typeLabels: Record<AssignmentType, string> = {
  assignment: 'Assignment',
  lab: 'Lab',
  project: 'Project',
  exam: 'Exam',
  reading: 'Reading',
}

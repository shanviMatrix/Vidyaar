import { PageHeader } from '@/components/page-header'
import { StudyTracker } from '@/components/study-tracker'

export default function StudyPage() {
  return (
    <div className="flex flex-col">
      <PageHeader
        eyebrow="Focus"
        title="Study session"
        description="A calm, distraction-free timer. Every focused block you log sharpens Vidyaar's estimates of how you actually work."
      />
      <StudyTracker />
    </div>
  )
}

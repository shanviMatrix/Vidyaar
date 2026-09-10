import { Plus } from 'lucide-react'
import { AssignmentsBrowser } from '@/components/assignments-browser'
import { PageHeader } from '@/components/page-header'
import { Button } from '@/components/ui/button'

export default function AssignmentsPage() {
  return (
    <div className="flex flex-col">
      <PageHeader
        eyebrow="Workspace"
        title="Assignments"
        description="Sorted by what matters most. Priority blends urgency, grade weight, remaining effort and your mastery of each subject."
        actions={
          <Button className="h-9">
            <Plus className="size-4" />
            Add assignment
          </Button>
        }
      />
      <AssignmentsBrowser />
    </div>
  )
}

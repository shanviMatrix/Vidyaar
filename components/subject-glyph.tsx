import type { ChartIndex } from '@/lib/data'
import { chartColor, chartTint } from '@/lib/colors'
import { cn } from '@/lib/utils'

export function SubjectDot({ chart, className }: { chart: ChartIndex; className?: string }) {
  return (
    <span
      className={cn('inline-block size-2.5 shrink-0 rounded-full', className)}
      style={{ backgroundColor: chartColor(chart) }}
      aria-hidden="true"
    />
  )
}

export function SubjectGlyph({
  code,
  chart,
  size = 'md',
}: {
  code: string
  chart: ChartIndex
  size?: 'sm' | 'md' | 'lg'
}) {
  const dims = size === 'lg' ? 'size-11 text-sm' : size === 'sm' ? 'size-8 text-[0.65rem]' : 'size-9 text-xs'
  return (
    <span
      className={cn('flex shrink-0 items-center justify-center rounded-lg font-semibold', dims)}
      style={{ backgroundColor: chartTint(chart, 0.16), color: chartColor(chart) }}
      aria-hidden="true"
    >
      {code.split('-')[0]}
    </span>
  )
}

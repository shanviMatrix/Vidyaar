import type { ChartIndex } from '@/lib/data'

export function chartColor(i: ChartIndex | number) {
  return `var(--chart-${i})`
}

export function chartTint(i: ChartIndex | number, alpha = 0.14) {
  return `color-mix(in oklch, var(--chart-${i}) ${alpha * 100}%, transparent)`
}

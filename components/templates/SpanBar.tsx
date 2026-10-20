import { t } from '@/i18n'
import type { DateSpec } from '@/types'
import { formatDate, formatYear, span } from '@/lib/time'
import { getEras } from '@/lib/repo'

const MIN = -600
const MAX = 2030

/** A single-row picture of where an entity’s dates sit on the global axis. */
export function SpanBar({ dates, colorVar = '--ink', label }: { dates: DateSpec; colorVar?: string; label?: string }) {
  const [s, e] = span(dates)
  const pct = (y: number) => ((Math.min(Math.max(y, MIN), MAX) - MIN) / (MAX - MIN)) * 100
  const a = pct(s), b = Math.max(pct(e), a + 0.8)
  const eras = getEras()
  return (
    <figure aria-label={label ?? t('Dates on the global axis: {dates}', { dates: formatDate(dates) })}>
      <div className="relative h-8 border border-rule bg-surface">
        {eras.map((era) => {
          const x0 = pct(Math.max(era.dates.start, MIN)), x1 = pct(Math.min(era.dates.end ?? MAX, MAX))
          return <div key={era.id} aria-hidden className="absolute inset-y-0 border-r border-rule" style={{ left: `${x0}%`, width: `${x1 - x0}%` }} />
        })}
        <div aria-hidden className="absolute inset-y-1.5" style={{ left: `${a}%`, width: `${b - a}%`, background: `rgb(var(${colorVar}))`, WebkitMaskImage: dates.approx ? 'linear-gradient(to right, transparent, #000 10px, #000 calc(100% - 10px), transparent)' : undefined, maskImage: dates.approx ? 'linear-gradient(to right, transparent, #000 10px, #000 calc(100% - 10px), transparent)' : undefined }} />
      </div>
      <div className="mt-1 flex justify-between text-[0.8rem] text-muted" aria-hidden>
        <span>{formatYear(MIN)}</span><span>0</span><span>1000</span><span>2000</span>
      </div>
    </figure>
  )
}

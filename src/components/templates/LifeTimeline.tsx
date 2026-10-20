import { useState } from 'react'
import { Link } from 'react-router-dom'
import { t } from '@/i18n'
import type { Artist } from '@/types'
import { entityPath, getEntity } from '@/lib/repo'
import { formatYear } from '@/lib/time'

/** Interactive life (or activity) timeline: every milestone is a focusable button. */
export function LifeTimeline({ artist }: { artist: Artist }) {
  const events = [...artist.lifeEvents].sort((a, b) => a.year - b.year)
  const [i, setI] = useState(0)
  if (events.length === 0) {
    return <p className="border border-dashed border-rule p-6 text-muted">{artist.kind === 'anonymous' ? t('No individual milestones are documented for this anonymous maker in the sample dataset.') : t('No individual milestones are documented for this record in the sample dataset.')}</p>
  }
  const lo = events[0].year, hi = events[events.length - 1].year
  const pad = Math.max((hi - lo) * 0.06, 2)
  const pos = (y: number) => (hi === lo ? 50 : ((y - (lo - pad)) / (hi - lo + pad * 2)) * 100)
  const cur = events[Math.min(i, events.length - 1)]
  const place = cur.place ? getEntity(cur.place) : undefined
  const atPlace = t('at {place}').split('{place}')

  return (
    <div>
      <div className="relative mx-3 h-[104px] sm:mx-6" role="group" aria-label={t('Milestones')}>
        <div className="absolute inset-x-0 top-1/2 h-px bg-ink" aria-hidden />
        {events.map((ev, k) => {
          const above = k % 2 === 0
          const active = k === i
          return (
            <button key={`${ev.year}-${k}`} type="button" onClick={() => setI(k)} aria-pressed={active} aria-label={`${formatYear(ev.year)}: ${ev.label}`}
              className="group absolute top-1/2 -translate-x-1/2 -translate-y-1/2" style={{ left: `${pos(ev.year)}%` }}>
              <span className="flex h-11 w-11 items-center justify-center">
                <span className={`block h-3.5 w-3.5 border-2 border-ink transition-all ${active ? 'scale-125 bg-ink' : 'bg-paper group-hover:bg-ink'}`} />
              </span>
              <span className={`absolute left-1/2 hidden -translate-x-1/2 whitespace-nowrap text-xs sm:block ${above ? 'bottom-[calc(50%+22px)]' : 'top-[calc(50%+22px)]'} ${active ? 'font-semibold text-ink' : 'text-muted'}`}>{formatYear(ev.year)}</span>
            </button>
          )
        })}
      </div>
      <div className="mt-4 grid gap-2 border-t border-rule pt-4 sm:grid-cols-[8rem_1fr] sm:gap-6" role="status" aria-live="polite">
        <p className="font-serif text-4xl leading-none">{formatYear(cur.year)}</p>
        <div>
          <p className="text-lg leading-snug">{cur.label}</p>
          {place && <p className="mt-1 text-sm text-muted">{atPlace[0]}<Link to={entityPath(place)} className="link-u text-ink">{place.title}</Link>{atPlace[1]}</p>}
          <div className="mt-3 flex gap-2">
            <button type="button" className="chip" onClick={() => setI(Math.max(i - 1, 0))} disabled={i === 0}>{t('← Earlier')}</button>
            <button type="button" className="chip" onClick={() => setI(Math.min(i + 1, events.length - 1))} disabled={i === events.length - 1}>{t('Later →')}</button>
            <span className="self-center text-xs text-muted">{t('{i} of {n}', { i: i + 1, n: events.length })}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

import { useState, type ReactNode } from 'react'
import { t } from '@/i18n'
import { useMediaQuery } from './hooks'

/**
 * Filters on the left, results on the right: the layout every filterable list uses.
 * From 1024px up the filter panel is a sticky sidebar; below that it folds behind a button above the results.
 */
export function FilterLayout({ id = 'filters', panel, filtered = false, children }: { id?: string; panel: ReactNode; filtered?: boolean; children: ReactNode }) {
  const wide = useMediaQuery('(min-width: 1024px)')
  const [show, setShow] = useState(false)
  return (
    <>
      <div className="mb-4 lg:hidden">
        <button type="button" className="btn btn-ghost w-full" aria-expanded={show} aria-controls={id} onClick={() => setShow(!show)}>
          {show ? t('Hide filters') : filtered ? t('Filters (on)') : t('Filters')}
        </button>
      </div>
      <div className="grid gap-8 lg:grid-cols-[17rem_minmax(0,1fr)] lg:items-start min-[1700px]:grid-cols-[19rem_minmax(0,1fr)]">
        {(wide || show) && (
          <aside id={id} aria-label={t('Filters')} className="rounded-3xl bg-surface p-5 lg:sticky lg:top-[84px] lg:max-h-[calc(100vh-100px)] lg:overflow-y-auto">
            {panel}
          </aside>
        )}
        <div className="min-w-0">{children}</div>
      </div>
    </>
  )
}

import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { t } from '@/i18n'
import type { EntityType } from '@/types'
import { getRegions, TYPE_LABEL_PLURAL } from '@/lib/repo'
import { activeFilterCount, EMPTY_FILTERS, facetOptions, filtersToParams, parseFilters, search, type Filters } from '@/lib/search'
import { EntityCard } from '@/components/ui/EntityCard'
import { useDocumentTitle } from '@/components/ui/hooks'
import { FilterLayout } from '@/components/ui/FilterLayout'
import { Close, Search } from '@/components/ui/Icons'
import { Breadcrumbs, EmptyState, PageHeader } from '@/components/ui/Page'
import { typeFill } from '@/components/ui/typeStyles'

const TYPES: EntityType[] = ['movement', 'school', 'collective', 'tradition', 'style', 'artist', 'artwork', 'event', 'exchange', 'theme', 'period', 'place']

/** Search and discovery: free text plus nine combinable filters, all reflected in the URL. */
export function SearchPage() {
  useDocumentTitle(t('Browse all'))
  const [sp, setSp] = useSearchParams()
  const filters = useMemo(() => parseFilters(sp), [sp])
  const [text, setText] = useState(filters.q)
  const f = facetOptions()

  useEffect(() => setText(filters.q), [filters.q])
  // debounce typing into the URL
  useEffect(() => {
    if (text === filters.q) return
    const timer = setTimeout(() => update({ ...filters, q: text }), 180)
    return () => clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text])

  const update = (next: Filters) => setSp(filtersToParams(next), { replace: true })
  const toggle = <T,>(arr: T[], v: T) => (arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v])

  const results = useMemo(() => search(filters), [filters])
  const n = activeFilterCount(filters)

  const chips: { label: string; clear: () => void }[] = []
  filters.types.forEach((ty) => chips.push({ label: TYPE_LABEL_PLURAL[ty], clear: () => update({ ...filters, types: filters.types.filter((x) => x !== ty) }) }))
  filters.regions.forEach((r) => chips.push({ label: getRegions().find((x) => x.id === r)?.name ?? r, clear: () => update({ ...filters, regions: filters.regions.filter((x) => x !== r) }) }))
  if (filters.era) chips.push({ label: f.eras.find((e) => e.id === filters.era)?.title ?? t('Period'), clear: () => update({ ...filters, era: undefined }) })
  if (filters.from !== undefined || filters.to !== undefined) chips.push({ label: t('Dates {from} to {to}', { from: filters.from ?? '…', to: filters.to ?? '…' }), clear: () => update({ ...filters, from: undefined, to: undefined }) })
  if (filters.movement) chips.push({ label: f.movements.find((m) => m.id === filters.movement)?.title ?? t('Movement'), clear: () => update({ ...filters, movement: undefined }) })
  if (filters.artist) chips.push({ label: f.artists.find((m) => m.id === filters.artist)?.title ?? t('Artist'), clear: () => update({ ...filters, artist: undefined }) })
  if (filters.medium) chips.push({ label: t('Medium: {value}', { value: filters.medium }), clear: () => update({ ...filters, medium: undefined }) })
  if (filters.technique) chips.push({ label: t('Technique: {value}', { value: filters.technique }), clear: () => update({ ...filters, technique: undefined }) })
  if (filters.theme) chips.push({ label: f.themes.find((m) => m.id === filters.theme)?.title ?? t('Theme'), clear: () => update({ ...filters, theme: undefined }) })

  const sel = (id: string, label: string, value: string | undefined, options: { value: string; label: string }[], set: (v?: string) => void) => (
    <label className="block" htmlFor={id}><span className="label mb-1.5 block">{label}</span>
      <select id={id} className="field" value={value ?? ''} onChange={(e) => set(e.target.value || undefined)}>
        <option value="">{t('Any')}</option>{options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select></label>
  )

  const clearAll = () => { setText(''); update(EMPTY_FILTERS) }
  const anyFilter = n > 0 || !!filters.q

  const panel = (
    <div className="space-y-5">
      <div>
        <label htmlFor="browse-q" className="label mb-1.5 block">{t('Search')}</label>
        <div className="relative">
          <Search size={18} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
          <input id="browse-q" type="search" value={text} onChange={(e) => setText(e.target.value)} placeholder={t('Search artists, works, movements, events, materials…')} className="field !pl-10" />
        </div>
      </div>
      <div role="group" aria-labelledby="f-type-l">
        <p id="f-type-l" className="label mb-2">{t('Type')}</p>
        <div className="flex flex-wrap gap-1.5">{TYPES.map((ty) => <button key={ty} type="button" className="chip chip-type" style={typeFill(ty)} aria-pressed={filters.types.includes(ty)} onClick={() => update({ ...filters, types: toggle(filters.types, ty) })}>{TYPE_LABEL_PLURAL[ty]}</button>)}</div>
      </div>
      <div role="group" aria-labelledby="f-region-l">
        <p id="f-region-l" className="label mb-2">{t('Region')}</p>
        <div className="flex flex-wrap gap-1.5">{getRegions().map((r) => <button key={r.id} type="button" className="chip" aria-pressed={filters.regions.includes(r.id)} onClick={() => update({ ...filters, regions: toggle(filters.regions, r.id) })}>{r.short}</button>)}</div>
      </div>
      {sel('f-era', t('Historical period'), filters.era, f.eras.map((e) => ({ value: e.id, label: e.title })), (v) => update({ ...filters, era: v }))}
      <fieldset><legend className="label mb-1.5">{t('Date range')} <span className="normal-case tracking-normal">{t('(years; negative = BCE)')}</span></legend>
        <div className="grid grid-cols-2 gap-2">
          <label><span className="sr-only">{t('From year')}</span><input className="field" inputMode="numeric" placeholder={t('From, e.g. -500')} value={filters.from ?? ''} onChange={(e) => update({ ...filters, from: e.target.value === '' || Number.isNaN(Number(e.target.value)) ? undefined : Number(e.target.value) })} /></label>
          <label><span className="sr-only">{t('To year')}</span><input className="field" inputMode="numeric" placeholder={t('To, e.g. 1500')} value={filters.to ?? ''} onChange={(e) => update({ ...filters, to: e.target.value === '' || Number.isNaN(Number(e.target.value)) ? undefined : Number(e.target.value) })} /></label>
        </div>
        <p className="mt-1.5 text-xs text-muted">{t('Matches anything whose dates overlap the range. Themes and places have no dates and are left out when a date filter is on.')}</p>
      </fieldset>
      {sel('f-mov', t('Movement or tradition'), filters.movement, f.movements.map((m) => ({ value: m.id, label: m.title })), (v) => update({ ...filters, movement: v }))}
      {sel('f-art', t('Artist'), filters.artist, f.artists.map((m) => ({ value: m.id, label: m.title })), (v) => update({ ...filters, artist: v }))}
      {sel('f-med', t('Medium'), filters.medium, f.mediums.map((m) => ({ value: m, label: m })), (v) => update({ ...filters, medium: v }))}
      {sel('f-tech', t('Technique'), filters.technique, f.techniques.map((m) => ({ value: m, label: m })), (v) => update({ ...filters, technique: v }))}
      {sel('f-theme', t('Theme'), filters.theme, f.themes.map((th) => ({ value: th.id, label: th.title })), (v) => update({ ...filters, theme: v }))}
      {anyFilter && (
        <div className="flex flex-wrap gap-1.5 border-t border-rule pt-4">
          <button type="button" className="chip" onClick={clearAll}>{t('Clear filters')}</button>
        </div>
      )}
    </div>
  )

  return (
    <>
      <Breadcrumbs items={[{ label: t('Explore'), to: '/explore' }, { label: t('Browse all') }]} />
      <PageHeader eyebrow={t('Explore')} title={t('Browse everything')} intro={t('Search by name, then narrow by period, place, maker, material or idea. Filters combine, and every result opens its own page.')} />
      <div className="page-x pb-20">
        <FilterLayout id="filters-panel" filtered={anyFilter} panel={panel}>
          <section aria-label={t('Results')}>
            <div className="mb-4 flex flex-wrap items-center gap-2">
              <p className="mr-3 text-sm" role="status" aria-live="polite"><strong className="font-medium">{results.length}</strong> {results.length === 1 ? t('result') : t('results')}{filters.q ? ` ${t('for “{q}”', { q: filters.q })}` : ''}</p>
              {chips.map((c, i) => <button key={i} type="button" className="chip bg-surface" onClick={c.clear} aria-label={t('Remove filter: {label}', { label: c.label })}>{c.label}<Close size={12} /></button>)}
              {anyFilter && <button type="button" className="chip border-transparent underline underline-offset-4" onClick={clearAll}>{t('Clear all')}</button>}
            </div>
            {results.length === 0 ? (
              <EmptyState title={t('Nothing matches those filters')}>{t('Filters combine, so the set can narrow quickly. Remove one or two and try again.')}</EmptyState>
            ) : (
              <div>{results.slice(0, 80).map((r) => <EntityCard key={r.entity.id} entity={r.entity} variant="row" />)}<div className="rule-t" /></div>
            )}
          </section>
        </FilterLayout>
      </div>
    </>
  )
}

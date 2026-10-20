import { Fragment, useMemo, useState, type ReactNode } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import type { Artist, Gender, RegionId } from '@/types'
import { artistsOfMovement, entityPath, getArtists, getEntity, getRegions, movementsOfArtist, regionName } from '@/lib/repo'
import { formatDate } from '@/lib/time'
import { ARTIST_SECTIONS } from '@/data/taxonomy'
import { ConnectionsGraph } from '@/components/graph/ConnectionsGraph'
import { PortraitImage } from '@/components/ui/PortraitImage'
import { useDocumentTitle, useMediaQuery } from '@/components/ui/hooks'
import { Breadcrumbs, EmptyState, PageHeader } from '@/components/ui/Page'
import { t } from '@/i18n'

/** Fill {name} slots in a translated string with JSX nodes, so Greek word order stays natural. */
function rich(s: string, parts: Record<string, ReactNode>): ReactNode[] {
  return s.split(/(\{\w+\})/g).map((p, i) => { const k = /^\{(\w+)\}$/.exec(p)?.[1]; return k && k in parts ? <Fragment key={i}>{parts[k]}</Fragment> : p })
}

const KINDS: { id: 'all' | Artist['kind']; label: string }[] = [
  { id: 'all', label: t('All') }, { id: 'individual', label: t('Individual artists') }, { id: 'workshop', label: t('Workshops') }, { id: 'collective', label: t('Collectives & guilds') }, { id: 'anonymous', label: t('Anonymous makers') },
]
const GENDERS: { id: Gender; label: string }[] = [
  { id: 'woman', label: t('Women') }, { id: 'man', label: t('Men') }, { id: 'non-binary or gender-diverse', label: t('Non-binary or gender-diverse') },
]
const PAGE = 60

const initials = (name: string) => {
  const w = name.replace(/\(.*\)/, '').split(/\s+/).filter((x) => /^[\p{L}]/u.test(x))
  return ((w[0]?.[0] ?? '') + (w.length > 1 ? w[w.length - 1][0] : '')).toUpperCase()
}

/** Photo (or a neutral initials tile where no verified portrait exists) with the name beside it. */
function Row({ a, showMovements = true }: { a: Artist; showMovements?: boolean }) {
  const movs = showMovements ? movementsOfArtist(a.id).slice(0, 3) : []
  return (
    <li>
      <Link to={entityPath(a)} className="group flex items-center gap-4 rounded-2xl p-2.5 transition-colors hover:bg-surface">
        {a.portrait?.src ? (
          <PortraitImage artist={a} ratio={1} className="!h-16 !w-16 shrink-0 !rounded-full !aspect-square" />
        ) : (
          <span aria-hidden className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-sunk font-display text-xl text-ink">{initials(a.title)}</span>
        )}
        <span className="min-w-0">
          <span className="block font-display text-[1.3rem] leading-tight group-hover:underline">{a.title}</span>
          <span className="block text-sm text-muted">
            {(a.subtitle ?? '').split(' · ')[0]}{a.originLabel ? ` · ${a.originLabel}` : ''} · {formatDate(a.dates)}
          </span>
          {movs.length > 0 && <span className="mt-0.5 block text-xs text-muted">{movs.map((m) => m.title).join(' · ')}</span>}
          {a.flags?.some((f) => f.startsWith('Unresolved')) && <span className="mt-1 inline-block rounded-full bg-surface px-2 py-0.5 text-xs text-muted">{t('needs verification')}</span>}
        </span>
      </Link>
    </li>
  )
}

export function ArtistsPage() {
  useDocumentTitle(t('Artists'))
  const [sp, setSp] = useSearchParams()
  const kind = (sp.get('kind') ?? 'all') as 'all' | Artist['kind']
  const region = sp.get('region') as RegionId | null
  const section = sp.get('section')
  const gender = sp.get('gender') as Gender | null
  const era = sp.get('era') as 'historical' | 'contemporary' | null
  const movementId = sp.get('movement')
  const profilesOnly = sp.get('profiles') === '1'
  const q = sp.get('q') ?? ''
  const sort = (sp.get('sort') ?? 'time') as 'time' | 'new' | 'name'
  const group = (sp.get('group') ?? 'movement') as 'movement' | 'section' | 'none'
  const [limit, setLimit] = useState(PAGE)
  const wide = useMediaQuery('(min-width: 1024px)')
  const [showFilters, setShowFilters] = useState(false)
  const set = (k: string, v: string | null) => { const n = new URLSearchParams(sp); if (v) n.set(k, v); else n.delete(k); setSp(n, { replace: true }); setLimit(PAGE) }

  const all = useMemo(() => getArtists(), [])
  const profileCount = all.filter((a) => a.level !== 'index').length
  const movementArtists = useMemo(() => (movementId ? new Set(artistsOfMovement(movementId).map((a) => a.id)) : null), [movementId])

  const list = useMemo(() => {
    const needle = q.trim().toLowerCase()
    const l = all.filter((a) =>
      (kind === 'all' || a.kind === kind) && (!region || a.regions.includes(region)) && (!section || a.taxonomy === section) &&
      (!gender || a.gender === gender) && (!era || (era === 'contemporary') === !!a.contemporary) && (!profilesOnly || a.level !== 'index') &&
      (!movementArtists || movementArtists.has(a.id)) &&
      (!needle || a.title.toLowerCase().includes(needle) || a.altTitles?.some((x) => x.toLowerCase().includes(needle)) || a.originLabel?.toLowerCase().includes(needle)))
    return l.sort((x, y) => (sort === 'name' ? x.title.localeCompare(y.title) : sort === 'new' ? y.dates.start - x.dates.start : x.dates.start - y.dates.start))
  }, [all, kind, region, section, gender, era, profilesOnly, movementArtists, q, sort])

  const groups = useMemo(() => {
    if (group === 'none') return null
    const out = new Map<string, { key: string; title: string; to?: string; start: number; items: Artist[] }>()
    const add = (key: string, title: string, start: number, a: Artist, to?: string) => {
      const g = out.get(key) ?? { key, title, to, start, items: [] }
      g.items.push(a); out.set(key, g)
    }
    for (const a of list) {
      if (group === 'section') {
        const sec = ARTIST_SECTIONS.findIndex((x) => x.id === a.taxonomy)
        add(a.taxonomy ?? 'zz', ARTIST_SECTIONS[sec]?.label ?? t('Not in the master list'), sec < 0 ? 1e9 : sec, a)
      } else {
        const ms = movementsOfArtist(a.id)
        if (!ms.length) add('zz', t('No movement assigned yet'), 1e9, a)
        for (const m of ms) add(m.id, m.title, m.dates.start, a, entityPath(m))
      }
    }
    const dir = sort === 'new' ? -1 : 1
    return [...out.values()].sort((x, y) => (x.start >= 1e8 ? 1 : y.start >= 1e8 ? -1 : (x.start - y.start) * dir))
  }, [list, group, sort])
  const shown = list.slice(0, limit)
  const filtered = !!(q || region || section || gender || era || movementId || profilesOnly || kind !== 'all')
  const clear = () => { setSp(new URLSearchParams(), { replace: true }); setLimit(PAGE) }
  const movementTitle = movementId ? getEntity(movementId)?.title : undefined

  const chip = (on: boolean, label: string, onClick: () => void, extra = '') => (
    <button type="button" className={`chip ${extra}`} aria-pressed={on} onClick={onClick}>{label}</button>
  )

  const panel = (
    <div className="space-y-5">
      <div>
        <label htmlFor="a-q" className="label mb-1.5 block">{t('Search')}</label>
        <input id="a-q" type="search" value={q} onChange={(e) => set('q', e.target.value || null)} placeholder={t('Name, alt name or country…')} className="field" />
      </div>
      <div>
        <label htmlFor="a-sort" className="label mb-1.5 block">{t('Order')}</label>
        <select id="a-sort" value={sort} onChange={(e) => set('sort', e.target.value === 'time' ? null : e.target.value)} className="field">
          <option value="time">{t('Old to new')}</option><option value="new">{t('New to old')}</option><option value="name">{t('A–Z')}</option>
        </select>
      </div>
      <div>
        <p className="label mb-2">{t('Group by')}</p>
        <div role="group" aria-label={t('Group by')} className="flex flex-wrap gap-1.5">
          {(['movement', 'section', 'none'] as const).map((g) => chip(group === g, g === 'none' ? t('No grouping') : g === 'movement' ? t('Movement') : t('Section'), () => set('group', g === 'movement' ? null : g)))}
        </div>
      </div>
      <div>
        <label htmlFor="a-section" className="label mb-1.5 block">{t('Section')}</label>
        <select id="a-section" value={section ?? ''} onChange={(e) => set('section', e.target.value || null)} className="field">
          <option value="">{t('All 18 sections')}</option>
          {ARTIST_SECTIONS.map((x) => <option key={x.id} value={x.id}>{x.label}</option>)}
        </select>
      </div>
      <div>
        <p className="label mb-2">{t('Period')}</p>
        <div role="group" aria-label={t('Period')} className="flex flex-wrap gap-1.5">
          {chip(!era, t('All'), () => set('era', null))}
          {chip(era === 'historical', t('Historical'), () => set('era', era === 'historical' ? null : 'historical'))}
          {chip(era === 'contemporary', t('Contemporary'), () => set('era', era === 'contemporary' ? null : 'contemporary'))}
        </div>
        <p className="mt-1.5 text-xs text-muted">{t('Contemporary = born 1930 or later.')}</p>
      </div>
      <div>
        <p className="label mb-2">{t('Gender')}</p>
        <div role="group" aria-label={t('Gender')} className="flex flex-wrap gap-1.5">
          {chip(!gender, t('All'), () => set('gender', null))}
          {GENDERS.map((g) => chip(gender === g.id, g.label, () => set('gender', gender === g.id ? null : g.id)))}
        </div>
      </div>
      <div>
        <p className="label mb-2">{t('Kind of maker')}</p>
        <div role="group" aria-label={t('Kind of maker')} className="flex flex-wrap gap-1.5">
          {KINDS.map((k) => chip(kind === k.id, k.label, () => set('kind', k.id === 'all' ? null : k.id)))}
        </div>
      </div>
      <div>
        <p className="label mb-2">{t('Region')}</p>
        <div role="group" aria-label={t('Region')} className="flex flex-wrap gap-1.5">
          {chip(!region, t('All regions'), () => set('region', null))}
          {getRegions().filter((r) => all.some((a) => a.regions.includes(r.id))).map((r) => chip(region === r.id, r.short, () => set('region', region === r.id ? null : r.id)))}
        </div>
      </div>
      <div className="flex flex-wrap gap-1.5 border-t border-rule pt-4">
        {chip(profilesOnly, t('Profiles only'), () => set('profiles', profilesOnly ? null : '1'))}
        {filtered && <button type="button" className="chip" onClick={clear}>{t('Clear filters')}</button>}
      </div>
    </div>
  )

  return (
    <>
      <Breadcrumbs items={[{ label: t('Artists') }]} />
      <PageHeader eyebrow={t('Artists · {n} records · {p} with profiles', { n: all.length, p: profileCount })} title={t('Artists, makers and workshops')}
        intro={t('The master list of artists, architects, designers, photographers, anonymous makers and workshops. Records marked Index hold identity, dates, origin and movement links; profiles are written over time.')} />
      <div className="page-x pb-20">
        <div className="mb-4 lg:hidden">
          <button type="button" className="btn btn-ghost w-full" aria-expanded={showFilters} aria-controls="a-filters" onClick={() => setShowFilters(!showFilters)}>{showFilters ? t('Hide filters') : filtered ? t('Filters (on)') : t('Filters')}</button>
        </div>
        <div className="grid gap-8 lg:grid-cols-[17rem_minmax(0,1fr)] min-[1700px]:grid-cols-[19rem_minmax(0,1fr)] lg:items-start">
          {(wide || showFilters) && (
            <aside id="a-filters" aria-label={t('Filters')} className="rounded-3xl bg-surface p-5 lg:sticky lg:top-[84px] lg:max-h-[calc(100vh-100px)] lg:overflow-y-auto">
              {panel}
            </aside>
          )}
          <div className="min-w-0">
            {movementTitle && <p className="mb-3 text-sm">{rich(t('Showing artists linked to {name}.'), { name: <strong className="font-medium">{movementTitle}</strong> })} <button type="button" onClick={() => set('movement', null)} className="link-u">{t('Remove')}</button></p>}
            <p aria-live="polite" className="mb-4 text-sm text-muted">
              {list.length === 1 ? t('{n} record', { n: list.length }) : t('{n} records', { n: list.length })}{section ? ` · ${ARTIST_SECTIONS.find((x) => x.id === section)?.label}` : ''}{region ? ` · ${regionName(region)}` : ''}
            </p>
            {list.length === 0 ? <EmptyState title={t('Nobody matches those filters')}>{t('Try removing a filter, or')} <button type="button" onClick={clear} className="link-u text-ink">{t('clear them all')}</button>.</EmptyState> : groups ? (
              <div className="space-y-9">
                {groups.map((g) => (
                  <section key={g.key} aria-labelledby={`g-${g.key}`}>
                    <h2 id={`g-${g.key}`} className="mb-2 flex flex-wrap items-baseline gap-x-3 border-b border-ink pb-1.5 font-display text-2xl">
                      {g.to ? <Link to={g.to} className="link-u">{g.title}</Link> : g.title}
                      <span className="text-sm text-muted">{g.items.length}</span>
                    </h2>
                    <ul className="grid gap-x-4 sm:grid-cols-2 min-[1700px]:grid-cols-3 min-[2200px]:grid-cols-4">{g.items.map((a) => <Row key={a.id} a={a} showMovements={group !== 'movement'} />)}</ul>
                  </section>
                ))}
                {group === 'movement' && <p className="max-w-prose text-sm text-muted">{t('Artists can belong to several movements, so they appear under each one.')}</p>}
              </div>
            ) : (
              <section aria-label={t('Artists')}>
                <ul className="grid gap-x-4 sm:grid-cols-2 min-[1700px]:grid-cols-3 min-[2200px]:grid-cols-4">{shown.map((a) => <Row key={a.id} a={a} />)}</ul>
                {list.length > shown.length && (
                  <div className="mt-8 flex items-center gap-4">
                    <button type="button" className="btn btn-ghost" onClick={() => setLimit((l) => l + PAGE)}>{t('Show {n} more', { n: Math.min(PAGE, list.length - shown.length) })}</button>
                    <span className="text-sm text-muted">{t('{shown} of {total}', { shown: shown.length, total: list.length })}</span>
                  </div>
                )}
              </section>
            )}
            <p className="mt-12 max-w-prose text-sm leading-relaxed text-muted">
              {rich(t('See {link} for an honest look at who is, and is not yet, represented in this list.'), { link: <Link to="/explore/coverage" className="link-u text-ink">{t('Coverage & gaps')}</Link> })}
            </p>
          </div>
        </div>
      </div>
    </>
  )
}

export function ArtistRelationships() {
  useDocumentTitle(t('Artist relationships'))
  return (
    <>
      <Breadcrumbs items={[{ label: t('Artists'), to: '/artists' }, { label: t('Relationships') }]} />
      <PageHeader eyebrow={t('Artists')} title={t('Who taught, influenced or worked with whom')}
        intro={t('A focused view of artists and the movements and exchanges that connect them. Every line is a documented relationship with a stated reason — click a node to read it.')} />
      <div className="page-x pb-20">
        <ConnectionsGraph defaultFocus="artist-van-gogh" heading={t('Artist relationships')}
          presetEntityGroups={['artist', 'movement', 'exchange']}
          presetRelations={['influenced_by', 'collaborated_with', 'studied_under', 'associated_with', 'cultural_exchange', 'developed_from']} />
      </div>
    </>
  )
}

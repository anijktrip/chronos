import { Fragment, useMemo, useState, type ReactNode } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import type { Domain, EntityType, MovementLike, RegionId } from '@/types'
import { entityPath, getMovements, getRegions, regionName, TYPE_LABEL_PLURAL } from '@/lib/repo'
import { formatDate } from '@/lib/time'
import { DOMAIN_LABEL, MOVEMENT_SECTIONS } from '@/data/taxonomy'
import { EntityCard } from '@/components/ui/EntityCard'
import { useDocumentTitle } from '@/components/ui/hooks'
import { FilterLayout } from '@/components/ui/FilterLayout'
import { Breadcrumbs, EmptyState, PageHeader } from '@/components/ui/Page'
import { Reveal } from '@/components/ui/Reveal'
import { TypeBadge } from '@/components/ui/TypeBadge'
import { typeFill } from '@/components/ui/typeStyles'
import { t } from '@/i18n'

/** Fill {name} slots in a translated string with JSX nodes, so Greek word order stays natural. */
function rich(s: string, parts: Record<string, ReactNode>): ReactNode[] {
  return s.split(/(\{\w+\})/g).map((p, i) => { const k = /^\{(\w+)\}$/.exec(p)?.[1]; return k && k in parts ? <Fragment key={i}>{parts[k]}</Fragment> : p })
}

const KINDS: { id: 'all' | EntityType; label: string; hint?: string }[] = [
  { id: 'all', label: t('All') },
  { id: 'movement', label: TYPE_LABEL_PLURAL.movement, hint: t('Named groups or currents with shared aims') },
  { id: 'school', label: TYPE_LABEL_PLURAL.school, hint: t('Teaching institutions and workshops') },
  { id: 'collective', label: TYPE_LABEL_PLURAL.collective, hint: t('Groups, associations and collectives') },
  { id: 'tradition', label: TYPE_LABEL_PLURAL.tradition, hint: t('Long-lived practices rooted in a community or court') },
  { id: 'style', label: TYPE_LABEL_PLURAL.style, hint: t('Recognisable styles and strands') },
]

/** Fields shown first because the user-facing question is how art connects to design, type, architecture and photography. */
const DOMAIN_ORDER: Domain[] = ['graphic-design', 'typography', 'architecture', 'design', 'photography', 'craft', 'painting', 'sculpture', 'printmaking', 'installation', 'performance', 'film-video', 'digital', 'literature', 'ceramics', 'urbanism']

const PAGE = 60

const sectionLabel = (id: string) => MOVEMENT_SECTIONS.find((s) => s.id === id)?.label ?? id

function Row({ m }: { m: MovementLike }) {
  const full = m.level !== 'index'
  return (
    <li>
      <Link to={entityPath(m)} className="group grid grid-cols-[1fr_auto] items-baseline gap-x-6 gap-y-1 border-t border-rule px-1 py-3.5 transition-colors hover:bg-surface sm:grid-cols-[minmax(0,1.6fr)_9rem_minmax(0,11rem)_6.5rem] sm:px-3">
        <span className="min-w-0">
          <span className="font-display text-xl leading-tight group-hover:underline">{m.title}</span>
          {!!m.altNames?.length && <span className="ml-2 hidden text-sm text-muted lg:inline">{m.altNames[0]}</span>}
        </span>
        <span className="justify-self-end sm:justify-self-start"><TypeBadge type={m.type} /></span>
        <span className="col-span-2 text-sm text-muted sm:col-span-1">{formatDate(m.dates)} · {m.regions.map((r) => getRegions().find((x) => x.id === r)?.short ?? r).slice(0, 2).join(', ')}</span>
        <span className="hidden justify-self-end text-xs sm:block">
          <span className={`rounded-full px-2.5 py-1 ${full ? 'bg-ink text-paper' : 'bg-surface text-muted'}`}>{full ? t('Full page') : t('Index')}</span>
        </span>
      </Link>
    </li>
  )
}

export function MovementsPage() {
  useDocumentTitle(t('Movements & Traditions'))
  const [sp, setSp] = useSearchParams()
  const kind = (sp.get('kind') ?? 'all') as 'all' | EntityType
  const region = sp.get('region') as RegionId | null
  const section = sp.get('section')
  const domain = sp.get('domain') as Domain | null
  const fullOnly = sp.get('full') === '1'
  const q = sp.get('q') ?? ''
  const sort = (sp.get('sort') ?? 'time') as 'time' | 'name' | 'section'
  const [limit, setLimit] = useState(PAGE)

  const set = (k: string, v: string | null) => { const n = new URLSearchParams(sp); if (v) n.set(k, v); else n.delete(k); setSp(n, { replace: true }); setLimit(PAGE) }

  const all = useMemo(() => getMovements(), [])
  const domainsPresent = useMemo(() => DOMAIN_ORDER.filter((d) => all.some((m) => m.domains?.includes(d))), [all])
  const fullCount = all.filter((m) => m.level !== 'index').length

  const list = useMemo(() => {
    const needle = q.trim().toLowerCase()
    const l = all.filter((m) =>
      (kind === 'all' || m.type === kind) && (!region || m.regions.includes(region)) && (!section || m.taxonomy?.includes(section)) &&
      (!domain || m.domains?.includes(domain)) && (!fullOnly || m.level !== 'index') &&
      (!needle || m.title.toLowerCase().includes(needle) || m.altNames?.some((a) => a.toLowerCase().includes(needle))))
    return l.sort((a, b) => (sort === 'name' ? a.title.localeCompare(b.title) : a.dates.start - b.dates.start))
  }, [all, kind, region, section, domain, fullOnly, q, sort])

  const featured = list.filter((m) => m.level !== 'index')
  const rest = sort === 'section' ? list : list
  const shown = rest.slice(0, limit)
  const filtered = !!(q || region || section || domain || fullOnly || kind !== 'all')

  // group by primary section when requested
  const groups = useMemo(() => {
    if (sort !== 'section') return null
    const map = new Map<string, MovementLike[]>()
    for (const m of shown) { const id = m.taxonomy?.[0] ?? 'other'; map.set(id, [...(map.get(id) ?? []), m]) }
    return MOVEMENT_SECTIONS.map((s) => ({ s, items: map.get(s.id) ?? [] })).filter((g) => g.items.length)
  }, [shown, sort])

  const clear = () => { setSp(new URLSearchParams(), { replace: true }); setLimit(PAGE) }

  return (
    <>
      <Breadcrumbs items={[{ label: t('Movements & Traditions') }]} />
      <PageHeader eyebrow={t('Movements & Traditions · {n} entries · {full} with full pages', { n: all.length, full: fullCount })} title={t('Movements, schools & traditions')}
        intro={t('A taxonomy of movements, design movements, schools, collectives and visual traditions from every region. Each keeps its correct classification — a school is not a movement, and a collective is not a style. Entries marked Index carry dates, origins and documented relationships now; their pages are written over time.')} />
      <div className="page-x pb-20">
        <FilterLayout id="m-filters" filtered={filtered} panel={
          <div className="space-y-5">
            <div>
              <label htmlFor="m-q" className="label mb-1.5 block">{t('Search this list')}</label>
              <input id="m-q" type="search" value={q} onChange={(e) => set('q', e.target.value || null)} placeholder={t('Bauhaus, Gutai, typography…')} className="field" />
            </div>
            <div>
              <label htmlFor="m-sort" className="label mb-1.5 block">{t('Order')}</label>
              <select id="m-sort" value={sort} onChange={(e) => set('sort', e.target.value === 'time' ? null : e.target.value)} className="field">
                <option value="time">{t('Oldest first')}</option><option value="section">{t('By section')}</option><option value="name">{t('A–Z')}</option>
              </select>
            </div>
            <div>
              <p className="label mb-2">{t('Classification')}</p>
              <div role="group" aria-label={t('Classification')} className="flex flex-wrap gap-1.5">
                {KINDS.map((k) => (
                  <button key={k.id} type="button" className={`chip ${k.id === 'all' ? '' : 'chip-type'}`} style={k.id === 'all' ? undefined : typeFill(k.id as EntityType)} aria-pressed={kind === k.id} title={k.hint} onClick={() => set('kind', k.id === 'all' ? null : k.id)}>
                    {k.label}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label htmlFor="m-section" className="label mb-1.5 block">{t('Section')}</label>
              <select id="m-section" value={section ?? ''} onChange={(e) => set('section', e.target.value || null)} className="field">
                <option value="">{t('All sections')}</option>
                {MOVEMENT_SECTIONS.map((s) => <option key={s.id} value={s.id}>{s.short}</option>)}
              </select>
            </div>
            <div>
              <p className="label mb-1">{t('Field of practice')}</p>
              <p className="mb-2 text-xs text-muted">{t('see how art, design, type, architecture and photography connect')}</p>
              <div role="group" aria-label={t('Field of practice')} className="flex flex-wrap gap-1.5">
                <button type="button" className="chip" aria-pressed={!domain} onClick={() => set('domain', null)}>{t('All fields')}</button>
                {domainsPresent.map((d) => <button key={d} type="button" className="chip" aria-pressed={domain === d} onClick={() => set('domain', domain === d ? null : d)}>{DOMAIN_LABEL[d]}</button>)}
              </div>
            </div>
            <div>
              <p className="label mb-2">{t('Region')}</p>
              <div role="group" aria-label={t('Region')} className="flex flex-wrap gap-1.5">
                <button type="button" className="chip" aria-pressed={!region} onClick={() => set('region', null)}>{t('All regions')}</button>
                {getRegions().filter((r) => all.some((m) => m.regions.includes(r.id))).map((r) => (
                  <button key={r.id} type="button" className="chip" aria-pressed={region === r.id} onClick={() => set('region', region === r.id ? null : r.id)}>{r.short}</button>
                ))}
              </div>
            </div>
            <div className="flex flex-wrap gap-1.5 border-t border-rule pt-4">
              <button type="button" className="chip" aria-pressed={fullOnly} onClick={() => set('full', fullOnly ? null : '1')}>{t('Full pages only')}</button>
              {filtered && <button type="button" className="chip" onClick={clear}>{t('Clear filters')}</button>}
            </div>
          </div>
        }>

        <p aria-live="polite" className="mb-6 text-sm text-muted">
          {list.length === 1 ? t('{n} entry', { n: list.length }) : t('{n} entries', { n: list.length })}{section ? ` ${t('in “{name}”', { name: sectionLabel(section) })}` : ''}{domain ? ` · ${DOMAIN_LABEL[domain]}` : ''}{region ? ` · ${regionName(region)}` : ''}
        </p>

        {list.length === 0 ? <EmptyState title={t('Nothing matches those filters')}>{t('Try removing a filter, or')} <button type="button" onClick={clear} className="link-u text-ink">{t('clear them all')}</button>.</EmptyState> : (
          <>
            {featured.length > 0 && !fullOnly && (
              <section aria-labelledby="featured-h" className="mb-14">
                <h2 id="featured-h" className="mb-5 font-display text-3xl">{t('Complete pages')} <span className="text-muted">· {featured.length}</span></h2>
                <div className="grid gap-5 sm:grid-cols-2 min-[1500px]:grid-cols-3">
                  {featured.slice(0, 9).map((m, i) => <Reveal key={m.id} delay={Math.min(i, 6) * 50}><EntityCard entity={m} /></Reveal>)}
                </div>
                {featured.length > 9 && <p className="mt-4 text-sm text-muted">{featured.length - 9 === 1 ? t('{n} more complete page is listed below.', { n: 1 }) : t('{n} more complete pages are listed below.', { n: featured.length - 9 })}</p>}
              </section>
            )}

            {fullOnly ? (
              <div className="grid gap-5 sm:grid-cols-2 min-[1500px]:grid-cols-3">{featured.map((m, i) => <Reveal key={m.id} delay={Math.min(i, 6) * 50}><EntityCard entity={m} /></Reveal>)}</div>
            ) : (
              <section aria-labelledby="all-h">
                <h2 id="all-h" className="mb-3 font-display text-3xl">{t('All entries')}</h2>
                {groups ? groups.map((g) => (
                  <Fragment key={g.s.id}>
                    <h3 className="label mb-1 mt-8">{g.s.label} · {g.items.length}</h3>
                    <ul>{g.items.map((m) => <Row key={m.id} m={m} />)}<li className="rule-t" aria-hidden /></ul>
                  </Fragment>
                )) : (
                  <ul>{shown.map((m) => <Row key={m.id} m={m} />)}<li className="rule-t" aria-hidden /></ul>
                )}
                {rest.length > shown.length && (
                  <div className="mt-8 flex items-center gap-4">
                    <button type="button" className="btn btn-ghost" onClick={() => setLimit((l) => l + PAGE)}>{t('Show {n} more', { n: Math.min(PAGE, rest.length - shown.length) })}</button>
                    <span className="text-sm text-muted">{t('{shown} of {total}', { shown: shown.length, total: rest.length })}</span>
                  </div>
                )}
              </section>
            )}
          </>
        )}

        <p className="mt-14 max-w-prose text-sm leading-relaxed text-muted">
          {rich(t('Gaps are listed openly on the {link} page — for example movements such as Rinpa, Group f/64 or the Oshogbo school that are not yet in the taxonomy.'), { link: <Link to="/explore/coverage" className="link-u text-ink">{t('Coverage & gaps')}</Link> })}
        </p>
        </FilterLayout>
      </div>
    </>
  )
}

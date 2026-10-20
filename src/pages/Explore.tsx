import { useMemo, useState } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import { t } from '@/i18n'
import type { Entity, EntityType, RegionId } from '@/types'
import { entitiesInRegion, entityPath, getArtworks, getEras, getMovements, getPeriods, getRegion, getRegions, regionName, TYPE_LABEL_PLURAL, allEntities, written } from '@/lib/repo'
import { activeAt, formatDate, formatYear, span } from '@/lib/time'
import { EntityCard } from '@/components/ui/EntityCard'
import { useDocumentTitle } from '@/components/ui/hooks'
import { ArrowRight } from '@/components/ui/Icons'
import { Breadcrumbs, PageHeader, SectionHeading } from '@/components/ui/Page'
import { Reveal } from '@/components/ui/Reveal'
import { TypeBadge } from '@/components/ui/TypeBadge'
import { SpanBar } from '@/components/templates/SpanBar'
import { WorldMap } from '@/components/templates/WorldMap'
import { Missing } from './MovementDetail'

/* ------------------------------------------------------------------ */
/* Overview                                                            */
/* ------------------------------------------------------------------ */

export function ExploreOverview() {
  useDocumentTitle(t('Explore'))
  // Four colour-coded doors (brand Volt, Lean, Heat and Black).
  const doors = [
    { to: '/explore/timeline', tone: 'bg-volt text-ink', title: t('The global timeline'), text: t('Ten regional lanes on one axis. Zoom from three thousand years to a single decade; filter by region and kind.'), cta: t('Open the timeline') },
    { to: '/explore/geography', tone: 'bg-lean text-[#0f1212]', title: t('Across the world'), text: t('Drag a year slider and see which traditions, artists and events were active in every region at once.'), cta: t('Explore by place') },
    { to: '/explore/periods', tone: 'bg-heat text-ink', title: t('Historical periods'), text: t('Five shared eras for comparison, and the regional periods — Song, Edo, Mughal, Classic Maya — that organise each place’s own story.'), cta: t('See the periods') },
    { to: '/explore/browse', tone: 'bg-sunk text-ink', title: t('Browse and filter'), text: t('Search by name, then combine period, date range, region, movement, artist, medium, technique and theme.'), cta: t('Browse all') },
  ]
  const starts = [
    { q: t('What was being made around the world in 1500?'), to: '/explore/geography?year=1500' },
    { q: t('What did the Song dynasty, the Khmer Empire and Benin have in common?'), to: '/explore/timeline?types=tradition,style,event&regions=east-asia,southeast-asia,sub-saharan-africa' },
    { q: t('How did Japanese prints reach Paris?'), to: '/learn/path/path-edo-to-paris' },
    { q: t('Where do the sample records cluster in time?'), to: '/explore/timeline' },
  ]
  return (
    <>
      <Breadcrumbs items={[{ label: t('Explore') }]} />
      <PageHeader eyebrow={t('Explore')} title={t('Four ways in')} intro={t('History is not a single line from one movement to the next. Pick the view that fits your question.')} />
      <div className="page-x grid gap-4 md:grid-cols-2 min-[1700px]:grid-cols-4">
        {doors.map((d, i) => (
          <Reveal key={d.to} delay={i * 60}>
            <Link to={d.to} className={`group relative flex h-full min-h-[18rem] flex-col justify-between overflow-hidden rounded-[2rem] p-7 transition-transform duration-300 hover:-translate-y-1 sm:min-h-[21rem] sm:p-10 min-[1700px]:min-h-[28rem] min-[1700px]:p-9 ${d.tone}`}>
              <span className="mt-auto block pt-10">
                <span className="page-title block max-w-[14ch] !text-[clamp(1.9rem,2.6vw+0.8rem,2.8rem)]">{d.title}</span>
                <span className="mt-4 block max-w-md text-[0.98rem] leading-relaxed">{d.text}</span>
                <span className="mt-7 inline-flex items-center gap-3 text-sm">
                  <span className={`flex h-12 w-12 items-center justify-center rounded-full transition-transform duration-300 group-hover:-rotate-45 bg-ink text-white`}><ArrowRight size={18} /></span>
                  {d.cta}
                </span>
              </span>
            </Link>
          </Reveal>
        ))}
      </div>
      <section className="py-20">
        <div className="page-x"><SectionHeading label={t('Or begin with a question')} title={t('Starting points')} /></div>
        <ul className="page-x grid gap-3 md:grid-cols-2 min-[1700px]:grid-cols-4">
          {starts.map((s) => (
            <li key={s.q}>
              <Link to={s.to} className="group flex h-full items-center justify-between gap-6 rounded-3xl bg-surface p-6 text-[1.15rem] leading-snug transition-colors hover:bg-volt sm:p-7 sm:text-[1.3rem]">
                {s.q}
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-ink text-volt transition-transform duration-300 group-hover:-rotate-45"><ArrowRight size={18} /></span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </>
  )
}

/* ------------------------------------------------------------------ */
/* Geography: the “meanwhile” explorer                                 */
/* ------------------------------------------------------------------ */

const YEAR_MIN = -500, YEAR_MAX = 2000
const YEAR_PRESETS = [-210, 800, 1000, 1200, 1500, 1650, 1850, 1925, 1950]
const SHOWN: EntityType[] = ['tradition', 'style', 'school', 'collective', 'movement', 'artist', 'event']

export function GeographyPage() {
  useDocumentTitle(t('Geographic exploration'))
  const [sp, setSp] = useSearchParams()
  const y0 = Number(sp.get('year'))
  const [year, setYearState] = useState(Number.isFinite(y0) && sp.get('year') ? Math.min(Math.max(y0, YEAR_MIN), YEAR_MAX) : 1500)
  const [hi, setHi] = useState<RegionId | null>(null)
  const setYear = (y: number) => { setYearState(y); const n = new URLSearchParams(sp); n.set('year', String(y)); setSp(n, { replace: true }) }

  const byRegion = useMemo(() => {
    const m = new Map<RegionId, Entity[]>()
    for (const r of getRegions()) {
      m.set(r.id, written(allEntities()).filter((e) => SHOWN.includes(e.type) && e.regions.includes(r.id) && activeAt(e.dates, year))
        .sort((a, b) => SHOWN.indexOf(a.type) - SHOWN.indexOf(b.type) || a.dates.start - b.dates.start))
    }
    return m
  }, [year])
  const active = new Set([...byRegion.entries()].filter(([, v]) => v.length).map(([k]) => k))
  const counts = Object.fromEntries([...byRegion.entries()].map(([k, v]) => [k, v.length])) as Record<RegionId, number>
  const total = [...byRegion.values()].reduce((a, v) => a + v.length, 0)

  return (
    <>
      <Breadcrumbs items={[{ label: t('Explore'), to: '/explore' }, { label: t('Geographic Exploration') }]} />
      <PageHeader eyebrow={t('Explore')} title={t('One year, every region')} intro={t('Choose a year. Every region lights up with what the sample dataset records as active then — so no place is ever the default centre of the story.')} />
      <div className="page-x pb-20">
        <div className="border border-rule bg-surface p-3 sm:p-6">
          <div className="mb-4 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="label">{t('Selected year')}</p>
              <p className="font-serif text-6xl leading-none sm:text-8xl" aria-live="polite">{formatYear(year)}</p>
              <p className="mt-2 text-sm text-muted">{t('{entries} across {regions}', { entries: total === 1 ? t('{n} active entry', { n: total }) : t('{n} active entries', { n: total }), regions: active.size === 1 ? t('{n} region', { n: active.size }) : t('{n} regions', { n: active.size }) })}</p>
            </div>
            <div className="flex flex-wrap gap-1.5" role="group" aria-label={t('Jump to a year')}>
              {YEAR_PRESETS.map((y) => <button key={y} type="button" className="chip" aria-pressed={year === y} onClick={() => setYear(y)}>{formatYear(y)}</button>)}
            </div>
          </div>
          <label htmlFor="year-range" className="sr-only">{t('Year')}</label>
          <input id="year-range" type="range" min={YEAR_MIN} max={YEAR_MAX} step={5} value={year} onChange={(e) => setYear(Number(e.target.value))}
            aria-valuetext={formatYear(year)} className="h-11 w-full accent-[rgb(var(--ink))]" />
          <div className="mb-4 flex justify-between text-xs text-muted" aria-hidden><span>{formatYear(YEAR_MIN)}</span><span>0</span><span>1000</span><span>{YEAR_MAX}</span></div>
          <WorldMap active={active} counts={counts} highlight={hi} onHover={setHi} />
          <p className="mt-2 text-xs text-muted">{t('Abstract locator map; the numbers show active entries. Dots mark places in the dataset. Select a region for its own page.')}</p>
        </div>

        <div className="mt-10 grid gap-px bg-rule sm:grid-cols-2 lg:grid-cols-3 [&>*]:bg-paper">
          {getRegions().map((r) => {
            const list = byRegion.get(r.id) ?? []
            return (
              <section key={r.id} aria-labelledby={`r-${r.id}`} onMouseEnter={() => setHi(r.id)} onMouseLeave={() => setHi(null)} className={`p-5 transition-colors ${hi === r.id ? 'bg-surface' : ''}`}>
                <h2 id={`r-${r.id}`} className="flex items-baseline justify-between gap-3 font-serif text-2xl leading-tight">
                  <Link to={`/explore/geography/${r.id}`} className="link-u">{r.name}</Link><span className="label">{list.length}</span>
                </h2>
                {list.length === 0 ? <p className="mt-3 text-sm text-muted">{t('Nothing recorded in the sample dataset for this year.')}</p> : (
                  <ul className="mt-3 space-y-2">
                    {list.map((e) => (
                      <li key={e.id} className="fade-in">
                        <Link to={entityPath(e)} className="group block"><TypeBadge type={e.type} /><span className="block font-medium leading-snug group-hover:underline">{e.title}</span><span className="block text-xs text-muted">{formatDate(e.dates)}</span></Link>
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            )
          })}
        </div>
      </div>
    </>
  )
}

/* ------------------------------------------------------------------ */
/* One region                                                          */
/* ------------------------------------------------------------------ */

export function RegionPage() {
  const { regionId = '' } = useParams()
  const region = getRegion(regionId)
  useDocumentTitle(region?.name)
  if (!region) return <Missing what="region" />
  const all = written(entitiesInRegion(region.id)).filter((e) => !['place', 'period', 'theme'].includes(e.type))
  const indexCount = entitiesInRegion(region.id).filter((e) => (e as { level?: string }).level === 'index').length
  const chron = [...all].filter((e) => e.type !== 'artwork').sort((a, b) => a.dates.start - b.dates.start)
  const groups: EntityType[] = ['tradition', 'style', 'movement']
  const moves = written(getMovements()).filter((m) => m.regions.includes(region.id))
  const works = getArtworks().filter((w) => w.regions.includes(region.id))
  const periods = getPeriods().filter((p) => p.scope === 'regional' && p.regions.includes(region.id))
  void groups
  return (
    <>
      <Breadcrumbs items={[{ label: t('Explore'), to: '/explore' }, { label: t('Geographic Exploration'), to: '/explore/geography' }, { label: region.name }]} />
      <PageHeader eyebrow={t('Region')} title={region.name} intro={region.blurb}>
        <div className="flex flex-wrap gap-3"><Link className="btn btn-solid" to={`/explore/timeline?regions=${region.id}`}>{t('Show on the timeline')}</Link><Link className="btn btn-ghost" to={`/explore/browse?regions=${region.id}`}>{t('Browse all {region}', { region: region.short })}</Link>{indexCount > 0 && <Link className="btn btn-ghost" to={`/movements?region=${region.id}`}>{t('{n} index entries in the directory', { n: indexCount })}</Link>}</div>
      </PageHeader>
      <div className="page-x space-y-20 pb-20">
        <section>
          <SectionHeading label={t('Chronology')} title={t('In order')} aside={t('{n} entries (artworks below)', { n: chron.length })} />
          <ul>
            {chron.map((e) => (
              <li key={e.id} className="grid items-center gap-x-6 gap-y-1 border-t border-rule py-3 sm:grid-cols-[minmax(0,1fr)_minmax(0,16rem)_8rem]">
                <span className="flex items-baseline gap-3"><TypeBadge type={e.type} className="hidden w-28 shrink-0 md:inline-flex" /><Link to={entityPath(e)} className="font-serif text-2xl link-u">{e.title}</Link></span>
                <SpanBar dates={e.dates} colorVar={`--c-${e.type}`} label={`${e.title}: ${formatDate(e.dates)}`} />
                <span className="text-sm text-muted sm:text-right">{formatDate(e.dates)}</span>
              </li>
            ))}
            <li className="rule-t" />
          </ul>
        </section>
        {periods.length > 0 && (
          <section><SectionHeading label={t('Regional periods')} title={t('The region’s own divisions')} />
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{periods.map((p) => <EntityCard key={p.id} entity={p} variant="tile" />)}</div></section>
        )}
        {moves.length > 0 && <section><SectionHeading label={TYPE_LABEL_PLURAL.movement} title={t('Movements and traditions')} /><div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{moves.map((m) => <EntityCard key={m.id} entity={m} />)}</div></section>}
        {works.length > 0 && <section><SectionHeading label={TYPE_LABEL_PLURAL.artwork} title={t('Works')} /><div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{works.map((w) => <EntityCard key={w.id} entity={w} />)}</div></section>}
        <nav aria-label={t('Other regions')} className="border-t border-ink pt-4">
          <p className="label mb-3">{t('Other regions')}</p>
          <div className="flex flex-wrap gap-2">{getRegions().filter((r) => r.id !== region.id).map((r) => <Link key={r.id} className="chip" to={`/explore/geography/${r.id}`}>{r.name}</Link>)}</div>
        </nav>
      </div>
    </>
  )
}

/* ------------------------------------------------------------------ */
/* Periods                                                             */
/* ------------------------------------------------------------------ */

export function PeriodsPage() {
  useDocumentTitle(t('Historical periods'))
  const eras = getEras().sort((a, b) => a.dates.start - b.dates.start)
  const regional = getPeriods().filter((p) => p.scope === 'regional')
  return (
    <>
      <Breadcrumbs items={[{ label: t('Explore'), to: '/explore' }, { label: t('Historical Periods') }]} />
      <PageHeader eyebrow={t('Explore')} title={t('Periods, shared and local')}
        intro={t('Five broad eras give a common frame for comparison. Beneath each sit the regional periods that places use for themselves — because “Renaissance” or “Baroque” is not how most of the world divides its past.')} />
      <div className="page-x space-y-16 pb-20">
        {eras.map((era) => {
          const [s, e] = span(era.dates)
          const inEra = regional.filter((p) => { const [ps, pe] = span(p.dates); return pe >= s && ps <= e }).sort((a, b) => a.dates.start - b.dates.start)
          return (
            <section key={era.id} aria-labelledby={`e-${era.id}`}>
              <header className="grid gap-4 border-t border-ink pt-4 lg:grid-cols-[1fr_1.4fr]">
                <div>
                  <p className="label">{era.subtitle}</p>
                  <h2 id={`e-${era.id}`} className="font-serif text-5xl leading-none"><Link to={entityPath(era)} className="link-u">{era.title}</Link></h2>
                </div>
                <div><p className="max-w-xl text-ink/85">{era.summary}</p><div className="mt-4"><SpanBar dates={era.dates} colorVar="--c-period" /></div></div>
              </header>
              {inEra.length > 0 && (
                <ul className="mt-6 grid gap-px bg-rule sm:grid-cols-2 lg:grid-cols-3 [&>*]:bg-paper">
                  {inEra.map((p) => (
                    <li key={p.id}>
                      <Link to={entityPath(p)} className="group block h-full p-5 transition-colors hover:bg-surface">
                        <p className="label">{p.regions.map(regionName).join(' · ')}</p>
                        <p className="mt-1 font-serif text-2xl leading-tight">{p.title}</p>
                        <p className="text-sm text-muted">{p.subtitle}</p>
                        <p className="mt-2 line-clamp-2 text-sm text-ink/75">{p.summary}</p>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          )
        })}
        <p className="max-w-prose text-sm text-muted">{t('Regional periods can span more than one era — the Mughal Empire, for example, runs from the early modern into the modern frame — so they appear under every era they overlap.')}</p>
      </div>
    </>
  )
}

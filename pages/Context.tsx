import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import type { ContextEntity, Entity, EntityType, HistoricalEvent, CulturalExchange } from '@/types'
import {
  entitiesAtPlace, entitiesInPeriod, entitiesWithTheme, entityPath, getBySlug, getEvents, getExchanges, getRegions, getThemes, regionName, relationsOf,
  TYPE_LABEL, TYPE_LABEL_PLURAL,
} from '@/lib/repo'
import { markViewed } from '@/lib/progress'
import { t } from '@/i18n'
import { formatDate } from '@/lib/time'
import { EntityCard } from '@/components/ui/EntityCard'
import { useDocumentTitle } from '@/components/ui/hooks'
import { FilterLayout } from '@/components/ui/FilterLayout'
import { ArrowRight } from '@/components/ui/Icons'
import { Breadcrumbs, ContinueExploring, PageHeader, SectionHeading, Sources, StatusNote } from '@/components/ui/Page'
import { Reveal } from '@/components/ui/Reveal'
import { SaveButton } from '@/components/ui/SaveButton'
import { TypeBadge } from '@/components/ui/TypeBadge'
import { MiniQuiz } from '@/components/quiz/MiniQuiz'
import { SpanBar } from '@/components/templates/SpanBar'
import { questionsFor } from '@/lib/repo'
import { Missing } from './MovementDetail'

type Kind = 'event' | 'exchange' | 'theme' | 'period' | 'place'

const PARENT: Record<Kind, { label: string; to: string }> = {
  event: { label: t('Historical Events'), to: '/connections/events' },
  exchange: { label: t('Cultural Exchanges'), to: '/connections/exchanges' },
  theme: { label: t('Themes and Influences'), to: '/connections/themes' },
  period: { label: t('Historical Periods'), to: '/explore/periods' },
  place: { label: t('Connections'), to: '/connections' },
}

const GROUP_ORDER: EntityType[] = ['movement', 'school', 'collective', 'tradition', 'style', 'artist', 'artwork', 'event', 'exchange', 'theme']

function groupByType(list: Entity[]) {
  return GROUP_ORDER.map((ty) => ({ type: ty, items: list.filter((e) => e.type === ty) })).filter((g) => g.items.length)
}

/** The shared “historical context” template for events, exchanges, themes, periods and places. */
export function ContextDetail({ kind }: { kind: Kind }) {
  const { slug = '' } = useParams()
  const c = getBySlug(kind, slug) as ContextEntity | undefined
  useDocumentTitle(c?.title)
  useEffect(() => { if (c) markViewed(c.id) }, [c])
  if (!c) return <Missing what={kind} />

  let related: Entity[] = []
  let relatedNote = ''
  if (kind === 'event' || kind === 'exchange') {
    related = relationsOf(c.id).map((r) => r.other)
    relatedNote = t('Linked by explicit relationship records:')
  } else if (kind === 'theme') {
    related = entitiesWithTheme(c.id).filter((e) => e.type !== 'place' && e.type !== 'period')
    relatedNote = t('Tagged with this theme:')
  } else if (kind === 'period') {
    related = entitiesInPeriod(c.id)
    relatedNote = t('Placed within this period:')
  } else {
    related = entitiesAtPlace(c.id)
    relatedNote = t('Associated with this place:')
  }
  // de-duplicate (a relation can appear twice)
  related = [...new Map(related.map((e) => [e.id, e])).values()]
  const groups = groupByType(related)
  const hasQuiz = questionsFor(c.id).length > 0
  const meta: string[] = []
  if (kind === 'event') meta.push((c as HistoricalEvent).kindOfEvent)
  if (kind === 'exchange') meta.push((c as CulturalExchange).flows)

  return (
    <article>
      <Breadcrumbs items={[{ label: PARENT[kind].label, to: PARENT[kind].to }, { label: c.title }]} />
      <header className="page-x pb-10 pt-8 lg:pt-14">
        <div className="flex flex-wrap items-center gap-4">
          <TypeBadge type={c.type} />
          {kind !== 'place' && kind !== 'theme' && <span className="label">{formatDate(c.dates)}</span>}
          {c.regions.length > 0 && <span className="label">{c.regions.map(regionName).join(' · ')}</span>}
          {meta.map((m) => <span key={m} className="label capitalize">{m}</span>)}
        </div>
        <h1 className="page-title mt-5 max-w-[22ch]">{c.title}</h1>
        {c.subtitle && kind !== 'place' && <p className="page-intro mt-3">{c.subtitle}</p>}
        <p className="page-intro mt-4 max-w-2xl">{c.summary}</p>
        <div className="mt-6 flex flex-wrap gap-3">
          {c.type !== 'place' && c.type !== 'period' && <Link to={`/connections?focus=${c.id}`} className="btn btn-ghost">{t('See connections')}</Link>}
          <SaveButton id={c.id} title={c.title} />
        </div>
      </header>

      <div className="page-x grid gap-12 pb-8 lg:grid-cols-[1.4fr_1fr]">
        <div className="space-y-12">
          {c.sections.map((s) => (
            <Reveal key={s.heading}>
              <h2 className="mb-3 border-t border-ink pt-4 font-serif text-3xl">{s.heading}</h2>
              <div className="prose-body">{s.paragraphs.map((p, i) => <p key={i}>{p}</p>)}</div>
            </Reveal>
          ))}
        </div>
        <aside className="space-y-8 lg:sticky lg:top-24 lg:self-start">
          <div className="border border-ink bg-surface p-5">
            <p className="label mb-2">{t('Why it matters for art')}</p>
            <p className="font-serif text-2xl leading-snug">{c.artSignificance}</p>
          </div>
          {kind !== 'place' && kind !== 'theme' && <div><p className="label mb-2">{t('Where it sits in time')}</p><SpanBar dates={c.dates} colorVar={`--c-${c.type}`} /></div>}
          <StatusNote entity={c} />
        </aside>
      </div>

      <div className="page-x space-y-16 py-12">
        {groups.length > 0 && (
          <section>
            <SectionHeading no="◦" label={t('Related content')} title={t('Connected art and ideas')} aside={relatedNote} />
            <div className="space-y-10">
              {groups.map((g) => (
                <div key={g.type}>
                  <p className="label mb-3">{TYPE_LABEL_PLURAL[g.type]}</p>
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{g.items.map((e, i) => <Reveal key={e.id} delay={i * 50}><EntityCard entity={e} /></Reveal>)}</div>
                </div>
              ))}
            </div>
          </section>
        )}
        {kind === 'event' && relationsOf(c.id).length > 0 && (
          <section>
            <SectionHeading no="◦" label={t('Why these are linked')} title={t('The stated reasons')} level={3} />
            <ul className="divide-y divide-rule border-y border-rule">
              {relationsOf(c.id).map((r) => (
                <li key={r.rel.id} className="grid gap-x-8 py-3 text-sm sm:grid-cols-[18rem_1fr]">
                  <span><Link to={entityPath(r.other)} className="link-u font-medium">{r.other.title}</Link> <span className="text-muted">{r.dir === 'in' ? t('was shaped by / relates to this') : r.phrase}</span></span>
                  <span className="text-ink/80">{r.rel.note}</span>
                </li>
              ))}
            </ul>
          </section>
        )}
        {hasQuiz && (
          <section><SectionHeading no="◦" label={t('Mini quiz')} title={t('Check what stuck')} /><MiniQuiz entityId={c.id} entityTitle={c.title} /></section>
        )}
        <section><SectionHeading no="◦" label={t('Sources and references')} title={t('Where to check')} /><Sources entity={c} /></section>
      </div>
      {c.type !== 'place' && <ContinueExploring id={c.id} />}
    </article>
  )
}

/* ------------------------------------------------------------------ */
/* Indexes: events / exchanges / themes                                */
/* ------------------------------------------------------------------ */

export function ContextIndex({ kind }: { kind: 'event' | 'exchange' | 'theme' }) {
  const copy = {
    event: { title: t('Historical events'), intro: t('What was happening around the art: wars and treaties, inventions, migrations and exhibitions. Each event states why it matters for how art was made.'), crumb: t('Historical Events') },
    exchange: { title: t('Cultural exchanges'), intro: t('Documented movements of images, materials and ideas between cultures — through trade, diplomacy, travel, empire and collecting. Not every exchange was equal, and the pages say so.'), crumb: t('Cultural Exchanges') },
    theme: { title: t('Themes and influences'), intro: t('Recurring questions that cut across regions and centuries: who paid, what it was made of, what it was for, and where it ended up.'), crumb: t('Themes and Influences') },
  }[kind]
  useDocumentTitle(copy.title)
  const [region, setRegion] = useState<string | null>(null)
  const all: ContextEntity[] = kind === 'event' ? getEvents() : kind === 'exchange' ? getExchanges() : getThemes()
  const list = useMemo(() => all.filter((e) => !region || e.regions.includes(region as never)).sort((a, b) => a.dates.start - b.dates.start || a.title.localeCompare(b.title)), [all, region])

  const panel = (
    <div className="space-y-5">
      <div role="group" aria-labelledby="ctx-region-l">
        <p id="ctx-region-l" className="label mb-2">{t('Region')}</p>
        <div className="flex flex-wrap gap-1.5">
          <button type="button" className="chip" aria-pressed={region === null} onClick={() => setRegion(null)}>{t('All regions')}</button>
          {getRegions().filter((r) => all.some((e) => e.regions.includes(r.id))).map((r) => <button key={r.id} type="button" className="chip" aria-pressed={region === r.id} onClick={() => setRegion(region === r.id ? null : r.id)}>{r.short}</button>)}
        </div>
      </div>
      {region !== null && (
        <div className="flex flex-wrap gap-1.5 border-t border-rule pt-4">
          <button type="button" className="chip" onClick={() => setRegion(null)}>{t('Clear filters')}</button>
        </div>
      )}
    </div>
  )

  const results = (
    <>
        {kind === 'event' && <div role="list" aria-live="polite">{list.map((e) => <div role="listitem" key={e.id}><EntityCard entity={e} variant="row" /></div>)}<div className="rule-t" /></div>}
        {kind === 'exchange' && (
          <div className="grid gap-5 sm:grid-cols-2 min-[1500px]:grid-cols-3">
            {list.map((e, i) => (
              <Reveal key={e.id} delay={i * 60}>
                <Link to={entityPath(e)} className="group card-hover flex h-full flex-col border border-rule bg-surface p-6">
                  <TypeBadge type="exchange" />
                  <h2 className="mt-3 font-serif text-3xl leading-tight">{e.title}</h2>
                  <p className="mt-1 text-sm text-muted">{formatDate(e.dates)} · {(e as CulturalExchange).flows}</p>
                  <p className="mt-3 text-sm leading-relaxed">{e.summary}</p>
                  <span className="mt-auto inline-flex items-center gap-2 pt-5 text-sm font-medium">{t('Read the exchange')} <ArrowRight size={16} className="arrow-nudge" /></span>
                </Link>
              </Reveal>
            ))}
          </div>
        )}
        {kind === 'theme' && (
          <div className="grid gap-5 md:grid-cols-2">
            {list.map((e, i) => {
              const n = entitiesWithTheme(e.id).length
              return (
                <Reveal key={e.id} delay={i * 40}>
                  <Link to={entityPath(e)} className="group card-hover flex h-full flex-col border border-rule bg-surface p-6">
                    <TypeBadge type="theme" label={n === 1 ? t('1 linked record') : t('{n} linked records', { n })} />
                    <h2 className="mt-3 font-serif text-3xl leading-tight">{e.title}</h2>
                    <p className="mt-3 text-sm leading-relaxed">{e.summary}</p>
                    <span className="mt-auto inline-flex items-center gap-2 pt-5 text-sm font-medium">{t('Explore theme')} <ArrowRight size={16} className="arrow-nudge" /></span>
                  </Link>
                </Reveal>
              )
            })}
          </div>
        )}
        {list.length === 0 && <p className="text-muted">{t('Nothing here for that region yet.')}</p>}
    </>
  )

  return (
    <>
      <Breadcrumbs items={[{ label: t('Connections'), to: '/connections' }, { label: copy.crumb }]} />
      <PageHeader eyebrow={t('Connections · {n} {items}', { n: list.length, items: TYPE_LABEL_PLURAL[kind].toLowerCase() })} title={copy.title} intro={copy.intro} />
      <div className="page-x pb-16">
        {kind === 'theme' ? results : <FilterLayout id="ctx-filters" filtered={region !== null} panel={panel}>{results}</FilterLayout>}
        <p className="mt-10 text-sm text-muted">{t('Looking for a specific {type}?', { type: TYPE_LABEL[kind].toLowerCase() })} <Link className="link-u text-ink" to={`/explore/browse?types=${kind}`}>{t('Search with filters')}</Link>.</p>
      </div>
    </>
  )
}

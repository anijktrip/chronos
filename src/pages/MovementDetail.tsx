import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { Link, useParams } from 'react-router-dom'
import type { Artist, Entity, MovementLike } from '@/types'
import {
  artistsOfMovement, artworksOfMovement, entityPath, eventsShaping, exchangesOf, getArtists, getBySlug, getEntity, heroOf, isMovementLike,
  questionsFor, regionName, relationsOf, TYPE_LABEL, type ResolvedRelation,
} from '@/lib/repo'
import { markViewed } from '@/lib/progress'
import { formatDate } from '@/lib/time'
import { DOMAIN_LABEL, MOVEMENT_SECTIONS } from '@/data/taxonomy'
import { ArtworkImage } from '@/components/ui/ArtworkImage'
import { EntityCard } from '@/components/ui/EntityCard'
import { useDocumentTitle } from '@/components/ui/hooks'
import { ArrowRight } from '@/components/ui/Icons'
import { MovementExamples } from '@/components/works/MovementExamples'
import { Breadcrumbs, ContinueExploring, DefList, scrollToSection, SectionHeading, SectionNav, Sources, StatusNote, type SectionDef } from '@/components/ui/Page'
import { Reveal } from '@/components/ui/Reveal'
import { SaveButton } from '@/components/ui/SaveButton'
import { TypeBadge } from '@/components/ui/TypeBadge'
import { ConnectionsGraph } from '@/components/graph/ConnectionsGraph'
import { MiniQuiz } from '@/components/quiz/MiniQuiz'
import { RelationList } from '@/components/templates/RelationList'
import { SpanBar } from '@/components/templates/SpanBar'
import { t } from '@/i18n'

const LINEAGE_IN = ['developed_from', 'influenced_by', 'reacted_against'] as const

function Bullets({ items }: { items: string[] }) {
  return (
    <ul className="max-w-3xl space-y-3">
      {items.map((item, i) => (
        <li key={i} className="grid grid-cols-[1.25rem_1fr] gap-2 text-lg leading-relaxed text-ink/90">
          <span aria-hidden className="mt-[0.7em] h-1.5 w-1.5 rounded-full bg-ink" /><span>{item}</span>
        </li>
      ))}
    </ul>
  )
}

/** Connect a founder / key-figure name to an artist record when one exists. */
function useArtistByName() {
  return useMemo(() => {
    const map = new Map<string, Artist>()
    for (const a of getArtists()) { map.set(a.title.toLowerCase(), a); for (const alt of a.altTitles ?? []) map.set(alt.toLowerCase(), a) }
    return (name: string) => map.get(name.replace(/\s*\(.*\)\s*$/, '').toLowerCase())
  }, [])
}

function Chips({ children }: { children: ReactNode }) {
  return <div className="flex flex-wrap gap-2">{children}</div>
}

export function MovementDetail() {
  const { slug = '' } = useParams()
  const m = getBySlug('movement', slug) as MovementLike | undefined
  useDocumentTitle(m?.title)
  useEffect(() => { if (m) markViewed(m.id) }, [m])
  const byName = useArtistByName()
  const [showAllPeople, setShowAllPeople] = useState(false)
  if (!m) return <Missing />

  const isIndex = m.level === 'index'
  const hero = heroOf(m)
  const makers = artistsOfMovement(m.id)
  const works = artworksOfMovement(m.id)
  const events = eventsShaping(m.id)
  const exchanges = exchangesOf(m.id)
  const rels = relationsOf(m.id)

  const isMov = (r: ResolvedRelation) => isMovementLike(r.other)
  const partOf = rels.filter((r) => r.rel.type === 'part_of' && r.dir === 'out')
  const parts = rels.filter((r) => r.rel.type === 'part_of' && r.dir === 'in')
  const shapedBy = rels.filter((r) => (LINEAGE_IN as readonly string[]).includes(r.rel.type) && r.dir === 'out' && isMov(r))
  const shaped = rels.filter((r) => (LINEAGE_IN as readonly string[]).includes(r.rel.type) && r.dir === 'in' && isMov(r))
  const associated = rels.filter((r) => r.rel.type === 'associated_with' && isMov(r))
  const institutions = rels.filter((r) => isMov(r) && (r.other.type === 'school' || r.other.type === 'collective'))
  const otherContext = rels.filter((r) => ['cultural_exchange', 'shaped_by'].includes(r.rel.type))
  const designers = makers.filter((a) => a.taxonomy === 'a18')
  const artistsOnly = makers.filter((a) => a.taxonomy !== 'a18')
  const themes = m.themes.map((id) => getEntity(id)).filter(Boolean) as Entity[]
  const hasQuiz = questionsFor(m.id).length > 0
  const hasWorks = works.length > 0 || !!m.notableWorks?.length
  const hasNetwork = rels.length > 0

  const nav: (SectionDef & { show: boolean })[] = [
    { id: 'classification', label: t('Classification'), show: true },
    { id: 'dates', label: t('Dates & origins'), show: true },
    { id: 'context', label: t('Context'), show: m.context.length > 0 || events.length > 0 },
    { id: 'reasons', label: t('Why it emerged'), show: !!m.reasons?.length },
    { id: 'founders', label: t('Key figures'), show: !!m.founders?.length },
    { id: 'ideas', label: t('Ideas'), show: !!m.ideas?.length },
    { id: 'look', label: t('Visual characteristics'), show: m.characteristics.length > 0 },
    { id: 'making', label: t('Techniques & materials'), show: m.mediums.length + m.techniques.length > 0 },
    { id: 'people', label: t('Artists & designers'), show: makers.length > 0 },
    { id: 'works', label: t('Works & designs'), show: hasWorks },
    { id: 'examples', label: t('Examples'), show: true },
    { id: 'manifestos', label: t('Manifestos & publications'), show: !!m.manifestos?.length },
    { id: 'institutions', label: t('Schools & collectives'), show: institutions.length > 0 },
    { id: 'shaped-by', label: t('Influenced by'), show: shapedBy.length > 0 },
    { id: 'shaped', label: t('Influenced'), show: shaped.length > 0 },
    { id: 'network', label: t('Network'), show: hasNetwork },
    { id: 'debates', label: t('Disagreements'), show: !!m.disagreements?.length },
    { id: 'legacy', label: t('Legacy'), show: !!m.legacy?.length },
    { id: 'quiz', label: t('Mini quiz'), show: hasQuiz },
    { id: 'sources', label: t('Sources'), show: m.sources.length > 0 || isIndex },
  ]
  const sections = nav.filter((s) => s.show)
  const no = (id: string) => String(sections.findIndex((s) => s.id === id) + 1).padStart(2, '0')

  const peopleCards = (list: Artist[]) => {
    const profiles = list.filter((x) => x.level !== 'index')
    const index = list.filter((x) => x.level === 'index')
    const shownIndex = showAllPeople ? index : index.slice(0, 12)
    return (
      <>
        {profiles.length > 0 && <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{profiles.map((a, i) => <Reveal key={a.id} delay={i * 60}><EntityCard entity={a} /></Reveal>)}</div>}
        {index.length > 0 && (
          <ul className={`grid gap-x-8 sm:grid-cols-2 ${profiles.length ? 'mt-8' : ''}`}>
            {shownIndex.map((a) => (
              <li key={a.id}>
                <Link to={entityPath(a)} className="group flex items-baseline justify-between gap-4 border-t border-rule px-1 py-3 transition-colors hover:bg-surface sm:px-2">
                  <span className="min-w-0"><span className="font-display text-xl leading-tight group-hover:underline">{a.title}</span><span className="block text-sm text-muted">{a.subtitle}</span></span>
                  <span className="shrink-0 text-sm text-muted">{formatDate(a.dates)}</span>
                </Link>
              </li>
            ))}
          </ul>
        )}
        {index.length > 12 && !showAllPeople && <button type="button" className="btn btn-ghost mt-6" onClick={() => setShowAllPeople(true)}>{t('Show all {n} index records', { n: index.length })}</button>}
      </>
    )
  }

  return (
    <article>
      <Breadcrumbs items={[{ label: t('Movements & Traditions'), to: '/movements' }, { label: m.title }]} />

      <header className="page-x grid gap-8 pb-10 pt-8 lg:grid-cols-[1.1fr_1fr] lg:items-end lg:gap-14 lg:pb-14 lg:pt-14">
        <div>
          <div className="flex flex-wrap items-center gap-4">
            <TypeBadge type={m.type} />
            <span className="label">{formatDate(m.dates)}</span>
            <span className="label">{m.regions.map(regionName).join(' · ')}</span>
          </div>
          <h1 className="page-title mt-5">{m.title}</h1>
          {!!m.altNames?.length && <p className="mt-3 text-muted">{t('Also known as {names}', { names: m.altNames.join(' · ') })}</p>}
          <p className="page-intro mt-4 max-w-xl">{m.summary}</p>
          {!!m.domains?.length && (
            <div className="mt-5"><Chips>{m.domains.map((d) => <Link key={d} to={`/movements?domain=${d}`} className="chip">{DOMAIN_LABEL[d]}</Link>)}</Chips></div>
          )}
          <div className="mt-6 flex flex-wrap gap-3">
            <button type="button" className="btn btn-solid" onClick={() => scrollToSection(hasNetwork ? 'network' : 'classification')}>{hasNetwork ? t('Explore the network') : t('Start reading')}</button>
            <Link to={`/connections?focus=${m.id}`} className="btn btn-ghost">{t('Open on the map')}</Link>
            <SaveButton id={m.id} title={m.title} />
          </div>
        </div>
        {hero && (
          <figure>
            <Link to={entityPath(hero)} className="img-zoom block" aria-label={t('Open artwork: {title}', { title: hero.title })}>
              <ArtworkImage artwork={hero} priority width={1400} ratio={Math.min(Math.max(hero.image.ratio, 0.8), 1.5)} fit="contain" className="border border-rule" />
            </Link>
            <figcaption className="mt-2 flex justify-between gap-4 text-xs text-muted">
              <span><span className="text-ink">{hero.title}</span> — {hero.attribution}, {hero.dateDisplay}</span>
              <Link to={entityPath(hero)} className="link-u shrink-0 text-ink">{t('View work')}</Link>
            </figcaption>
          </figure>
        )}
      </header>

      {isIndex && (
        <div className="page-x pb-6">
          <aside className="rounded-2xl bg-surface p-5 text-sm leading-relaxed text-muted" aria-label={t('About this record')}>
            <p><strong className="font-medium text-ink">{t('Index record.')}</strong> {t('The classification, dates, origins and documented relationships below are in the database; the written page — context, ideas, artists, works and quiz — has not been written yet. Only sections with real content are shown.')} {t('Complete examples:')} <Link to="/movements/bauhaus" className="link-u text-ink">{getBySlug('movement', 'bauhaus')?.title ?? t('Bauhaus')}</Link>, <Link to="/movements/art-nouveau" className="link-u text-ink">{getBySlug('movement', 'art-nouveau')?.title ?? t('Art Nouveau')}</Link>, <Link to="/movements/dada" className="link-u text-ink">{getBySlug('movement', 'dada')?.title ?? t('Dada')}</Link>.</p>
          </aside>
        </div>
      )}

      <SectionNav sections={sections} />

      <div className="page-x space-y-24 py-16">
        {/* 1–3 — name, classification, dates */}
        <section>
          <SectionHeading id="classification" no={no('classification')} label={t('Name & classification')} title={t('What kind of thing is it?')} />
          <div className="grid gap-10 lg:grid-cols-2">
            <div>
              <p className="prose-body">{m.summary}</p>
              {m.classificationNote && <p className="mt-4 max-w-prose text-sm leading-relaxed text-muted"><strong className="font-medium text-ink">{t('Classification note.')}</strong> {m.classificationNote}</p>}
              {m.umbrella && <p className="mt-4 max-w-prose text-sm leading-relaxed text-muted"><strong className="font-medium text-ink">{t('Umbrella category.')}</strong> {t('This groups many regional or historical subdivisions rather than describing one coherent style.')}</p>}
            </div>
            <DefList items={[
              { label: t('Classification'), value: <>{TYPE_LABEL[m.type]}{m.umbrella ? ` ${t('(umbrella)')}` : ''}</> },
              ...(m.altNames?.length ? [{ label: t('Also known as'), value: m.altNames.join(' · ') }] : []),
              ...(m.domains?.length ? [{ label: t('Fields'), value: <Chips>{m.domains.map((d) => <Link key={d} to={`/movements?domain=${d}`} className="link-u mr-3">{DOMAIN_LABEL[d]}</Link>)}</Chips> }] : []),
              ...(m.taxonomy?.length ? [{ label: t('Listed under'), value: m.taxonomy.map((sid) => <Link key={sid} to={`/movements?section=${sid}`} className="link-u mr-3">{MOVEMENT_SECTIONS.find((s) => s.id === sid)?.short ?? sid}</Link>) }] : []),
              ...(partOf.length ? [{ label: t('Part of'), value: partOf.map((r) => <Link key={r.rel.id} to={entityPath(r.other)} className="link-u mr-3">{r.other.title}</Link>) }] : []),
              ...(parts.length ? [{ label: t('Includes'), value: parts.map((r) => <Link key={r.rel.id} to={entityPath(r.other)} className="link-u mr-3">{r.other.title}</Link>) }] : []),
            ]} />
          </div>
        </section>

        <section>
          <SectionHeading id="dates" no={no('dates')} label={t('Dates & geographical origins')} title={t('When and where')} />
          <div className="grid gap-10 lg:grid-cols-2">
            <div>
              <div><SpanBar dates={m.dates} colorVar={`--c-${m.type}`} /></div>
              {m.dateNote && <p className="mt-3 max-w-prose text-sm leading-relaxed text-muted"><strong className="font-medium text-ink">{t('About these dates.')}</strong> {m.dateNote}</p>}
              {m.origins.length > 0 && <div className="prose-body mt-6">{m.origins.map((p, i) => <p key={i}>{p}</p>)}</div>}
            </div>
            <DefList items={[
              { label: t('Dates'), value: formatDate(m.dates) },
              { label: t('Region'), value: m.regions.map((r) => <Link key={r} to={`/explore/geography/${r}`} className="link-u mr-3">{regionName(r)}</Link>) },
              ...(m.places.length ? [{ label: t('Places'), value: m.places.map((p) => getEntity(p)).filter(Boolean).map((p) => <Link key={p!.id} to={entityPath(p!)} className="link-u mr-3">{p!.title}</Link>) }] : []),
              ...(themes.length ? [{ label: t('Themes'), value: themes.map((th) => <Link key={th.id} to={entityPath(th)} className="link-u mr-3">{th.title}</Link>) }] : []),
            ]} />
          </div>
        </section>

        {sections.some((s) => s.id === 'context') && (
          <section>
            <SectionHeading id="context" no={no('context')} label={t('Historical & sociopolitical context')} title={t('What was happening')} />
            <div className="grid gap-10 lg:grid-cols-[1.3fr_1fr]">
              <Reveal><div className="prose-body">{m.context.map((p, i) => <p key={i}>{p}</p>)}</div></Reveal>
              {events.length > 0 && (
                <div>
                  <p className="label mb-3">{t('Events and conditions linked to it')}</p>
                  <ul>{events.map((e) => <li key={e.id}><EntityCard entity={e} variant="tile" className="mb-4" /></li>)}</ul>
                </div>
              )}
            </div>
          </section>
        )}

        {!!m.reasons?.length && (
          <section>
            <SectionHeading id="reasons" no={no('reasons')} label={t('Reasons for emergence')} title={t('Why it emerged')} />
            <Bullets items={m.reasons} />
          </section>
        )}

        {!!m.founders?.length && (
          <section>
            <SectionHeading id="founders" no={no('founders')} label={t('Founders & key figures')} title={t('Who started it')} />
            <Chips>
              {m.founders.map((f) => {
                const a = byName(f)
                return a ? <Link key={f} to={entityPath(a)} className="chip">{f}</Link> : <span key={f} className="chip" style={{ cursor: 'default' }}>{f}</span>
              })}
            </Chips>
          </section>
        )}

        {!!m.ideas?.length && (
          <section>
            <SectionHeading id="ideas" no={no('ideas')} label={t('Main ideas & philosophy')} title={t('What it believed')} />
            <Bullets items={m.ideas} />
          </section>
        )}

        {m.characteristics.length > 0 && (
          <section>
            <SectionHeading id="look" no={no('look')} label={t('Visual characteristics')} title={t('What to look for')} />
            <ol className="grid gap-x-10 gap-y-0 sm:grid-cols-2">
              {m.characteristics.map((c, i) => (
                <Reveal key={c.title} as="li" delay={i * 70} className="border-t border-rule py-6">
                  <p className="label mb-2">{String(i + 1).padStart(2, '0')}</p>
                  <h3 className="font-serif text-3xl leading-tight">{c.title}</h3>
                  <p className="mt-2 max-w-md leading-relaxed text-ink/85">{c.text}</p>
                </Reveal>
              ))}
            </ol>
          </section>
        )}

        {m.mediums.length + m.techniques.length > 0 && (
          <section>
            <SectionHeading id="making" no={no('making')} label={t('Techniques, media & materials')} title={t('How it was made')} />
            <div className="grid gap-8 sm:grid-cols-2">
              {m.mediums.length > 0 && <div><p className="label mb-3">{t('Media and materials')}</p><Chips>{m.mediums.map((x) => <span key={x} className="chip" style={{ cursor: 'default' }}>{x}</span>)}</Chips></div>}
              {m.techniques.length > 0 && <div><p className="label mb-3">{t('Techniques')}</p><Chips>{m.techniques.map((x) => <span key={x} className="chip" style={{ cursor: 'default' }}>{x}</span>)}</Chips></div>}
            </div>
          </section>
        )}

        {makers.length > 0 && (
          <section>
            <SectionHeading id="people" no={no('people')} label={t('Important artists & designers')} title={t('Who made it')} />
            {artistsOnly.length > 0 && designers.length > 0 && <p className="label mb-4">{t('Artists')}</p>}
            {artistsOnly.length > 0 && peopleCards(artistsOnly)}
            {designers.length > 0 && (<div className={artistsOnly.length ? 'mt-10' : ''}><p className="label mb-4">{t('Designers, architects & typographers')}</p>{peopleCards(designers)}</div>)}
          </section>
        )}

        {hasWorks && (
          <section>
            <SectionHeading id="works" no={no('works')} label={t('Significant artworks, objects, buildings & designs')} title={t('Works to look at')} />
            {!!m.notableWorks?.length && (
              <div className="mb-8 overflow-x-auto">
                <table className="w-full min-w-[34rem] text-left text-sm">
                  <caption className="sr-only">{t('Notable works of {title}', { title: m.title })}</caption>
                  <thead><tr className="border-b border-ink text-xs uppercase tracking-wider text-muted"><th scope="col" className="py-2 pr-4 font-normal">{t('Work')}</th><th scope="col" className="py-2 pr-4 font-normal">{t('By')}</th><th scope="col" className="py-2 pr-4 font-normal">{t('Date')}</th><th scope="col" className="py-2 font-normal">{t('Kind')}</th></tr></thead>
                  <tbody>
                    {m.notableWorks.map((w) => (
                      <tr key={w.title} className="border-b border-rule align-top">
                        <th scope="row" className="py-3 pr-4 font-display text-lg font-normal leading-snug">{w.title}</th>
                        <td className="py-3 pr-4">{w.creator}</td><td className="py-3 pr-4 whitespace-nowrap">{w.date}</td><td className="py-3">{w.kind}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <p className="mt-3 max-w-prose text-xs leading-relaxed text-muted">{t('Listed works are text records. Images are added only where an open licence has been verified; many of these are in copyright.')}</p>
              </div>
            )}
            {works.length > 0 && <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{works.map((a, i) => <Reveal key={a.id} delay={i * 60}><EntityCard entity={a} /></Reveal>)}</div>}
          </section>
        )}

        <section>
          <SectionHeading id="examples" no={no('examples')} label={t('Examples to see')} title={t('See it for yourself')} />
          <MovementExamples movement={m} />
        </section>

        {!!m.manifestos?.length && (
          <section>
            <SectionHeading id="manifestos" no={no('manifestos')} label={t('Manifestos & influential publications')} title={t('In their own words')} />
            <ul className="divide-y divide-rule border-y border-rule">
              {m.manifestos.map((x) => (
                <li key={x.title} className="grid gap-x-8 gap-y-1 py-4 sm:grid-cols-[6rem_1fr]">
                  <span className="label pt-1">{x.year}</span>
                  <p><span className="font-display text-xl">{x.title}</span>{x.note && <span className="block text-sm text-muted">{x.note}</span>}</p>
                </li>
              ))}
            </ul>
          </section>
        )}

        {institutions.length > 0 && (
          <section>
            <SectionHeading id="institutions" no={no('institutions')} label={t('Related schools, collectives & institutions')} title={t('Groups and places of teaching')} />
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {institutions.map((r, i) => (
                <Reveal key={r.rel.id} delay={i * 60}>
                  <p className="label mb-2">{m.title} {r.phrase}</p>
                  <EntityCard entity={r.other} variant="tile" />
                  <p className="mt-2 text-xs text-muted">{r.rel.note}</p>
                </Reveal>
              ))}
            </div>
          </section>
        )}

        {shapedBy.length > 0 && (
          <section>
            <SectionHeading id="shaped-by" no={no('shaped-by')} label={t('Movements that influenced it')} title={t('What it grew from')} />
            <RelationList subject={m.title} relations={shapedBy} />
          </section>
        )}

        {shaped.length > 0 && (
          <section>
            <SectionHeading id="shaped" no={no('shaped')} label={t('Movements it influenced')} title={t('What grew from it')} />
            <RelationList subject={m.title} relations={shaped} />
          </section>
        )}

        {hasNetwork && (
          <section>
            <SectionHeading id="network" no={no('network')} label={t('Interactive network')} title={t('Explore its connections')}
              aside={<Link to={`/connections?focus=${m.id}`} className="link-u inline-flex items-center gap-2 text-ink">{t('Open full map')} <ArrowRight size={14} /></Link>} />
            <p className="mb-6 max-w-prose text-muted">{t('Click any node to re-centre the network on it. These are simplified, documented relationships; the real history has many more overlaps and cross-currents. Hover or focus a line to read the reason for it.')}</p>
            <ConnectionsGraph compact defaultFocus={m.id} heading={t('{title} network', { title: m.title })} presetEntityGroups={['movement']}
              presetRelations={['developed_from', 'influenced_by', 'reacted_against', 'associated_with', 'part_of', 'cultural_exchange']} />
            {(associated.length > 0 || otherContext.length > 0 || exchanges.length > 0) && (
              <div className="mt-10 grid gap-10 lg:grid-cols-2">
                {associated.length > 0 && <div><p className="label mb-3">{t('Associated movements and groups')}</p><RelationList subject={m.title} relations={associated} /></div>}
                {(otherContext.length > 0 || exchanges.length > 0) && (
                  <div>
                    <p className="label mb-3">{t('Exchanges and conditions')}</p>
                    <RelationList subject={m.title} relations={otherContext} />
                  </div>
                )}
              </div>
            )}
          </section>
        )}

        {!!m.disagreements?.length && (
          <section>
            <SectionHeading id="debates" no={no('debates')} label={t('Internal disagreements & developments')} title={t('Where it divided')} />
            <Bullets items={m.disagreements} />
          </section>
        )}

        {!!m.legacy?.length && (
          <section>
            <SectionHeading id="legacy" no={no('legacy')} label={t('Historical legacy')} title={t('What it left behind')} />
            <Bullets items={m.legacy} />
          </section>
        )}

        {hasQuiz && (
          <section>
            <SectionHeading id="quiz" no={no('quiz')} label={t('Mini quiz')} title={t('Check what stuck')} />
            <MiniQuiz entityId={m.id} entityTitle={m.title} />
          </section>
        )}

        {(m.sources.length > 0 || isIndex) && (
          <section>
            <SectionHeading id="sources" no={no('sources')} label={t('Sources and references')} title={t('Where to check')} />
            <div className="grid gap-6 lg:grid-cols-[2fr_1fr]"><Sources entity={m} /><StatusNote entity={m} /></div>
          </section>
        )}
      </div>

      <ContinueExploring id={m.id} />
    </article>
  )
}

export function Missing({ what = 'page' }: { what?: string }) {
  useDocumentTitle(t('Not found'))
  // Whole sentences per kind of record: Greek nouns differ in gender, so the sentence can't be assembled from parts.
  const sentence: Record<string, string> = {
    page: t('That page isn’t in the sample dataset.'),
    artist: t('That artist isn’t in the sample dataset.'),
    artwork: t('That artwork isn’t in the sample dataset.'),
    'learning path': t('That learning path isn’t in the sample dataset.'),
    quiz: t('That quiz isn’t in the sample dataset.'),
    region: t('That region isn’t in the sample dataset.'),
    event: t('That event isn’t in the sample dataset.'),
    exchange: t('That exchange isn’t in the sample dataset.'),
    theme: t('That theme isn’t in the sample dataset.'),
    period: t('That period isn’t in the sample dataset.'),
    place: t('That place isn’t in the sample dataset.'),
  }
  return (
    <div className="page-x py-24">
      <p className="label">{t('Not found')}</p>
      <h1 className="page-title mt-4">{sentence[what] ?? t('That {what} isn’t in the sample dataset.', { what })}</h1>
      <p className="page-intro mt-4 max-w-lg">{t('The link may be mistyped, or the record may not exist yet.')}</p>
      <div className="mt-8 flex gap-3"><Link to="/explore/browse" className="btn btn-solid">{t('Browse everything')}</Link><Link to="/" className="btn btn-ghost">{t('Home')}</Link></div>
    </div>
  )
}

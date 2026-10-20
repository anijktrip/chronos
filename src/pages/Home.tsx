import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { t } from '@/i18n'
import type { Entity, RegionId } from '@/types'
import { allEntities, entityPath, written, getArtworks, getArtists, getEntity, getEras, getMovements, getRegions, regionName, suggestionsFor } from '@/lib/repo'
import { activeAt, formatDate, formatYear } from '@/lib/time'
import { HeroRing } from '@/components/home/HeroRing'
import { ConnectionsGraph } from '@/components/graph/ConnectionsGraph'
import { QuizPlayer } from '@/components/quiz/QuizPlayer'
import { Timeline } from '@/components/timeline/Timeline'
import { WorldMap } from '@/components/templates/WorldMap'
import { EntityCard } from '@/components/ui/EntityCard'
import { useDocumentTitle } from '@/components/ui/hooks'
import { ArrowRight } from '@/components/ui/Icons'
import { SectionHeading } from '@/components/ui/Page'
import { Reveal } from '@/components/ui/Reveal'
import { TypeBadge } from '@/components/ui/TypeBadge'

/* ------------------------------------------------------------------ */
/* Hero                                                                */
/* ------------------------------------------------------------------ */

/* ------------------------------------------------------------------ */
/* Year strip                                                         */
/* ------------------------------------------------------------------ */

const LINEAGES: { label: string; ids: string[]; note: string }[] = [
  { label: t('Craft to modern design'), ids: ['mov-arts-and-crafts', 'mov-art-nouveau', 'school-bauhaus', 'style-international-typographic'],
    note: t('Reform of craft led to the total design of Art Nouveau; the Bauhaus joined craft to industry; Swiss typographers refined its lessons.') },
  { label: t('Cubism to constructed abstraction'), ids: ['mov-cubism', 'mov-russian-constructivism', 'mov-de-stijl'],
    note: t('Constructivism and De Stijl both grew from Cubist ideas and exchanged ideas with each other in the early 1920s.') },
  { label: t('Dada to Surrealism'), ids: ['mov-dada', 'mov-surrealism'],
    note: t('Several Paris Dadaists, led by André Breton, turned Dada’s negation into Surrealism’s exploration of the unconscious.') },
  { label: t('Dada to Conceptual Art'), ids: ['mov-dada', 'mov-neo-dada', 'mov-fluxus', 'mov-conceptual-art'],
    note: t('A different line from Dada: found objects, chance and events passed from Neo-Dada through Fluxus into Conceptual Art.') },
]

const YEARS = [-210, 1000, 1500, 1650, 1850]

function YearStrip() {
  const [year, setYear] = useState(1500)
  const [hi, setHi] = useState<RegionId | null>(null)
  const byRegion = useMemo(() => {
    const m = new Map<RegionId, Entity[]>()
    for (const r of getRegions()) m.set(r.id, written(allEntities()).filter((e) => ['tradition', 'style', 'school', 'collective', 'movement', 'artist', 'event'].includes(e.type) && e.regions.includes(r.id) && activeAt(e.dates, year)))
    return m
  }, [year])
  const active = new Set([...byRegion.entries()].filter(([, v]) => v.length).map(([k]) => k))
  const counts = Object.fromEntries([...byRegion.entries()].map(([k, v]) => [k, v.length])) as Record<RegionId, number>
  const shown = [...byRegion.entries()].filter(([, v]) => v.length)
  return (
    <div className="grid gap-8 lg:grid-cols-[1.35fr_1fr]">
      <div className="rounded-3xl bg-surface p-4 sm:p-6">
        <div className="mb-3 flex flex-wrap items-center gap-2" role="group" aria-label={t('Choose a year')}>
          <span className="label mr-2">{t('Pick a year')}</span>
          {YEARS.map((y) => <button key={y} type="button" className="chip" aria-pressed={year === y} onClick={() => setYear(y)}>{formatYear(y)}</button>)}
        </div>
        <WorldMap active={active} counts={counts} highlight={hi} onHover={setHi} />
      </div>
      <div aria-live="polite">
        <p className="mb-3 font-display text-3xl">{t('In {year}', { year: formatYear(year) })}</p>
        <ul className="divide-y divide-rule">
          {shown.map(([r, list]) => (
            <li key={r} className={`py-3 transition-colors ${hi === r ? 'bg-surface' : ''}`} onMouseEnter={() => setHi(r)} onMouseLeave={() => setHi(null)}>
              <p className="label"><Link to={`/explore/geography/${r}`} className="link-u inline-flex min-h-[24px] items-center">{regionName(r)}</Link></p>
              <p className="mt-0.5 leading-snug">{list.slice(0, 3).map((e, k) => <span key={e.id}>{k > 0 && ' · '}<Link to={entityPath(e)} className="link-u">{e.title}</Link></span>)}{list.length > 3 && <span className="text-muted"> {t('+ {n} more', { n: list.length - 3 })}</span>}</p>
            </li>
          ))}
          {shown.length === 0 && <li className="py-4 text-sm text-muted">{t('Nothing recorded for this year in the sample dataset.')}</li>}
        </ul>
        <Link to={`/explore/geography?year=${year}`} className="link-u mt-4 inline-flex items-center gap-2 text-sm font-medium">{t('Explore every region at {year}', { year: formatYear(year) })} <ArrowRight size={16} /></Link>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

const FOCI = [
  { id: 'artist-van-gogh', label: t('Van Gogh') }, { id: 'artist-hokusai', label: t('Hokusai') }, { id: 'style-mughal-painting', label: t('Mughal painting') },
  { id: 'mov-cubism', label: t('Cubism') }, { id: 'trad-benin-court', label: t('Benin court arts') },
]

const CONTEXT_PAIRS = [
  { kind: t('Political'), event: 'evt-qin-unification', effect: 'trad-qin-funerary', verb: t('made possible'), text: t('A newly unified state could marshal labour and materials at an unprecedented scale — and the Terracotta Army followed.') },
  { kind: t('Technological'), event: 'evt-paint-tube', effect: 'mov-impressionism', verb: t('helped shape'), text: t('Paint in portable tubes made painting outdoors practical, supporting the Impressionists’ way of working.') },
  { kind: t('Social'), event: 'evt-great-migration', effect: 'mov-harlem-renaissance', verb: t('brought together'), text: t('Millions moving north created the community, audience and publications of the Harlem Renaissance.') },
  { kind: t('Cultural exchange'), event: 'evt-perry', effect: 'exc-japonisme', verb: t('opened the way for'), text: t('As Japan’s ports opened, prints travelled west — to be collected by Monet and copied by Van Gogh.') },
]

export function Home() {
  useDocumentTitle()
  const [focus, setFocus] = useState(FOCI[0].id)
  const eras = getEras().sort((a, b) => a.dates.start - b.dates.start)
  const curated = ['style-ukiyo-e', 'style-song-landscape', 'trad-benin-court', 'mov-impressionism', 'trad-maya', 'mov-harlem-renaissance'].map((id) => getEntity(id) as Entity)
  const more = useMemo(() => {
    const a = suggestionsFor('exc-japonisme', 2), b = suggestionsFor('trad-benin-court', 2, a.map((x) => x.id))
    return [...a, ...b].slice(0, 4)
  }, [])
  const cover = getArtworks().length

  return (
    <>
      {/* ------------------------------ hero ------------------------------ */}
      <section className="on-dark mx-3 mt-1 flex min-h-[calc(100svh-68px-1.25rem)] flex-col overflow-hidden rounded-[2rem] bg-black text-white sm:mx-5 sm:rounded-[2.5rem]" aria-labelledby="hero-h">
        <div className="page-x pt-10 text-center sm:pt-14">
          <h1 id="hero-h" className="page-title mx-auto max-w-[19ch] !text-[clamp(2.2rem,3.6vw+0.8rem,4.3rem)] !leading-[1.04]">{t('See art history as it actually happened.')}</h1>
        </div>
        <HeroRing className="flex min-h-[260px] flex-1 flex-col pt-6 [&>div:first-child]:flex-1" />
        <div className="page-x hidden pb-9 pt-1 sm:block [@media(max-height:860px)]:!hidden">
          <dl className="mx-auto grid max-w-2xl grid-cols-4 gap-x-4 text-center text-sm">
            {[[String(getRegions().length), t('regions')], [String(getMovements().length), t('movements & traditions')], [String(getArtists().length), t('artists')], [String(cover), t('artworks')]].map(([n, l]) => (
              <div key={l}><dt className="sr-only">{l}</dt><dd><span className="font-display text-3xl leading-none text-volt sm:text-4xl">{n}</span><span className="mt-1 block text-xs text-white/70">{l}</span></dd></div>
            ))}
          </dl>
        </div>
      </section>

      {/* ------------------------- explore through time ------------------------- */}
      <section className="page-x py-16">
        <SectionHeading id="time" label={t('Explore through time')} title={t('Ten regions, one timeline')} aside={<Link className="link-u text-ink" to="/explore/timeline">{t('Open the full timeline')}</Link>} />
        <p className="lede mb-8 max-w-2xl">{t('Follow one row to follow a place. Look straight down at any year to see what was happening everywhere else. Drag the chart, or jump to an era.')}</p>
        <Timeline variant="preview" />
        <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {eras.map((e) => (
            <li key={e.id}>
              <Link to={`/explore/timeline?from=${Math.max(e.dates.start, -600)}&to=${e.dates.end ?? 2030}`} className="group block h-full rounded-2xl bg-surface p-5 transition-colors hover:bg-sunk">
                <span className="label">{e.subtitle}</span>
                <span className="mt-1 block font-display text-2xl leading-tight">{e.title}</span>
                <span className="mt-2 inline-flex items-center gap-1.5 text-sm text-muted group-hover:text-ink">{t('Enter this era')} <ArrowRight size={14} className="arrow-nudge" /></span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* ------------------------- across cultures ------------------------- */}
      <section className="page-x py-16">
        <SectionHeading id="cultures" label={t('Explore across cultures')} title={t('The same year, everywhere')} aside={<Link className="link-u text-ink" to="/explore/geography">{t('All regions')}</Link>} />
        <p className="lede mb-8 max-w-2xl">{t('Pick a year and see which traditions, artists and events were active in each part of the world. No place is the default centre of the story.')}</p>
        <YearStrip />
      </section>

      {/* ------------------------- movements ------------------------- */}
      <section className="page-x py-16">
        <SectionHeading id="movements" label={t('Movements & traditions')} title={t('Many stories, not one line')} aside={<Link className="link-u text-ink" to="/movements">{t('All movements & traditions')}</Link>} />
        <div className="grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {curated.map((e, i) => <Reveal key={e.id} delay={(i % 3) * 70}><EntityCard entity={e} /></Reveal>)}
        </div>
      </section>

      {/* ------------------------- design lineage ------------------------- */}
      <section className="page-x py-16">
        <SectionHeading id="design" label={t('Art, design, typography & architecture')} title={t('How the arts became design')}
          aside={<Link className="link-u text-ink" to="/movements?domain=graphic-design">{t('Design & typography movements')}</Link>} />
        <p className="mb-8 max-w-2xl text-lg leading-relaxed text-ink/80" >
          {t('Movements rarely stand alone. These four chains are simplified routes through the network — click any step to read why it emerged, then open its connections to see everything else that fed into it.')}
        </p>
        <div className="grid gap-6 lg:grid-cols-2">
          {LINEAGES.map((l) => (
            <div key={l.label} className="rounded-3xl bg-surface p-5 sm:p-6">
              <p className="label mb-4">{l.label}</p>
              <ol className="flex flex-wrap items-center gap-2" aria-label={l.label}>
                {l.ids.map((id, i) => {
                  const e = getEntity(id)
                  if (!e) return null
                  return (
                    <li key={id} className="flex items-center gap-2">
                      {i > 0 && <><ArrowRight size={16} className="text-muted" /><span className="sr-only">{t('then')}</span></>}
                      <Link to={entityPath(e)} className="chip bg-paper">{e.title}</Link>
                    </li>
                  )
                })}
              </ol>
              <p className="mt-4 text-sm leading-relaxed text-muted">{l.note}</p>
            </div>
          ))}
        </div>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link to="/learn/path/path-craft-to-bauhaus" className="btn btn-solid">{t('Follow the design-lineage path')}</Link>
          <Link to="/connections?focus=school-bauhaus" className="btn btn-ghost">{t('Open the Bauhaus network')}</Link>
        </div>
      </section>

      {/* ------------------------- connections ------------------------- */}
      <section className="page-x py-16">
        <SectionHeading id="connections" label={t('Artists and their connections')} title={t('Who influenced whom')} aside={<Link className="link-u text-ink" to="/connections">{t('Open the full map')}</Link>} />
        <div className="mb-5 flex flex-wrap items-center gap-2" role="group" aria-label={t('Choose a focus')}>
          <span className="label mr-2">{t('Start from')}</span>
          {FOCI.map((f) => <button key={f.id} type="button" className="chip" aria-pressed={focus === f.id} onClick={() => setFocus(f.id)}>{f.label}</button>)}
        </div>
        <ConnectionsGraph key={focus} compact defaultFocus={focus} />
      </section>

      {/* ------------------------- context ------------------------- */}
      <section className="page-x py-16">
        <SectionHeading id="context" label={t('Understand the context')} title={t('Art never happens alone')} />
        <p className="lede mb-10 max-w-2xl">{t('Politics, society, technology and exchange shape what artists make. Each pairing below is a documented link in the dataset, never a guess based on shared dates.')}</p>
        <div className="grid gap-4 md:grid-cols-2">
          {CONTEXT_PAIRS.map((c, i) => {
            const ev = getEntity(c.event) as Entity, ef = getEntity(c.effect) as Entity
            return (
              <Reveal key={c.event} delay={(i % 2) * 70}>
                <div className="h-full rounded-3xl bg-surface p-7 sm:p-9">
                  <p className="inline-block rounded-full bg-paper px-3 py-1 text-sm">{c.kind}</p>
                  <p className="mt-4 flex flex-wrap items-baseline gap-x-3 gap-y-1">
                    <Link to={entityPath(ev)} className="font-display text-3xl leading-tight link-u">{ev.title}</Link>
                    <span className="text-sm text-muted">{formatDate(ev.dates)}</span>
                  </p>
                  <p className="my-3 flex items-center gap-3 text-sm text-muted"><span aria-hidden className="h-px w-8 bg-ink/40" />{c.verb}<ArrowRight size={14} /></p>
                  <p className="flex flex-wrap items-center gap-3"><Link to={entityPath(ef)} className="font-display text-3xl leading-tight link-u">{ef.title}</Link><TypeBadge type={ef.type} /></p>
                  <p className="mt-4 max-w-md text-sm leading-relaxed text-ink/80">{c.text}</p>
                </div>
              </Reveal>
            )
          })}
        </div>
        <p className="mt-5"><Link to="/connections/events" className="link-u inline-flex items-center gap-2 text-sm font-medium">{t('All historical events')} <ArrowRight size={14} /></Link></p>
      </section>

      {/* ------------------------- quiz ------------------------- */}
      <section className="page-x py-16">
        <SectionHeading id="quiz" label={t('Test your knowledge')} title={t('Three quick questions')} aside={<Link className="link-u text-ink" to="/learn/quizzes">{t('All quizzes')}</Link>} />
        <div className="rounded-[2rem] bg-surface p-6 sm:p-12">
          <QuizPlayer compact quizId="home-featured" title={t('Featured mini quiz')} questionIds={['q-aid-great-wave', 'q-cx-impressionism', 'q-tl-meanwhile']} onExit={() => undefined} exitLabel={t('Close')} />
        </div>
      </section>

      {/* ------------------------- continue ------------------------- */}
      <section className="page-x py-16">
        <SectionHeading id="next" label={t('Continue exploring')} title={t('Keep going')} />
        <div className="grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
          {more.map((e, i) => <Reveal key={e.id} delay={i * 60}><EntityCard entity={e} /></Reveal>)}
        </div>
        <div className="mt-16 grid gap-4 sm:grid-cols-3">
          {[[t('Take a guided path'), '/learn', t('From Edo to Paris, courts and power, five modern movements.')], [t('Compare two works'), '/artworks/compare', t('Scale, material and the world each belongs to.')], [t('Browse and filter'), '/explore/browse', t('Nine combinable filters, every result a page.')]].map(([title, to, d]) => (
            <Link key={to} to={to} className="group block rounded-3xl bg-surface p-8 transition-colors hover:bg-sunk"><span className="block font-display text-3xl">{title}</span><span className="mt-2 block text-[0.95rem] text-muted">{d}</span><ArrowRight size={18} className="arrow-nudge mt-6" /></Link>
          ))}
        </div>
      </section>
    </>
  )
}

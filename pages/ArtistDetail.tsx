import { useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import type { Artist } from '@/types'
import {
  artworksOfArtist, entityPath, getBySlug, heroOf, movementsOfArtist, regionName, relationsOf, TYPE_LABEL,
} from '@/lib/repo'
import { markViewed } from '@/lib/progress'
import { formatDate } from '@/lib/time'
import { ArtworkImage } from '@/components/ui/ArtworkImage'
import { PortraitCredit, PortraitImage } from '@/components/ui/PortraitImage'
import { EntityCard } from '@/components/ui/EntityCard'
import { useDocumentTitle } from '@/components/ui/hooks'
import { ArrowRight } from '@/components/ui/Icons'
import { Breadcrumbs, ContinueExploring, DefList, scrollToSection, SectionHeading, SectionNav, Sources, StatusNote } from '@/components/ui/Page'
import { Reveal } from '@/components/ui/Reveal'
import { SaveButton } from '@/components/ui/SaveButton'
import { MiniQuiz } from '@/components/quiz/MiniQuiz'
import { LifeTimeline } from '@/components/templates/LifeTimeline'
import { RelationList } from '@/components/templates/RelationList'
import { SpanBar } from '@/components/templates/SpanBar'
import { ConnectionsGraph } from '@/components/graph/ConnectionsGraph'
import { ARTIST_SECTIONS } from '@/data/taxonomy'
import { ArtistWorks } from '@/components/artists/ArtistWorks'
import { pick, t } from '@/i18n'
import { Missing } from './MovementDetail'

const KIND_LABEL: Record<Artist['kind'], string> = { individual: t('Individual artist'), anonymous: t('Anonymous makers'), workshop: t('Workshop'), collective: t('Collective or guild') }

const GENDER_LABEL: Record<string, string> = { woman: t('Woman'), man: t('Man'), 'non-binary or gender-diverse': t('Non-binary or gender-diverse') }

const SECTIONS = [
  { id: 'essentials', label: t('Essentials') }, { id: 'life', label: t('Timeline') }, { id: 'context', label: t('Context') }, { id: 'development', label: t('Development') },
  { id: 'movements', label: t('Movements') }, { id: 'works', label: t('Selected works') }, { id: 'relationships', label: t('Relationships') }, { id: 'legacy', label: t('Legacy') },
  { id: 'quiz', label: t('Quiz') }, { id: 'refs', label: t('References') },
]

export function ArtistDetail() {
  const { slug = '' } = useParams()
  const a = getBySlug('artist', slug) as Artist | undefined
  useDocumentTitle(a?.title)
  useEffect(() => { if (a) markViewed(a.id) }, [a])
  if (!a) return <Missing what="artist" />
  if (a.level === 'index') return <ArtistIndexRecord a={a} />

  const hero = heroOf(a)
  const works = artworksOfArtist(a.id)
  const movements = movementsOfArtist(a.id)
  const rels = relationsOf(a.id, ['influenced_by', 'collaborated_with', 'studied_under', 'cultural_exchange', 'shaped_by'])
  const anon = a.kind !== 'individual'

  return (
    <article>
      <Breadcrumbs items={[{ label: t('Artists'), to: '/artists' }, { label: a.title }]} />

      {/* 1 — introduction */}
      <header className="page-x grid gap-8 pb-10 pt-8 lg:grid-cols-[1.1fr_1fr] lg:items-end lg:gap-14 lg:pt-14">
        <div>
          <div className="flex flex-wrap items-center gap-4">
            <span className="inline-flex items-center gap-2 rounded-full bg-f-artist px-3 py-1 text-[0.82rem] leading-none text-onfill">{KIND_LABEL[a.kind]}</span>
            <span className="label">{a.subtitle}</span>
          </div>
          <h1 className="page-title mt-5">{a.title}</h1>
          <p className="page-intro mt-4 max-w-xl">{a.summary}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <button type="button" className="btn btn-solid" onClick={() => scrollToSection('essentials')}>{t('Start reading')}</button>
            <Link to={`/connections?focus=${a.id}`} className="btn btn-ghost">{t('See relationships')}</Link>
            <SaveButton id={a.id} title={a.title} />
          </div>
        </div>
        {(hero || a.portrait) ? (
          <div className={a.portrait && hero ? 'grid items-end gap-4 sm:grid-cols-[0.8fr_1.2fr]' : ''}>
            {a.portrait && (
              <figure>
                <PortraitImage artist={a} ratio={0.8} priority className="!rounded-3xl" />
                <figcaption className="mt-2"><PortraitCredit artist={a} /></figcaption>
              </figure>
            )}
            {hero && (
              <figure>
                <Link to={entityPath(hero)} className="img-zoom block" aria-label={t('Open artwork: {title}', { title: hero.title })}>
                  <ArtworkImage artwork={hero} priority width={1200} ratio={a.portrait ? 1.2 : Math.min(Math.max(hero.image.ratio, 0.8), 1.5)} fit="cover" className="!rounded-3xl" />
                </Link>
                <figcaption className="mt-2 text-xs text-muted"><span className="text-ink">{hero.title}</span>, {hero.dateDisplay}</figcaption>
              </figure>
            )}
          </div>
        ) : <div className="hidden lg:block" />}
      </header>

      <SectionNav sections={SECTIONS} />

      <div className="page-x space-y-24 py-16">
        {a.stub && <StatusNote entity={a} stub />}

        {/* 2 — essentials */}
        <section>
          <SectionHeading id="essentials" no="01" label={t('Essential information')} title={t('At a glance')} />
          <div className="grid gap-10 lg:grid-cols-2">
            <DefList items={[...a.essentials.map((e) => ({ label: e.label, value: e.value })), { label: t('Region'), value: a.regions.map((r) => <Link key={r} to={`/explore/geography/${r}`} className="link-u mr-3">{regionName(r)}</Link>) }, { label: t('Materials'), value: a.mediums.join(' · ') }]} />
            <div><p className="label mb-3">{t('Dates on the global axis')}</p><SpanBar dates={a.dates} colorVar="--c-artist" /><p className="mt-3 text-sm text-muted">{formatDate(a.dates)}</p></div>
          </div>
        </section>

        {/* 3 — life timeline */}
        <section>
          <SectionHeading id="life" no="02" label={t('Interactive timeline')} title={anon ? t('Documented milestones') : t('A life in dates')} />
          <LifeTimeline artist={a} />
        </section>

        {/* 4 — context */}
        <section>
          <SectionHeading id="context" no="03" label={t('Historical context')} title={t('The world around')} />
          <Reveal><div className="prose-body">{a.context.map((p, i) => <p key={i}>{p}</p>)}</div></Reveal>
        </section>

        {/* 5 — development */}
        <section>
          <SectionHeading id="development" no="04" label={t('Artistic development')} title={t('How the work changed')} />
          <Reveal><div className="prose-body">{a.development.map((p, i) => <p key={i}>{p}</p>)}</div></Reveal>
        </section>

        {/* 6 — movements */}
        <section>
          <SectionHeading id="movements" no="05" label={t('Movements and traditions')} title={t('Where they belong')} />
          {movements.length ? <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{movements.map((m) => <EntityCard key={m.id} entity={m} />)}</div> : <p className="text-muted">{t('No linked movements yet.')}</p>}
        </section>

        {/* 7 — works */}
        <section>
          <SectionHeading id="works" no="06" label={t('Selected artworks')} title={t('Works')} />
          {works.length ? <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{works.map((w, i) => <Reveal key={w.id} delay={i * 60}><EntityCard entity={w} /></Reveal>)}</div>
            : <p className="max-w-prose text-muted">{t('No artworks are catalogued for {title} in the sample dataset — this is an intentionally partial record.', { title: a.title })}</p>}
        </section>

        <ArtistWorks artist={a} hasLocal={works.length > 0} />

        {/* 8 — relationships */}
        <section>
          <SectionHeading id="relationships" no="07" label={t('Influences, collaborations and relationships')} title={t('Connected to')}
            aside={<Link to={`/connections?focus=${a.id}`} className="link-u inline-flex items-center gap-2 text-ink">{t('Open on the map')} <ArrowRight size={14} /></Link>} />
          <RelationList subject={a.title} relations={rels} />
          {rels.length > 0 && <p className="mt-3 text-xs text-muted">{t('Also shown on {type} relationship views. Every link above has a stated basis; none is inferred from shared dates.', { type: TYPE_LABEL.artist.toLowerCase() })}</p>}
        </section>

        {/* 9 — legacy */}
        <section>
          <SectionHeading id="legacy" no="08" label={t('Legacy')} title={t('Afterwards')} />
          <Reveal><div className="prose-body">{a.legacy.map((p, i) => <p key={i}>{p}</p>)}</div></Reveal>
        </section>

        {/* 10 — quizzes */}
        <section>
          <SectionHeading id="quiz" no="09" label={t('Related quizzes')} title={t('Check what stuck')} />
          <MiniQuiz entityId={a.id} entityTitle={a.title} />
        </section>

        {/* 11 — references */}
        <section>
          <SectionHeading id="refs" no="10" label={t('References')} title={t('Where to check')} />
          <div className="grid gap-6 lg:grid-cols-[2fr_1fr]"><Sources entity={a} /><StatusNote entity={a} /></div>
        </section>
      </div>

      <ContinueExploring id={a.id} title={t('Related content')} />
    </article>
  )
}

/** Compact page for index-level records: only what is actually recorded, plus an honest "profile not written yet". */
function ArtistIndexRecord({ a }: { a: Artist }) {
  const movements = movementsOfArtist(a.id)
  const section = ARTIST_SECTIONS.find((s) => s.id === a.taxonomy)
  const flags = a.flags ?? []
  const unresolved = flags.some((f) => f.startsWith('Unresolved'))
  return (
    <article>
      <Breadcrumbs items={[{ label: t('Artists'), to: '/artists' }, { label: a.title }]} />
      <header className={`page-x pb-8 pt-8 lg:pt-14 ${a.portrait ? 'grid gap-8 lg:grid-cols-[1.4fr_0.6fr] lg:items-end' : ''}`}>
        <div>
        <div className="flex flex-wrap items-center gap-4">
          <span className="inline-flex items-center gap-2 rounded-full bg-f-artist px-3 py-1 text-[0.82rem] leading-none text-onfill">{KIND_LABEL[a.kind]}</span>
          <span className="label">{a.contemporary ? t('Contemporary practitioner') : pick('Historical', 'Ιστορικός δημιουργός')}</span>
          <span className="rounded-full bg-surface px-3 py-1 text-xs text-muted">{t('Index record')}</span>
        </div>
        <h1 className="page-title mt-5">{a.title}</h1>
        {!!a.altTitles?.length && <p className="mt-3 text-muted">{t('Also written {names}', { names: a.altTitles.join(' · ') })}</p>}
        <p className="page-intro mt-4 max-w-xl">{a.subtitle}</p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link to={`/connections?focus=${a.id}`} className="btn btn-solid">{t('Open on the map')}</Link>
          {movements[0] && <Link to={entityPath(movements[0])} className="btn btn-ghost">{movements[0].title}</Link>}
          <SaveButton id={a.id} title={a.title} />
        </div>
        </div>
        {a.portrait && (
          <figure className="max-w-xs lg:justify-self-end">
            <PortraitImage artist={a} ratio={0.8} priority className="!rounded-3xl" />
            <figcaption className="mt-2"><PortraitCredit artist={a} /></figcaption>
          </figure>
        )}
      </header>

      <div className="page-x space-y-16 pb-20 pt-4">
        <section aria-labelledby="rec-h">
          <h2 id="rec-h" className="mb-5 font-display text-3xl">{t('What the record holds')}</h2>
          <div className="grid gap-10 lg:grid-cols-2">
            <DefList items={[
              { label: t('Name'), value: a.title },
              ...(a.altTitles?.length ? [{ label: t('Also'), value: a.altTitles.join(' · ') }] : []),
              { label: t('Practice'), value: (a.subtitle ?? '').split(' · ')[0] },
              { label: t('Origin'), value: a.originLabel ?? '' },
              { label: t('Region'), value: a.regions.map((r) => <Link key={r} to={`/explore/geography/${r}`} className="link-u mr-3">{regionName(r)}</Link>) },
              { label: t('Dates'), value: formatDate(a.dates) },
              { label: t('Period'), value: a.contemporary ? t('Contemporary (born 1930 or later)') : pick('Historical', 'Ιστορική') },
              ...(a.gender ? [{ label: t('Gender'), value: GENDER_LABEL[a.gender] ?? a.gender }] : []),
              ...(section ? [{ label: t('Master list'), value: <Link to={`/artists?section=${section.id}`} className="link-u">{section.label}</Link> }] : []),
              { label: t('Movements'), value: movements.length ? movements.map((m) => <Link key={m.id} to={entityPath(m)} className="link-u mr-3">{m.title}</Link>) : t('None assigned yet') },
            ]} />
            <div>
              <p className="label mb-3">{t('Dates on the global axis')}</p>
              <SpanBar dates={a.dates} colorVar="--c-artist" />
              <p className="mt-3 text-sm text-muted">{formatDate(a.dates)}</p>
              <aside className="mt-8 rounded-2xl bg-surface p-5 text-sm leading-relaxed text-muted" aria-label={t('Profile status')}>
                <p><strong className="font-medium text-ink">{t('No profile yet.')}</strong> {t('Biography, context, major works, influences and sources will be written and checked before this record is promoted to a profile. Nothing here is inferred beyond the master list and the movement tags.')}</p>
              </aside>
            </div>
          </div>
        </section>

        {flags.length > 0 && (
          <section aria-labelledby="flags-h">
            <h2 id="flags-h" className="mb-5 font-display text-3xl">{unresolved ? t('Verification needed') : t('Editorial notes')}</h2>
            <ul className="max-w-3xl space-y-3">
              {flags.map((f, i) => <li key={i} className="grid grid-cols-[1.25rem_1fr] gap-2 text-lg leading-relaxed text-ink/90"><span aria-hidden className="mt-[0.7em] h-1.5 w-1.5 rounded-full bg-ink" /><span>{f}</span></li>)}
            </ul>
          </section>
        )}

        <ArtistWorks artist={a} />

        {movements.length > 0 && (
          <section aria-labelledby="mv-h">
            <h2 id="mv-h" className="mb-5 font-display text-3xl">{t('Movements and traditions')}</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{movements.map((m) => <EntityCard key={m.id} entity={m} />)}</div>
          </section>
        )}

        {movements.length > 0 && (
          <section aria-labelledby="net-h">
            <h2 id="net-h" className="mb-5 font-display text-3xl">{t('Network')}</h2>
            <ConnectionsGraph compact defaultFocus={a.id} heading={t('{title} network', { title: a.title })} presetEntityGroups={['artist', 'movement']}
              presetRelations={['associated_with', 'influenced_by', 'studied_under', 'collaborated_with', 'developed_from', 'part_of']} />
          </section>
        )}
      </div>
      <ContinueExploring id={a.id} title={t('Related content')} />
    </article>
  )
}

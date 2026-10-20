import { useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import type { Artwork } from '@/types'
import { commonsPage } from '@/lib/images'
import {
  artistsOfArtwork, entityPath, eventsShaping, exchangesOf, getBySlug, getEntity, movementsOfArtwork, regionName, relationsOf, similarArtworks,
} from '@/lib/repo'
import { markViewed } from '@/lib/progress'
import { dateLabel, t } from '@/i18n'
import { EntityCard } from '@/components/ui/EntityCard'
import { useDocumentTitle } from '@/components/ui/hooks'
import { ArrowUpRight } from '@/components/ui/Icons'
import { Breadcrumbs, ContinueExploring, DefList, SectionHeading, Sources, StatusNote } from '@/components/ui/Page'
import { Reveal } from '@/components/ui/Reveal'
import { SaveButton } from '@/components/ui/SaveButton'
import { TypeBadge } from '@/components/ui/TypeBadge'
import { MiniQuiz } from '@/components/quiz/MiniQuiz'
import { ArtworkViewer } from '@/components/templates/ArtworkViewer'
import { RelationList } from '@/components/templates/RelationList'
import { Missing } from './MovementDetail'

export function ArtworkDetail() {
  const { slug = '' } = useParams()
  const w = getBySlug('artwork', slug) as Artwork | undefined
  useDocumentTitle(w?.title)
  useEffect(() => { if (w) markViewed(w.id) }, [w])
  if (!w) return <Missing what="artwork" />

  const artists = artistsOfArtwork(w.id)
  const movements = movementsOfArtwork(w.id)
  const events = eventsShaping(w.id)
  const exchanges = exchangesOf(w.id)
  const similar = similarArtworks(w.id, 3)
  const lineage = relationsOf(w.id, ['influenced_by', 'depicts', 'cultural_exchange', 'shaped_by'])
  const themes = w.themes.map((id) => getEntity(id)).filter(Boolean)
  const imageNote = w.image.commonsFile

  return (
    <article>
      <Breadcrumbs items={[{ label: t('Artworks'), to: '/artworks' }, { label: w.title }]} />

      {/* the artwork is the primary focus */}
      <section className="page-x pt-6" aria-label={t('Artwork viewer')}>
        <ArtworkViewer artwork={w} />
        {w.image.src && (
          <p className="mt-3 text-[0.8rem] text-muted">
            {t('Image: {credit}.', { credit: w.image.credit })}{' '}
            {imageNote && <a href={commonsPage(w.image.commonsFile as string)} target="_blank" rel="noreferrer noopener" className="link-u">{t('Source and licence')}<span className="sr-only"> ({t('opens in a new tab')})</span></a>}
          </p>
        )}
      </section>

      <header className="page-x grid gap-8 pb-10 pt-8 lg:grid-cols-[1.4fr_1fr]">
        <div>
          <TypeBadge type="artwork" />
          <h1 className="page-title mt-4">{w.title}</h1>
          {w.subtitle && <p className="page-intro mt-3 max-w-xl">{w.subtitle}</p>}
          <p className="mt-5 text-lg">
            {artists.length ? artists.map((a, i) => <span key={a.id}>{i > 0 && ', '}<Link to={entityPath(a)} className="link-u font-medium">{a.title}</Link></span>) : w.attribution}
            <span className="text-muted"> · {dateLabel(w.dateDisplay)}</span>
          </p>
          {artists.length > 0 && w.attribution !== artists.map((a) => a.title).join(', ') && <p className="mt-1 text-sm text-muted">{t('Attribution: {name}', { name: w.attribution })}</p>}
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-ink/85">{w.summary}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <SaveButton id={w.id} title={w.title} className="border-rule" />
            <Link to={`/artworks/compare?a=${w.id}`} className="btn btn-ghost">{t('Compare with another work')}</Link>
            <Link to={`/connections?focus=${w.id}`} className="btn btn-ghost">{t('See connections')}</Link>
          </div>
        </div>
        <DefList items={[
          { label: t('Date'), value: dateLabel(w.dateDisplay) },
          { label: t('Medium'), value: w.medium },
          { label: t('Technique'), value: w.techniques.join(' · ') },
          ...(w.dimensions ? [{ label: t('Dimensions'), value: w.dimensions }] : []),
          { label: t('Origin'), value: <>{w.originPlace}{w.regions[0] && <> · <Link to={`/explore/geography/${w.regions[0]}`} className="link-u">{regionName(w.regions[0])}</Link></>}</> },
          { label: t('Collection'), value: w.location },
        ]} />
      </header>

      <div className="page-x space-y-20 py-12">
        <section>
          <SectionHeading no="01" label={t('Historical context')} title={t('Why it exists')} />
          <Reveal><div className="prose-body">{w.context.map((p, i) => <p key={i}>{p}</p>)}</div></Reveal>
          {events.length > 0 && <div className="mt-8 grid gap-4 sm:grid-cols-2">{events.map((e) => <EntityCard key={e.id} entity={e} variant="row" />)}</div>}
        </section>

        <section>
          <SectionHeading no="02" label={t('Visual analysis')} title={t('Looking closely')} />
          <div className="grid gap-10 lg:grid-cols-[1.3fr_1fr]">
            <Reveal><div className="prose-body">
              <p className="font-medium">{w.description}</p>
              {w.analysis.map((p, i) => <p key={i}>{p}</p>)}
            </div></Reveal>
            {w.symbolism && (
              <aside className="border-l-2 border-ink pl-6">
                <p className="label mb-2">{t('Symbolism and interpretation')}</p>
                <div className="space-y-3 text-sm leading-relaxed">{w.symbolism.map((p, i) => <p key={i}>{p}</p>)}</div>
                <p className="mt-3 text-xs text-muted">{t('Interpretations are offered where scholarship supports them and are marked as debated where they are.')}</p>
              </aside>
            )}
          </div>
        </section>

        <section>
          <SectionHeading no="03" label={t('Related artists, traditions and movements')} title={t('Where it sits')} />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[...artists, ...movements].map((e) => <EntityCard key={e.id} entity={e} variant="row" image={false} className="sm:col-span-1" />)}
          </div>
          {lineage.length > 0 && <div className="mt-10"><p className="label mb-3">{t('Other documented links')}</p><RelationList subject={w.title} relations={lineage} /></div>}
          {exchanges.length > 0 && <p className="mt-6 text-sm text-muted">{t('Part of:')} {exchanges.map((e) => <Link key={e.id} to={entityPath(e)} className="link-u mr-3 text-ink">{e.title}</Link>)}</p>}
          {themes.length > 0 && <p className="mt-2 text-sm text-muted">{t('Themes:')} {themes.map((th) => <Link key={th!.id} to={entityPath(th!)} className="link-u mr-3 text-ink">{th!.title}</Link>)}</p>}
        </section>

        {similar.length > 0 && (
          <section>
            <SectionHeading no="04" label={t('Similar or related artworks')} title={t('Look next')} />
            <div className="grid gap-4 sm:grid-cols-3">{similar.map((s, i) => <Reveal key={s.id} delay={i * 60}><EntityCard entity={s} /></Reveal>)}</div>
          </section>
        )}

        <section>
          <SectionHeading no="05" label={t('Test yourself')} title={t('Quiz on this work')} />
          <MiniQuiz entityId={w.id} entityTitle={w.title} />
        </section>

        <section>
          <SectionHeading no="06" label={t('Image credit and licensing')} title={t('Credits & sources')} />
          <div className="grid gap-8 lg:grid-cols-2">
            <DefList items={[
              { label: t('Image'), value: imageNote ? <>{t('File “{file}” on Wikimedia Commons', { file: w.image.commonsFile as string })} — <a className="link-u inline-flex items-center gap-1" href={commonsPage(w.image.commonsFile as string)} target="_blank" rel="noreferrer noopener">{t('source page')}<ArrowUpRight size={13} /><span className="sr-only"> ({t('opens in a new tab')})</span></a></> : w.image.src ? t('Supplied by the project owner (not from Wikimedia Commons)') : t('None catalogued yet') },
              { label: t('Credit'), value: w.image.credit },
              { label: t('Licence'), value: w.image.licence },
              ...(w.image.restricted ? [{ label: t('See the work'), value: <a className="link-u" href={w.image.restricted.viewUrl} target="_blank" rel="noreferrer noopener">{w.image.restricted.viewLabel}<span className="sr-only"> ({t('opens in a new tab')})</span></a> }] : []),
              { label: t('Alt text'), value: w.image.alt },
            ]} />
            <div className="space-y-4"><Sources entity={w} /><StatusNote entity={w} /></div>
          </div>
          <p className="mt-4 max-w-prose text-xs leading-relaxed text-muted">
            {t('Images are never copied into this prototype without a checked licence, and stock imagery is never used as a stand-in for a specific work. The licence line states what is expected; confirm it on the source page before reuse.')}
          </p>
        </section>
      </div>
      <ContinueExploring id={w.id} />
    </article>
  )
}

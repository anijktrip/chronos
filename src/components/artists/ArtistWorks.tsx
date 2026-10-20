import { useEffect, useState } from 'react'
import type { Artist } from '@/types'
import { t } from '@/i18n'
import { EXT as ext, WorkGrid, type W } from '@/components/works/WorkGrid'

interface Entry { links: Record<string, string>; works?: W[] }

/**
 * "Works" for any artist: a justified gallery of their best-known works where public-domain images exist, and always a row of
 * links to see everything elsewhere (the artist's own site where one exists, WikiArt only where the page really exists, Commons, Wikipedia). The data comes from scripts/find-works.ts and is
 * loaded on demand so it never weighs on the other pages.
 */
export function ArtistWorks({ artist, hasLocal = false }: { artist: Artist; hasLocal?: boolean }) {
  const [entry, setEntry] = useState<Entry | null | undefined>(undefined)
  useEffect(() => {
    let on = true
    import('@/data/artist-works.json').then((m) => { if (on) setEntry((m.default as unknown as Record<string, Entry>)[artist.id] ?? null) }).catch(() => { if (on) setEntry(null) })
    return () => { on = false }
  }, [artist.id])

  if (entry === undefined) return null
  const links = entry?.links ?? {}
  const name = artist.title.replace(/ \(.*\)$/, '')
  const works: W[] = entry?.works ?? []
  const out = [
    ...(links.website ? [{ href: links.website, label: t('Official website') }] : []),
    ...(links.wikiart ? [{ href: links.wikiart, label: 'WikiArt' }] : []),
    { href: links.commons ?? links.commonsSearch, label: links.commons ? 'Wikimedia Commons' : t('Wikimedia Commons (search)') },
    ...(links.wikipedia ? [{ href: links.wikipedia, label: 'Wikipedia (EN)' }] : []),
    ...(links.wikipediaEl ? [{ href: links.wikipediaEl, label: 'Wikipedia (ΕΛ)' }] : []),
  ].filter((l) => l.href)

  return (
    <section aria-labelledby="aw-h">
      <h2 id="aw-h" className="mb-2 font-display text-3xl">{hasLocal ? t('More works') : t('Works')}</h2>
      {works.length > 0 ? (
        <>
          <p className="mb-5 max-w-prose text-muted">{t('The best-known works of {name} with a freely licensed image, from Wikimedia Commons. Select an image for its source and credit.', { name })}</p>
          <WorkGrid works={works} />
          <p className="mt-3 max-w-prose text-xs leading-relaxed text-muted">{t('Public-domain works unless a licence is shown on the image page; photographs of sculpture and buildings carry their photographer’s licence and credit.')}</p>
        </>
      ) : (
        <p className="mb-5 max-w-prose text-muted">
          {artist.contemporary || artist.dates.start >= 1900
            ? t('Works by artists of the last century are usually still in copyright, so no image is shown here. You can see their work at the sources below.')
            : t('No freely licensed images of {name}’s works have been catalogued here yet. You can see their work at the sources below.', { name })}
        </p>
      )}
      <div className="mt-6 flex flex-wrap items-center gap-2 rounded-3xl bg-surface p-4 sm:p-5">
        <p className="mr-2 text-[0.98rem]">{t('See all works of {name}:', { name })}</p>
        {out.map((l) => (
          <a key={l.label} href={l.href} target="_blank" rel={ext} className="chip">{l.label}<span className="sr-only"> {t('(opens in a new tab)')}</span></a>
        ))}
      </div>
    </section>
  )
}

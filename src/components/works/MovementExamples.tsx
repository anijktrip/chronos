import { useEffect, useMemo, useState } from 'react'
import type { MovementLike } from '@/types'
import { artistsOfMovement } from '@/lib/repo'
import { t } from '@/i18n'
import { EXT, WorkGrid, type W } from './WorkGrid'

interface Entry { links: Record<string, string>; works?: W[] }

/**
 * Examples for any movement, school, style, collective or tradition: works whose "movement" is this one on Wikidata
 * (scripts/find-movement-works.ts) plus one well-known work from each artist linked to it, all with a checked free image,
 * and always a row of links to see more (Wikipedia, Commons, WikiArt where the page exists). Loaded on demand.
 */
export function MovementExamples({ movement }: { movement: MovementLike }) {
  const [data, setData] = useState<{ mv?: Entry; artists: Record<string, Entry> } | undefined>(undefined)
  useEffect(() => {
    let on = true
    Promise.all([import('@/data/movement-works.json'), import('@/data/artist-works.json')])
      .then(([a, b]) => { if (on) setData({ mv: (a.default as unknown as Record<string, Entry>)[movement.id], artists: b.default as unknown as Record<string, Entry> }) })
      .catch(() => { if (on) setData({ artists: {} }) })
    return () => { on = false }
  }, [movement.id])

  const makers = useMemo(() => artistsOfMovement(movement.id), [movement.id])
  const works = useMemo(() => {
    if (!data) return []
    const out: W[] = []
    const seen = new Set<string>()
    const add = (w: W) => { if (!seen.has(w.f) && out.length < 12) { seen.add(w.f); out.push(w) } }
    ;(data.mv?.works ?? []).slice(0, 8).forEach(add)
    for (const a of makers) { const w = data.artists[a.id]?.works?.[0]; if (w) add({ ...w, a: a.title.replace(/ \(.*\)$/, '') }) }
    ;(data.mv?.works ?? []).slice(8).forEach(add)
    return out
  }, [data, makers])

  if (!data) return null
  const links = data.mv?.links ?? {}
  const name = movement.title.replace(/ \(.*\)$/, '')
  const out = [
    ...(links.wikiart ? [{ href: links.wikiart, label: 'WikiArt' }] : []),
    { href: links.commons ?? links.commonsSearch, label: links.commons ? 'Wikimedia Commons' : t('Wikimedia Commons (search)') },
    ...(links.wikipedia ? [{ href: links.wikipedia, label: 'Wikipedia (EN)' }] : []),
    ...(links.wikipediaEl ? [{ href: links.wikipediaEl, label: 'Wikipedia (ΕΛ)' }] : []),
  ].filter((l) => l.href)

  return (
    <div>
      {works.length > 0 ? (
        <>
          <p className="mb-5 max-w-prose text-muted">{t('Works associated with {name}, each with a freely licensed image from Wikimedia Commons. Select an image for its source and credit.', { name })}</p>
          <WorkGrid works={works} />
          <p className="mt-3 max-w-prose text-xs leading-relaxed text-muted">{t('Public-domain works unless a licence is shown on the image page; photographs of sculpture and buildings carry their photographer’s licence and credit.')}</p>
        </>
      ) : (
        <p className="mb-5 max-w-prose text-muted">{t('No freely licensed images of works by {name} have been catalogued here yet. You can see examples at the sources below.', { name })}</p>
      )}
      <div className="mt-6 flex flex-wrap items-center gap-2 rounded-3xl bg-surface p-4 sm:p-5">
        <p className="mr-2 text-[0.98rem]">{t('See more examples of {name}:', { name })}</p>
        {out.map((l) => (
          <a key={l.label} href={l.href} target="_blank" rel={EXT} className="chip">{l.label}<span className="sr-only"> {t('(opens in a new tab)')}</span></a>
        ))}
      </div>
    </div>
  )
}

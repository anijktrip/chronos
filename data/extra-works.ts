import credits from './image-credits.json'
import raw from './extra-works.json'
import { localImage } from '@/lib/localImages'
import type { Artwork, Relationship, RegionId } from '@/types'
import { artwork } from './helpers'

/**
 * One well-known, freely licensed work for each of many artists, found by scripts/find-extra-works.ts from Wikidata and
 * Wikimedia Commons. These are index records: identity, date, materials, collection and image are recorded; no analysis yet.
 */
export interface ExtraRaw {
  id: string; artist?: string; name: string; title: string; titleEl?: string; year?: number; label?: string; collection?: string
  mats: string[]; kind: string; ratio: number; regions: string[]; periods: string[]; origin?: string; aStart: number; aEnd?: number
}
export const extraRaw = raw as unknown as ExtraRaw[]

type Credit = { credit: string; licence: string; ratio?: number }

export const extraArtworks: Artwork[] = extraRaw.map((w) => {
  const c = (credits as Record<string, Credit>)[w.id]
  const mid = Math.round((w.aStart + (w.aEnd ?? w.aStart + 40)) / 2)
  const medium = w.mats.length ? w.mats.join(', ') : w.kind ? w.kind.charAt(0).toUpperCase() + w.kind.slice(1) : 'Medium not recorded'
  const date = w.year ? (w.label ?? String(w.year)) : 'Date not recorded'
  return artwork({
    id: w.id,
    title: w.title,
    attribution: w.name,
    dateDisplay: date,
    dates: w.year ? { start: w.year, approx: !/^-?\d+$/.test(date.replace(/ BCE$/, '')), label: date } : { start: mid, approx: true, label: date },
    summary: `A work by ${w.name}${w.collection ? `, in ${w.collection}` : ''}.`,
    regions: w.regions as RegionId[],
    medium,
    mediums: w.mats.length ? w.mats : w.kind ? [w.kind.charAt(0).toUpperCase() + w.kind.slice(1)] : [],
    techniques: [],
    location: w.collection ?? 'Collection not recorded',
    originPlace: w.origin ?? '',
    image: { src: localImage(w.id), alt: `${w.title}, by ${w.name}`, credit: c?.credit ?? '', licence: c?.licence ?? '', ratio: c?.ratio ?? w.ratio },
    description: `${w.title}, by ${w.name}.`,
    context: [],
    analysis: [],
    periods: w.periods,
    sources: ['s-commons'],
    tags: w.kind ? [w.kind] : [],
    status: { level: 'sample', note: 'Index record: title, maker, date, materials, collection and image come from Wikidata and Wikimedia Commons; no analysis has been written yet.' },
  } as never)
})

export const extraRelationships: Relationship[] = extraRaw.filter((w) => w.artist).map((w) => ({
  id: `rel-x-${w.id.slice(4)}`.slice(0, 80), type: 'created_by', from: w.id, to: w.artist as string, note: `Work by ${w.name}.`,
}))

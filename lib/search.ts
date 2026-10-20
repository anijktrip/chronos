import type { Artist, Artwork, Entity, EntityType, MovementLike, RegionId } from '@/types'
import {
  artistsOfMovement, artworksOfArtist, entitiesOfType, getEntity, getPeriods, getThemes, isMovementLike, regionName, relationsOf,
  TYPE_LABEL,
} from './repo'
import { overlaps } from './time'

/* ------------------------------------------------------------------ */
/* Filters                                                             */
/* ------------------------------------------------------------------ */

export interface Filters {
  q: string
  types: EntityType[]
  regions: RegionId[]
  era?: string
  from?: number
  to?: number
  movement?: string
  artist?: string
  medium?: string
  technique?: string
  theme?: string
}

export const EMPTY_FILTERS: Filters = { q: '', types: [], regions: [] }

const list = (v: string | null) => (v ? v.split(',').filter(Boolean) : [])
const num = (v: string | null) => (v !== null && v !== '' && !Number.isNaN(Number(v)) ? Number(v) : undefined)

export function parseFilters(sp: URLSearchParams): Filters {
  return {
    q: sp.get('q') ?? '',
    types: list(sp.get('types')) as EntityType[],
    regions: list(sp.get('regions')) as RegionId[],
    era: sp.get('era') ?? undefined,
    from: num(sp.get('from')),
    to: num(sp.get('to')),
    movement: sp.get('movement') ?? undefined,
    artist: sp.get('artist') ?? undefined,
    medium: sp.get('medium') ?? undefined,
    technique: sp.get('technique') ?? undefined,
    theme: sp.get('theme') ?? undefined,
  }
}

export function filtersToParams(f: Filters): URLSearchParams {
  const sp = new URLSearchParams()
  if (f.q) sp.set('q', f.q)
  if (f.types.length) sp.set('types', f.types.join(','))
  if (f.regions.length) sp.set('regions', f.regions.join(','))
  if (f.era) sp.set('era', f.era)
  if (f.from !== undefined) sp.set('from', String(f.from))
  if (f.to !== undefined) sp.set('to', String(f.to))
  for (const k of ['movement', 'artist', 'medium', 'technique', 'theme'] as const) if (f[k]) sp.set(k, f[k] as string)
  return sp
}

export const activeFilterCount = (f: Filters) =>
  (f.types.length ? 1 : 0) + (f.regions.length ? 1 : 0) + (f.era ? 1 : 0) + (f.from !== undefined || f.to !== undefined ? 1 : 0) +
  (['movement', 'artist', 'medium', 'technique', 'theme'] as const).filter((k) => f[k]).length

/* ------------------------------------------------------------------ */
/* Index                                                               */
/* ------------------------------------------------------------------ */

const norm = (s: string) => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[\u2019']/g, '')

interface Doc { e: Entity; title: string; alt: string; tags: string; body: string }
let docs: Doc[] | null = null

const mediumsOf = (e: Entity): string[] => ('mediums' in e ? (e as Artwork).mediums : [])
const techniquesOf = (e: Entity): string[] => ('techniques' in e ? (e as Artwork).techniques : [])

function buildDocs(): Doc[] {
  if (docs) return docs
  docs = (entitiesOfAll()).map((e) => ({
    e,
    title: norm(e.title),
    alt: norm([...(e.altTitles ?? []), e.subtitle ?? ''].join(' ')),
    tags: norm([...e.tags, ...mediumsOf(e), ...techniquesOf(e), TYPE_LABEL[e.type]].join(' ')),
    body: norm([
      e.summary, ('attribution' in e ? (e as Artwork).attribution : ''), e.regions.map(regionName).join(' '),
      e.places.map((p) => getEntity(p)?.title ?? '').join(' '), ('medium' in e ? (e as Artwork).medium : ''),
    ].join(' ')),
  }))
  return docs
}
const entitiesOfAll = () => entitiesOfType(
  'tradition', 'movement', 'style', 'school', 'collective', 'artist', 'artwork', 'event', 'exchange', 'theme', 'period', 'place',
)

const TYPE_ORDER: EntityType[] = ['movement', 'school', 'collective', 'tradition', 'style', 'artist', 'artwork', 'event', 'exchange', 'theme', 'period', 'place']

/* ------------------------------------------------------------------ */
/* Connected sets used by the movement / artist facets                 */
/* ------------------------------------------------------------------ */

function connectedToMovement(id: string): Set<string> {
  const s = new Set<string>([id])
  relationsOf(id).forEach((r) => s.add(r.other.id))
  artistsOfMovement(id).forEach((a) => artworksOfArtist(a.id).forEach((w) => s.add(w.id)))
  return s
}
function connectedToArtist(id: string): Set<string> {
  const s = new Set<string>([id])
  relationsOf(id).forEach((r) => s.add(r.other.id))
  return s
}

/* ------------------------------------------------------------------ */
/* Search                                                              */
/* ------------------------------------------------------------------ */

export interface Result { entity: Entity; score: number }

export function search(f: Filters): Result[] {
  const tokens = norm(f.q).split(/\s+/).filter(Boolean)
  const mv = f.movement ? connectedToMovement(f.movement) : null
  const ar = f.artist ? connectedToArtist(f.artist) : null
  const era = f.era ? getPeriods().find((p) => p.id === f.era) : undefined
  const dateFiltered = !!era || f.from !== undefined || f.to !== undefined
  const lo = f.from ?? -Infinity
  const hi = f.to ?? Infinity

  const out: Result[] = []
  for (const d of buildDocs()) {
    const e = d.e
    if (f.types.length && !f.types.includes(e.type)) continue
    if (f.regions.length && !e.regions.some((r) => f.regions.includes(r))) continue
    if (dateFiltered) {
      if (e.type === 'place' || e.type === 'theme') continue
      if (era && !overlaps(e.dates, era.dates.start, era.dates.end ?? 3000)) continue
      if (!overlaps(e.dates, lo, hi)) continue
    }
    if (mv && !mv.has(e.id)) continue
    if (ar && !ar.has(e.id)) continue
    if (f.medium && !mediumsOf(e).includes(f.medium)) continue
    if (f.technique && !techniquesOf(e).includes(f.technique)) continue
    if (f.theme && !e.themes.includes(f.theme)) continue

    let score = 0
    if (tokens.length) {
      let ok = true
      for (const t of tokens) {
        let s = 0
        if (d.title.startsWith(t)) s = 12
        else if (d.title.split(/\s+/).some((w) => w.startsWith(t))) s = 10
        else if (d.title.includes(t)) s = 7
        else if (d.alt.includes(t)) s = 5
        else if (d.tags.includes(t)) s = 4
        else if (d.body.includes(t)) s = 2
        if (!s) { ok = false; break }
        score += s
      }
      if (!ok) continue
    }
    // written pages outrank index records of equal relevance
    if ((e as { level?: string }).level !== 'index') score += 1
    out.push({ entity: e, score })
  }
  return out.sort(
    (a, b) => b.score - a.score || TYPE_ORDER.indexOf(a.entity.type) - TYPE_ORDER.indexOf(b.entity.type) ||
      a.entity.dates.start - b.entity.dates.start || a.entity.title.localeCompare(b.entity.title),
  )
}

/* ------------------------------------------------------------------ */
/* Facet options                                                       */
/* ------------------------------------------------------------------ */

export interface FacetOptions {
  movements: MovementLike[]
  artists: Artist[]
  mediums: string[]
  techniques: string[]
  themes: { id: string; title: string }[]
  eras: { id: string; title: string }[]
}

let facets: FacetOptions | null = null
export function facetOptions(): FacetOptions {
  if (facets) return facets
  const all = entitiesOfAll()
  const uniq = (xs: string[]) => [...new Set(xs)].sort((a, b) => a.localeCompare(b))
  facets = {
    movements: all.filter(isMovementLike).sort((a, b) => a.dates.start - b.dates.start),
    artists: all.filter((e): e is Artist => e.type === 'artist').sort((a, b) => a.title.localeCompare(b.title)),
    mediums: uniq(all.flatMap(mediumsOf)),
    techniques: uniq(all.flatMap(techniquesOf)),
    themes: getThemes().map((t) => ({ id: t.id, title: t.title })),
    eras: getPeriods().filter((p) => p.scope === 'era').sort((a, b) => a.dates.start - b.dates.start).map((p) => ({ id: p.id, title: `${p.title} (${p.subtitle})` })),
  }
  return facets
}

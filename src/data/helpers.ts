import type {
  Artist, Artwork, ContentStatus, CulturalExchange, HistoricalEvent, MovementLike, Period, Place, Theme,
} from '@/types'

/** Every record in this prototype is sample content until a scholar signs it off. */
export const SAMPLE: ContentStatus = {
  level: 'sample',
  note: 'Prototype sample text, drafted from general reference knowledge. Not yet reviewed against primary sources or specialist scholarship.',
}

type Optional = 'slug' | 'status' | 'places' | 'themes' | 'tags' | 'sources'
type Input<T> = Omit<T, 'type' | Optional> & Partial<Pick<T, Extract<keyof T, Optional>>>

/** Slug = id without its type prefix ("mov-cubism" → "cubism"). */
const slugOf = (id: string) => id.slice(id.indexOf('-') + 1)

function build<T>(type: string, d: unknown): T {
  const rec = d as { id: string }
  return { slug: slugOf(rec.id), status: SAMPLE, places: [], themes: [], tags: [], sources: [], ...rec, type } as T
}

export const tradition = (d: Input<MovementLike>) => build<MovementLike>('tradition', d)
export const movement = (d: Input<MovementLike>) => build<MovementLike>('movement', d)
export const style = (d: Input<MovementLike>) => build<MovementLike>('style', d)
export const school = (d: Input<MovementLike>) => build<MovementLike>('school', d)
export const collective = (d: Input<MovementLike>) => build<MovementLike>('collective', d)
export const artist = (d: Input<Artist>) => build<Artist>('artist', d)
export const artwork = (d: Input<Artwork>) => build<Artwork>('artwork', d)
export const event = (d: Input<HistoricalEvent>) => build<HistoricalEvent>('event', d)
export const exchange = (d: Input<CulturalExchange>) => build<CulturalExchange>('exchange', d)
export const theme = (d: Input<Theme>) => build<Theme>('theme', d)
export const period = (d: Input<Period>) => build<Period>('period', d)
export const place = (d: Input<Place>) => build<Place>('place', d)

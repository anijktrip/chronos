/**
 * Content barrel. This is the ONLY module that knows where content comes from.
 * To move to a CMS or database, replace these imports with fetchers that return the
 * same shapes and keep `lib/repo.ts` unchanged.
 *
 * Content comes in two depths:
 *   – FULL records (hand-written prototype sample): traditions.ts, movements.ts, movements-full.ts, artists.ts, artworks.ts …
 *   – INDEX records (structure only, no prose): movement-index.ts and artist-index.ts, generated from compact tables.
 * Index records are real entities in the same graph, so relationships, search and filters work on them.
 */
import type { Artist, Entity, MovementLike, Relationship } from '@/types'
import { artistOverlays, artistMovementRelationships, indexArtists } from './artist-index'
import { artists } from './artists'
import { artworks } from './artworks'
import { galleryArtists, galleryArtworks, galleryRelationships } from './gallery-works'
import { extraArtworks, extraRelationships } from './extra-works'
import { eventsMore } from './events-more'
import { guernicaArtwork, guernicaRelationships } from './guernica'
import { keyRestrictedArtworks, keyRestrictedRelationships } from './key-works-restricted'
import { eventLinks } from './event-links'
import { events } from './events'
import { exchanges } from './exchanges'
import { objectives, paths, questions, quizzes } from './learning'
import { movementPaths, movementQuestions, movementQuizzes } from './learning-movements'
import { indexMovements, idOfSlug, movementOverlays } from './movement-index'
import { movementRelationships } from './movement-relations'
import { fullMovements } from './movements-full'
import { periods } from './periods'
import { portraitOverlays } from './portraits'
import { places } from './places'
import { regions } from './regions'
import { relationships as baseRelationships } from './relationships'
import { sources } from './sources'
import { themes } from './themes'
import { traditionsA } from './traditions'
import { traditionsB } from './movements'
import { dateLabel, isEl, t } from '@/i18n'
import { elEntities, elObjectives, elPaths, elQuestions, elQuizzes, elRegions, elRelationships, elSources } from './el'
import { localize, merge } from './el/merge'
import { buildArtQuiz } from './art-quiz'

/** Profile records outside the master list: added earlier as relationship examples. */
const extraArtistOverlays: Record<string, Partial<Artist>> = {
  'artist-verrocchio': { gender: 'man', flags: ['Not in the master list; included as a teacher–pupil relationship example (Leonardo).'] },
  'artist-douglas': { gender: 'man', flags: ['Not in the master list; included as a Harlem Renaissance example.'] },
  'artist-lawrence': { gender: 'man', flags: ['Not in the master list; included as a Harlem Renaissance example.'] },
  'artist-rukupo': { gender: 'man', flags: ['Not in the master list; included as a Māori carving example.'] },
}

const withOverlay = <T extends Entity>(list: T[], overlays: Record<string, Partial<Entity>>): T[] =>
  list.map((e) => (overlays[e.id] ? ({ ...e, ...Object.fromEntries(Object.entries(overlays[e.id]).filter(([, v]) => v !== undefined)) } as T) : e))

const fullIds = new Set(fullMovements.map((m) => m.id))
const writtenMovements = withOverlay<MovementLike>([...traditionsA, ...traditionsB] as MovementLike[], movementOverlays)

const entitiesEn: Entity[] = [
  ...writtenMovements, ...fullMovements,
  ...indexMovements.filter((m) => !fullIds.has(m.id)),
  ...withOverlay([...artists, ...indexArtists], { ...extraArtistOverlays, ...artistOverlays, ...portraitOverlays }),
  ...artworks, ...galleryArtworks, ...extraArtworks, guernicaArtwork, ...keyRestrictedArtworks, ...galleryArtists, ...events, ...eventsMore, ...exchanges, ...themes, ...periods, ...places,
]

/** "Katsushika Hokusai, via Wikimedia Commons" → "<Greek attribution>, μέσω Wikimedia Commons". */
function creditEl(credit: string, en?: string, el?: string): string {
  if (t(credit) !== credit) return t(credit)
  const m = credit.match(/^(.*), via (.+)$/)
  if (!m) return credit
  return `${en && el && m[1] === en ? el : m[1]}, μέσω ${m[2]}`
}

/** Greek: merge the overlay and keep the English title searchable as an alternative name. */
export const entities: Entity[] = !isEl ? entitiesEn : entitiesEn.map((e) => {
  const o = elEntities[e.id]
  const g = o ? merge(e, o) : e
  const dates = g.dates.label ? { ...g.dates, label: dateLabel(g.dates.label) } : g.dates
  const dateDisplay = (g as { dateDisplay?: string }).dateDisplay
  const img = (g as { image?: { credit: string; licence: string; note?: string } }).image
  const out = {
    ...g, dates,
    ...(dateDisplay ? { dateDisplay: dateLabel(dateDisplay) } : {}),
    ...(img ? { image: { ...img, credit: creditEl(img.credit, (e as { attribution?: string }).attribution, (g as { attribution?: string }).attribution), licence: t(img.licence), ...(img.note ? { note: t(img.note) } : {}) } } : {}),
    ...(g.status?.note ? { status: { ...g.status, note: t(g.status.note) } } : {}),
  } as Entity
  return out.title !== e.title ? { ...out, altTitles: [...new Set([e.title, ...(out.altTitles ?? [])])] } as Entity : out
})

const extra: Relationship[] = [
  { id: 'rel-x-001', type: 'associated_with', from: idOfSlug('japonisme'), to: 'exc-japonisme',
    note: 'Japonisme is the Western artistic response to the documented exchange of Japanese prints and objects with Europe.' },
  { id: 'rel-x-002', type: 'associated_with', from: 'artist-papunya-tula-artists', to: 'coll-papunya-tula-artists',
    note: 'The same Aboriginal-owned artists’ company, recorded both as a maker in the artist list and as a collective in the schools list.' },
]

/** De-duplicate on (type, unordered pair for symmetric types) so generated links never repeat hand-written ones. */
function dedupe(list: Relationship[]): Relationship[] {
  const seen = new Set<string>()
  return list.filter((r) => {
    const pair = r.type === 'associated_with' || r.type === 'collaborated_with' || r.type === 'cultural_exchange' ? [r.from, r.to].sort().join('~') : `${r.from}~${r.to}`
    const k = `${r.type}|${pair}`
    if (seen.has(k)) return false
    seen.add(k)
    return true
  })
}

const relationshipsEn: Relationship[] = dedupe([...baseRelationships, ...galleryRelationships, ...extraRelationships, ...guernicaRelationships, ...keyRestrictedRelationships, ...eventLinks, ...movementRelationships, ...extra, ...artistMovementRelationships])

/** Greek: per-id overlay first, then the shared dictionary (the generated notes repeat a handful of sentences). */
export const relationships: Relationship[] = !isEl ? relationshipsEn : localize(relationshipsEn, elRelationships).map((r, i) =>
  elRelationships[r.id]?.note ? r : { ...r, note: t(relationshipsEn[i].note), ...(r.qualifier ? { qualifier: t(r.qualifier) } : {}) })

const baseQuestions = isEl ? localize([...questions, ...movementQuestions], elQuestions) : [...questions, ...movementQuestions]
const baseQuizzes = isEl ? localize([...quizzes, ...movementQuizzes], elQuizzes) : [...quizzes, ...movementQuizzes]
const allPaths = isEl ? localize([...paths, ...movementPaths], elPaths) : [...paths, ...movementPaths]

const regionsOut = isEl ? localize(regions, elRegions) : regions
/** Picture quizzes ("Which work is this?", "Who made it?") generated from the artworks that have an image. */
const artQuiz = buildArtQuiz(entities, relationships, regionsOut)
const allQuestions = [...baseQuestions, ...artQuiz.questions]
const allQuizzes = [...baseQuizzes, ...artQuiz.quizzes]
const sourcesOut = isEl ? localize(sources, elSources) : sources
const objectivesOut = isEl ? localize(objectives, elObjectives) : objectives

export { regionsOut as regions, sourcesOut as sources, objectivesOut as objectives, allQuestions as questions, allQuizzes as quizzes, allPaths as paths }

/**
 * Repository — the single read API over content.
 *
 * Pages and components call these functions and never import raw data arrays. Swapping the
 * data source (CMS, database, API) means re-implementing this module's inputs, not the UI.
 */
import { t } from '@/i18n'
import { imageSrc } from '@/lib/images'
import { entities, objectives, paths, questions, quizzes, regions, relationships, sources } from '@/data'
import type {
  Artist, Artwork, ContextEntity, Entity, EntityType, LearningPath, MovementLike, Period, Place,
  Question, Quiz, Region, RegionId, RelationMeta, RelationType, Relationship, SourceRef,
} from '@/types'

/* ------------------------------------------------------------------ */
/* Lookups                                                             */
/* ------------------------------------------------------------------ */

const byId = new Map<string, Entity>(entities.map((e) => [e.id, e]))

export const getEntity = (id: string): Entity | undefined => byId.get(id)
export const requireEntity = (id: string): Entity => {
  const e = byId.get(id)
  if (!e) throw new Error(`Unknown entity id: ${id}`)
  return e
}

/** An artwork is listed only when it has an image to show; records without one stay in the data but are not displayed. */
const hasImage = (e: Entity) => e.type !== 'artwork' || !!imageSrc((e as Artwork).image) || !!(e as Artwork).image.restricted
const listed = entities.filter(hasImage)
export const allEntities = (): Entity[] => listed
export const entitiesOfType = <T extends Entity = Entity>(...types: EntityType[]): T[] =>
  listed.filter((e) => types.includes(e.type)) as T[]

export const MOVEMENT_TYPES: EntityType[] = ['movement', 'tradition', 'style', 'school', 'collective']
export const isMovementLike = (e: Entity): e is MovementLike => MOVEMENT_TYPES.includes(e.type)

/** Index-level records carry structure only (no prose). Curated views such as the home page and default timeline skip them. */
export const isIndexLevel = (e: Entity): boolean => (e as { level?: string }).level === 'index'
export const written = (list: Entity[]) => list.filter((e) => !isIndexLevel(e))

export const getMovements = () => entitiesOfType<MovementLike>(...MOVEMENT_TYPES)
export const getArtists = () => entitiesOfType<Artist>('artist')
export const getArtworks = () => entitiesOfType<Artwork>('artwork')
export const getEvents = () => entitiesOfType<ContextEntity>('event')
export const getExchanges = () => entitiesOfType<ContextEntity>('exchange')
export const getThemes = () => entitiesOfType<ContextEntity>('theme')
export const getPeriods = () => entitiesOfType<Period>('period')
export const getPlaces = () => entitiesOfType<Place>('place')

export const getBySlug = (group: 'movement' | 'artist' | 'artwork' | 'event' | 'exchange' | 'theme' | 'period' | 'place', slug: string) => {
  const types: EntityType[] = group === 'movement' ? MOVEMENT_TYPES : [group]
  return entities.find((e) => types.includes(e.type) && e.slug === slug)
}

/* ------------------------------------------------------------------ */
/* Presentation metadata for entity types                              */
/* ------------------------------------------------------------------ */

export const TYPE_LABEL: Record<EntityType, string> = {
  tradition: t('Tradition'), movement: t('Movement'), style: t('Style'), school: t('School / workshop'), collective: t('Collective / group'), artist: t('Artist'), artwork: t('Artwork'),
  event: t('Historical event'), exchange: t('Cultural exchange'), theme: t('Theme'), place: t('Place'), period: t('Period'),
}
export const TYPE_LABEL_PLURAL: Record<EntityType, string> = {
  tradition: t('Traditions'), movement: t('Movements'), style: t('Styles'), school: t('Schools & workshops'), collective: t('Collectives & groups'), artist: t('Artists'), artwork: t('Artworks'),
  event: t('Historical events'), exchange: t('Cultural exchanges'), theme: t('Themes'), place: t('Places'), period: t('Periods'),
}

export function entityPath(e: Entity | string): string {
  const ent = typeof e === 'string' ? requireEntity(e) : e
  switch (ent.type) {
    case 'tradition': case 'movement': case 'style': case 'school': case 'collective': return `/movements/${ent.slug}`
    case 'artist': return `/artists/${ent.slug}`
    case 'artwork': return `/artworks/${ent.slug}`
    case 'event': return `/connections/events/${ent.slug}`
    case 'exchange': return `/connections/exchanges/${ent.slug}`
    case 'theme': return `/connections/themes/${ent.slug}`
    case 'period': return `/explore/periods/${ent.slug}`
    case 'place': return `/places/${ent.slug}`
  }
}

/* ------------------------------------------------------------------ */
/* Regions                                                             */
/* ------------------------------------------------------------------ */

export const getRegions = (): Region[] => regions
export const getRegion = (id: RegionId | string) => regions.find((r) => r.id === id)
export const regionName = (id: RegionId | string) => getRegion(id)?.name ?? id
export const entitiesInRegion = (id: RegionId) => listed.filter((e) => e.regions.includes(id))

/* ------------------------------------------------------------------ */
/* Relationships                                                       */
/* ------------------------------------------------------------------ */

export const RELATION_META: Record<RelationType, RelationMeta> = {
  influenced_by: { label: t('was influenced by'), inverse: t('influenced'), directed: true, description: t('One entity drew on the ideas, forms or work of another.') },
  collaborated_with: { label: t('collaborated with'), inverse: t('collaborated with'), directed: false, description: t('Worked together in a documented partnership.') },
  studied_under: { label: t('studied under'), inverse: t('taught'), directed: true, description: t('Trained in the workshop or school of another.') },
  developed_from: { label: t('developed from'), inverse: t('gave rise to'), directed: true, description: t('Emerged out of an earlier movement, tradition or practice.') },
  reacted_against: { label: t('reacted against'), inverse: t('was challenged by'), directed: true, description: t('Defined itself in opposition to another.') },
  associated_with: { label: t('is associated with'), inverse: t('is associated with'), directed: false, description: t('Linked as part of, or closely connected to, the same group or tradition.') },
  created_by: { label: t('was created by'), inverse: t('created'), directed: true, description: t('Made by this artist, workshop or collective.') },
  cultural_exchange: { label: t('is connected through cultural exchange with'), inverse: t('is connected through cultural exchange with'), directed: false, description: t('Linked by a documented transfer of ideas, objects or materials between cultures.') },
  exemplifies: { label: t('exemplifies'), inverse: t('is exemplified by'), directed: true, description: t('A work that illustrates the characteristics of a movement or tradition.') },
  shaped_by: { label: t('was shaped by'), inverse: t('shaped'), directed: true, description: t('Historical events or conditions that helped bring this about.') },
  part_of: { label: t('is part of'), inverse: t('includes'), directed: true, description: t('A sub-movement, branch or member group within a larger movement, school or umbrella term.') },
  depicts: { label: t('depicts'), inverse: t('is depicted in'), directed: true, description: t('An artwork whose subject is this event or place.') },
}

export interface ResolvedRelation {
  rel: Relationship
  other: Entity
  /** 'out' when the focus entity is the `from` side. */
  dir: 'out' | 'in'
  /** Verb phrase read from the focus entity’s point of view. */
  phrase: string
}

const relsByEntity = new Map<string, Relationship[]>()
for (const rel of relationships) {
  for (const id of [rel.from, rel.to]) {
    const list = relsByEntity.get(id) ?? []
    list.push(rel)
    relsByEntity.set(id, list)
  }
}

export const getRelationships = () => relationships
export const getRelationship = (id: string) => relationships.find((r) => r.id === id)

export function relationsOf(id: string, only?: RelationType[]): ResolvedRelation[] {
  const out: ResolvedRelation[] = []
  for (const rel of relsByEntity.get(id) ?? []) {
    if (only && !only.includes(rel.type)) continue
    const isFrom = rel.from === id
    const other = byId.get(isFrom ? rel.to : rel.from)
    if (!other || !hasImage(other)) continue
    const meta = RELATION_META[rel.type]
    out.push({ rel, other, dir: isFrom ? 'out' : 'in', phrase: isFrom ? meta.label : meta.inverse })
  }
  return out
}

/** Entities linked to `id` by any of `types`, from either side, de-duplicated. */
export function linked(id: string, types: RelationType[], otherType?: EntityType[]): Entity[] {
  const seen = new Set<string>()
  const res: Entity[] = []
  for (const r of relationsOf(id, types)) {
    if (otherType && !otherType.includes(r.other.type)) continue
    if (seen.has(r.other.id)) continue
    seen.add(r.other.id)
    res.push(r.other)
  }
  return res
}

/** Convenience traversals built purely from explicit relationship records. */
export const artistsOfArtwork = (id: string) => linked(id, ['created_by'], ['artist']) as Artist[]
export const artworksOfArtist = (id: string) => (linked(id, ['created_by'], ['artwork']) as Artwork[]).filter(hasImage)
export const movementsOfArtist = (id: string) => linked(id, ['associated_with'], MOVEMENT_TYPES) as MovementLike[]
export const artistsOfMovement = (id: string) => linked(id, ['associated_with'], ['artist']) as Artist[]
export const movementsOfArtwork = (id: string) => linked(id, ['exemplifies', 'associated_with'], MOVEMENT_TYPES) as MovementLike[]
export const artworksOfMovement = (id: string) => (linked(id, ['exemplifies', 'associated_with'], ['artwork']) as Artwork[]).filter(hasImage)
export const eventsShaping = (id: string) => linked(id, ['shaped_by', 'associated_with', 'depicts'], ['event']) as ContextEntity[]
export const exchangesOf = (id: string) => linked(id, ['cultural_exchange'], ['exchange']) as ContextEntity[]
export const eventRelated = (id: string) => linked(id, ['shaped_by', 'associated_with', 'depicts']).filter((e) => e.type !== 'event')

/** Related movements: any lineage / exchange relationship between movement-like entities. */
export const relatedMovements = (id: string) =>
  relationsOf(id, ['developed_from', 'reacted_against', 'influenced_by', 'associated_with', 'cultural_exchange']).filter((r) => isMovementLike(r.other))

/** Works similar to `id`: share a movement, a theme, or a medium, scored in that order. */
export function similarArtworks(id: string, limit = 4): Artwork[] {
  const a = requireEntity(id) as Artwork
  const mine = new Set(movementsOfArtwork(id).map((m) => m.id))
  const scored = getArtworks()
    .filter((o) => o.id !== id)
    .map((o) => {
      let s = 0
      for (const m of movementsOfArtwork(o.id)) if (mine.has(m.id)) s += 5
      s += o.themes.filter((t) => a.themes.includes(t)).length * 2
      s += o.mediums.filter((m) => a.mediums.includes(m)).length
      if (o.regions.some((r) => a.regions.includes(r))) s += 1
      return { o, s }
    })
    .filter((x) => x.s > 0)
    .sort((x, y) => y.s - x.s)
  return scored.slice(0, limit).map((x) => x.o)
}

export const entitiesWithTheme = (themeId: string) => listed.filter((e) => e.themes.includes(themeId))
export const entitiesAtPlace = (placeId: string) => listed.filter((e) => e.places.includes(placeId))

/* ------------------------------------------------------------------ */
/* Sources, periods                                                    */
/* ------------------------------------------------------------------ */

export const getSource = (id: string): SourceRef | undefined => sources.find((s) => s.id === id)
export const sourcesOf = (e: Entity): SourceRef[] => e.sources.map(getSource).filter(Boolean) as SourceRef[]

export const getEras = () => getPeriods().filter((p) => p.scope === 'era')
export const getRegionalPeriods = () => getPeriods().filter((p) => p.scope === 'regional')
/** Entities attached to a period via their `periods` attribute (movements, artists, artworks). */
export const entitiesInPeriod = (periodId: string) =>
  listed.filter((e) => 'periods' in e && (e as MovementLike).periods?.includes(periodId))

/* ------------------------------------------------------------------ */
/* Learning                                                            */
/* ------------------------------------------------------------------ */

export const getObjectives = () => objectives
export const getObjective = (id: string) => objectives.find((o) => o.id === id)
export const getQuestions = () => questions
export const getQuestion = (id: string): Question | undefined => questions.find((q) => q.id === id)
export const getQuizzes = (): Quiz[] => quizzes
export const getQuiz = (id: string) => quizzes.find((q) => q.id === id)
export const getPaths = (): LearningPath[] => paths
export const getPath = (id: string) => paths.find((p) => p.id === id)
export const questionsFor = (entityId: string) => questions.filter((q) => q.entityRefs.includes(entityId))
export const quizzesFor = (entityId: string) => quizzes.filter((qz) => qz.questionIds.some((qid) => getQuestion(qid)?.entityRefs.includes(entityId)))

/* ------------------------------------------------------------------ */
/* Discovery                                                           */
/* ------------------------------------------------------------------ */

/** “Continue exploring”: neighbours across relationships first, then same-theme entities, then same region. */
export function suggestionsFor(id: string, limit = 6, exclude: string[] = []): Entity[] {
  const self = requireEntity(id)
  const skip = new Set([id, ...exclude])
  const pool: { e: Entity; s: number }[] = []
  const bump = (e: Entity | undefined, s: number) => {
    if (!e || skip.has(e.id) || e.type === 'place' || e.type === 'period') return
    const hit = pool.find((p) => p.e.id === e.id)
    if (hit) hit.s += s
    else pool.push({ e, s })
  }
  relationsOf(id).forEach((r) => bump(r.other, 6))
  // second-degree neighbours: links of links, which tend to cross regions
  relationsOf(id).forEach((r) => relationsOf(r.other.id).forEach((r2) => bump(r2.other, 2)))
  entities.forEach((e) => {
    if (e.themes.some((t) => self.themes.includes(t))) bump(e, 1)
  })
  return pool.sort((a, b) => b.s - a.s || a.e.title.localeCompare(b.e.title)).slice(0, limit).map((p) => p.e)
}

export const artworkOfTheDay = (): Artwork => {
  const withImg = getArtworks().filter((a) => a.image.commonsFile)
  const d = new Date()
  const idx = (d.getFullYear() * 366 + d.getMonth() * 31 + d.getDate()) % withImg.length
  return withImg[idx]
}

export const heroOf = (e: MovementLike | Artist): Artwork | undefined => {
  const id = e.hero
  const w = id ? (getEntity(id) as Artwork | undefined) : undefined
  return w && imageSrc(w.image) ? w : undefined   // an artwork without a picture is not shown
}

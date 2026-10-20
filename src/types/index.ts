/**
 * Chronos — domain model.
 *
 * Content is stored as plain, serialisable records so the same shapes can be
 * produced by a headless CMS or a database. Presentation never reads the raw
 * arrays; it goes through `lib/repo.ts`.
 *
 * Years are signed integers on a shared axis: -221 is 221 BCE, 1874 is 1874 CE.
 * (There is no year 0 in the historical calendar; the prototype treats 1 BCE as -1
 * and 1 CE as 1, which is accurate to well within the precision of the data.)
 */

export type RegionId =
  | 'europe'
  | 'east-asia'
  | 'south-asia'
  | 'southeast-asia'
  | 'west-asia-north-africa'
  | 'sub-saharan-africa'
  | 'north-america'
  | 'central-america-caribbean'
  | 'south-america'
  | 'oceania'

export type EntityType =
  | 'tradition'
  | 'movement'
  | 'style'
  | 'school'
  | 'collective'
  | 'artist'
  | 'artwork'
  | 'event'
  | 'exchange'
  | 'theme'
  | 'place'
  | 'period'

export interface Region {
  id: RegionId
  name: string
  short: string
  blurb: string
  /** Approximate centre of the region on an equirectangular map: [lon, lat]. */
  anchor: [number, number]
}

/** A date or date range, with explicit uncertainty. */
export interface DateSpec {
  start: number
  /** undefined → a single point in time; null → ongoing / continuing today. */
  end?: number | null
  /** True when either edge is an estimate — rendered with softened edges. */
  approx?: boolean
  /** Human-readable override, e.g. "9th–10th century". Always preferred for display. */
  label?: string
}

/** Honest provenance for every record. All prototype content is `sample`. */
export interface ContentStatus {
  level: 'sample' | 'reviewed'
  note?: string
}

export interface SourceRef {
  id: string
  kind: 'collection' | 'scholarship' | 'reference' | 'primary'
  citation: string
  /** Institution or publisher root only — specific record URLs are not fabricated. */
  url?: string
  note?: string
}

export interface ImageRef {
  /** Bundled image URL (resolved at build time from src/assets/art/<artwork-id>.jpg). Preferred over any remote link. */
  src?: string
  /** Wikimedia Commons file name (no "File:" prefix). Absent = no verified open image yet. */
  commonsFile?: string
  alt: string
  credit: string
  licence: string
  /** Image aspect ratio (width / height) used to reserve space. */
  ratio: number
  note?: string
  /** Set when the work is in copyright and its image is deliberately not reproduced here; the record stays, with a link to see the work. */
  restricted?: { viewUrl: string; viewLabel: string }
}

interface Base {
  id: string
  type: EntityType
  slug: string
  title: string
  subtitle?: string
  altTitles?: string[]
  summary: string
  regions: RegionId[]
  /** Place ids (geographic associations). */
  places: string[]
  dates: DateSpec
  /** Theme ids — a taxonomy, not a relationship. */
  themes: string[]
  /** Free taxonomy tags. */
  tags: string[]
  /** Source ids from the source catalogue. */
  sources: string[]
  status?: ContentStatus
}

export interface Characteristic {
  title: string
  text: string
}

/** Fields of practice. Movements are tagged with every domain they touched: art, design, type, architecture, photography. */
export type Domain =
  | 'painting' | 'sculpture' | 'architecture' | 'graphic-design' | 'typography' | 'photography' | 'design' | 'craft'
  | 'printmaking' | 'performance' | 'installation' | 'film-video' | 'digital' | 'literature' | 'ceramics' | 'urbanism'

export interface MovementLike extends Base {
  type: 'tradition' | 'movement' | 'style' | 'school' | 'collective'
  /** 'index' records carry structure (classification, dates, relations) but no prose yet; pages show only what exists. */
  level?: 'full' | 'index'
  /** Period ids this entity sits within (broad era + regional). */
  periods: string[]
  context: string[]
  origins: string[]
  characteristics: Characteristic[]
  mediums: string[]
  techniques: string[]
  /** Artwork id used as the hero visual. */
  hero?: string
  /** Short note on why dates are fuzzy, if so. */
  dateNote?: string
  /** Normalised alternative names (other languages, older terms, overlapping labels). */
  altNames?: string[]
  /** True for umbrella categories that group several regional or historical subdivisions. */
  umbrella?: boolean
  /** Taxonomy section ids this entity is listed under (an entity can appear in several). */
  taxonomy?: string[]
  domains?: Domain[]
  /** Why it emerged. */
  reasons?: string[]
  founders?: string[]
  ideas?: string[]
  manifestos?: { title: string; year: string; note?: string }[]
  notableWorks?: { title: string; creator: string; date: string; kind: string }[]
  disagreements?: string[]
  legacy?: string[]
  /** Editorial caveat on the category itself (overlaps, contested labels). */
  classificationNote?: string
}

export interface LifeEvent {
  year: number
  label: string
  place?: string
}

export type Gender = 'woman' | 'man' | 'non-binary or gender-diverse'

export interface Artist extends Base {
  type: 'artist'
  /** 'index' records carry identity, dates, regions, movements and flags; prose profiles come later. */
  level?: 'profile' | 'index'
  kind: 'individual' | 'anonymous' | 'workshop' | 'collective'
  gender?: Gender
  /** Taxonomy section of the master artist list. */
  taxonomy?: string
  /** Country / tradition label as it should read ("Flanders", "Safavid Iran"). */
  originLabel?: string
  /** Practitioner whose career developed after about 1960. */
  contemporary?: boolean
  /** Verified likeness (photograph, self-portrait or contemporary portrait). Absent where none is verified — never a stand-in face. */
  portrait?: ImageRef & { page?: string; note?: string }
  /** Editorial flags: duplicates combined, identity or attribution needing verification, corrected classifications. */
  flags?: string[]
  /** Short, factual key-value lines for the "essential information" panel. */
  essentials: { label: string; value: string }[]
  lifeEvents: LifeEvent[]
  context: string[]
  development: string[]
  legacy: string[]
  mediums: string[]
  periods: string[]
  hero?: string
  /** Stub records show a notice that the entry is intentionally partial. */
  stub?: boolean
}

export interface Artwork extends Base {
  type: 'artwork'
  /** Attribution line as it should read, e.g. "Katsushika Hokusai". */
  attribution: string
  dateDisplay: string
  medium: string
  mediums: string[]
  techniques: string[]
  dimensions?: string
  location: string
  originPlace: string
  image: ImageRef
  /** Short description of what is depicted — used by the quiz "clue" and screen readers. */
  description: string
  context: string[]
  analysis: string[]
  symbolism?: string[]
  periods: string[]
}

export interface ContentSection {
  heading: string
  paragraphs: string[]
}

/** Events, exchanges, themes, periods and places share one contextual template. */
interface ContextBase extends Base {
  sections: ContentSection[]
  /** One or two sentences: why this matters for how art was made. */
  artSignificance: string
}

export interface HistoricalEvent extends ContextBase {
  type: 'event'
  kindOfEvent: 'political' | 'social' | 'economic' | 'technological' | 'cultural'
}

export interface CulturalExchange extends ContextBase {
  type: 'exchange'
  /** Direction of flows, for display only. */
  flows: string
}

export interface Theme extends ContextBase {
  type: 'theme'
}

export interface Period extends ContextBase {
  type: 'period'
  scope: 'era' | 'regional'
}

export interface Place extends ContextBase {
  type: 'place'
  coordinates: [number, number] // [lon, lat]
  country: string
}

export type ContextEntity = HistoricalEvent | CulturalExchange | Theme | Period | Place
export type Entity = MovementLike | Artist | Artwork | ContextEntity

/* ------------------------------------------------------------------ */
/* Relationships                                                       */
/* ------------------------------------------------------------------ */

export type RelationType =
  | 'influenced_by'
  | 'collaborated_with'
  | 'studied_under'
  | 'developed_from'
  | 'reacted_against'
  | 'associated_with'
  | 'created_by'
  | 'cultural_exchange'
  | 'exemplifies'
  | 'shaped_by'
  | 'depicts'
  | 'part_of'

export interface Relationship {
  id: string
  type: RelationType
  /** Reads: "<from> <type> <to>", e.g. Van Gogh —influenced by→ Hiroshige. */
  from: string
  to: string
  /** Why this link exists. Required: no relationship is inferred from shared dates. */
  note: string
  /** Optional qualifier, e.g. "Roman copy after the lost bronze original". */
  qualifier?: string
  sources?: string[]
}

export interface RelationMeta {
  label: string
  inverse: string
  directed: boolean
  description: string
}

/* ------------------------------------------------------------------ */
/* Learning                                                            */
/* ------------------------------------------------------------------ */

export interface LearningObjective {
  id: string
  text: string
}

interface QBase {
  id: string
  prompt: string
  explanation: string
  /** Entities this question teaches. Drives per-subject practice and mastery. */
  entityRefs: string[]
  objective: string
}

export interface QMultipleChoice extends QBase {
  kind: 'multiple-choice'
  options: string[]
  answer: number
}

export interface QArtworkId extends QBase {
  kind: 'artwork-id'
  artworkId: string
  /** Text clue so the question still works if the image cannot load. */
  clue: string
  options: string[]
  answer: number
}

export interface QTimeline extends QBase {
  kind: 'timeline'
  items: { id: string; label: string; year: number; yearLabel: string }[]
}

export interface QMatch extends QBase {
  kind: 'match'
  pairs: { left: string; right: string }[]
}

export interface QContext extends QBase {
  kind: 'context'
  options: { text: string; correct: boolean; why: string }[]
}

export type Question = QMultipleChoice | QArtworkId | QTimeline | QMatch | QContext

export interface Quiz {
  id: string
  title: string
  description: string
  objectives: string[]
  questionIds: string[]
  minutes: number
}

export type PathStep =
  | { id: string; kind: 'read'; entity: string; prompt: string }
  | { id: string; kind: 'quiz'; quizId: string; prompt: string }
  | { id: string; kind: 'explore'; to: string; label: string; prompt: string }

export interface LearningPath {
  id: string
  title: string
  description: string
  level: 'Introductory' | 'Intermediate'
  objectives: string[]
  steps: PathStep[]
}

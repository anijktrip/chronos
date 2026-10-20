/* Data integrity check: ids unique, every reference resolves. Run: npm run validate */
import { entities, paths, questions, quizzes, regions, relationships, sources } from '../src/data'
import type { Artist, Artwork, MovementLike } from '../src/types'
import { ORIGIN_REGION, ARTIST_SECTIONS, MOVEMENT_SECTIONS } from '../src/data/taxonomy'
import { parsedArtists } from '../src/data/artist-index'

const errors: string[] = []
const err = (m: string) => errors.push(m)

const ids = new Set<string>()
for (const e of entities) { if (ids.has(e.id)) err(`duplicate id ${e.id}`); ids.add(e.id) }
const slugs = new Set<string>()
for (const e of entities) {
  const group = ['tradition', 'movement', 'style', 'school', 'collective'].includes(e.type) ? 'movement' : e.type
  const k = `${group}/${e.slug}`
  if (slugs.has(k)) err(`duplicate slug ${k}`); slugs.add(k)
}
const regionIds = new Set<string>(regions.map((r) => r.id))
const sourceIds = new Set(sources.map((s) => s.id))
const get = (id: string) => entities.find((e) => e.id === id)

for (const e of entities) {
  e.regions.forEach((r) => !regionIds.has(r) && err(`${e.id}: unknown region ${r}`))
  e.places.forEach((p) => get(p)?.type !== 'place' && err(`${e.id}: unknown place ${p}`))
  e.themes.forEach((t) => get(t)?.type !== 'theme' && err(`${e.id}: unknown theme ${t}`))
  e.sources.forEach((s) => !sourceIds.has(s) && err(`${e.id}: unknown source ${s}`))
  if ('periods' in e) (e as MovementLike).periods.forEach((p) => get(p)?.type !== 'period' && err(`${e.id}: unknown period ${p}`))
  if ('hero' in e && (e as MovementLike).hero && get((e as MovementLike).hero)?.type !== 'artwork') err(`${e.id}: bad hero`)
  if (e.type === 'artwork' && !(e as Artwork).image.alt) err(`${e.id}: missing alt text`)
  const isIndex = (e as MovementLike | Artist).level === 'index'
  if (e.sources.length === 0 && !['place', 'theme', 'period'].includes(e.type) && !isIndex) err(`${e.id}: has no sources`)
  if (isIndex && e.summary.trim() === '') err(`${e.id}: empty summary`)
}
for (const r of relationships) {
  if (!get(r.from)) err(`${r.id}: unknown from ${r.from}`)
  if (!get(r.to)) err(`${r.id}: unknown to ${r.to}`)
  if (!r.note) err(`${r.id}: missing note`)
}
// each FULL movement/tradition must have a quiz question; those with no written notableWorks list also need a linked artwork
const MOVEMENT_TYPES = ['tradition', 'movement', 'style', 'school', 'collective']
for (const e of entities.filter((x) => MOVEMENT_TYPES.includes(x.type) && (x as MovementLike).level !== 'index')) {
  if (!questions.some((q) => q.entityRefs.includes(e.id))) err(`${e.id}: no quiz question references it`)
  const m = e as MovementLike
  if (!m.notableWorks?.length && !relationships.some((r) => (r.to === e.id || r.from === e.id) && (r.type === 'exemplifies' || r.type === 'associated_with') && (get(r.from)?.type === 'artwork' || get(r.to)?.type === 'artwork'))) err(`${e.id}: no linked artwork or listed notable works`)
}
// taxonomy checks
const movSec = new Set(MOVEMENT_SECTIONS.map((s) => s.id)), artSec = new Set(ARTIST_SECTIONS.map((s) => s.id))
for (const e of entities) {
  if (MOVEMENT_TYPES.includes(e.type)) for (const t of (e as MovementLike).taxonomy ?? []) if (!movSec.has(t)) err(`${e.id}: unknown movement section ${t}`)
  if (e.type === 'artist') { const t = (e as Artist).taxonomy; if (t && !artSec.has(t)) err(`${e.id}: unknown artist section ${t}`) }
}
for (const p of parsedArtists) for (const t of p.origin.split('/').map((x) => x.trim())) if (!ORIGIN_REGION[t]) err(`artist #${p.n} ${p.name}: unmapped origin "${t}"`)
// no relationship may point an entity at itself, and part_of must not form a cycle
for (const r of relationships) if (r.from === r.to) err(`${r.id}: self relation`)
{
  const parent = new Map<string, string[]>()
  for (const r of relationships.filter((x) => x.type === 'part_of')) parent.set(r.from, [...(parent.get(r.from) ?? []), r.to])
  const visit = (id: string, stack: string[]) => {
    if (stack.includes(id)) { err(`part_of cycle: ${[...stack, id].join(' → ')}`); return }
    for (const p of parent.get(id) ?? []) visit(p, [...stack, id])
  }
  for (const id of parent.keys()) visit(id, [])
}
// relationship ids unique
{ const seen = new Set<string>(); for (const r of relationships) { if (seen.has(r.id)) err(`duplicate relationship id ${r.id}`); seen.add(r.id) } }
for (const q of questions) {
  q.entityRefs.forEach((id) => !get(id) && err(`${q.id}: unknown entityRef ${id}`))
  if (q.kind === 'artwork-id' && get(q.artworkId)?.type !== 'artwork') err(`${q.id}: bad artworkId`)
  if ((q.kind === 'multiple-choice' || q.kind === 'artwork-id') && (q.answer < 0 || q.answer >= q.options.length)) err(`${q.id}: answer out of range`)
  if (q.kind === 'context' && !q.options.some((o) => o.correct)) err(`${q.id}: no correct option`)
  if (q.kind === 'timeline') {
    const years = q.items.map((i) => i.year)
    if (new Set(years).size !== years.length) err(`${q.id}: duplicate years`)
  }
}
for (const qz of quizzes) qz.questionIds.forEach((id) => !questions.find((q) => q.id === id) && err(`${qz.id}: unknown question ${id}`))
for (const p of paths) for (const s of p.steps) {
  if (s.kind === 'read' && !get(s.entity)) err(`${p.id}/${s.id}: unknown entity ${s.entity}`)
  if (s.kind === 'quiz' && !quizzes.find((q) => q.id === s.quizId)) err(`${p.id}/${s.id}: unknown quiz`)
}

console.log(`${entities.length} entities · ${relationships.length} relationships · ${questions.length} questions · ${quizzes.length} quizzes · ${paths.length} paths`)
if (errors.length) { console.error(errors.join('\n')); process.exit(1) } else console.log('data OK')

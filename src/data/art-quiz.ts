import type { Artist, Artwork, Entity, Question, Quiz, Region, Relationship } from '@/types'
import { isEl, t } from '@/i18n'

/**
 * Picture quizzes built from the artwork records: "Which work is this?" and "Who made this work?".
 * Only works with a bundled image are used (works shown without an image never appear), and everything is generated from the data in
 * the language that is active, so titles, artists and regions are already translated. Selection and distractors are deterministic.
 */
const hash = (s: string) => { let h = 2166136261; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619) } return h >>> 0 }
const clean = (s: string) => s.replace(/ \(.*\)$/, '')
const notRecorded = (s: string) => /not recorded/i.test(s)
/** In Greek, a question's options should all be in one script: a title that has no Greek yet is only mixed with other untranslated titles. */
const greek = (s: string) => /[Ͱ-Ͽ]/.test(s)

interface Pick { art: Artwork; artist?: Artist }

export function buildArtQuiz(entities: Entity[], relationships: Relationship[], regions: Region[]): { questions: Question[]; quizzes: Quiz[] } {
  const byId = new Map(entities.map((e) => [e.id, e]))
  const regionName = (id: string) => regions.find((r) => r.id === id)?.name ?? id
  const makerOf = new Map<string, Artist>()
  for (const r of relationships) if (r.type === 'created_by') { const a = byId.get(r.to); if (a?.type === 'artist' && !makerOf.has(r.from)) makerOf.set(r.from, a as Artist) }

  const picks: Pick[] = (entities.filter((e) => e.type === 'artwork') as Artwork[])
    .filter((a) => !!a.image.src && !a.image.restricted)
    .map((art) => ({ art, artist: makerOf.get(art.id) }))
    .sort((x, y) => x.art.id.localeCompare(y.art.id))
  if (picks.length < 8) return { questions: [], quizzes: [] }

  const near = (a: Pick, b: Pick) => (a.art.regions[0] === b.art.regions[0] ? 2 : 0) + (Math.abs(a.art.dates.start - b.art.dates.start) < 250 ? 1 : 0)
  /** Three plausible wrong answers: the most similar candidates, shuffled by a seed so the same question always gets the same ones. */
  const distract = (self: Pick, pool: Pick[], key: (p: Pick) => string | undefined, ok: (p: Pick) => boolean, seed: string): string[] => {
    const seen = new Set([key(self)])
    const same = (k?: string) => !isEl || !k || greek(k) === greek(key(self) ?? '')
    const ranked = pool.filter((p) => p !== self && ok(p)).sort((a, b) => near(self, b) - near(self, a) || hash(seed + a.art.id) - hash(seed + b.art.id)).slice(0, 14)
    const out: string[] = []
    for (const p of ranked.sort((a, b) => hash(seed + 'x' + a.art.id) - hash(seed + 'x' + b.art.id))) {
      const k = key(p); if (!k || seen.has(k) || !same(k)) continue
      seen.add(k); out.push(k); if (out.length === 3) break
    }
    return out
  }
  const place = (right: string, wrong: string[], seed: string) => {
    const at = hash(seed) % (wrong.length + 1)
    const options = [...wrong]; options.splice(at, 0, right)
    return { options, answer: at }
  }

  const clue = (a: Artwork) => [notRecorded(a.medium) ? '' : a.medium, notRecorded(a.dateDisplay) ? '' : a.dateDisplay, regionName(a.regions[0])].filter(Boolean).join(' · ')
  const where = (a: Artwork) => (notRecorded(a.location) ? '' : ` ${t('Now in {place}.', { place: a.location })}`)

  const workQ = new Map<string, Question>(), whoQ = new Map<string, Question>()
  for (const p of picks) {
    const a = p.art, id = a.id.replace(/^art-/, '')
    const date = notRecorded(a.dateDisplay) ? '' : a.dateDisplay
    const wrongTitles = distract(p, picks, (x) => x.art.title, () => true, 'w' + a.id)
    if (wrongTitles.length === 3) {
      const { options, answer } = place(a.title, wrongTitles, 'wa' + a.id)
      workQ.set(a.id, {
        id: `q-wk-${id}`, kind: 'artwork-id', objective: 'obj-identify', entityRefs: [a.id, ...(p.artist ? [p.artist.id] : [])], artworkId: a.id, clue: clue(a),
        prompt: t('Which work is this?'), options, answer,
        explanation: (p.artist ? t('{title} by {artist}{date}.', { title: a.title, artist: clean(p.artist.title), date: date ? `, ${date}` : '' }) : t('{title}{date}.', { title: a.title, date: date ? `, ${date}` : '' })) + where(a),
      })
    }
    if (p.artist) {
      const name = clean(p.artist.title)
      const wrongNames = distract(p, picks.filter((x) => x.artist), (x) => (x.artist ? clean(x.artist.title) : undefined), (x) => x.artist?.id !== p.artist!.id, 'a' + a.id)
      if (wrongNames.length === 3) {
        const { options, answer } = place(name, wrongNames, 'aa' + a.id)
        whoQ.set(a.id, {
          id: `q-wa-${id}`, kind: 'artwork-id', objective: 'obj-identify', entityRefs: [a.id, p.artist.id], artworkId: a.id, clue: clue(a),
          prompt: t('Who made this work?'), options, answer,
          explanation: t('{artist} made {title}{date}.', { artist: name, title: a.title, date: date ? `, ${date}` : '' }) + where(a),
        })
      }
    }
  }

  /** Ten questions for a quiz: one per maker where possible, in a fixed pseudo-random order. */
  const choose = (pool: Map<string, Question>, ok: (p: Pick) => boolean, seed: string, n = 10) => {
    const usedMakers = new Set<string>(); const ids: string[] = []
    const candidates = picks.filter((p) => pool.has(p.art.id) && ok(p)).sort((x, y) => hash(seed + x.art.id) - hash(seed + y.art.id))
    for (const p of candidates) { const m = p.artist?.id ?? p.art.id; if (usedMakers.has(m)) continue; usedMakers.add(m); ids.push(pool.get(p.art.id)!.id); if (ids.length === n) break }
    return ids
  }
  const year = (p: Pick) => p.art.dates.start
  const outside = (p: Pick) => p.art.regions[0] !== 'europe'
  const specs: { id: string; pool: Map<string, Question>; ok: (p: Pick) => boolean; title: string; description: string }[] = [
    { id: 'quiz-name-ancient-medieval', pool: workQ, ok: (p) => year(p) < 1400, title: t('Name That Work: Antiquity to the Middle Ages'), description: t('Ten works made before 1400. Name each work from the picture.') },
    { id: 'quiz-name-renaissance-baroque', pool: workQ, ok: (p) => year(p) >= 1400 && year(p) < 1750, title: t('Name That Work: Renaissance and Baroque'), description: t('Ten works made between 1400 and 1750. Name each work from the picture.') },
    { id: 'quiz-name-modern', pool: workQ, ok: (p) => year(p) >= 1750 && year(p) < 1900, title: t('Name That Work: 1750 to 1900'), description: t('Ten works from the age of revolutions, realism and Impressionism. Name each work from the picture.') },
    { id: 'quiz-name-twentieth', pool: workQ, ok: (p) => year(p) >= 1900, title: t('Name That Work: The Twentieth Century'), description: t('Ten works made since 1900. Name each work from the picture.') },
    { id: 'quiz-name-beyond-europe', pool: workQ, ok: outside, title: t('Name That Work: Beyond Europe'), description: t('Ten works from Asia, Africa, the Americas and the Pacific. Name each work from the picture.') },
    { id: 'quiz-who-before-1800', pool: whoQ, ok: (p) => year(p) < 1800, title: t('Who Made It? Before 1800'), description: t('Ten works made before 1800. Pick the artist from the picture.') },
    { id: 'quiz-who-since-1800', pool: whoQ, ok: (p) => year(p) >= 1800, title: t('Who Made It? Since 1800'), description: t('Ten works made since 1800. Pick the artist from the picture.') },
    { id: 'quiz-who-beyond-europe', pool: whoQ, ok: outside, title: t('Who Made It? Beyond Europe'), description: t('Ten works from Asia, Africa, the Americas and the Pacific. Pick the artist from the picture.') },
  ]
  const quizzes: Quiz[] = []
  for (const s of specs) {
    const questionIds = choose(s.pool, s.ok, s.id)
    if (questionIds.length < 5) continue
    quizzes.push({ id: s.id, title: s.title, description: s.description, objectives: ['obj-identify'], questionIds, minutes: Math.max(3, Math.round(questionIds.length / 2)) })
  }
  return { questions: [...workQ.values(), ...whoQ.values()], quizzes }
}

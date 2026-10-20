/**
 * Finds a verified portrait for each individual artist, from Wikidata's "image" statement (P18).
 *
 * Why Wikidata and not a text search: the match must be the right person. A candidate is accepted only when
 *   – the Wikidata item is a human (P31 = Q5),
 *   – its birth year agrees with our record (within a year, or five for approximate dates),
 *   – where our record states a gender, it agrees with Wikidata's sex or gender (P21) for male / female.
 * The picture itself is then checked on Commons for an allowed licence (public domain, CC0, CC BY, CC BY-SA); anything
 * else is skipped and reported, never embedded.
 *
 * Skipped by design: collectives, anonymous makers and workshops; entries with no birth year (ancient and medieval
 * figures — no authenticated likeness survives, so a "portrait" would be a later invention); and anyone born before 1450.
 *
 * Run: NODE_USE_ENV_PROXY=1 npx tsx scripts/find-portraits.ts   (slow on purpose; resumable via /tmp/portrait-cache)
 * Output: scripts/portrait-picks.json (+ report on stdout)
 */
import fs from 'node:fs'
import { entities } from '../src/data'
import type { Artist } from '../src/types'
import { info, wmFetch } from './wm.mjs'

const CACHE = '/tmp/portrait-cache'
fs.mkdirSync(CACHE, { recursive: true })
const OUT = new URL('./portrait-picks.json', import.meta.url)
const OVERRIDES: Record<string, { file: string; note: string }> = JSON.parse(fs.readFileSync(new URL('./portrait-overrides.json', import.meta.url), 'utf8'))
const OK = /^(public domain|cc0|cc by(-sa)? [0-9.]+)$/i
const norm = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim()

const artists = (entities.filter((e) => e.type === 'artist') as Artist[])
const candidates = artists.filter((a) => a.kind === 'individual')
  .filter((a) => !a.flags?.some((f) => f.startsWith('Unresolved')))

const born = (a: Artist): { y: number; approx: boolean } | undefined => {
  const l = a.dates.label ?? ''
  if (l.startsWith('active') || l.includes('not established') || a.dates.start === 0) return undefined
  return { y: a.dates.start, approx: !!a.dates.approx }
}

const year = (claim: any): number | undefined => {
  const t = claim?.mainsnak?.datavalue?.value?.time as string | undefined
  const m = t?.match(/^([+-])(\d{4})/)
  return m ? Number(m[2]) * (m[1] === '-' ? -1 : 1) : undefined
}

async function wikidata(params: Record<string, string>) {
  return wmFetch('https://www.wikidata.org/w/api.php?' + new URLSearchParams({ format: 'json', ...params }))
}

type Match = { id: string; qid: string; file: string; by: 'wikidata' | 'override'; note?: string }
const matches: Match[] = []
const report: string[] = []

const todo = candidates.filter((a) => (born(a) && born(a)!.y >= 1450) || OVERRIDES[a.id])
console.log(`candidates ${todo.length} of ${artists.length} artist records`)

const cachePath = `${CACHE}/entities.json`
const cache: Record<string, any> = fs.existsSync(cachePath) ? JSON.parse(fs.readFileSync(cachePath, 'utf8')) : {}

/** 1. entity lookup by English Wikipedia title (50 per request); Wikipedia redirects ("Michelangelo Buonarroti" → "Michelangelo") are resolved in a second pass. */
const titleOf = (a: Artist) => a.title.replace(/ \(.*\)$/, '')
const enwiki = (params: Record<string, string>) => wmFetch('https://en.wikipedia.org/w/api.php?' + new URLSearchParams({ format: 'json', formatversion: '2', ...params }))

async function lookup(pairs: { id: string; title: string }[]) {
  for (let i = 0; i < pairs.length; i += 40) {
    const chunk = pairs.slice(i, i + 40)
    const d = await wikidata({ action: 'wbgetentities', sites: 'enwiki', titles: chunk.map((c) => c.title).join('|'), props: 'claims|sitelinks' })
    const byTitle = new Map<string, any>()
    for (const ent of Object.values<any>(d.entities ?? {})) if (ent.sitelinks?.enwiki) byTitle.set(norm(ent.sitelinks.enwiki.title), ent)
    for (const c of chunk) if (!cache[c.id]) cache[c.id] = byTitle.get(norm(c.title)) ?? null
    fs.writeFileSync(cachePath, JSON.stringify(cache))
    console.log(`  looked up ${Math.min(i + 40, pairs.length)}/${pairs.length}`)
  }
}
const pending = todo.filter((a) => !(a.id in cache))
await lookup(pending.map((a) => ({ id: a.id, title: titleOf(a) })))

const missed = todo.filter((a) => cache[a.id] === null)
if (missed.length) {
  const resolved = new Map<string, string>()
  for (let i = 0; i < missed.length; i += 40) {
    const chunk = missed.slice(i, i + 40)
    const d = await enwiki({ action: 'query', titles: chunk.map(titleOf).join('|'), redirects: '1' })
    for (const r of d.query?.redirects ?? []) resolved.set(norm(r.from), r.to)
    for (const n of d.query?.normalized ?? []) if (!resolved.has(norm(n.from))) resolved.set(norm(n.from), n.to)
  }
  const second = missed.map((a) => ({ a, to: resolved.get(norm(titleOf(a))) })).filter((x) => x.to)
  for (const x of second) delete cache[x.a.id]
  await lookup(second.map((x) => ({ id: x.a.id, title: x.to! })))
}

/** 2. verify identity and read P18. */
const proposals: { a: Artist; qid: string; file: string; by: Match['by']; note?: string }[] = []
for (const a of todo) {
  const ov = OVERRIDES[a.id]
  if (ov) { proposals.push({ a, qid: '-', file: ov.file, by: 'override', note: ov.note }); continue }
  const ent = cache[a.id]
  if (!ent) { report.push(`NO ENTITY    ${a.title}`); continue }
  const human = ent.claims?.P31?.some((c: any) => c.mainsnak?.datavalue?.value?.id === 'Q5')
  const by = year(ent.claims?.P569?.[0])
  const b = born(a)!
  const tol = b.approx ? 5 : 1
  const sex = ent.claims?.P21?.[0]?.mainsnak?.datavalue?.value?.id
  const sexOk = !a.gender || (a.gender === 'woman' ? sex === 'Q6581072' : a.gender === 'man' ? sex === 'Q6581097' : true)
  if (!human) { report.push(`NOT HUMAN    ${a.title} (${ent.id})`); continue }
  if (by === undefined || Math.abs(by - b.y) > tol) { report.push(`BIRTH MISMATCH ${a.title}: ours ${b.y}, wikidata ${by}`); continue }
  if (!sexOk) { report.push(`GENDER MISMATCH ${a.title}`); continue }
  const p18 = (ent.claims?.P18 ?? []).find((c: any) => c.rank === 'preferred') ?? ent.claims?.P18?.[0]
  const file = p18?.mainsnak?.datavalue?.value as string | undefined
  if (!file) { report.push(`NO IMAGE     ${a.title}`); continue }
  proposals.push({ a, qid: ent.id, file, by: 'wikidata' })
}
console.log(`identity verified, with an image: ${proposals.length}`)

/** 3. licence check on Commons (batches of 40), then download 500px thumbnails. */
const infoCachePath = `${CACHE}/info.json`
const infos: Record<string, any> = fs.existsSync(infoCachePath) ? JSON.parse(fs.readFileSync(infoCachePath, 'utf8')) : {}
for (let i = 0; i < proposals.length; i += 40) {
  const chunk = proposals.slice(i, i + 40).filter((p) => !(p.file in infos))
  if (!chunk.length) continue
  for (const r of await info(chunk.map((p) => p.file))) infos[r.title.replace(/_/g, ' ')] = r
  fs.writeFileSync(infoCachePath, JSON.stringify(infos))
}

const picks: Record<string, unknown> = fs.existsSync(OUT) ? JSON.parse(fs.readFileSync(OUT, 'utf8')) : {}
for (const p of proposals) {
  const meta = infos[p.file.replace(/_/g, ' ')]
  if (!meta || meta.missing) { report.push(`FILE MISSING ${p.a.title}: ${p.file}`); continue }
  if (!OK.test(meta.licence)) { report.push(`LICENCE      ${p.a.title}: "${meta.licence}" — ${p.file}`); continue }
  if (!/^image\/(jpeg|png|webp)$/.test(meta.mime)) { report.push(`FORMAT       ${p.a.title}: ${meta.mime}`); continue }
  picks[p.a.id] = { file: meta.title, licence: meta.licence, artist: meta.artist || 'Unknown author', qid: p.qid, by: p.by, ...(p.note ? { note: p.note } : {}), name: p.a.title, w: meta.w, h: meta.h }
}
fs.writeFileSync(OUT, JSON.stringify(picks, null, 2))
console.log(`accepted portraits: ${Object.keys(picks).length}`)
console.log(report.join('\n'))
void matches

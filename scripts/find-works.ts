/**
 * Finds works to show on each artist's page, and links to "all works" elsewhere.
 *
 * Works: Wikidata items whose creator (P170) or architect (P84) is the artist and that have an image (P18), ranked by
 * how many Wikipedia editions describe them (a fair proxy for "best known"). Only artists who died in 1955 or earlier are
 * searched (their work is public domain in most of the world); each candidate image is then checked on Commons and kept
 * only with an allowed licence (public domain, CC0, CC BY, CC BY-SA). Nothing is guessed.
 *
 * Links (every artist): the verified Wikipedia article, Commons category and WikiArt page where Wikidata records them,
 * plus search links that always work.
 *
 * Run: NODE_USE_ENV_PROXY=1 npx tsx scripts/find-works.ts      (slow on purpose, resumable via /tmp/works-cache)
 * Output: src/data/artist-works.json
 */
import fs from 'node:fs'
import { entities } from '../src/data'
import type { Artist } from '../src/types'
import { UA, wmFetch } from './wm.mjs'

const CACHE = '/tmp/works-cache'
fs.mkdirSync(CACHE, { recursive: true })
const OUT = new URL('../src/data/artist-works.json', import.meta.url)
const OK = /^(public domain|cc0|cc by(-sa)? [0-9.]+)$/i
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))
const norm = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim()
const readJson = (p: string, d: any) => (fs.existsSync(p) ? JSON.parse(fs.readFileSync(p, 'utf8')) : d)
const writeJson = (p: string, v: unknown) => fs.writeFileSync(p, JSON.stringify(v))

const artists = entities.filter((e) => e.type === 'artist') as Artist[]
const titleOf = (a: Artist) => a.title.replace(/ \(.*\)$/, '')

/* ---------- 1. identify each artist on Wikidata (cache from the portrait run is reused) ---------- */
const entCache: Record<string, any> = { ...readJson('/tmp/portrait-cache/entities.json', {}), ...readJson(`${CACHE}/entities.json`, {}) }
const wikidata = (params: Record<string, string>) => wmFetch('https://www.wikidata.org/w/api.php?' + new URLSearchParams({ format: 'json', ...params }))
const enwiki = (params: Record<string, string>) => wmFetch('https://en.wikipedia.org/w/api.php?' + new URLSearchParams({ format: 'json', formatversion: '2', ...params }))

async function lookup(pairs: { id: string; title: string }[]) {
  for (let i = 0; i < pairs.length; i += 40) {
    const chunk = pairs.slice(i, i + 40)
    const d = await wikidata({ action: 'wbgetentities', sites: 'enwiki', titles: chunk.map((c) => c.title).join('|'), props: 'claims|sitelinks' })
    const byTitle = new Map<string, any>()
    for (const ent of Object.values<any>(d.entities ?? {})) if (ent.sitelinks?.enwiki) byTitle.set(norm(ent.sitelinks.enwiki.title), ent)
    for (const c of chunk) if (!entCache[c.id]) entCache[c.id] = byTitle.get(norm(c.title)) ?? null
    writeJson(`${CACHE}/entities.json`, entCache)
    console.log(`  looked up ${Math.min(i + 40, pairs.length)}/${pairs.length}`)
  }
}
const individual = artists.filter((a) => a.kind === 'individual' && !a.flags?.some((f) => f.startsWith('Unresolved')))
const pending = individual.filter((a) => !(a.id in entCache))
console.log(`artists ${artists.length}, individual ${individual.length}, to look up ${pending.length}`)
await lookup(pending.map((a) => ({ id: a.id, title: titleOf(a) })))
const missed = individual.filter((a) => entCache[a.id] === null)
if (missed.length) {
  const resolved = new Map<string, string>()
  for (let i = 0; i < missed.length; i += 40) {
    const chunk = missed.slice(i, i + 40)
    const d = await enwiki({ action: 'query', titles: chunk.map(titleOf).join('|'), redirects: '1' })
    for (const r of d.query?.redirects ?? []) resolved.set(norm(r.from), r.to)
  }
  const second = missed.map((a) => ({ a, to: resolved.get(norm(titleOf(a))) })).filter((x) => x.to)
  for (const x of second) delete entCache[x.a.id]
  await lookup(second.map((x) => ({ id: x.a.id, title: x.to! })))
}

const yearOf = (claim: any): number | undefined => {
  const t = claim?.mainsnak?.datavalue?.value?.time as string | undefined
  const m = t?.match(/^([+-])(\d{4})/)
  return m ? Number(m[2]) * (m[1] === '-' ? -1 : 1) : undefined
}
const claimStr = (ent: any, p: string) => ent?.claims?.[p]?.[0]?.mainsnak?.datavalue?.value as string | undefined

/* ---------- 2. verify identity (human, birth year) before trusting a Wikidata match ---------- */
type Ident = { qid: string; died?: number; commons?: string; wikiart?: string; wp?: string; wpEl?: string; sitelinks: number }
const ident: Record<string, Ident> = {}
for (const a of individual) {
  const ent = entCache[a.id]
  if (!ent) continue
  const human = ent.claims?.P31?.some((c: any) => c.mainsnak?.datavalue?.value?.id === 'Q5')
  const by = yearOf(ent.claims?.P569?.[0])
  const lbl = a.dates.label ?? ''
  const hasBirth = !(lbl.startsWith('active') || lbl.includes('not established') || a.dates.start === 0)
  const tol = a.dates.approx ? 8 : 2
  if (!human) continue
  if (hasBirth && by !== undefined && Math.abs(by - a.dates.start) > tol) continue   // a different person with the same name
  ident[a.id] = {
    qid: ent.id, died: yearOf(ent.claims?.P570?.[0]), commons: claimStr(ent, 'P373'), wikiart: claimStr(ent, 'P6002'),
    wp: ent.sitelinks?.enwiki?.title, wpEl: ent.sitelinks?.elwiki?.title, sitelinks: Object.keys(ent.sitelinks ?? {}).length,
  }
}
console.log(`identity verified: ${Object.keys(ident).length} of ${individual.length}`)

/* ---------- 3. works per artist (SPARQL), licence-checked on Commons ---------- */
const sparql = async (q: string) => {
  for (let i = 0; i < 6; i++) {
    const res = await fetch('https://query.wikidata.org/sparql?' + new URLSearchParams({ query: q }), { headers: { Accept: 'application/sparql-results+json', 'User-Agent': UA } })
    if (res.status === 429 || res.status === 503) { const ra = Number(res.headers.get('retry-after')) || 30; console.error(`  sparql ${res.status}, waiting ${ra}s`); await sleep((ra + 2) * 1000); continue }
    if (!res.ok) throw new Error(`sparql ${res.status}`)
    return (await res.json()).results.bindings as any[]
  }
  throw new Error('sparql rate limited')
}
const worksCachePath = `${CACHE}/works.json`
const rawWorks: Record<string, any[]> = readJson(worksCachePath, {})
const PD_CUTOFF = 1955
const eligible = individual.filter((a) => ident[a.id] && ident[a.id].died !== undefined && ident[a.id].died! <= PD_CUTOFF)
console.log(`public-domain candidates (died ≤ ${PD_CUTOFF}): ${eligible.length}`)
let n = 0
// Buildings (architect, P84) are only searched for artists who are primarily architects; for everyone else only works they created (P170).
const isArch = (a: Artist) => /^architect/i.test(a.subtitle ?? '')
const keyOf = (a: Artist) => `${a.id}|${isArch(a) ? 'arch' : 'p170'}`
for (const a of eligible) {
  n++
  if (keyOf(a) in rawWorks) continue
  const q = `SELECT ?w ?wLabel ?wEl ?img ?inc ?collLabel ?sl WHERE {
    ${isArch(a) ? `{ ?w wdt:P170 wd:${ident[a.id].qid} } UNION { ?w wdt:P84 wd:${ident[a.id].qid} }` : `?w wdt:P170 wd:${ident[a.id].qid} .`} ?w wdt:P18 ?img . ?w wikibase:sitelinks ?sl .
    OPTIONAL { ?w wdt:P571 ?inc } OPTIONAL { ?w wdt:P195 ?coll } OPTIONAL { ?w rdfs:label ?wEl FILTER(LANG(?wEl) = "el") }
    SERVICE wikibase:label { bd:serviceParam wikibase:language "en". } } ORDER BY DESC(?sl) LIMIT 45`
  try { rawWorks[keyOf(a)] = await sparql(q) } catch (e) { console.error('  failed', a.title, String(e)); continue }   // not cached: a re-run retries it
  writeJson(worksCachePath, rawWorks)
  if (n % 10 === 0) console.log(`  works ${n}/${eligible.length}`)
  await sleep(1800)
}

/* ---------- 4. licence check + assemble ---------- */
const infoCachePath = `${CACHE}/info.json`
const infos: Record<string, any> = readJson(infoCachePath, {})
const strip = (h = '') => h.replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#039;/g, "'").replace(/\s+/g, ' ').trim()
const fileOf = (u: string) => decodeURIComponent(u.split('/Special:FilePath/')[1] ?? u.split('/').pop() ?? '').replace(/_/g, ' ')
const wanted = new Set<string>()
for (const a of eligible) for (const r of rawWorks[keyOf(a)] ?? []) wanted.add(fileOf(r.img.value))
const todo = [...wanted].filter((f) => !(f in infos))
console.log(`files to check: ${todo.length}`)
for (let i = 0; i < todo.length; i += 30) {
  const chunk = todo.slice(i, i + 30)
  const d: any = await wmFetch('https://commons.wikimedia.org/w/api.php?' + new URLSearchParams({
    format: 'json', formatversion: '2', action: 'query', titles: chunk.map((t) => 'File:' + t).join('|'), prop: 'imageinfo', iiprop: 'url|size|mime|extmetadata', iiurlwidth: '720',
  }))
  const byTitle = new Map<string, any>()
  for (const p of d.query?.pages ?? []) byTitle.set((p.title as string).replace(/^File:/, '').replace(/_/g, ' '), p)
  for (const f of chunk) {
    const p = byTitle.get(f)
    const ii = p?.imageinfo?.[0]
    if (!ii) { infos[f] = { missing: true }; continue }
    const m = ii.extmetadata ?? {}
    infos[f] = { w: ii.width, h: ii.height, mime: ii.mime, thumb: ii.thumburl, page: ii.descriptionurl, licence: strip(m.LicenseShortName?.value), by: strip(m.Artist?.value), restr: strip(m.Restrictions?.value) }
  }
  writeJson(infoCachePath, infos)
  if ((i / 30) % 5 === 0) console.log(`  checked ${Math.min(i + 30, todo.length)}/${todo.length}`)
}

/* importance: Wikipedia editions of the artist; the best known get ten works, the rest up to three */
const ranked = [...eligible].sort((x, y) => ident[y.id].sitelinks - ident[x.id].sitelinks)
const TOP = new Set(ranked.slice(0, 150).map((a) => a.id))

const enc = (s: string) => encodeURIComponent(s)
const out: Record<string, any> = {}
for (const a of artists) {
  const id = ident[a.id]
  const name = titleOf(a)
  const links: Record<string, string> = {
    wikiartSearch: `https://www.wikiart.org/en/search/${enc(name)}`,
    commonsSearch: `https://commons.wikimedia.org/w/index.php?search=${enc(name)}&ns6=1&ns14=1`,
  }
  if (id?.wp) links.wikipedia = `https://en.wikipedia.org/wiki/${enc(id.wp.replace(/ /g, '_'))}`
  if (id?.wpEl) links.wikipediaEl = `https://el.wikipedia.org/wiki/${enc(id.wpEl.replace(/ /g, '_'))}`
  if (id?.commons) links.commons = `https://commons.wikimedia.org/wiki/Category:${enc(id.commons.replace(/ /g, '_'))}`
  if (id?.wikiart) links.wikiart = `https://www.wikiart.org/en/${id.wikiart}`
  const entry: any = { links }
  if (id) entry.qid = id.qid
  const works: any[] = []
  const seen = new Set<string>()
  if (id && eligible.includes(a)) {
    const cap = TOP.has(a.id) ? 10 : 3
    const rows = rawWorks[keyOf(a)] ?? []
    // a year is shown only when every Wikidata inception value for the work agrees
    const years = new Map<string, Set<number>>()
    for (const r of rows) if (r.inc) { const y = new Date(r.inc.value).getUTCFullYear(); if (y > 0) years.set(r.w.value, (years.get(r.w.value) ?? new Set()).add(y)) }
    for (const r of rows) {
      const f = fileOf(r.img.value)
      const inf = infos[f]
      const title = r.wLabel?.value as string | undefined
      if (!inf || inf.missing || !title || /^Q\d+$/.test(title) || seen.has(r.w.value) || seen.has(f)) continue
      if (!OK.test(inf.licence) || !/^image\/(jpeg|png|webp)$/.test(inf.mime) || inf.restr || (inf.w ?? 0) < 500) continue
      seen.add(r.w.value); seen.add(f)
      const ys = years.get(r.w.value)
      const yr = ys && ys.size === 1 ? [...ys][0] : undefined
      works.push({
        t: title, ...(r.wEl && r.wEl.value !== title ? { tEl: r.wEl.value } : {}), ...(yr && yr > 0 ? { y: String(yr) } : {}), ...(r.collLabel && !/^Q\d+$/.test(r.collLabel.value) && !/^https?:/.test(r.collLabel.value) ? { c: r.collLabel.value } : {}),
        f, th: inf.thumb, p: inf.page, l: inf.licence, r: Number((inf.w / inf.h).toFixed(3)), ...(/^public domain$/i.test(inf.licence) ? {} : { by: inf.by }),
      })
      if (works.length >= cap) break
    }
  }
  if (works.length) entry.works = works
  out[a.id] = entry
}
fs.writeFileSync(OUT, JSON.stringify(out))
const withWorks = Object.values(out).filter((e: any) => e.works?.length).length
const totalWorks = Object.values(out).reduce((s: number, e: any) => s + (e.works?.length ?? 0), 0)
const withLink = Object.values(out).filter((e: any) => e.links.wikipedia || e.links.commons || e.links.wikiart).length
console.log(`DONE: ${Object.keys(out).length} artists; ${withWorks} with works (${totalWorks} works); ${withLink} with a verified wikipedia/commons/wikiart link`)

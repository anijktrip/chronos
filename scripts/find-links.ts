/**
 * Verifies and completes the outbound links of every artist in src/data/artist-works.json.
 *
 *  - WikiArt: kept only when the page really exists (HTTP 200). Where Wikidata has no WikiArt id, the slug is derived from the
 *    artist's name and Wikipedia title and kept only if that page exists. No "search" fallback is stored any more.
 *  - Official website: Wikidata property P856, kept only if the site answers; MANUAL below always wins (supplied by the project
 *    owner or checked by hand).
 *
 * Run: NODE_USE_ENV_PROXY=1 npx tsx scripts/find-links.ts      (resumable via /tmp/links-cache)
 */
import fs from 'node:fs'
import { entities } from '../src/data'
import type { Artist } from '../src/types'
import { UA } from './wm.mjs'

const FILE = new URL('../src/data/artist-works.json', import.meta.url)
const CACHE = '/tmp/links-cache'
fs.mkdirSync(CACHE, { recursive: true })
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))
const BROWSER = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36'

/** Wikidata / Wikipedia websites that are fan sites, societies, galleries or dead redirects, not the artist's own, estate's or foundation's. */
const NOT_THEIRS = /(^|\.)(theartstory|culture\.gouv|gale|oup|archive|metmuseum|cnap|theartnewspaper|wikipedia|guggenheim|csmonitor|nytimes|tate|moma|getty|louvre|britishmuseum|nga|artnet|artsy|khanacademy|britannica|youtube|facebook|instagram|twitter|x)\.[a-z.]+$/i
const EXCLUDE = new Set([
  'artist-leonardo', 'artist-wassily-kandinsky', 'artist-paul-cezanne', 'artist-rabindranath-tagore', 'artist-andre-derain',
  'artist-julie-mehretu', 'artist-frida-kahlo', 'artist-william-morris', 'artist-tracey-emin', 'artist-andre-masson', 'artist-francis-picabia',
])

/** Websites found by a web search and checked by hand, or given by the project owner (artist id → URL): scripts/artist-sites.json. */
const MANUAL: Record<string, string> = JSON.parse(fs.readFileSync(new URL('./artist-sites.json', import.meta.url), 'utf8'))

const data: Record<string, any> = JSON.parse(fs.readFileSync(FILE, 'utf8'))
const artists = new Map((entities.filter((e) => e.type === 'artist') as Artist[]).map((a) => [a.id, a]))
const titleOf = (a: Artist) => a.title.replace(/ \(.*\)$/, '')
const slug = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/['’.]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

const cached = async <T>(name: string, fn: () => Promise<T>): Promise<T> => {
  const p = `${CACHE}/${name.replace(/[^a-z0-9._-]/gi, '_').slice(0, 150)}.json`
  if (fs.existsSync(p)) return JSON.parse(fs.readFileSync(p, 'utf8'))
  const v = await fn()
  fs.writeFileSync(p, JSON.stringify(v))
  return v
}

/** HTTP status, or 0 when the host cannot be reached at all. */
const status = async (url: string): Promise<number> => {
  if (url.startsWith('http://')) { const st = await status('https://' + url.slice(7)); if (st) return st }
  for (let i = 0; i < 3; i++) {
    try {
      const res = await fetch(url, { redirect: 'follow', headers: { 'User-Agent': BROWSER, Accept: 'text/html' }, signal: AbortSignal.timeout(20000) })
      await res.body?.cancel()
      if (res.status === 429) { await sleep(5000 * (i + 1)); continue }
      return res.status
    } catch { await sleep(1500) }
  }
  return 0
}

async function pool<T>(items: T[], n: number, fn: (x: T) => Promise<void>) {
  let i = 0
  await Promise.all(Array.from({ length: n }, async () => { while (i < items.length) await fn(items[i++]) }))
}

/* ---------- WikiArt ---------- */
const wikiartOk: Record<string, string | null> = {}
await pool([...artists.keys()], 4, async (id) => {
  const a = artists.get(id)!
  const e = data[id] ?? (data[id] = { links: {} })
  const wp = e.links.wikipedia ? decodeURIComponent(String(e.links.wikipedia).split('/wiki/')[1] ?? '').replace(/_/g, ' ').replace(/ \(.*\)$/, '') : ''
  const cands = new Set<string>()
  if (e.links.wikiart) cands.add(String(e.links.wikiart).replace('https://www.wikiart.org/en/', ''))
  for (const s of [slug(titleOf(a)), slug(wp)]) if (s) cands.add(s)
  let found: string | null = null
  for (const c of cands) {
    const st = await cached(`wa-${c}`, async () => { await sleep(250); return status(`https://www.wikiart.org/en/${c}`) })
    if (st === 200) { found = c; break }
  }
  wikiartOk[id] = found
})

/* ---------- official websites: Wikidata P856, then the English Wikipedia infobox ---------- */
const qids = Object.entries(data).filter(([, e]) => e.qid).map(([id, e]) => [id, e.qid as string] as const)
const sites: Record<string, string> = {}
for (let i = 0; i < qids.length; i += 80) {
  const batch = qids.slice(i, i + 80)
  const rows = await cached(`p856-${i}`, async () => {
    const q = `SELECT ?q ?w ?rank WHERE { VALUES ?q { ${batch.map(([, q]) => `wd:${q}`).join(' ')} } ?q p:P856 ?s . ?s ps:P856 ?w ; wikibase:rank ?rank . FILTER NOT EXISTS { ?s pq:P582 ?end } }`
    for (let t = 0; t < 8; t++) {
      const res = await fetch('https://query.wikidata.org/sparql?' + new URLSearchParams({ query: q }), { headers: { Accept: 'application/sparql-results+json', 'User-Agent': UA } })
      if (res.ok) return (await res.json()).results.bindings as any[]
      console.error(`  sparql ${res.status}, retrying`)
      await sleep(10000 * (t + 1))
    }
    throw new Error('sparql failed')
  })
  const byQ = new Map<string, { w: string; pref: boolean }[]>()
  for (const r of rows) {
    const q = String(r.q.value).split('/').pop()!
    if (/deprecated/i.test(r.rank.value)) continue
    byQ.set(q, [...(byQ.get(q) ?? []), { w: r.w.value, pref: /Preferred/.test(r.rank.value) }])
  }
  for (const [id, q] of batch) {
    const c = (byQ.get(q) ?? []).sort((a, b) => Number(b.pref) - Number(a.pref) || Number(b.w.startsWith('https')) - Number(a.w.startsWith('https')))
    if (c[0]) sites[id] = c[0].w
  }
  await sleep(1500)
}

const wpTitle = (id: string) => data[id]?.links?.wikipedia ? decodeURIComponent(String(data[id].links.wikipedia).split('/wiki/')[1] ?? '').replace(/_/g, ' ') : ''
const missing = [...artists.keys()].filter((id) => !sites[id] && !MANUAL[id] && wpTitle(id))
for (let i = 0; i < missing.length; i += 20) {
  const batch = missing.slice(i, i + 20)
  const pages = await cached(`wp-text-${i}`, async () => {
    const u = 'https://en.wikipedia.org/w/api.php?' + new URLSearchParams({ action: 'query', prop: 'revisions', rvprop: 'content', rvslots: 'main', format: 'json', formatversion: '2', redirects: '1', titles: batch.map(wpTitle).join('|') })
    for (let t = 0; t < 12; t++) {
      const res = await fetch(u, { headers: { 'User-Agent': UA } })
      if (res.ok) return (await res.json()).query as { pages: any[]; redirects?: { from: string; to: string }[]; normalized?: { from: string; to: string }[] }
      const ra = Number(res.headers.get('retry-after')) || 0
      console.error(`  wikipedia ${res.status}, waiting`)
      await sleep(Math.max(ra * 1000, 20000 * (t + 1)))
    }
    throw new Error('wikipedia failed')
  })
  const text = new Map<string, string>()
  for (const p of pages.pages) text.set(p.title, p.revisions?.[0]?.slots?.main?.content ?? '')
  const to = new Map<string, string>()
  for (const r of [...(pages.normalized ?? []), ...(pages.redirects ?? [])]) to.set(r.from, r.to)
  for (const id of batch) {
    let title = wpTitle(id)
    for (let k = 0; k < 3 && to.has(title); k++) title = to.get(title)!
    const wt = text.get(title) ?? ''
    // only the infobox "website" field or the {{official website}} template under External links: never a citation
    const infobox = wt.match(/\{\{\s*infobox[\s\S]*?\n\}\}/i)?.[0] ?? ''
    const links = wt.split(/==\s*external links\s*==/i)[1] ?? ''
    const m = links.match(/\{\{\s*official (?:website|url)\s*\|\s*(?:1\s*=\s*)?(https?:\/\/[^|}\s]+|[a-z0-9.-]+\.[a-z]{2,}[^|}\s]*)/i)
      ?? infobox.match(/\|\s*(?:website|homepage)\s*=\s*(?:\{\{\s*(?:url|official website)\s*\|\s*(?:1\s*=\s*)?|\[)?\s*(https?:\/\/[^\s|\]}]+|[a-z0-9.-]+\.[a-z]{2,}[^\s|\]}]*)/i)
    if (m) sites[id] = /^https?:/i.test(m[1]) ? m[1] : 'https://' + m[1]
  }
  await sleep(4000)
}

const siteOk: Record<string, string> = {}
await pool(Object.entries(sites).filter(([id]) => !MANUAL[id] && !EXCLUDE.has(id) && !NOT_THEIRS.test(new URL(sites[id] ?? 'https://x.invalid').hostname)), 6, async ([id, url]) => {
  const st = await cached(`site-${url}`, () => status(url))
  if (st >= 200 && st < 400 || st === 401 || st === 403) siteOk[id] = url
  else console.log(`  site not reachable (${st}): ${id} ${url}`)
})
for (const [id, url] of Object.entries(MANUAL)) siteOk[id] = url

/* ---------- write ---------- */
let wa = 0, ws = 0
for (const id of artists.keys()) {
  const e = data[id]
  delete e.links.wikiartSearch
  delete e.links.wikiart
  if (wikiartOk[id]) { e.links.wikiart = `https://www.wikiart.org/en/${wikiartOk[id]}`; wa++ }
  delete e.links.website
  if (siteOk[id]) { e.links.website = siteOk[id]; ws++ }
}
fs.writeFileSync(FILE, JSON.stringify(data))
console.log(`DONE: ${artists.size} artists; WikiArt verified ${wa}; official website ${ws}`)
fs.writeFileSync('/tmp/links-report.json', JSON.stringify({ wikiart: wikiartOk, sites: siteOk }, null, 1))

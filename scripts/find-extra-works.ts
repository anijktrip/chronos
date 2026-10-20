/**
 * Adds one well-known, freely licensed work for each of many different artists to the artwork collection, so the collection
 * is not dominated by a few names. Works come from src/data/artist-works.json (already licence-checked on Commons); here we
 * pick one per artist, ask Wikidata for the work's materials, download the 720px Commons thumbnail into src/assets/art and
 * record credit and licence.
 *
 * Run: NODE_USE_ENV_PROXY=1 npx tsx scripts/find-extra-works.ts      (resumable via /tmp/extra-cache)
 * Output: src/data/extra-works.json, src/data/image-credits.json (appended), src/assets/art/*.jpg, src/assets/hero/*.jpg
 */
import crypto from 'node:crypto'
import fs from 'node:fs'
import { entities, relationships } from '../src/data'
import type { Artist } from '../src/types'
import { UA } from './wm.mjs'

const CACHE = '/tmp/extra-cache'
fs.mkdirSync(CACHE, { recursive: true })
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))
const slug = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/['’.]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
const works: Record<string, any> = JSON.parse(fs.readFileSync(new URL('../src/data/artist-works.json', import.meta.url), 'utf8'))
const artists = entities.filter((e) => e.type === 'artist') as Artist[]
const hasArtwork = new Set(relationships.filter((r) => r.type === 'created_by' && String(r.from).startsWith('art-') && !String(r.id).startsWith('rel-x-')).map((r) => r.to))
const nameOf = (a: Artist) => a.title.replace(/ \(.*\)$/, '')

/** Europe is the largest set, so it is chosen by hand to spread over eras and media; every other region is taken in full. */
const EUROPE = ['Exekias', 'Myron', 'Praxiteles', 'Duccio di Buoninsegna', 'Giotto di Bondone', 'Simone Martini', 'Andrei Rublev', 'Donatello', 'Jan van Eyck', 'Masaccio',
  'Piero della Francesca', 'Sandro Botticelli', 'Hieronymus Bosch', 'Lucas Cranach the Elder', 'Michelangelo Buonarroti', 'Raphael', 'Titian', 'Hans Holbein the Younger',
  'Pieter Bruegel the Elder', 'Sofonisba Anguissola', 'Caravaggio', 'Peter Paul Rubens', 'Artemisia Gentileschi', 'Gian Lorenzo Bernini', 'Francisco de Zurbarán', 'Diego Velázquez',
  'Claude Lorrain', 'Judith Leyster', 'Rachel Ruysch', 'Jean-Antoine Watteau', 'Jean-Honoré Fragonard', 'Henry Fuseli', 'Francisco Goya', 'Jacques-Louis David',
  'Élisabeth Vigée Le Brun', 'Antonio Canova', 'William Blake', 'Caspar David Friedrich', 'J. M. W. Turner', 'John Constable', 'Jean-Auguste-Dominique Ingres', 'Théodore Géricault',
  'Eugène Delacroix', 'Honoré Daumier', 'Jean-François Millet', 'Gustave Courbet', 'Édouard Manet', 'Edgar Degas', 'Berthe Morisot', 'Gustave Caillebotte', 'Georges Seurat',
  'Gustav Klimt', 'Edvard Munch', 'Henri de Toulouse-Lautrec', 'Käthe Kollwitz', 'Henri Matisse', 'Piet Mondrian', 'Paul Klee', 'Kazimir Malevich', 'Franz Marc',
  'Ernst Ludwig Kirchner', 'Umberto Boccioni', 'Amedeo Modigliani', 'Robert Delaunay', 'Egon Schiele', 'El Lissitzky', 'Lyubov Popova', 'Antoni Gaudí', 'Charles Rennie Mackintosh']
const SKIP = new Set(['Alfred Stieglitz'])

const pick = artists.filter((a) => works[a.id]?.works?.length && !hasArtwork.has(a.id) && !SKIP.has(nameOf(a)) && (a.regions[0] !== 'europe' || EUROPE.includes(nameOf(a))))
console.log(`${pick.length} artists selected`)

const sparql = async (q: string) => {
  for (let i = 0; i < 8; i++) {
    const res = await fetch('https://query.wikidata.org/sparql?' + new URLSearchParams({ query: q }), { headers: { Accept: 'application/sparql-results+json', 'User-Agent': UA } })
    if (res.ok) return (await res.json()).results.bindings as any[]
    console.error(`  sparql ${res.status}`)
    await sleep(8000 * (i + 1))
  }
  return [] as any[]
}
const cached = async <T>(key: string, fn: () => Promise<T>): Promise<T> => {
  const p = `${CACHE}/${key.replace(/[^a-z0-9._-]/gi, '_').slice(0, 140)}.json`
  if (fs.existsSync(p)) return JSON.parse(fs.readFileSync(p, 'utf8'))
  const v = await fn(); fs.writeFileSync(p, JSON.stringify(v)); return v
}
/** A standard-size rendering of the file; originals are served unscaled (and throttled) by Commons. */
const thumbUrl = (file: string, w: number) => {
  const name = file.replace(/ /g, '_')
  const h = crypto.createHash('md5').update(name).digest('hex')
  const enc = encodeURIComponent(name).replace(/'/g, '%27')
  const ext = /\.(tiff?|png)$/i.test(name) ? '.png' : ''
  return `https://upload.wikimedia.org/wikipedia/commons/thumb/${h[0]}/${h.slice(0, 2)}/${enc}/${w}px-${enc}${ext}`
}
const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1)

const credPath = new URL('../src/data/image-credits.json', import.meta.url)
const credits = JSON.parse(fs.readFileSync(credPath, 'utf8'))
/** Wikidata inception → a date that is safe to show: an exact year, a decade or a century, only when every statement agrees and it fits the artist's lifetime. */
function dateOf(inc: string[], a: Artist): { year?: number; label?: string } {
  const parsed = inc.map((x) => { const [t, pr] = x.split('|'); const m = t.match(/^([+-]?)(\d+)-/); return m ? { y: Number(m[2]) * (m[1] === '-' ? -1 : 1), pr: Number(pr) } : undefined }).filter(Boolean) as { y: number; pr: number }[]
  if (!parsed.length) return {}
  const pr = Math.min(...parsed.map((p) => p.pr))
  const ys = new Set(parsed.map((p) => (pr >= 9 ? p.y : pr === 8 ? Math.floor(p.y / 10) * 10 : Math.floor((p.y - 1) / 100)))) 
  if (ys.size !== 1) return {}
  const k = [...ys][0]
  const start = pr >= 9 ? k : pr === 8 ? k : k * 100 + 1
  const tol = a.dates.approx ? 40 : 15
  if (start < a.dates.start - tol || start > (a.dates.end ?? a.dates.start + 90) + tol) return {}
  const bce = (n: number) => (n < 0 ? `${-n} BCE` : String(n))
  if (pr >= 9) return { year: k, label: bce(k) }
  if (pr === 8) return { year: k, label: k < 0 ? `c. ${bce(k)}` : `${k}s` }
  const c = k + 1
  const ord = (n: number) => `${n}${n % 100 >= 11 && n % 100 <= 13 ? 'th' : ['th', 'st', 'nd', 'rd'][n % 10 > 3 ? 0 : n % 10]}`
  return k >= 0 ? { year: k * 100 + 50, label: `${ord(c)} century` } : {}
}

const out: any[] = []
for (const a of pick) {
  const name = nameOf(a)
  const cands = (works[a.id].works as any[]).filter((w) => w.r >= 0.5 && w.r <= 2.1 && !/cemetery|caryatid|murals?\b|\bLIS\b|camera notes/i.test(w.t))
  const w = cands[0]
  if (!w) { console.log('no usable image', name); continue }
  const id = `art-${slug(name)}-${slug(w.t)}`.slice(0, 64).replace(/-$/, '')
  const qid = works[a.id].qid
  const det = await cached(`det2-${id}`, async () => {
    const lbl = String(w.t).replace(/\\/g, '\\\\').replace(/"/g, '\\"')
    const rows = await sparql(`SELECT ?m ?mL ?iL ?t ?pr WHERE { ?w rdfs:label "${lbl}"@en . { ?w wdt:P170 wd:${qid} } UNION { ?w wdt:P84 wd:${qid} } OPTIONAL { ?w wdt:P186 ?m . ?m rdfs:label ?mL FILTER(LANG(?mL)="en") } OPTIONAL { ?w wdt:P31 ?i . ?i rdfs:label ?iL FILTER(LANG(?iL)="en") } OPTIONAL { ?w p:P571/psv:P571 [ wikibase:timeValue ?t ; wikibase:timePrecision ?pr ] } } LIMIT 60`)
    await sleep(1200)
    return {
      mats: [...new Set(rows.map((r) => r.mL?.value).filter(Boolean))] as string[], kind: [...new Set(rows.map((r) => r.iL?.value).filter(Boolean))] as string[],
      inc: [...new Set(rows.filter((r) => r.t).map((r) => `${r.t.value}|${r.pr.value}`))] as string[],
    }
  })
  const file = new URL(`../src/assets/art/${id}.jpg`, import.meta.url)
  if (!fs.existsSync(file)) {
    let buf: Buffer | undefined
    for (const u of [thumbUrl(w.f, 960), w.th.replace('thumbnail_unscaled', 'thumbnail')]) {
      const res = await fetch(u, { headers: { 'User-Agent': UA } }).catch(() => undefined)
      if (res?.ok) { buf = Buffer.from(await res.arrayBuffer()); break }
      console.log('  try failed', name, res?.status)
      await sleep(1500)
    }
    if (!buf) { console.log('image failed', name); continue }
    fs.writeFileSync(file, buf)
  }
  const pd = /^public domain$/i.test(w.l)
  credits[id] = {
    file: w.f,
    credit: pd ? 'Wikimedia Commons' : `Photo: ${w.by ?? 'see Commons page'} (${w.l}), via Wikimedia Commons`,
    licence: pd ? 'Public domain. Reproduction of a public-domain work.' : `${w.l}. Attribution required${/sa/i.test(w.l) ? '; share-alike applies to adaptations' : ''}.`,
    page: w.p,
    ratio: w.r,
  }
  out.push({
    id, artist: a.id, name, title: w.t, titleEl: w.tEl, ...dateOf(det.inc ?? [], a), collection: w.c,
    mats: det.mats.slice(0, 4).map((m) => cap(m.toLowerCase())), kind: det.kind.find((k) => /painting|sculpture|fresco|print|drawing|mosaic|building|church|cathedral|photograph|icon|vase|cup|manuscript|screen|scroll|woodblock|ceramic|relief|statue/i.test(k)) ?? '',
    ratio: w.r, regions: a.regions, periods: a.periods, origin: a.originLabel, aStart: a.dates.start, aEnd: a.dates.end ?? undefined,
  })
  console.log('OK', id)
}
fs.writeFileSync(credPath, JSON.stringify(credits, null, 2))
fs.writeFileSync(new URL('../src/data/extra-works.json', import.meta.url), JSON.stringify(out, null, 1))
console.log(`DONE: ${out.length} works`)

/**
 * Adds well-known works that the collection was missing, as artwork records.
 *
 *  PICKS  — works that are already in an artist's licence-checked gallery (src/data/artist-works.json) and are promoted to full artwork records.
 *  ANON   — works without an artist record (ancient, medieval or anonymous works, buildings): found on Wikidata by name, image from Commons,
 *           accepted only as public domain / CC0 / CC BY / CC BY-SA.
 * Output is merged into src/data/extra-works.json and src/data/image-credits.json; images go to src/assets/art.
 *
 * Run: NODE_USE_ENV_PROXY=1 npx tsx scripts/add-key-works.ts      (resumable via /tmp/key-cache)
 */
import crypto from 'node:crypto'
import fs from 'node:fs'
import { entities } from '../src/data'
import type { Artist } from '../src/types'
import { UA } from './wm.mjs'

const CACHE = '/tmp/key-cache'
fs.mkdirSync(CACHE, { recursive: true })
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))
const slug = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/['’.]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
const works: Record<string, any> = JSON.parse(fs.readFileSync(new URL('../src/data/artist-works.json', import.meta.url), 'utf8'))
const artists = new Map((entities.filter((e) => e.type === 'artist') as Artist[]).map((a) => [a.id, a]))
const OK = /^(public domain|cc0|cc by(-sa)? [0-9.]+)$/i

const PICKS: [string, RegExp][] = [
  ['artist-leonardo', /^The Last Supper$/], ['artist-leonardo', /^Vitruvian Man$/], ['artist-francisco-goya', /Saturn Devouring/], ['artist-wassily-kandinsky', /Composition VIII/],
  ['artist-jacques-louis-david', /Death of Marat/], ['artist-jacques-louis-david', /Oath of the Horatii/], ['artist-edouard-manet', /^Olympia$/], ['artist-edouard-manet', /Folies-Berg/],
  ['artist-paul-cezanne', /^The Card Players$/], ['artist-paul-cezanne', /^Mont Sainte-Victoire$/], ['artist-pierre-auguste-renoir', /Bal du moulin/], ['artist-pierre-auguste-renoir', /Luncheon of the Boating/],
  ['artist-sandro-botticelli', /Primavera/], ['artist-giorgione', /The Tempest/], ['artist-piet-mondrian', /Composition with Red, Yellow and Blue/], ['artist-diego-velazquez', /Surrender of Breda/],
  ['artist-diego-velazquez', /Rokeby Venus/], ['artist-rembrandt', /Anatomy Lesson/], ['artist-pieter-bruegel-the-elder', /Tower of Babel/], ['artist-hans-holbein-the-younger', /Dead Christ/],
  ['artist-gustave-courbet', /Burial at Ornans/], ['artist-gustave-courbet', /Painter's Studio/], ['artist-michelangelo-buonarroti', /The Creation of Adam/], ['artist-michelangelo-buonarroti', /^David$/],
  ['artist-michelangelo-buonarroti', /Pietà/], ['artist-michelangelo-buonarroti', /The Last Judgment/], ['artist-titian', /Bacchus and Ariadne/], ['artist-titian', /Assumption of the Virgin/],
  ['artist-peter-paul-rubens', /Descent from the Cross/], ['artist-gustav-klimt', /Adele Bloch-Bauer I/], ['artist-william-blake', /Ancient of Days/], ['artist-jan-van-eyck', /Ghent Altarpiece/],
  ['artist-giotto-di-bondone', /^Lamentation$/], ['artist-edvard-munch', /^Madonna$/],
]

const ANON: { id: string; title: string; label: string; name: string; regions: string[]; periods: string[]; origin: string }[] = [
  { id: 'art-venus-de-milo', title: 'Venus de Milo', label: 'Venus de Milo', name: 'Attributed to Alexandros of Antioch', regions: ['europe'], periods: ['per-era-antiquity'], origin: 'Greece' },
  { id: 'art-winged-victory-samothrace', title: 'Winged Victory of Samothrace', label: 'Winged Victory of Samothrace', name: 'Unknown Hellenistic sculptor', regions: ['europe'], periods: ['per-era-antiquity'], origin: 'Greece' },
  { id: 'art-laocoon-and-his-sons', title: 'Laocoön and His Sons', label: 'Laocoön and His Sons', name: 'Attributed to Hagesander, Athenodoros and Polydorus of Rhodes', regions: ['europe'], periods: ['per-era-antiquity'], origin: 'Greece or Rome' },
  { id: 'art-the-thinker', title: 'The Thinker', label: 'The Thinker', name: 'Auguste Rodin', regions: ['europe'], periods: ['per-era-modern'], origin: 'France' },
  { id: 'art-parthenon', title: 'The Parthenon', label: 'Parthenon', name: 'Iktinos and Kallikrates, with sculpture overseen by Phidias', regions: ['europe'], periods: ['per-classical-greece'], origin: 'Greece' },
  { id: 'art-chartres-cathedral', title: 'Chartres Cathedral', label: 'Chartres Cathedral', name: 'Unknown medieval builders', regions: ['europe'], periods: ['per-era-postclassical'], origin: 'France' },
  { id: 'art-taj-mahal', title: 'The Taj Mahal', label: 'Taj Mahal', name: 'Commissioned by Shah Jahan; architect traditionally Ustad Ahmad Lahori', regions: ['south-asia'], periods: ['per-mughal'], origin: 'India' },
  { id: 'art-bayeux-tapestry', title: 'The Bayeux Tapestry', label: 'Bayeux Tapestry', name: 'Unknown embroiderers, probably in England', regions: ['europe'], periods: ['per-era-postclassical'], origin: 'England or Normandy' },
  { id: 'art-book-of-kells', title: 'The Book of Kells', label: 'Book of Kells', name: 'Unknown monks, probably of Iona and Kells', regions: ['europe'], periods: ['per-era-postclassical'], origin: 'Ireland or Scotland' },
  { id: 'art-tale-of-genji-scroll', title: 'Illustrated Handscroll of the Tale of Genji', label: 'Genji Monogatari Emaki', name: 'Unknown court painters', regions: ['east-asia'], periods: ['per-era-postclassical'], origin: 'Japan' },
]

const cached = async <T>(key: string, fn: () => Promise<T>): Promise<T> => {
  const p = `${CACHE}/${key.replace(/[^a-z0-9._-]/gi, '_').slice(0, 140)}.json`
  if (fs.existsSync(p)) return JSON.parse(fs.readFileSync(p, 'utf8'))
  const v = await fn(); fs.writeFileSync(p, JSON.stringify(v)); return v
}
const sparql = async (q: string) => {
  for (let i = 0; i < 8; i++) {
    const res = await fetch('https://query.wikidata.org/sparql?' + new URLSearchParams({ query: q }), { headers: { Accept: 'application/sparql-results+json', 'User-Agent': UA } })
    if (res.ok) return (await res.json()).results.bindings as any[]
    await sleep(8000 * (i + 1))
  }
  return [] as any[]
}
const strip = (h = '') => h.replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#039;/g, "'").replace(/\s+/g, ' ').trim()
const fileOf = (u: string) => decodeURIComponent(u.split('/Special:FilePath/')[1] ?? u.split('/').pop() ?? '').replace(/_/g, ' ')
const thumbUrl = (file: string, w: number) => {
  const name = file.replace(/ /g, '_'); const h = crypto.createHash('md5').update(name).digest('hex'); const enc = encodeURIComponent(name).replace(/'/g, '%27')
  return `https://upload.wikimedia.org/wikipedia/commons/thumb/${h[0]}/${h.slice(0, 2)}/${enc}/${w}px-${enc}${/\.(tiff?|png)$/i.test(name) ? '.png' : ''}`
}
const commonsInfo = (f: string) => cached(`ci-${f}`, async () => {
  for (let i = 0; i < 6; i++) {
    const r = await fetch('https://commons.wikimedia.org/w/api.php?' + new URLSearchParams({ format: 'json', formatversion: '2', action: 'query', titles: 'File:' + f, prop: 'imageinfo', iiprop: 'url|size|mime|extmetadata', iiurlwidth: '960' }), { headers: { 'User-Agent': UA } })
    if (r.ok) { const ii = (await r.json()).query?.pages?.[0]?.imageinfo?.[0]; if (!ii) return { missing: true }; const x = ii.extmetadata ?? {}; return { w: ii.width, h: ii.height, mime: ii.mime, thumb: ii.thumburl, page: ii.descriptionurl, licence: strip(x.LicenseShortName?.value), by: strip(x.Artist?.value), restr: strip(x.Restrictions?.value) } }
    await sleep(6000 * (i + 1))
  }
  return { missing: true }
})
const getImage = async (f: string, fallback: string): Promise<Buffer | undefined> => {
  for (const u of [thumbUrl(f, 960), fallback.replace('thumbnail_unscaled', 'thumbnail')]) {
    for (let i = 0; i < 3; i++) {
      const res = await fetch(u, { headers: { 'User-Agent': UA } }).catch(() => undefined)
      if (res?.ok) return Buffer.from(await res.arrayBuffer())
      if (res && res.status !== 429) break
      await sleep(15000)
    }
  }
}

const jsonPath = new URL('../src/data/extra-works.json', import.meta.url)
const credPath = new URL('../src/data/image-credits.json', import.meta.url)
const out: any[] = JSON.parse(fs.readFileSync(jsonPath, 'utf8'))
const credits = JSON.parse(fs.readFileSync(credPath, 'utf8'))
const have = new Set(out.map((w) => w.id))

async function save(id: string, file: string, thumb: string, info: any, rec: any) {
  const dest = new URL(`../src/assets/art/${id}.jpg`, import.meta.url)
  if (!fs.existsSync(dest)) {
    const buf = await getImage(file, thumb)
    if (!buf) { console.log('  image failed', id); return }
    fs.writeFileSync(dest, buf)
  }
  const pd = /^(public domain|cc0)$/i.test(info.licence)
  credits[id] = {
    file, credit: pd ? 'Wikimedia Commons' : `Photo: ${info.by || 'see Commons page'} (${info.licence}), via Wikimedia Commons`,
    licence: pd ? 'Public domain. Reproduction of a public-domain work.' : `${info.licence}. Attribution required${/sa/i.test(info.licence) ? '; share-alike applies to adaptations' : ''}.`,
    page: info.page, ratio: Number((info.w / info.h).toFixed(3)),
  }
  const i = out.findIndex((w) => w.id === id)
  if (i >= 0) out[i] = rec; else out.push(rec)
  have.add(id)
  console.log('OK', id)
}

/* ---- PICKS ---- */
for (const [aid, re] of PICKS) {
  const a = artists.get(aid); const w = (works[aid]?.works as any[] | undefined)?.find((x) => re.test(x.t))
  if (!a || !w) { console.log('no match', aid, String(re)); continue }
  const id = `art-${slug(a.title.replace(/ \(.*\)$/, ''))}-${slug(w.t)}`.slice(0, 64).replace(/-$/, '')
  if (have.has(id)) continue
  const det = await cached(`det-${id}`, async () => {
    const lbl = String(w.t).replace(/\\/g, '\\\\').replace(/"/g, '\\"')
    const rows = await sparql(`SELECT ?mL ?iL ?t ?pr WHERE { ?w rdfs:label "${lbl}"@en . { ?w wdt:P170 wd:${works[aid].qid} } UNION { ?w wdt:P84 wd:${works[aid].qid} } OPTIONAL { ?w wdt:P186 ?m . ?m rdfs:label ?mL FILTER(LANG(?mL)="en") } OPTIONAL { ?w wdt:P31 ?i . ?i rdfs:label ?iL FILTER(LANG(?iL)="en") } OPTIONAL { ?w p:P571/psv:P571 [ wikibase:timeValue ?t ; wikibase:timePrecision ?pr ] } } LIMIT 60`)
    await sleep(1200)
    return { mats: [...new Set(rows.map((r) => r.mL?.value).filter(Boolean))] as string[], kind: [...new Set(rows.map((r) => r.iL?.value).filter(Boolean))] as string[], inc: [...new Set(rows.filter((r) => r.t).map((r) => `${r.t.value}|${r.pr.value}`))] as string[] }
  })
  const info: any = await commonsInfo(w.f)
  if (info.missing || !OK.test(info.licence)) { console.log('  licence not ok', id, info.licence); continue }
  const dt = dateFrom(det.inc, a)
  await save(id, w.f, w.th, info, {
    id, artist: aid, name: a.title.replace(/ \(.*\)$/, ''), title: w.t, titleEl: w.tEl, ...dt, collection: w.c,
    mats: det.mats.slice(0, 4).map((m) => m.charAt(0).toUpperCase() + m.slice(1).toLowerCase()), kind: det.kind.find((k) => /painting|sculpture|fresco|print|drawing|altarpiece|mural/i.test(k)) ?? '',
    ratio: Number((info.w / info.h).toFixed(3)), regions: a.regions, periods: a.periods, origin: a.originLabel, aStart: a.dates.start, aEnd: a.dates.end ?? undefined,
  })
}

/* ---- ANON ---- */
for (const w of ANON) {
  if (have.has(w.id)) continue
  const rows = await cached(`anon-${w.id}`, async () => {
    const r = await sparql(`SELECT ?w ?img ?sl ?inc ?pr ?collLabel WHERE { ?w rdfs:label "${w.label}"@en ; wdt:P18 ?img ; wikibase:sitelinks ?sl . OPTIONAL { ?w p:P571/psv:P571 [ wikibase:timeValue ?inc ; wikibase:timePrecision ?pr ] } OPTIONAL { ?w wdt:P195 ?coll . ?coll rdfs:label ?collLabel FILTER(LANG(?collLabel)="en") } } ORDER BY DESC(?sl) LIMIT 6`)
    await sleep(1500)
    return r
  })
  const best = rows[0]
  if (!best) { console.log('  not found on Wikidata', w.label); continue }
  const file = fileOf(best.img.value)
  const info: any = await commonsInfo(file)
  if (info.missing || !OK.test(info.licence)) { console.log('  licence not ok', w.id, info.licence); continue }
  const fake = { dates: { start: -500, end: 1900, approx: true } } as unknown as Artist
  const dt = best.inc ? dateFrom([`${best.inc.value}|${best.pr?.value ?? 9}`], fake) : {}
  await save(w.id, file, best.img.value, info, {
    id: w.id, name: w.name, title: w.title, ...dt, collection: best.collLabel?.value, mats: [], kind: '', ratio: Number((info.w / info.h).toFixed(3)), regions: w.regions, periods: w.periods, origin: w.origin, aStart: -500, aEnd: 1900,
  })
}

/** Inception → a date safe to show: exact year, decade or century, only when it is precise enough and sensible. */
function dateFrom(inc: string[], a: Artist): { year?: number; label?: string } {
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

fs.writeFileSync(jsonPath, JSON.stringify(out, null, 1))
fs.writeFileSync(credPath, JSON.stringify(credits, null, 2))
console.log(`DONE: ${out.length} extra works in total`)

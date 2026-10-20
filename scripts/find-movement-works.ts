/**
 * Finds example works and "see all" links for every movement, school, style, collective and tradition.
 *
 * 1. Each movement is matched to its Wikidata item (search by name, then checked: not a person, has an English Wikipedia
 *    article, description reads like an art movement, style, school, tradition or similar).
 * 2. Works whose "movement" property (P135) is that item and that have an image (P18) are listed, best known first.
 * 3. Each image is checked on Wikimedia Commons: public domain, CC0, CC BY or CC BY-SA only. A work is kept only when it is
 *    safely out of copyright: made before 1901, or its maker died in 1955 or earlier. Nothing is guessed.
 * 4. Links: English and Greek Wikipedia, the Commons category, and the WikiArt style page only if that page exists.
 *
 * Run: NODE_USE_ENV_PROXY=1 npx tsx scripts/find-movement-works.ts      (slow on purpose, resumable via /tmp/mvworks-cache)
 * Output: src/data/movement-works.json
 */
import fs from 'node:fs'
import { entities } from '../src/data'
import type { MovementLike } from '../src/types'
import { UA, wmFetch } from './wm.mjs'

const CACHE = '/tmp/mvworks-cache'
fs.mkdirSync(CACHE, { recursive: true })
const OUT = new URL('../src/data/movement-works.json', import.meta.url)
const OK = /^(public domain|cc0|cc by(-sa)? [0-9.]+)$/i
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))
const readJson = (p: string, d: any) => (fs.existsSync(p) ? JSON.parse(fs.readFileSync(p, 'utf8')) : d)
const writeJson = (p: string, v: unknown) => fs.writeFileSync(p, JSON.stringify(v))
const slug = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/['’.]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
const enc = encodeURIComponent

const MT = ['tradition', 'movement', 'style', 'school', 'collective']
const movements = entities.filter((e) => MT.includes(e.type)) as MovementLike[]
const nameOf = (m: MovementLike) => m.title.replace(/ \(.*\)$/, '')
console.log(`${movements.length} movements`)

/* ---------- 1. Wikidata item per movement (one SPARQL query per 30 names) ---------- */
const sparqlQ = async (q: string) => {
  for (let i = 0; i < 8; i++) {
    const res = await fetch('https://query.wikidata.org/sparql?' + new URLSearchParams({ query: q }), { headers: { Accept: 'application/sparql-results+json', 'User-Agent': UA } })
    if (res.status === 429 || res.status === 503 || res.status === 502) { const ra = Number(res.headers.get('retry-after')) || 20; console.error(`  sparql ${res.status}, waiting ${ra}s`); await sleep((ra + 2) * 1000); continue }
    if (!res.ok) throw new Error(`sparql ${res.status}`)
    return (await res.json()).results.bindings as any[]
  }
  throw new Error('sparql rate limited')
}
const ARTISH = /art|style|movement|school|tradition|architect|design|paint|sculpt|craft|typograph|photograph|period|culture|genre|group|collective|ceramic|textile|calligraph|print|manuscript|workshop|aesthetic/i
const OVERRIDES: Record<string, string[]> = {
  'style-classical-greek': ['Ancient Greek sculpture'], 'trad-qin-funerary': ['Terracotta Army'], 'trad-maya': ['Maya art'], 'trad-angkor': ['Khmer art', 'Khmer architecture'],
  'trad-islamic-calligraphy': ['Islamic calligraphy'], 'style-song-landscape': ['Chinese landscape painting'], 'trad-benin-court': ['Benin Bronzes'], 'trad-maori-whakairo': ['Māori art'],
  'trad-inka': ['Inca art', 'Inca architecture'], 'style-mughal-painting': ['Mughal painting'], 'style-ukiyo-e': ['Ukiyo-e'], 'mov-renaissance': ['Renaissance art'],
  'style-dutch-golden-age': ['Dutch Golden Age painting'], 'mov-post-impressionism': ['Post-Impressionism'], 'mov-cubism': ['Cubism'], 'mov-surrealism': ['Surrealism'],
  'mov-russian-constructivism': ['Constructivism (art)'], 'trad-egyptian': ['Ancient Egyptian art'], 'trad-ancient-greek': ['Ancient Greek art'], 'style-hellenistic': ['Hellenistic art'],
  'trad-roman': ['Ancient Roman art'], 'trad-etruscan': ['Etruscan art'], 'trad-byzantine': ['Byzantine art'], 'trad-early-christian': ['Early Christian art and architecture'],
  'style-romanesque': ['Romanesque art'], 'style-gothic': ['Gothic art'], 'trad-islamic-art': ['Islamic art'], 'style-chinese-literati': ['Literati painting'],
  'style-persian-miniature': ['Persian miniature'], 'style-rajput': ['Rajput painting'], 'trad-tibetan-buddhist': ['Tibetan art'], 'trad-west-african': ['African art'],
  'trad-aboriginal-australian': ['Indigenous Australian art'], 'style-early-renaissance': ['Early Renaissance'], 'style-northern-renaissance': ['Northern Renaissance'],
  'style-academic-art': ['Academic art'], 'mov-realism': ['Realism (arts)'], 'school-barbizon': ['Barbizon school'], 'mov-neo-impressionism': ['Neo-impressionism'],
  'style-pointillism': ['Pointillism'], 'mov-aesthetic': ['Aestheticism'], 'mov-pictorialism': ['Pictorialism'], 'style-analytical-cubism': ['Analytic cubism'],
  'style-synthetic-cubism': ['Synthetic cubism'], 'style-neo-plasticism': ['Neoplasticism'], 'mov-vorticism': ['Vorticism'], 'mov-metaphysical': ['Metaphysical art'],
  'mov-mexican-muralism': ['Mexican muralism'], 'mov-social-realism': ['Social realism'], 'mov-socialist-realism': ['Socialist realism'],
  'coll-pre-raphaelite-brotherhood': ['Pre-Raphaelite Brotherhood'], 'coll-gutai': ['Gutai group'], 'coll-progressive-artists-group': ["Progressive Artists' Group"],
  'mov-new-typography': ['New Typography'], 'mov-modernist-architecture': ['Modern architecture'], 'mov-functionalism': ['Functionalism (architecture)'],
  'mov-brutalism': ['Brutalist architecture'], 'style-scandinavian-modern': ['Scandinavian design'], 'style-mid-century-modern': ['Mid-century modern'],
  'mov-italian-radical': ['Radical design'], 'mov-deconstructivism': ['Deconstructivism'], 'style-colour-field': ['Color field'], 'mov-nouveau-realisme': ['Nouveau réalisme'],
  'mov-op-art': ['Op art'], 'mov-post-minimalism': ['Postminimalism'], 'style-hard-edge': ['Hard-edge painting'], 'mov-performance-art': ['Performance art'],
  'style-installation-art': ['Installation art'], 'mov-video-art': ['Video art'], 'mov-feminist-art': ['Feminist art'], 'mov-institutional-critique': ['Institutional critique'],
  'mov-photorealism': ['Photorealism'], 'style-hyperrealism': ['Hyperrealism (visual arts)'], 'style-appropriation-art': ['Appropriation (art)'], 'mov-pictures-generation': ['Pictures Generation'],
  'mov-street-art': ['Street art'], 'mov-graffiti-art': ['Graffiti'], 'mov-relational-aesthetics': ['Relational art'], 'mov-socially-engaged': ['Social practice (art)'],
  'style-participatory': ['Participatory art'], 'mov-new-media-art': ['New media art'], 'style-internet-art': ['Internet art'], 'style-digital-art': ['Digital art'],
  'mov-bio-art': ['Bio art'], 'style-interactive-art': ['Interactive art'], 'style-generative-art': ['Generative art'], 'style-ai-art': ['Artificial intelligence art'],
  'mov-sosaku-hanga': ['Sōsaku-hanga'], 'mov-mingei': ['Mingei'], 'mov-minjung': ['Minjung art'], 'mov-chinese-contemporary': ['Contemporary Chinese art'],
  'mov-saqqakhaneh': ['Saqqakhaneh school'], 'mov-hurufiyya': ['Hurufiyya'], 'school-ecole-de-dakar': ['École de Dakar'], 'mov-anthropophagic': ['Anthropophagic Manifesto'],
  'mov-neo-concrete': ['Neo-Concrete Movement'], 'mov-madi': ['Madí'], 'mov-kinetic-art': ['Kinetic art'], 'mov-chicano': ['Chicano art movement'],
  'mov-papunya-tula-movement': ['Papunya Tula'], 'coll-bloomsbury': ['Bloomsbury Group'],
}
const qidPath = `${CACHE}/qids4.json`
const found: Record<string, any> = readJson(qidPath, {})
const esc = (x: string) => x.replace(/\\/g, '\\\\').replace(/"/g, '\\"')
const todoM = movements.filter((m) => !(m.id in found))
for (let i = 0; i < todoM.length; i += 30) {
  const chunk = todoM.slice(i, i + 30)
  const names = [...new Set(chunk.flatMap((m) => [...(OVERRIDES[m.id] ?? []), nameOf(m), ...(m.altNames ?? []).slice(0, 2)]))]
  // Wikidata labels of movements are usually lower case ("cubism"), so each name is tried in both cases, and as an English Wikipedia title
  const forms = [...new Set(names.flatMap((x) => [x, x.charAt(0).toLowerCase() + x.slice(1), x.toLowerCase()]))]
  const sel = `?m ?lbl ?desc ?sl ?wp ?wpEl ?commons`
  const common = `?wpA schema:about ?m ; schema:isPartOf <https://en.wikipedia.org/> ; schema:name ?wp . ?m wikibase:sitelinks ?sl .
    FILTER NOT EXISTS { ?m wdt:P31 wd:Q5 }
    OPTIONAL { ?m schema:description ?desc FILTER(LANG(?desc) = "en") }
    OPTIONAL { ?wpB schema:about ?m ; schema:isPartOf <https://el.wikipedia.org/> ; schema:name ?wpEl }
    OPTIONAL { ?m wdt:P373 ?commons }`
  const rows = [
    ...(await sparqlQ(`SELECT ${sel} WHERE { VALUES ?lbl { ${forms.map((x) => `"${esc(x)}"@en`).join(' ')} } ?m rdfs:label ?lbl . ${common} }`)),
    ...(await sparqlQ(`SELECT ${sel} WHERE { VALUES ?lbl { ${names.map((x) => `"${esc(x)}"@en`).join(' ')} } ?wpA schema:name ?lbl . ${common} }`)),
  ]
  const byLabel = new Map<string, any[]>()
  for (const r of rows) byLabel.set(r.lbl.value.toLowerCase(), [...(byLabel.get(r.lbl.value.toLowerCase()) ?? []), r])
  for (const m of chunk) {
    const trusted = (OVERRIDES[m.id] ?? []).flatMap((x) => byLabel.get(x.toLowerCase()) ?? []).filter((r) => r.wp.value.toLowerCase() === (OVERRIDES[m.id] ?? []).find((x) => x.toLowerCase() === r.lbl.value.toLowerCase())?.toLowerCase())
    const cands = [nameOf(m), ...(m.altNames ?? []).slice(0, 2)].flatMap((x) => byLabel.get(x.toLowerCase()) ?? []).filter((r) => ARTISH.test((r.desc?.value ?? '') + ' ' + r.lbl.value))
    cands.sort((x, y) => Number(y.sl.value) - Number(x.sl.value))
    const c = trusted[0] ?? cands[0]
    found[m.id] = c ? { qid: String(c.m.value).split('/').pop(), label: c.lbl.value, desc: c.desc?.value, wp: c.wp.value, wpEl: c.wpEl?.value, commons: c.commons?.value, exactLabel: c.lbl.value.toLowerCase() === nameOf(m).toLowerCase() } : null
  }
  writeJson(qidPath, found)
  console.log(`  matched ${Math.min(i + 30, todoM.length)}/${todoM.length}`)
  await sleep(2500)
}
const matched = movements.filter((m) => found[m.id])
console.log(`matched to Wikidata: ${matched.length} of ${movements.length} (exact label: ${matched.filter((m) => found[m.id].exactLabel).length})`)
fs.writeFileSync('/tmp/mvworks-matches.txt', movements.map((m) => `${m.id} | ${nameOf(m)} -> ${found[m.id] ? `${found[m.id].qid} ${found[m.id].label} (${found[m.id].desc ?? ''})` : 'NO MATCH'}`).join('\n'))

/* ---------- 2. works with P135 = movement ---------- */
const sparql = sparqlQ
const rawPath = `${CACHE}/raw.json`
const raw: Record<string, any[]> = readJson(rawPath, {})
let n = 0
for (const m of matched) {
  n++
  const f = found[m.id]
  if (f.qid in raw) continue
  const q = `SELECT ?w ?wLabel ?wEl ?img ?inc ?collLabel ?sl ?crLabel ?death WHERE {
    ?w wdt:P135 wd:${f.qid} ; wdt:P18 ?img ; wikibase:sitelinks ?sl .
    OPTIONAL { ?w wdt:P571 ?inc } OPTIONAL { ?w wdt:P195 ?coll } OPTIONAL { ?w rdfs:label ?wEl FILTER(LANG(?wEl) = "el") }
    OPTIONAL { ?w wdt:P170 ?cr . OPTIONAL { ?cr wdt:P570 ?death } }
    SERVICE wikibase:label { bd:serviceParam wikibase:language "en". } } ORDER BY DESC(?sl) LIMIT 80`
  try { raw[f.qid] = await sparql(q) } catch (e) { console.error('  failed', nameOf(m), String(e)); continue }
  writeJson(rawPath, raw)
  if (n % 10 === 0) console.log(`  works ${n}/${matched.length}`)
  await sleep(1500)
}

/* ---------- 3. licence check on Commons ---------- */
const infoPath = `${CACHE}/info.json`
const infos: Record<string, any> = readJson(infoPath, {})
const strip = (h = '') => h.replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#039;/g, "'").replace(/\s+/g, ' ').trim()
const fileOf = (u: string) => decodeURIComponent(u.split('/Special:FilePath/')[1] ?? u.split('/').pop() ?? '').replace(/_/g, ' ')
const yearOf = (s?: string) => { const x = s?.match(/^([+-]?)(\d{1,4})-/); return x ? Number(x[2]) * (x[1] === '-' ? -1 : 1) : undefined }
const safe = (r: any) => {
  const inc = yearOf(r.inc?.value), death = yearOf(r.death?.value)
  return (inc !== undefined && inc <= 1900) || (death !== undefined && death <= 1955)
}
const wanted = new Set<string>()
for (const m of matched) for (const r of raw[found[m.id].qid] ?? []) if (safe(r)) wanted.add(fileOf(r.img.value))
const todo = [...wanted].filter((x) => !(x in infos))
console.log(`files to check: ${todo.length}`)
for (let i = 0; i < todo.length; i += 30) {
  const chunk = todo.slice(i, i + 30)
  const d: any = await wmFetch('https://commons.wikimedia.org/w/api.php?' + new URLSearchParams({
    format: 'json', formatversion: '2', action: 'query', titles: chunk.map((t) => 'File:' + t).join('|'), prop: 'imageinfo', iiprop: 'url|size|mime|extmetadata', iiurlwidth: '720',
  }))
  const byTitle = new Map<string, any>()
  for (const p of d.query?.pages ?? []) byTitle.set((p.title as string).replace(/^File:/, '').replace(/_/g, ' '), p)
  for (const f of chunk) {
    const ii = byTitle.get(f)?.imageinfo?.[0]
    if (!ii) { infos[f] = { missing: true }; continue }
    const x = ii.extmetadata ?? {}
    infos[f] = { w: ii.width, h: ii.height, mime: ii.mime, thumb: ii.thumburl, page: ii.descriptionurl, licence: strip(x.LicenseShortName?.value), by: strip(x.Artist?.value), restr: strip(x.Restrictions?.value), name: strip(x.ObjectName?.value), date: strip(x.DateTimeOriginal?.value) }
  }
  writeJson(infoPath, infos)
  if ((i / 30) % 5 === 0) console.log(`  checked ${Math.min(i + 30, todo.length)}/${todo.length}`)
}


/* ---------- 3b. fallback: public-domain images used in the movement's own Wikipedia article ---------- */
const wpImgPath = `${CACHE}/wpimages.json`
const wpImages: Record<string, string[]> = readJson(wpImgPath, {})
const SKIP_FILE = /logo|icon|flag|map|symbol|diagram|signature|stub|commons-|question|edit|wiki|ambox|oojs|portal|button|arrow|blank|\.svg|\.gif|\.ogg|\.webm|\.pdf|\.tif|chart|graph|timeline|poster|screenshot|album|cover|banner/i
const needImages = matched.filter((m) => !(found[m.id].wp in wpImages))
for (let i = 0; i < needImages.length; i += 8) {
  const chunk = needImages.slice(i, i + 8)
  const titles = chunk.map((m) => found[m.id].wp)
  const acc = new Map<string, string[]>(titles.map((t) => [t, []]))
  let cont: Record<string, string> = {}
  for (let g = 0; g < 6; g++) {
    const d: any = await wmFetch('https://en.wikipedia.org/w/api.php?' + new URLSearchParams({ format: 'json', formatversion: '2', action: 'query', prop: 'images', imlimit: '500', redirects: '1', titles: titles.join('|'), ...cont }))
    const redir = new Map<string, string>((d.query?.redirects ?? []).map((r: any) => [r.to, r.from]))
    for (const pg of d.query?.pages ?? []) {
      const key = acc.has(pg.title) ? pg.title : redir.get(pg.title) ?? pg.title
      acc.set(key, [...(acc.get(key) ?? []), ...(pg.images ?? []).map((x: any) => String(x.title).replace(/^File:/, ''))])
    }
    if (!d.continue) break
    cont = d.continue
  }
  for (const t of titles) wpImages[t] = (acc.get(t) ?? []).filter((f) => /\.(jpe?g|png)$/i.test(f) && !SKIP_FILE.test(f)).slice(0, 30)
  writeJson(wpImgPath, wpImages)
  console.log(`  article images ${Math.min(i + 8, needImages.length)}/${needImages.length}`)
}
const wanted2 = new Set<string>()
for (const m of matched) if ((raw[found[m.id].qid] ?? []).length < 60) for (const f of wpImages[found[m.id].wp] ?? []) wanted2.add(f.replace(/_/g, ' '))
const todo2 = [...wanted2].filter((x) => !(x in infos))
console.log(`article files to check: ${todo2.length}`)
for (let i = 0; i < todo2.length; i += 30) {
  const chunk = todo2.slice(i, i + 30)
  const d: any = await wmFetch('https://commons.wikimedia.org/w/api.php?' + new URLSearchParams({
    format: 'json', formatversion: '2', action: 'query', titles: chunk.map((t) => 'File:' + t).join('|'), prop: 'imageinfo', iiprop: 'url|size|mime|extmetadata', iiurlwidth: '720',
  }))
  const byTitle = new Map<string, any>()
  for (const p of d.query?.pages ?? []) byTitle.set((p.title as string).replace(/^File:/, '').replace(/_/g, ' '), p)
  for (const f of chunk) {
    const ii = byTitle.get(f)?.imageinfo?.[0]
    if (!ii) { infos[f] = { missing: true }; continue }
    const x = ii.extmetadata ?? {}
    infos[f] = { w: ii.width, h: ii.height, mime: ii.mime, thumb: ii.thumburl, page: ii.descriptionurl, licence: strip(x.LicenseShortName?.value), by: strip(x.Artist?.value), restr: strip(x.Restrictions?.value), name: strip(x.ObjectName?.value), date: strip(x.DateTimeOriginal?.value) }
  }
  writeJson(infoPath, infos)
  if ((i / 30) % 5 === 0) console.log(`  checked ${Math.min(i + 30, todo2.length)}/${todo2.length}`)
}

/* ---------- 4. WikiArt style pages that really exist ---------- */
const waPath = `${CACHE}/wikiart.json`
const wa: Record<string, number> = readJson(waPath, {})
const waStatus = async (s: string) => {
  if (s in wa) return wa[s]
  let st = 0
  for (let i = 0; i < 3 && !st; i++) {
    try { const r = await fetch(`https://www.wikiart.org/en/paintings-by-style/${s}`, { headers: { 'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) Chrome/120' }, signal: AbortSignal.timeout(20000) }); await r.body?.cancel(); st = r.status === 429 ? 0 : r.status; if (!st) await sleep(5000) } catch { await sleep(1500) }
  }
  wa[s] = st; writeJson(waPath, wa); await sleep(300); return st
}

/* ---------- 5. assemble ---------- */
const out: Record<string, any> = {}
let withWorks = 0, total = 0
for (const m of movements) {
  const f = found[m.id]
  const links: Record<string, string> = {
    commonsSearch: `https://commons.wikimedia.org/w/index.php?search=${enc(nameOf(m))}&ns6=1&ns14=1`,
  }
  const entry: any = { links }
  if (f) {
    entry.qid = f.qid
    links.wikipedia = `https://en.wikipedia.org/wiki/${enc(f.wp.replace(/ /g, '_'))}`
    if (f.wpEl) links.wikipediaEl = `https://el.wikipedia.org/wiki/${enc(f.wpEl.replace(/ /g, '_'))}`
    if (f.commons) links.commons = `https://commons.wikimedia.org/wiki/Category:${enc(String(f.commons).replace(/ /g, '_'))}`
    for (const s of [...new Set([slug(f.wp.replace(/ \(.*\)$/, '')), slug(nameOf(m))])]) if (s && (await waStatus(s)) === 200) { links.wikiart = `https://www.wikiart.org/en/paintings-by-style/${s}`; break }
    const works: any[] = []
    const seen = new Set<string>(), perMaker: Record<string, number> = {}
    const years = new Map<string, Set<number>>()
    for (const r of raw[f.qid] ?? []) { const y = yearOf(r.inc?.value); if (y && y > 0) years.set(r.w.value, (years.get(r.w.value) ?? new Set()).add(y)) }
    for (const r of raw[f.qid] ?? []) {
      if (!safe(r)) continue
      const file = fileOf(r.img.value), inf = infos[file], title = r.wLabel?.value as string | undefined
      if (!inf || inf.missing || !title || /^Q\d+$/.test(title) || seen.has(r.w.value) || seen.has(file)) continue
      if (!OK.test(inf.licence) || !/^image\/(jpeg|png|webp)$/.test(inf.mime) || inf.restr || (inf.w ?? 0) < 500) continue
      const maker = r.crLabel?.value ?? '?'
      if ((perMaker[maker] ?? 0) >= 3) continue
      perMaker[maker] = (perMaker[maker] ?? 0) + 1
      seen.add(r.w.value); seen.add(file)
      const ys = years.get(r.w.value), yr = ys && ys.size === 1 ? [...ys][0] : undefined
      works.push({
        t: title, ...(r.wEl && r.wEl.value !== title ? { tEl: r.wEl.value } : {}), ...(yr ? { y: String(yr) } : {}),
        ...(maker !== '?' && !/^Q\d+$/.test(maker) ? { a: maker } : {}),
        ...(r.collLabel && !/^Q\d+$/.test(r.collLabel.value) && !/^https?:/.test(r.collLabel.value) ? { c: r.collLabel.value } : {}),
        f: file, th: inf.thumb, p: inf.page, l: inf.licence, r: Number((inf.w / inf.h).toFixed(3)), ...(/^public domain$/i.test(inf.licence) ? {} : { by: inf.by }),
      })
      if (works.length >= 12) break
    }
    // fallback: images from the movement's Wikipedia article that Commons marks public domain, filled up to twelve
    const perMaker2: Record<string, number> = {}
    for (const file0 of wpImages[f.wp] ?? []) {
      if (works.length >= 12) break
      const file = file0.replace(/_/g, ' '), inf = infos[file]
      if (!inf || inf.missing || seen.has(file) || !/^(public domain|cc0)$/i.test(inf.licence) || !/^image\/(jpeg|png)$/.test(inf.mime) || inf.restr || (inf.w ?? 0) < 600) continue
      const base = file.replace(/\.[a-z]+$/i, '')
      // The Commons "artist" and date of a photograph are the photographer and the day it was taken, so neither is shown. A maker is
      // used only when the file name follows the Commons convention "Maker - Title".
      const parts = base.split(' - ')
      const maker = parts.length >= 2 && parts[0].length <= 40 && !/\d|museum|gallery|collection|photo|file|wikimedia/i.test(parts[0]) ? parts[0] : undefined
      const rawTitle = inf.name && inf.name.length > 2 && inf.name.length < 110 && !/^(file|img|dsc)/i.test(inf.name) ? inf.name : (maker ? parts.slice(1).join(' - ') : base)
      const nm = rawTitle.replace(/_/g, ' ').trim()
      if (/^(dsc|img|p\d|\d)|\d{4,}\s*$|^[^a-z]*$/i.test(nm) || nm.length < 4) continue
      if (maker && (perMaker2[maker] ?? 0) >= 2) continue
      if (maker) perMaker2[maker] = (perMaker2[maker] ?? 0) + 1
      seen.add(file)
      works.push({ t: nm, ...(maker ? { a: maker } : {}), f: file, th: inf.thumb, p: inf.page, l: inf.licence, r: Number((inf.w / inf.h).toFixed(3)) })
    }
    if (works.length) { entry.works = works; withWorks++; total += works.length }
  }
  out[m.id] = entry
}
fs.writeFileSync(OUT, JSON.stringify(out))
console.log(`DONE: ${Object.keys(out).length} movements; ${withWorks} with works (${total} works); WikiArt pages: ${Object.values(out).filter((e: any) => e.links.wikiart).length}`)

// Downloads the portraits chosen by find-portraits.ts, shrinks them to avatar size, and records credits.
// Output: src/assets/portraits/<artist-id>.jpg  and  src/data/portrait-credits.json
// Run: NODE_USE_ENV_PROXY=1 node scripts/fetch-portraits.mjs
import crypto from 'node:crypto'
import fs from 'node:fs'
import { execFileSync } from 'node:child_process'
import { wmFetch } from './wm.mjs'

const picks = JSON.parse(fs.readFileSync(new URL('./portrait-picks.json', import.meta.url), 'utf8'))
const credPath = new URL('../src/data/portrait-credits.json', import.meta.url)
const credits = fs.existsSync(credPath) ? JSON.parse(fs.readFileSync(credPath, 'utf8')) : {}
const dir = new URL('../src/assets/portraits/', import.meta.url)
fs.mkdirSync(dir, { recursive: true })
fs.mkdirSync('/tmp/portrait-raw', { recursive: true })
const exclude = JSON.parse(fs.readFileSync(new URL('./portrait-exclude.json', import.meta.url), 'utf8'))
const OLD = 'Painted, drawn or printed likeness. It may be a self-portrait, a portrait from the artist’s lifetime or a later image; see the source page.'
const OK = /^(public domain|cc0|cc by(-sa)? [0-9.]+)$/i

const thumbUrl = (file, w) => {
  const name = file.replace(/ /g, '_')
  const h = crypto.createHash('md5').update(name).digest('hex')
  const enc = encodeURIComponent(name).replace(/'/g, '%27').replace(/\(/g, '%28').replace(/\)/g, '%29')
  const ext = /\.(tiff?|png|webp)$/i.test(name) ? '.png' : ''
  return `https://upload.wikimedia.org/wikipedia/commons/thumb/${h[0]}/${h.slice(0, 2)}/${enc}/${w}px-${enc}${ext}`
}

let n = 0
for (const [id, p] of Object.entries(picks)) {
  const out = new URL(`${id}.jpg`, dir)
  if (id in exclude) { if (fs.existsSync(out)) fs.unlinkSync(out); if (credits[id]) { delete credits[id]; fs.writeFileSync(credPath, JSON.stringify(credits, null, 2)) } continue }
  if (fs.existsSync(out) && credits[id]) continue
  if (!OK.test(p.licence)) { console.log('SKIP (licence)', id, p.licence); continue }
  const raw = `/tmp/portrait-raw/${id}.img`
  try {
    if (!fs.existsSync(raw)) fs.writeFileSync(raw, await wmFetch(thumbUrl(p.file, 500), { binary: true }))
    // top-weighted crop: portraits are used in landscape and square frames, faces sit near the top
    const dims = execFileSync('python3', ['-I', '-c', `
import sys
from PIL import Image
im = Image.open(sys.argv[1]).convert('RGB')
w, h = im.size
tw = 360
im = im.resize((tw, round(h * tw / w)), Image.LANCZOS)
im.save(sys.argv[2], 'JPEG', quality=74, optimize=True, progressive=True)
print(im.size[0], im.size[1])
`, raw, out.pathname]).toString().trim().split(' ').map(Number)
    const pd = /public domain|cc0/i.test(p.licence)
    const name = p.file.replace(/ /g, '_')
    credits[id] = {
      file: p.file,
      credit: pd ? `${p.artist}, via Wikimedia Commons` : `${p.artist} (${p.licence}), via Wikimedia Commons`,
      licence: pd ? p.licence : `${p.licence}. Attribution required${/sa/i.test(p.licence) ? '; share-alike applies to adaptations' : ''}.`,
      page: `https://commons.wikimedia.org/wiki/File:${encodeURIComponent(name)}`,
      ratio: Number((dims[0] / dims[1]).toFixed(3)),
      ...(p.note ? { note: p.note } : p.born && p.born < 1840 ? { note: OLD } : {}),
    }
    fs.writeFileSync(credPath, JSON.stringify(credits, null, 2))
    n++
    console.log('OK', id, `${(fs.statSync(out).size / 1024).toFixed(0)} KB`)
  } catch (e) { console.log('ERROR', id, e.message) }
}
console.log('done', n)

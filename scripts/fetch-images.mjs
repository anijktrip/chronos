// Downloads the picked Wikimedia Commons images into src/assets/art/<artwork-id>.jpg and records credits in
// src/data/image-credits.json. Licence and author come from image-picks.json (copied from each file's Commons
// page when picked), so the only requests made are the image downloads themselves, kept slow on purpose.
// Run: NODE_USE_ENV_PROXY=1 node scripts/fetch-images.mjs
import crypto from 'node:crypto'
import fs from 'node:fs'
import { wmFetch } from './wm.mjs'

const picks = JSON.parse(fs.readFileSync(new URL('./image-picks.json', import.meta.url), 'utf8'))
const credPath = new URL('../src/data/image-credits.json', import.meta.url)
const credits = fs.existsSync(credPath) ? JSON.parse(fs.readFileSync(credPath, 'utf8')) : {}
const OK = /^(public domain|cc0|cc by(-sa)? [0-9.]+)$/i

const thumbUrl = (file, w) => {
  const name = file.replace(/ /g, '_')
  const h = crypto.createHash('md5').update(name).digest('hex')
  const enc = encodeURIComponent(name).replace(/'/g, '%27')
  const ext = /\.(tiff?|png)$/i.test(name) ? '.png' : ''
  return `https://upload.wikimedia.org/wikipedia/commons/thumb/${h[0]}/${h.slice(0, 2)}/${enc}/${w}px-${enc}${ext}`
}

for (const [id, p] of Object.entries(picks)) {
  const out = new URL(`../src/assets/art/${id}.jpg`, import.meta.url)
  if (fs.existsSync(out)) continue
  if (!OK.test(p.licence)) { console.log('SKIP (licence)', id, p.licence); continue }
  try {
    const buf = await wmFetch(thumbUrl(p.file, 1280), { binary: true })
    fs.writeFileSync(out, buf)
    const pd = /public domain|cc0/i.test(p.licence)
    const name = p.file.replace(/ /g, '_')
    credits[id] = {
      file: p.file,
      credit: pd ? `${p.artist}, via Wikimedia Commons` : `Photo: ${p.artist} (${p.licence}), via Wikimedia Commons`,
      licence: pd ? `${p.licence}. Reproduction of a public-domain work.` : `${p.licence}. Attribution required${/sa/i.test(p.licence) ? '; share-alike applies to adaptations' : ''}.`,
      page: `https://commons.wikimedia.org/wiki/File:${encodeURIComponent(name)}`,
    }
    fs.writeFileSync(credPath, JSON.stringify(credits, null, 2))
    console.log('OK', id, `${(buf.length / 1024).toFixed(0)} KB`)
  } catch (e) { console.log('ERROR', id, e.message) }
}
console.log('done')

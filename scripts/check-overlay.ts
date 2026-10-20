/**
 * Validates a Greek overlay against the English data.
 *   npx tsx scripts/check-overlay.ts <overlay-module> <exportName> <entities|relationships|questions|quizzes|paths|objectives|sources|regions> [--complete]
 * Fails on: unknown ids, keys that do not exist in the English record, array length mismatches (string arrays),
 * Latin-only text where Greek is expected (warn), and (with --complete) English records that have no overlay.
 */
import path from 'node:path'
import { entities, relationships, questions, quizzes, paths, objectives, sources, regions } from '../src/data'
import { entities as _unused } from '../src/data'
void _unused
const [mod, exp, kind, flag] = process.argv.slice(2)
const overlay = (await import(path.resolve(mod)))[exp] as Record<string, any>
const base: Record<string, any[]> = { entities, relationships, questions, quizzes, paths, objectives, sources, regions }
// NB: this reads the data in English because the script runs with no stored language.
const list = base[kind] as any[]
const byId = new Map(list.map((x) => [x.id, x]))
let bad = 0, greekless = 0
const err = (m: string) => { bad++; if (bad <= 40) console.log('ERR ', m) }
const walk = (id: string, en: any, el: any, p: string) => {
  if (el === undefined) return
  if (Array.isArray(el)) {
    if (!Array.isArray(en)) return err(`${id} ${p}: overlay has an array, English does not`)
    if (typeof el[0] === 'string' || el.length === 0) { if (el.length !== en.length) err(`${id} ${p}: ${el.length} items vs ${en.length} in English`) }
    else el.forEach((x, i) => { if (x !== undefined && x !== null) walk(id, en[i], x, `${p}[${i}]`) ; if (i >= en.length) err(`${id} ${p}[${i}] has no English counterpart`) })
  } else if (el && typeof el === 'object') {
    if (!en || typeof en !== 'object') return err(`${id} ${p}: overlay object where English has ${typeof en}`)
    for (const k of Object.keys(el)) { if (!(k in en)) err(`${id} ${p}.${k}: key does not exist in English`); else walk(id, en[k], el[k], `${p}.${k}`) }
  } else if (typeof el === 'string' && typeof en === 'string' && el.length > 25 && !/[Ά-ώ]/.test(el)) greekless++
}
for (const [id, el] of Object.entries(overlay)) {
  const en = byId.get(id)
  if (!en) { err(`unknown id ${id}`); continue }
  walk(id, en, el, '')
}
const missing = list.filter((x) => !(x.id in overlay)).length
console.log(`${Object.keys(overlay).length} overlays, ${bad} errors, ${greekless} long strings with no Greek letters, ${missing} English records without an overlay`)
if (bad || (flag === '--complete' && missing)) process.exit(1)

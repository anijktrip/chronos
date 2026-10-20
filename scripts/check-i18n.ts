/** Lists t('…') keys in the given files that have no Greek entry: npx tsx scripts/check-i18n.ts src/pages/Home.tsx … */
import fs from 'node:fs'
import { el } from '../src/i18n/el'
let missing = 0
for (const f of process.argv.slice(2)) {
  const src = fs.readFileSync(f, 'utf8')
  const re = /\bt\(\s*(?:'((?:[^'\\]|\\.)*)'|"((?:[^"\\]|\\.)*)"|`((?:[^`\\]|\\.)*)`)/g
  for (const m of src.matchAll(re)) {
    const raw = m[1] ?? m[2] ?? m[3]
    const key = raw.replace(/\\(['"`\\])/g, '$1').replace(/\\n/g, '\n')
    if (!(key in el)) { missing++; console.log(`${f}: ${JSON.stringify(key)}`) }
  }
}
console.log(missing ? `${missing} missing` : 'all keys translated')

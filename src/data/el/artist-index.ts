/**
 * Greek overlay for the index-level artist records, computed from the English record: names come from
 * ./artist-names, the generated subtitle / summary / origin are rebuilt from term dictionaries, and the
 * per-artist notes are looked up in i18n/el/terms.
 */
import { dateLabel } from '@/i18n'
import { artistNotes, places, roles } from '@/i18n/el/terms'
import { indexArtists } from '../artist-index'
import { artistNamesEl } from './artist-names'

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1)

const join = (xs: string[]) => (xs.length < 2 ? xs.join('') : `${xs.slice(0, -1).join(', ')} και ${xs[xs.length - 1]}`)

/** "Painter, printmaker and poet" → "Ζωγράφος, χαράκτρια και ποιήτρια" (feminine forms for women). */
function role(en: string, woman: boolean): string {
  const pick = (k: string) => { const r = roles[k.toLowerCase()]; return r ? (woman && r[1]) || r[0] : undefined }
  const whole = pick(en)
  if (whole) return cap(whole)
  const parts = en.split(/, | and /)
  const out = parts.map((p) => pick(p) ?? p)
  return cap(join(out))
}

/** "Italy / France" → "Ιταλία / Γαλλία". */
const place = (en: string) => places[en] ?? en.split(' / ').map((p) => places[p] ?? p).join(' / ')

export const artistIndexEl: Record<string, Record<string, unknown>> = Object.fromEntries(indexArtists.map((a) => {
  const woman = a.gender === 'woman'
  const origin = a.originLabel ? place(a.originLabel) : undefined
  const r = role(a.subtitle?.split(' · ')[0] ?? '', woman)
  const date = a.dates.label ? dateLabel(a.dates.label) : ''
  const o: Record<string, unknown> = {}
  if (artistNamesEl[a.id]) o.title = artistNamesEl[a.id]
  if (a.subtitle) o.subtitle = origin ? `${r} · ${origin}` : r
  if (origin) o.originLabel = origin
  o.summary = /^.+\. .+\. .+\.$/.test(a.summary) ? `${r}. ${origin ?? ''}. ${date}.` : (artistNotes[a.summary] ?? a.summary)
  if (a.flags?.length) o.flags = a.flags.map((f) => artistNotes[f] ?? f)
  return [a.id, o]
}))

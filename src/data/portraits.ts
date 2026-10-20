import type { Artist } from '@/types'
import { localPortrait } from '@/lib/localImages'
import credits from './portrait-credits.json'

type Credit = { file: string; credit: string; licence: string; page: string; ratio: number; note?: string }

/**
 * Portrait overlay: an artist gets a portrait only if a bundled, licence-checked file exists
 * (src/assets/portraits/<artist-id>.jpg) with a credit record. Nothing is ever shown as a stand-in face.
 * Files are chosen by scripts/find-portraits.ts, which verifies identity against Wikidata before accepting.
 */
/** Commons "artist" fields sometimes carry template residue ("AnonymousUnknown author circa 1915date QS:P…"); keep only the attribution. */
function tidyCredit(c: string): string {
  const [by, ...rest] = c.split(/, via /)
  let who = by.replace(/\s*(?:circa )?\d*date QS:P.*$/i, '').replace(/^Anonymous(?:\s*\([^)]*\))?\s*Unknown author.*$/i, 'Unknown author')
  who = who.replace(/(\))(Unknown author)/, '$1 $2').trim()
  return [who, ...rest].join(', via ')
}

export const portraitOverlays: Record<string, Partial<Artist>> = {}
for (const [id, c] of Object.entries(credits as Record<string, Credit>)) {
  const src = localPortrait(id)
  if (!src) continue
  portraitOverlays[id] = {
    portrait: {
      src, commonsFile: c.file, alt: '', credit: tidyCredit(c.credit), licence: c.licence, ratio: c.ratio, page: c.page, note: c.note,
    },
  }
}

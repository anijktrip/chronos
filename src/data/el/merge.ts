/**
 * Greek overlays are partial records keyed by id. They are merged over the English record at load time:
 * objects merge key by key, arrays of objects merge index by index (so `lifeEvents: [{ label }]` keeps the years),
 * and arrays of strings (and everything else) are replaced as a whole.
 */
type Json = unknown
const isObj = (v: Json): v is Record<string, Json> => !!v && typeof v === 'object' && !Array.isArray(v)

export function merge<T>(base: T, over: Json): T {
  if (over === undefined) return base
  if (Array.isArray(base) && Array.isArray(over)) {
    if (base.length && isObj(base[0])) return base.map((b, i) => (over[i] === undefined ? b : merge(b, over[i]))) as unknown as T
    return over as unknown as T
  }
  if (isObj(base) && isObj(over)) {
    const out: Record<string, Json> = { ...base }
    for (const k of Object.keys(over)) out[k] = merge(base[k], over[k])
    return out as T
  }
  return over as T
}

/** Apply an id-keyed overlay map to a list; items without an overlay pass through untouched. */
export function localize<T extends { id: string }>(list: T[], map: Record<string, Json>): T[] {
  return list.map((x) => (map[x.id] ? merge(x, map[x.id]) : x))
}

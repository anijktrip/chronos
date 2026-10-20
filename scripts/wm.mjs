// Polite Wikimedia client: descriptive User-Agent, one request at a time, honours Retry-After on 429.
export const UA = 'ChronosArtHistoryPrototype/0.1 (https://github.com/anijktrip/test-claude; educational prototype)'
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
let last = 0
export async function wmFetch(url, { binary = false, tries = 8 } = {}) {
  for (let i = 0; i < tries; i++) {
    const wait = Math.max(0, last + 1500 - Date.now())
    if (wait) await sleep(wait)
    last = Date.now()
    const res = await fetch(url, { headers: { 'User-Agent': UA, 'Api-User-Agent': UA } })
    if (res.status === 429 || res.status === 503) {
      const ra = Number(res.headers.get('retry-after')) || 20
      console.error(`  ${res.status} — waiting ${ra}s`)
      await sleep((ra + 2) * 1000)
      continue
    }
    if (!res.ok) throw new Error(`${res.status} ${url}`)
    return binary ? Buffer.from(await res.arrayBuffer()) : res.json()
  }
  throw new Error('rate limited too long: ' + url)
}
export const api = (params) => wmFetch('https://commons.wikimedia.org/w/api.php?' + new URLSearchParams({ format: 'json', formatversion: '2', ...params }))
export const strip = (h = '') => h.replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#039;/g, "'").replace(/\s+/g, ' ').trim()
export async function info(titles) {
  const d = await api({ action: 'query', titles: titles.map((t) => 'File:' + t).join('|'), prop: 'imageinfo', iiprop: 'url|size|mime|extmetadata', iiurlwidth: '1600' })
  return d.query.pages.map((p) => {
    if (!p.imageinfo) return { title: p.title, missing: true }
    const i = p.imageinfo[0], m = i.extmetadata || {}
    return { title: p.title.replace(/^File:/, ''), w: i.width, h: i.height, mime: i.mime, thumb: i.thumburl, page: i.descriptionurl,
      licence: strip(m.LicenseShortName?.value), artist: strip(m.Artist?.value), credit: strip(m.Credit?.value), usage: strip(m.UsageTerms?.value), restr: strip(m.Restrictions?.value) }
  })
}

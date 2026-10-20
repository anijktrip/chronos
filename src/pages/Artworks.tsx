import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import type { Artwork } from '@/types'
import { artistsOfArtwork, entityPath, getArtworks, getEntity, getRegions, movementsOfArtwork, regionName, similarArtworks } from '@/lib/repo'
import { FilterLayout } from '@/components/ui/FilterLayout'
import { ArtworkImage } from '@/components/ui/ArtworkImage'
import { useDocumentTitle } from '@/components/ui/hooks'
import { Breadcrumbs, EmptyState, PageHeader } from '@/components/ui/Page'
import { Reveal } from '@/components/ui/Reveal'
import { facetOptions, search } from '@/lib/search'
import { findPath } from '@/lib/graph'
import { dateLabel, t } from '@/i18n'
import type { RegionId } from '@/types'

export function ArtworksPage() {
  useDocumentTitle(t('Artwork collection'))
  const [sp, setSp] = useSearchParams()
  const region = sp.get('region') as RegionId | null
  const medium = sp.get('medium')
  const movement = sp.get('movement')
  const order = sp.get('order') === 'date' ? 'date' : 'mixed'
  const set = (k: string, v: string | null) => { const n = new URLSearchParams(sp); if (v) n.set(k, v); else n.delete(k); setSp(n, { replace: true }) }
  const filtered = !!(region || medium || movement)
  const f = facetOptions()
  const usedMovements = f.movements.filter((m) => getArtworks().some((a) => movementsOfArtwork(a.id).some((x) => x.id === m.id)))

  const list = useMemo(() => getArtworks()
    .filter((a) => (!region || a.regions.includes(region)) && (!medium || a.mediums.includes(medium)) && (!movement || movementsOfArtwork(a.id).some((m) => m.id === movement)))
    .sort((a, b) => a.dates.start - b.dates.start), [region, medium, movement])
  // "mixed": take one work per maker in turn (each maker's own works stay in date order), so no maker fills the page
  const shown = useMemo(() => {
    if (order === 'date') return list
    const groups = new Map<string, Artwork[]>()
    for (const w of list) groups.set(w.attribution, [...(groups.get(w.attribution) ?? []), w])
    const queues = [...groups.values()]
    const mixed: Artwork[] = []
    for (let i = 0; mixed.length < list.length; i++) for (const q of queues) if (q[i]) mixed.push(q[i])
    return mixed
  }, [list, order])

  return (
    <>
      <Breadcrumbs items={[{ label: t('Artworks') }]} />
      <PageHeader eyebrow={t('Artworks · {n} shown', { n: list.length })} title={t('The collection')} intro={t('Specific works, shown as large as the source allows, with their makers, dates, materials and the reasons they look the way they do.')}>
        <Link to="/artworks/compare" className="btn btn-ghost">{t('Compare two works')}</Link>
      </PageHeader>
      <div className="page-x pb-20">
        <FilterLayout id="a-filters" filtered={filtered} panel={
          <div className="space-y-5">
            <div>
              <p className="label mb-2">{t('Region')}</p>
              <div role="group" aria-label={t('Region')} className="flex flex-wrap gap-1.5">
                <button type="button" className="chip" aria-pressed={!region} onClick={() => set('region', null)}>{t('All regions')}</button>
                {getRegions().filter((r) => getArtworks().some((a) => a.regions.includes(r.id))).map((r) => (
                  <button key={r.id} type="button" className="chip" aria-pressed={region === r.id} onClick={() => set('region', region === r.id ? null : r.id)}>{r.short}</button>
                ))}
              </div>
            </div>
            <div>
              <label htmlFor="a-order" className="label mb-1.5 block">{t('Order')}</label>
              <select id="a-order" className="field" value={order} onChange={(e) => set('order', e.target.value === 'date' ? 'date' : null)}>
                <option value="mixed">{t('Mixed: a variety of makers')}</option>
                <option value="date">{t('By date')}</option>
              </select>
            </div>
            <div>
              <label htmlFor="a-medium" className="label mb-1.5 block">{t('Medium')}</label>
              <select id="a-medium" className="field" value={medium ?? ''} onChange={(e) => set('medium', e.target.value || null)}>
                <option value="">{t('Any medium')}</option>
                {[...new Set(getArtworks().flatMap((a) => a.mediums))].sort().map((m) => <option key={m}>{m}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="a-movement" className="label mb-1.5 block">{t('Movement or tradition')}</label>
              <select id="a-movement" className="field" value={movement ?? ''} onChange={(e) => set('movement', e.target.value || null)}>
                <option value="">{t('Any')}</option>
                {usedMovements.map((m) => <option key={m.id} value={m.id}>{m.title}</option>)}
              </select>
            </div>
            {filtered && (
              <div className="flex flex-wrap gap-1.5 border-t border-rule pt-4">
                <button type="button" className="chip" onClick={() => setSp(new URLSearchParams(), { replace: true })}>{t('Clear filters')}</button>
              </div>
            )}
          </div>
        }>
        <div aria-live="polite" className="sr-only">{list.length === 1 ? t('1 result') : t('{n} results', { n: list.length })}</div>
        {list.length === 0 ? <EmptyState title={t('No works match those filters')} /> : (
          <div className="columns-1 gap-5 sm:columns-2 min-[1500px]:columns-3 [&>*]:mb-5 [&>*]:break-inside-avoid">
            {shown.map((a, i) => (
              <Reveal key={a.id} delay={Math.min(i, 6) * 40}>
                <Link to={entityPath(a)} className="group card-hover block border border-rule bg-surface">
                  <div className="img-zoom overflow-hidden"><ArtworkImage artwork={a} width={800} /></div>
                  <div className="p-4">
                    <p className="font-serif text-2xl leading-tight">{a.title}</p>
                    <p className="mt-1 text-sm text-muted">{a.attribution}</p>
                    <p className="text-sm text-muted">{dateLabel(a.dateDisplay)} · {regionName(a.regions[0])}</p>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        )}
        </FilterLayout>
      </div>
    </>
  )
}

/* ------------------------------------------------------------------ */
/* Compare                                                             */
/* ------------------------------------------------------------------ */

type Side =
  | { kind: 'work'; work: Artwork }
  | { kind: 'custom'; src: string; fileName: string; title: string; artist: string; date: string; medium: string }

const norm = (x: string) => x.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()

/** Find known artworks from free text (a title, an artist, or a file name such as "great-wave-hokusai.jpg"). */
function matchWorks(text: string, limit = 5): Artwork[] {
  const q = norm(text).replace(/\.[a-z0-9]{2,4}$/, '').replace(/[_\-.]+/g, ' ').replace(/\b(img|image|photo|jpe?g|png|copy|final|\d{3,})\b/g, ' ').trim()
  if (!q) return []
  const hits = search({ q, types: ['artwork'], regions: [] }).map((r) => r.entity as Artwork)
  if (hits.length) return hits.slice(0, limit)
  // file names rarely match every word: fall back to any single word
  const seen = new Map<string, number>()
  for (const w of q.split(/\s+/).filter((x) => x.length > 2)) for (const r of search({ q: w, types: ['artwork'], regions: [] })) seen.set(r.entity.id, (seen.get(r.entity.id) ?? 0) + 1)
  return [...seen.entries()].sort((a, b) => b[1] - a[1]).slice(0, limit).map(([id]) => getArtworks().find((w) => w.id === id) as Artwork)
}

/** Which picker a pasted picture goes to: the one last hovered or focused (the first one before any interaction). */
let activePicker = ''
const mountedPickers = new Set<string>()

const imageFrom = (data: DataTransfer | null): File | undefined =>
  Array.from(data?.files ?? []).find((f) => f.type.startsWith('image/')) ?? Array.from(data?.items ?? []).find((i) => i.kind === 'file' && i.type.startsWith('image/'))?.getAsFile() ?? undefined

function Picker({ label, onPick, onCustom }: { label: string; onPick: (w: Artwork) => void; onCustom: (s: Extract<Side, { kind: 'custom' }>) => void }) {
  const [q, setQ] = useState('')
  const [over, setOver] = useState(false)
  const [suggest, setSuggest] = useState<{ file: string; works: Artwork[] } | null>(null)
  const input = useRef<HTMLInputElement>(null)
  const file = useRef<HTMLInputElement>(null)
  const results = useMemo(() => (q.trim() ? matchWorks(q) : []), [q])
  const id = `pick-${label}`

  const [pasteMsg, setPasteMsg] = useState('')
  const takeFile = (f?: File) => {
    if (!f) return
    setPasteMsg('')
    if (!f.type.startsWith('image/')) { setSuggest({ file: t('“{name}” is not an image file.', { name: f.name }), works: [] }); return }
    const src = URL.createObjectURL(f)
    const base = f.name.replace(/\.[^.]+$/, '')
    const works = matchWorks(f.name, 3)
    onCustom({ kind: 'custom', src, fileName: f.name, title: base.replace(/[_-]+/g, ' ').trim(), artist: '', date: '', medium: '' })
    setSuggest(works.length ? { file: f.name, works } : null)
  }

  // Ctrl/⌘+V anywhere on the page puts a copied picture into this picker while it is the active one
  const take = useRef(takeFile)
  take.current = takeFile
  useEffect(() => {
    mountedPickers.add(label)
    const onPaste = (e: ClipboardEvent) => {
      const f = imageFrom(e.clipboardData)
      if (!f || (mountedPickers.has(activePicker) ? activePicker : [...mountedPickers][0]) !== label) return
      e.preventDefault()
      take.current(f.name === 'image.png' || !f.name ? new File([f], `pasted-picture.${(f.type.split('/')[1] || 'png').replace('jpeg', 'jpg')}`, { type: f.type }) : f)
    }
    document.addEventListener('paste', onPaste)
    return () => { document.removeEventListener('paste', onPaste); mountedPickers.delete(label); if (activePicker === label) activePicker = '' }
  }, [label])

  // the button reads the clipboard directly where the browser allows it; otherwise it explains the shortcut
  const pasteFromClipboard = async () => {
    activePicker = label
    try {
      for (const item of await navigator.clipboard.read()) {
        const type = item.types.find((x) => x.startsWith('image/'))
        if (type) { const blob = await item.getType(type); takeFile(new File([blob], `pasted-picture.${type.split('/')[1].replace('jpeg', 'jpg')}`, { type })); return }
      }
      setPasteMsg(t('There is no picture on the clipboard. Copy one first, then press Ctrl+V (⌘+V on a Mac).'))
    } catch { setPasteMsg(t('Press Ctrl+V (⌘+V on a Mac) to paste a copied picture.')) }
  }

  return (
    <div
      onPointerEnter={() => { activePicker = label }} onFocusCapture={() => { activePicker = label }}
      onDragOver={(e) => { e.preventDefault(); setOver(true) }} onDragLeave={() => setOver(false)}
      onDrop={(e) => { e.preventDefault(); setOver(false); takeFile(imageFrom(e.dataTransfer) ?? e.dataTransfer.files?.[0]) }}
      className={`rounded-3xl p-5 transition-colors sm:p-7 ${over ? 'bg-lean/20 ring-2 ring-lean' : 'bg-surface'}`}
    >
      <p className="font-display text-2xl">{label}</p>
      <label htmlFor={id} className="label mt-4 block">{t('Type an artwork or an artist')}</label>
      <div className="relative mt-1.5">
        <input id={id} ref={input} className="field" value={q} onChange={(e) => setQ(e.target.value)} placeholder={t('e.g. Starry Night, Hokusai, mughal…')} autoComplete="off"
          onKeyDown={(e) => { if (e.key === 'Enter' && results[0]) onPick(results[0]) }} role="combobox" aria-expanded={results.length > 0} aria-controls={`${id}-list`} />
        {q.trim() && (
          <ul id={`${id}-list`} role="listbox" aria-label={t('Matching artworks')} className="mt-2 overflow-hidden rounded-2xl bg-paper shadow-[0_8px_30px_-10px_rgba(0,0,0,.25)]">
            {results.length === 0 && <li className="px-4 py-3 text-sm text-muted">{t('No artwork in the dataset matches “{q}”. Drop or paste a picture of it instead.', { q })}</li>}
            {results.map((w) => (
              <li key={w.id} role="option" aria-selected={false}>
                <button type="button" onClick={() => onPick(w)} className="flex w-full items-baseline justify-between gap-4 px-4 py-3 text-left hover:bg-surface">
                  <span className="font-display text-lg leading-tight">{w.title}</span><span className="shrink-0 text-xs text-muted">{w.attribution.split(' (')[0]} · {dateLabel(w.dateDisplay.split(';')[0]).slice(0, 22)}</span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="my-5 flex items-center gap-3 text-xs text-muted"><span className="h-px flex-1 bg-rule" />{t('or')}<span className="h-px flex-1 bg-rule" /></div>

      <button type="button" onClick={() => file.current?.click()} className="flex min-h-[8.5rem] w-full flex-col items-center justify-center gap-1 rounded-2xl border-2 border-dashed border-rule bg-paper px-4 text-center transition-colors hover:border-ink">
        <span className="font-display text-lg">{t('Drop or paste a picture here')}</span>
        <span className="text-sm text-muted">{t('or choose a file. It stays in your browser and is never uploaded.')}</span>
      </button>
      <button type="button" onClick={pasteFromClipboard} className="chip mt-3">{t('Paste a copied picture')} <kbd className="text-xs text-muted">Ctrl+V</kbd></button>
      {pasteMsg && <p className="mt-2 text-sm text-muted" role="status">{pasteMsg}</p>}
      <input ref={file} type="file" accept="image/*" className="sr-only" aria-label={t('Choose an image file for {label}', { label })} onChange={(e) => { takeFile(e.target.files?.[0]); e.target.value = '' }} />
      {suggest && suggest.works.length === 0 && <p className="mt-3 text-sm text-tradition" role="status">{suggest.file}</p>}
    </div>
  )
}

export function ComparePage() {
  useDocumentTitle(t('Compare artworks'))
  const works = getArtworks().sort((x, y) => x.dates.start - y.dates.start)
  const [sp, setSp] = useSearchParams()
  const byId = (id: string | null) => works.find((w) => w.id === id)
  const [A, setA] = useState<Side | null>(() => { const w = byId(sp.get('a')) ?? byId('art-great-wave'); return w ? { kind: 'work', work: w } : null })
  const [B, setB] = useState<Side | null>(() => { const w = byId(sp.get('b')) ?? byId('art-travelers'); return w ? { kind: 'work', work: w } : null })
  const [hint, setHint] = useState<{ side: 'a' | 'b'; works: Artwork[]; file: string } | null>(null)

  // keep the URL shareable for known works only; dropped pictures never leave the browser
  const write = (a: Side | null, b: Side | null) => {
    const n = new URLSearchParams()
    if (a?.kind === 'work') n.set('a', a.work.id)
    if (b?.kind === 'work') n.set('b', b.work.id)
    setSp(n, { replace: true })
  }
  const setSide = (side: 'a' | 'b', v: Side | null) => {
    const prev = side === 'a' ? A : B
    if (prev?.kind === 'custom' && prev.src !== (v?.kind === 'custom' ? v.src : '')) URL.revokeObjectURL(prev.src)
    if (side === 'a') { setA(v); write(v, B) } else { setB(v); write(A, v) }
  }
  useEffect(() => () => { [A, B].forEach((s) => s?.kind === 'custom' && URL.revokeObjectURL(s.src)) }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const meta = (s: Side) => s.kind === 'work'
    ? { title: s.work.title, who: artistsOfArtwork(s.work.id).map((x) => x.title).join(', ') || s.work.attribution, date: dateLabel(s.work.dateDisplay), region: s.work.regions.map(regionName).join(', '), medium: s.work.medium, tech: s.work.techniques.join(' · '), mov: movementsOfArtwork(s.work.id).map((m) => m.title).join(', ') || '—', place: s.work.location }
    : { title: s.title || t('Untitled picture'), who: s.artist || '—', date: s.date || '—', region: '—', medium: s.medium || '—', tech: '—', mov: '—', place: t('Your picture') }

  const both = A && B
  const rows = both ? [
    [t('Attribution'), meta(A).who, meta(B).who], [t('Date'), meta(A).date, meta(B).date], [t('Region'), meta(A).region, meta(B).region], [t('Medium'), meta(A).medium, meta(B).medium],
    [t('Technique'), meta(A).tech, meta(B).tech], [t('Movement or tradition'), meta(A).mov, meta(B).mov], [t('Collection'), meta(A).place, meta(B).place],
  ] : []
  const wa = A?.kind === 'work' ? A.work : null
  const wb = B?.kind === 'work' ? B.work : null
  const sharedThemes = wa && wb ? wa.themes.filter((x) => wb.themes.includes(x)) : []
  const sharedMediums = wa && wb ? wa.mediums.filter((m) => wb.mediums.includes(m)) : []
  const years = wa && wb ? Math.abs(wa.dates.start - wb.dates.start) : null
  const path = useMemo(() => (wa && wb && wa.id !== wb.id ? findPath(wa.id, wb.id) : wa && wb ? [] : undefined), [wa, wb])

  const SideView = ({ s, side }: { s: Side; side: 'a' | 'b' }) => (
    <figure>
      {s.kind === 'work' ? (
        <Link to={entityPath(s.work)} className="block"><ArtworkImage artwork={s.work} width={1000} ratio={1.15} fit="contain" /></Link>
      ) : (
        <div className="flex aspect-[1.15/1] items-center justify-center overflow-hidden rounded-2xl bg-sunk"><img src={s.src} alt={s.title || t('Picture you added')} className="max-h-full max-w-full object-contain" /></div>
      )}
      <figcaption className="mt-4">
        {s.kind === 'work' ? (
          <>
            <Link to={entityPath(s.work)} className="font-display text-3xl leading-tight link-u">{s.work.title}</Link>
            <p className="mt-1 text-sm text-muted">{meta(s).who}, {dateLabel(s.work.dateDisplay)}</p>
          </>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            <p className="label sm:col-span-2">{t('Your picture — label it so it appears correctly in the comparison.')}</p>
            {([['title', t('Title')], ['artist', t('Artist')], ['date', t('Date')], ['medium', t('Medium')]] as const).map(([k, l]) => (
              <label key={k} className="block" htmlFor={`c-${side}-${k}`}><span className="sr-only">{l}</span>
                <input id={`c-${side}-${k}`} className="field" placeholder={l} value={s[k]} onChange={(e) => setSide(side, { ...s, [k]: e.target.value })} /></label>
            ))}
          </div>
        )}
        <button type="button" className="mt-3 text-sm text-muted underline underline-offset-4 hover:text-ink" onClick={() => { setSide(side, null); setHint(null) }}>{t('Choose a different work')}</button>
      </figcaption>
    </figure>
  )

  const pick = (side: 'a' | 'b') => (
    <Picker label={side === 'a' ? t('First work') : t('Second work')} onPick={(w) => { setSide(side, { kind: 'work', work: w }); setHint(null) }}
      onCustom={(c) => { setSide(side, c); setHint({ side, works: matchWorks(c.fileName, 3), file: c.fileName }) }} />
  )

  return (
    <>
      <Breadcrumbs items={[{ label: t('Artworks'), to: '/artworks' }, { label: t('Comparison') }]} />
      <PageHeader eyebrow={t('Artworks')} title={t('Compare two works')} intro={t('Search for a work by name, or drop a picture of one. See scale, material, purpose and the world each belongs to, side by side.')} />
      <div className="page-x pb-24">
        {hint && hint.works.length > 0 && (
          <div className="mb-6 rounded-2xl bg-lean/20 p-4 text-[0.95rem]" role="status">
            <p>{t("Based on the file name “{file}”, this may be one of the works we already hold. We can't recognise a picture from its pixels, so this is only a name match.", { file: hint.file })}</p>
            <div className="mt-3 flex flex-wrap gap-2">{hint.works.map((w) => <button key={w.id} type="button" className="chip" onClick={() => { setSide(hint.side, { kind: 'work', work: w }); setHint(null) }}>{t('Use “{title}”', { title: w.title })}</button>)}</div>
          </div>
        )}
        <div className="grid gap-6 lg:grid-cols-2">
          {A ? <SideView s={A} side="a" /> : pick('a')}
          {B ? <SideView s={B} side="b" /> : pick('b')}
        </div>

        {both && (
          <>
            <div className="mt-12 overflow-x-auto rounded-3xl bg-surface p-2 sm:p-4">
              <table className="w-full min-w-[34rem] border-collapse text-left text-sm">
                <caption className="sr-only">{t('Comparison of {a} and {b}', { a: meta(A).title, b: meta(B).title })}</caption>
                <thead><tr><th className="w-44 px-4 py-3 label font-normal">{t('Aspect')}</th><th className="px-4 py-3 font-display text-xl font-medium">{meta(A).title}</th><th className="px-4 py-3 font-display text-xl font-medium">{meta(B).title}</th></tr></thead>
                <tbody>{rows.map(([l, x, y]) => <tr key={l} className="border-t border-rule align-top"><th scope="row" className="label px-4 py-3 font-normal">{l}</th><td className="px-4 py-3">{x}</td><td className="px-4 py-3">{y}</td></tr>)}</tbody>
              </table>
            </div>

            {wa && wb && (
              <section className="mt-10 grid gap-4 md:grid-cols-3" aria-label={t('What the comparison shows')}>
                <div className="rounded-3xl bg-surface p-7"><p className="label">{t('Apart in time')}</p><p className="mt-2 font-display text-4xl">{years === 0 ? t('Same period') : years === 1 ? t('1 year') : t('{n} years', { n: (years ?? 0).toLocaleString() })}</p><p className="mt-1 text-sm text-muted">{t('between the start dates of the two works, approximate where dates are.')}</p></div>
                <div className="rounded-3xl bg-surface p-7"><p className="label">{t('In common')}</p><p className="mt-2 text-[0.95rem] leading-relaxed">{sharedMediums.length ? t('Medium: {list}.', { list: sharedMediums.join(', ') }) : t('No shared medium.')}{' '}{sharedThemes.length ? t('Themes: {list}.', { list: sharedThemes.map((x) => getEntity(x)?.title ?? x.replace('theme-', '').replace(/-/g, ' ')).join(', ') }) : t('No shared tagged theme.')}</p></div>
                <div className="rounded-3xl bg-surface p-7"><p className="label">{t('Try instead')}</p><ul className="mt-2 text-[0.95rem]">{similarArtworks(wa.id, 3).map((x) => <li key={x.id}><button type="button" className="link-u py-1" onClick={() => setSide('b', { kind: 'work', work: x })}>{x.title}</button></li>)}</ul></div>
              </section>
            )}

            <section className="mt-10" aria-label={t('Documented connection')}>
              <p className="mb-3 font-display text-2xl">{t('Is there a documented connection?')}</p>
              {!wa || !wb ? <p className="max-w-prose text-muted">{t('Connections are only drawn between works that are in the dataset. A picture you dropped in has no recorded relationships, so none are suggested.')}</p>
                : path === null ? <p className="max-w-prose text-muted">{t("No chain of documented relationships links these two works in the sample dataset. That says something about the dataset, not about history. It also means we won't suggest a link just because they share a century or a theme.")}</p>
                : path && path.length > 0 ? (
                  <ol className="space-y-2 text-[0.95rem]">
                    <li>{wa.title}</li>
                    {path.map((st) => <li key={st.rel.id} className="border-l-2 border-ink/20 pl-4"><span className="text-muted">{st.phrase}</span> <Link to={entityPath(st.other)} className="link-u">{st.other.title}</Link> — {st.rel.note}</li>)}
                  </ol>
                ) : null}
            </section>
          </>
        )}
      </div>
    </>
  )
}

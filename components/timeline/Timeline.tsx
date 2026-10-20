import { FilterLayout } from '../ui/FilterLayout'
import { TYPE_ON_VAR } from '../ui/typeStyles'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { t } from '@/i18n'
import type { Entity, EntityType, RegionId } from '@/types'
import { entitiesOfType, entityPath, getEras, getRegions, regionName, TYPE_LABEL } from '@/lib/repo'
import { formatDate, formatYear, span, THIS_YEAR, tickStep } from '@/lib/time'
import { ArtworkImage } from '../ui/ArtworkImage'
import { useElementSize, useMediaQuery } from '../ui/hooks'
import { heroOfAny } from '../ui/heroOf'
import { ArrowLeft, ArrowRight, Close, Minus, Plus, Reset } from '../ui/Icons'
import { SaveButton } from '../ui/SaveButton'
import { TypeBadge } from '../ui/TypeBadge'

/* ------------------------------------------------------------------ */
/* Constants                                                           */
/* ------------------------------------------------------------------ */

const DOMAIN_MIN = -600
const DOMAIN_MAX = 2030
const MIN_SPAN = 24
const ROW_H = 40
const LABEL_W = 148

const TIMELINE_TYPES: EntityType[] = ['tradition', 'style', 'movement', 'school', 'collective', 'artist', 'event', 'exchange', 'artwork']
const DEFAULT_TYPES: EntityType[] = ['tradition', 'style', 'movement', 'school', 'collective', 'event']

/** What the viewer sees: five plain groups instead of seven entity types. */
const GROUPS: { id: string; label: string; types: EntityType[] }[] = [
  { id: 'mov', label: t('Movements & traditions'), types: ['tradition', 'style', 'movement', 'school', 'collective'] },
  { id: 'event', label: t('Events'), types: ['event'] },
  { id: 'artist', label: t('Artists'), types: ['artist'] },
  { id: 'exchange', label: t('Exchanges'), types: ['exchange'] },
  { id: 'artwork', label: t('Artworks'), types: ['artwork'] },
]

const COLOR_VAR: Record<EntityType, string> = {
  tradition: '--f-tradition', movement: '--f-movement', style: '--f-style', school: '--f-school', collective: '--f-collective', artist: '--f-artist', artwork: '--f-artwork',
  event: '--f-event', exchange: '--f-exchange', theme: '--f-theme', place: '--f-place', period: '--f-period',
}

export const PRESETS: { id: string; label: string; from: number; to: number }[] = [
  { id: 'recent', label: t('1400 – today'), from: 1400, to: DOMAIN_MAX },
  { id: 'all', label: t('Everything'), from: DOMAIN_MIN, to: DOMAIN_MAX },
  { id: 'antiquity', label: t('Antiquity'), from: DOMAIN_MIN, to: 500 },
  { id: 'postclassical', label: t('Post-classical'), from: 500, to: 1400 },
  { id: 'early-modern', label: t('Early modern'), from: 1400, to: 1800 },
  { id: 'modern', label: t('Modern'), from: 1800, to: 1945 },
  { id: 'contemporary', label: t('Contemporary'), from: 1900, to: DOMAIN_MAX },
]

const clamp = (v: number, a: number, b: number) => Math.min(Math.max(v, a), b)
function clampView(start: number, end: number): [number, number] {
  const sp = clamp(end - start, MIN_SPAN, DOMAIN_MAX - DOMAIN_MIN)
  const s = clamp(start, DOMAIN_MIN, DOMAIN_MAX - sp)
  return [s, s + sp]
}

/* ------------------------------------------------------------------ */
/* Layout                                                              */
/* ------------------------------------------------------------------ */

interface Placed {
  key: string
  e: Entity
  lane: RegionId
  x0: number
  w: number
  row: number
  bar: boolean
  s: number
  eYear: number
  /** Marker only (label dropped) when a lane is too dense at this zoom; the label shows on hover or focus. */
  noLabel?: boolean
}

const labelPx = (t: string) => Math.min(t.length * 7 + 14, 300)

function layoutLanes(items: { e: Entity; lane: RegionId }[], lanes: RegionId[], ppy: number, maxRows: number) {
  const placed: Placed[] = []
  const rowCount: Record<string, number> = {}
  for (const lane of lanes) {
    const mine = items.filter((i) => i.lane === lane).map((i) => {
      const [s, eYear] = span(i.e.dates)
      return { ...i, s, eYear }
    }).sort((a, b) => a.s - b.s || (b.eYear - b.s) - (a.eYear - a.s))
    const rows: number[] = []
    for (const it of mine) {
      const x0 = (it.s - DOMAIN_MIN) * ppy
      const barW = (it.eYear - it.s) * ppy
      const isBar = barW >= 72 && it.e.type !== 'artwork' && it.e.type !== 'event'
      const w = isBar ? barW : 16
      const labelExtent = isBar ? barW : 20 + labelPx(it.e.title)
      let r = rows.findIndex((end) => end + 8 <= x0)
      let noLabel = false
      let extent = labelExtent
      if (r === -1 && !isBar) {
        if (rows.length < maxRows) { r = rows.length; rows.push(0) }
        else {
          noLabel = true; extent = 14
          r = rows.findIndex((end) => end <= x0 - 12)
          if (r === -1 && rows.length < maxRows + 6) { r = rows.length; rows.push(0) }
          // beyond the hard cap a marker would overlap its neighbour and become unclickable; it stays reachable from the list view and by zooming
          if (r === -1) continue
        }
      } else if (r === -1) { r = rows.length; rows.push(0) }
      rows[r] = x0 + extent
      placed.push({ key: `${lane}:${it.e.id}`, e: it.e, lane, x0, w, row: r, bar: isBar, s: it.s, eYear: it.eYear, noLabel })
    }
    rowCount[lane] = Math.max(rows.length, 1)
  }
  return { placed, rowCount }
}

/* ------------------------------------------------------------------ */
/* Component                                                           */
/* ------------------------------------------------------------------ */

export function Timeline({ variant = 'full' }: { variant?: 'full' | 'preview' }) {
  const preview = variant === 'preview'
  const nav = useNavigate()
  const [sp, setSp] = useSearchParams()
  const isMobile = useMediaQuery('(max-width: 639px)')
  const [wrapRef, size] = useElementSize<HTMLDivElement>()

  const initTypes = (sp.get('types')?.split(',').filter(Boolean) as EntityType[] | undefined) ?? DEFAULT_TYPES
  const initRegions = (sp.get('regions')?.split(',').filter(Boolean) as RegionId[] | undefined) ?? []
  const [types, setTypes] = useState<EntityType[]>(preview ? ['tradition', 'style', 'movement', 'school', 'collective', 'event'] : initTypes)
  const [showIndex, setShowIndex] = useState(sp.get('index') === '1' && !preview)
  const [regions, setRegions] = useState<RegionId[]>(initRegions)
  const [view, setView] = useState<[number, number]>(() => {
    const f = Number(sp.get('from')), t = Number(sp.get('to'))
    return !preview && sp.get('from') && sp.get('to') && Number.isFinite(f) && Number.isFinite(t) ? clampView(f, t) : [1400, DOMAIN_MAX]
  })
  const [mode, setMode] = useState<'timeline' | 'list'>('timeline')
  const [selected, setSelected] = useState<string | null>(sp.get('sel'))
  const [hover, setHover] = useState<{ key: string; e: Entity; x: number; y: number } | null>(null)
  const [cursorYear, setCursorYear] = useState<number | null>(null)

  useEffect(() => {
    if (preview) return
    const next = new URLSearchParams()
    if (types.join() !== DEFAULT_TYPES.join()) next.set('types', types.join(','))
    if (regions.length) next.set('regions', regions.join(','))
    if (showIndex) next.set('index', '1')
    if (selected) next.set('sel', selected)
    if (sp.get('from')) { next.set('from', sp.get('from') as string); next.set('to', sp.get('to') ?? '') }
    setSp(next, { replace: true })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [types, regions, selected, showIndex])

  /* ---------- data ---------- */
  const allLanes = getRegions().map((r) => r.id)
  const items = useMemo(() => {
    const out: { e: Entity; lane: RegionId }[] = []
    for (const e of entitiesOfType(...types)) { if (!showIndex && (e as { level?: string }).level === 'index') continue; for (const r of e.regions) if (!regions.length || regions.includes(r)) out.push({ e, lane: r }) }
    return out
  }, [types, regions, showIndex])
  const lanes = useMemo(() => allLanes.filter((l) => items.some((i) => i.lane === l)), [items, allLanes])

  /* ---------- geometry ---------- */
  const labelW = isMobile || preview ? 0 : LABEL_W
  const plotW = Math.max(size.width - labelW - 24, 100)
  const ppy = plotW / (view[1] - view[0])
  const layout = useMemo(() => layoutLanes(items, lanes, ppy, preview ? 8 : 14), [items, lanes, ppy, preview])
  const padTop = isMobile || preview ? 34 : 14
  const laneGeom = useMemo(() => {
    let y = 0
    const g: Record<string, { top: number; h: number }> = {}
    for (const l of lanes) {
      const h = padTop + layout.rowCount[l] * ROW_H + 14
      g[l] = { top: y, h }
      y += h + 10
    }
    return { g, total: Math.max(y - 10, 0) }
  }, [lanes, layout, padTop])

  const xOf = useCallback((year: number) => (year - view[0]) * ppy, [view, ppy])
  const offset = (view[0] - DOMAIN_MIN) * ppy

  /* ---------- view controls ---------- */
  const setClamped = useCallback((s: number, e: number) => setView(clampView(s, e)), [])
  const zoomAround = useCallback((factor: number, anchorYear: number) => {
    setView(([s, e]) => {
      const nsp = clamp((e - s) * factor, MIN_SPAN, DOMAIN_MAX - DOMAIN_MIN)
      const ratio = (anchorYear - s) / (e - s)
      return clampView(anchorYear - nsp * ratio, anchorYear + nsp * (1 - ratio))
    })
  }, [])
  const center = (y: number) => setView(([s, e]) => clampView(y - (e - s) / 2, y + (e - s) / 2))
  const pan = (frac: number) => setView(([s, e]) => clampView(s + (e - s) * frac, e + (e - s) * frac))
  const midYear = (view[0] + view[1]) / 2

  /* ---------- pointer: drag to pan, pinch to zoom, wheel ---------- */
  const plotRef = useRef<HTMLDivElement>(null)
  const drag = useRef<{ x: number; s: number; e: number; moved: boolean } | null>(null)
  const pointers = useRef(new Map<number, number>())
  const pinch = useRef<{ dist: number; s: number; e: number; mid: number } | null>(null)
  const justDragged = useRef(false)
  const viewRef = useRef(view)
  viewRef.current = view
  const ppyRef = useRef(ppy)
  ppyRef.current = ppy

  const onPointerDown = (ev: React.PointerEvent) => {
    if (ev.pointerType === 'mouse' && ev.button !== 0) return
    pointers.current.set(ev.pointerId, ev.clientX)
    justDragged.current = false
    const [s, e] = viewRef.current
    if (pointers.current.size === 1) drag.current = { x: ev.clientX, s, e, moved: false }
    if (pointers.current.size === 2) {
      const xs = [...pointers.current.values()]
      const rect = plotRef.current?.getBoundingClientRect()
      const mid = rect ? s + (((xs[0] + xs[1]) / 2 - rect.left) / (rect.width || 1)) * (e - s) : (s + e) / 2
      pinch.current = { dist: Math.abs(xs[0] - xs[1]) || 1, s, e, mid }
      drag.current = null
    }
    const move = (m: PointerEvent) => {
      if (!pointers.current.has(m.pointerId)) return
      pointers.current.set(m.pointerId, m.clientX)
      if (pinch.current && pointers.current.size >= 2) {
        const xs = [...pointers.current.values()]
        const d = Math.abs(xs[0] - xs[1]) || 1
        const f = pinch.current.dist / d
        const p = pinch.current
        const nsp = clamp((p.e - p.s) * f, MIN_SPAN, DOMAIN_MAX - DOMAIN_MIN)
        const ratio = (p.mid - p.s) / (p.e - p.s)
        setView(clampView(p.mid - nsp * ratio, p.mid + nsp * (1 - ratio)))
        justDragged.current = true
      } else if (drag.current) {
        const dx = m.clientX - drag.current.x
        if (Math.abs(dx) > 4) { drag.current.moved = true; justDragged.current = true }
        if (drag.current.moved) {
          const dy = dx / ppyRef.current
          setView(clampView(drag.current.s - dy, drag.current.e - dy))
        }
      }
    }
    const up = (u: PointerEvent) => {
      pointers.current.delete(u.pointerId)
      if (pointers.current.size < 2) pinch.current = null
      if (pointers.current.size === 0) {
        drag.current = null
        window.removeEventListener('pointermove', move)
        window.removeEventListener('pointerup', up)
        window.removeEventListener('pointercancel', up)
      }
    }
    window.addEventListener('pointermove', move)
    window.addEventListener('pointerup', up)
    window.addEventListener('pointercancel', up)
  }

  useEffect(() => {
    const el = plotRef.current
    if (!el) return
    const onWheel = (ev: WheelEvent) => {
      const [s, e] = viewRef.current
      const rect = el.getBoundingClientRect()
      if (ev.ctrlKey || ev.metaKey) {
        ev.preventDefault()
        const anchor = s + ((ev.clientX - rect.left - labelW) / (rect.width - labelW)) * (e - s)
        zoomAround(Math.exp(ev.deltaY * 0.0022), anchor)
      } else if (Math.abs(ev.deltaX) > Math.abs(ev.deltaY) || ev.shiftKey) {
        ev.preventDefault()
        const dy = (ev.shiftKey && ev.deltaX === 0 ? ev.deltaY : ev.deltaX) / ppyRef.current
        setView(clampView(s + dy, e + dy))
      }
    }
    el.addEventListener('wheel', onWheel, { passive: false })
    return () => el.removeEventListener('wheel', onWheel)
  }, [zoomAround, labelW])

  const onKeyDown = (ev: React.KeyboardEvent) => {
    if (ev.target !== ev.currentTarget) return
    if (ev.key === 'ArrowLeft') { ev.preventDefault(); pan(-0.12) }
    else if (ev.key === 'ArrowRight') { ev.preventDefault(); pan(0.12) }
    else if (ev.key === '+' || ev.key === '=') { ev.preventDefault(); zoomAround(0.7, midYear) }
    else if (ev.key === '-') { ev.preventDefault(); zoomAround(1 / 0.7, midYear) }
    else if (ev.key === '0') { ev.preventDefault(); setView([1400, DOMAIN_MAX]) }
  }

  /* ---------- derived visuals ---------- */
  const ticks = useMemo(() => {
    const step = tickStep(view[1] - view[0], plotW)
    const out: number[] = []
    for (let y = Math.ceil(view[0] / step) * step; y <= view[1]; y += step) out.push(y)
    return out
  }, [view, plotW])
  const eras = getEras()
  const visible = layout.placed.filter((p) => p.x0 + (p.bar ? p.w : p.noLabel ? 16 : 20 + labelPx(p.e.title)) >= offset - 40 && p.x0 <= offset + plotW + 40)

  const offscreen = (lane: RegionId) => {
    const mine = layout.placed.filter((p) => p.lane === lane)
    return { before: mine.filter((p) => p.eYear < view[0]), after: mine.filter((p) => p.s > view[1]) }
  }

  const selectedEntity = selected ? entitiesOfType(...TIMELINE_TYPES).find((e) => e.id === selected) : undefined
  const groupOn = (g: (typeof GROUPS)[number]) => g.types.every((t) => types.includes(t))
  const toggleGroup = (g: (typeof GROUPS)[number]) => setTypes((cur) => (g.types.every((t) => cur.includes(t)) ? cur.filter((t) => !g.types.includes(t)) : [...new Set([...cur, ...g.types])]))
  const toggleRegion = (r: RegionId) => setRegions((cur) => (cur.includes(r) ? cur.filter((x) => x !== r) : [...cur, r]))
  const activePreset = PRESETS.find((p) => Math.abs(p.from - view[0]) < 1 && Math.abs(p.to - view[1]) < 1)?.id

  const open = (e: Entity) => {
    if (justDragged.current) return
    if (preview) nav(`/explore/timeline?sel=${e.id}`)
    else setSelected(e.id)
  }

  /* ---------------------------------------------------------------- */

  const filterPanel = (
    <div className="space-y-5">
      <div>
        <p className="label mb-2">{t('Show')}</p>
        <div className="flex flex-wrap gap-1.5">
          {GROUPS.map((g) => (
            <button key={g.id} type="button" className="chip" aria-pressed={groupOn(g)} onClick={() => toggleGroup(g)}>{g.label}</button>
          ))}
          <button type="button" className="chip" aria-pressed={showIndex} onClick={() => setShowIndex(!showIndex)} title={t('Index records have dates and links but no written page yet')}>{t('Include index records')}</button>
        </div>
      </div>
      <div>
        <p className="label mb-2">{t('Display mode')}</p>
        <div className="flex gap-1.5" role="group" aria-label={t('Display mode')}>
          {(['timeline', 'list'] as const).map((m) => (
            <button key={m} type="button" className="chip" aria-pressed={mode === m} onClick={() => setMode(m)}>{m === 'timeline' ? t('Timeline') : t('List')}</button>
          ))}
        </div>
      </div>
      <div>
        <p className="label mb-2">{t('Regions')}</p>
        <div className="flex flex-wrap gap-1.5" role="group" aria-label={t('Regions')}>
          <button type="button" className="chip" aria-pressed={regions.length === 0} onClick={() => setRegions([])}>{t('All regions')}</button>
          {getRegions().map((r) => <button key={r.id} type="button" className="chip" aria-pressed={regions.includes(r.id)} onClick={() => toggleRegion(r.id)}>{r.short}</button>)}
        </div>
      </div>
    </div>
  )

  const content = (
    <div className="w-full">
      {/* one calm control row */}
      <div className="mb-4 flex flex-wrap items-center gap-x-4 gap-y-3">
        <div className="no-scrollbar -mx-1 flex max-w-full gap-1.5 overflow-x-auto px-1 py-1" role="group" aria-label={t('Jump to a period')}>
          {PRESETS.map((p) => (
            <button key={p.id} type="button" className="chip shrink-0" aria-pressed={activePreset === p.id} onClick={() => setClamped(p.from, p.to)}>{p.label}</button>
          ))}
        </div>
        {!preview && (
          <div className="ml-auto flex items-center gap-1.5" role="group" aria-label={t('View controls')}>
            <button type="button" className="chip !px-3" onClick={() => zoomAround(1 / 0.6, midYear)} aria-label={t('Zoom out')}><Minus size={16} /></button>
            <button type="button" className="chip !px-3" onClick={() => zoomAround(0.6, midYear)} aria-label={t('Zoom in')}><Plus size={16} /></button>
            <button type="button" className="chip !px-3" onClick={() => setView([1400, DOMAIN_MAX])} aria-label={t('Reset view')}><Reset size={16} /></button>
          </div>
        )}
      </div>

      {mode === 'list' && !preview ? (
        <ListView items={items} />
      ) : (
        <>
          {!preview && <Minimap view={view} onMove={center} />}

          <div className="flex gap-0 lg:gap-6">
            <div className="min-w-0 flex-1">
              <div
                ref={wrapRef}
                tabIndex={0}
                onKeyDown={onKeyDown}
                role="region"
                aria-label={t('Global timeline. Focus this area and use the arrow keys to pan, plus and minus to zoom, 0 to reset. Entries are buttons.')}
                className="relative select-none overflow-hidden rounded-3xl bg-paper ring-1 ring-rule"
              >
                {/* axis */}
                <div className="relative h-[60px]" style={{ marginLeft: labelW + 12, marginRight: 12 }}>
                  <div className="absolute inset-x-0 top-3 h-[22px] overflow-hidden rounded-full bg-surface" aria-hidden>
                    {eras.map((era) => {
                      const a = xOf(Math.max(era.dates.start, DOMAIN_MIN)), b = xOf(Math.min(era.dates.end ?? DOMAIN_MAX, DOMAIN_MAX))
                      if (b < 0 || a > plotW) return null
                      return (
                        <div key={era.id} className="absolute top-0 h-full border-l border-paper px-3 text-[0.7rem] leading-[22px] text-muted" style={{ left: a, width: Math.max(b - a, 0) }}>
                          <span className="whitespace-nowrap">{b - a > 90 ? era.title : ''}</span>
                        </div>
                      )
                    })}
                  </div>
                  {ticks.map((y) => (
                    <span key={y} className="absolute bottom-1 -translate-x-1/2 whitespace-nowrap text-[0.8rem] text-muted" style={{ left: xOf(y) }} aria-hidden>{formatYear(y)}</span>
                  ))}
                  {cursorYear !== null && (
                    <span className="pointer-events-none absolute bottom-0 -translate-x-1/2 rounded-full bg-ink px-2.5 py-0.5 text-[0.8rem] text-paper" style={{ left: clamp(xOf(cursorYear), 0, plotW) }} aria-hidden>{formatYear(Math.round(cursorYear))}</span>
                  )}
                </div>

                {/* lanes */}
                <div
                  ref={plotRef}
                  className="relative mx-3 mb-3 cursor-grab touch-pan-y active:cursor-grabbing"
                  style={{ height: Math.max(laneGeom.total, 120) }}
                  onPointerDown={onPointerDown}
                  onPointerMove={(ev) => {
                    if (ev.pointerType !== 'mouse') return
                    const rect = ev.currentTarget.getBoundingClientRect()
                    setCursorYear(view[0] + ((ev.clientX - rect.left - labelW) / plotW) * (view[1] - view[0]))
                  }}
                  onPointerLeave={() => { setCursorYear(null); setHover(null) }}
                >
                  {lanes.length === 0 && <p className="p-8 text-sm text-muted">{t('Nothing to show with these filters. Turn on more kinds above.')}</p>}

                  {lanes.map((l) => {
                    const g = laneGeom.g[l]
                    const { before, after } = offscreen(l)
                    return (
                      <div key={l} className="absolute inset-x-0 rounded-2xl bg-surface" style={{ top: g.top, height: g.h }}>
                        <div className="pointer-events-none absolute left-0 top-0 z-20 flex h-full items-start" style={{ width: labelW || undefined }}>
                          <span className={`font-display ${labelW ? 'p-4 text-[1.05rem] leading-tight' : 'm-2.5 rounded-full bg-paper px-3 py-1 text-[0.8rem]'}`}>{regionName(l)}</span>
                        </div>
                        {before.length > 0 && !before.some((p) => p.eYear >= view[0]) && (
                          <button type="button" onClick={() => center(Math.max(...before.map((p) => p.eYear)) - (view[1] - view[0]) * 0.3)}
                            className="absolute bottom-2 z-20 flex min-h-[28px] items-center gap-1 rounded-full bg-paper px-3 text-[0.75rem] text-muted shadow-sm hover:text-ink" style={{ left: labelW + 8 }}>
                            <ArrowLeft size={12} /> {t('{n} earlier', { n: before.length })}
                          </button>
                        )}
                        {after.length > 0 && (
                          <button type="button" onClick={() => center(Math.min(...after.map((p) => p.s)) + (view[1] - view[0]) * 0.3)}
                            className="absolute bottom-2 right-2 z-20 flex min-h-[28px] items-center gap-1 rounded-full bg-paper px-3 text-[0.75rem] text-muted shadow-sm hover:text-ink">
                            {t('{n} later', { n: after.length })} <ArrowRight size={12} />
                          </button>
                        )}
                      </div>
                    )
                  })}

                  {/* today + cursor guides: the only vertical lines */}
                  <div className="pointer-events-none absolute inset-y-0 right-0 overflow-hidden" style={{ left: labelW }} aria-hidden>
                    {THIS_YEAR <= view[1] && <div className="absolute inset-y-0 border-l border-dashed border-ink/25" style={{ left: xOf(THIS_YEAR) }} />}
                    {cursorYear !== null && <div className="absolute inset-y-0 w-px bg-ink/30" style={{ left: xOf(cursorYear) }} />}
                  </div>

                  {/* entries */}
                  <div className="absolute inset-y-0 right-0 overflow-hidden" style={{ left: labelW }}>
                    <div className="absolute left-0 top-0" style={{ transform: `translate3d(${-offset}px,0,0)`, willChange: 'transform' }}>
                      {visible.map((p) => {
                        const g = laneGeom.g[p.lane]
                        if (!g) return null
                        return (
                          <Entry
                            key={p.key} p={p} top={g.top + padTop + p.row * ROW_H} selected={selected === p.e.id} stick={offset - p.x0} visW={Math.min(p.x0 + p.w, offset + plotW) - Math.max(p.x0, offset)}
                            onOpen={() => open(p.e)}
                            onHover={(on, el) => {
                              if (!on || !el) { setHover(null); return }
                              const w = wrapRef.current?.getBoundingClientRect()
                              const r = el.getBoundingClientRect()
                              if (w) setHover({ key: p.key, e: p.e, x: r.left - w.left + r.width / 2, y: r.top - w.top })
                            }}
                          />
                        )
                      })}
                    </div>
                  </div>
                </div>

                {/* hover preview */}
                {hover && !isMobile && (
                  <div className="pointer-events-none absolute z-30 w-72 overflow-hidden rounded-2xl bg-paper shadow-[0_20px_50px_-12px_rgba(0,0,0,.35)] ring-1 ring-rule pop-in"
                    style={{ left: clamp(hover.x - 144, 8, Math.max(size.width - 296, 8)), top: Math.max(hover.y - 8, 70), transform: hover.y > 300 ? 'translateY(-100%)' : 'translateY(40px)' }}
                    role="tooltip">
                    <div className="p-4">
                      <TypeBadge type={hover.e.type} />
                      <p className="mt-1.5 font-display text-xl leading-tight">{hover.e.title}</p>
                      <p className="mt-0.5 text-xs text-muted">{formatDate(hover.e.dates)} · {hover.e.regions.map(regionName).join(', ')}</p>
                      <p className="mt-2 line-clamp-3 text-[0.82rem] leading-relaxed text-ink/80" >{hover.e.summary}</p>
                      <p className="mt-2 text-xs text-ink underline decoration-heat decoration-2 underline-offset-4">{preview ? t('Click to open on the timeline') : t('Click to open a preview')}</p>
                    </div>
                  </div>
                )}
              </div>

              <Legend preview={preview} view={view} />
              {preview && (
                <p className="mt-5"><Link to="/explore/timeline" className="btn btn-ghost">{t('Open the full timeline')} <ArrowRight size={16} /></Link></p>
              )}
            </div>

            {/* detail drawer (desktop) */}
            {!preview && selectedEntity && !isMobile && (
              <aside className="sticky top-24 hidden h-fit w-[22rem] shrink-0 lg:block" aria-label={t('Selected entry')}>
                <DetailCard e={selectedEntity} onClose={() => setSelected(null)} onZoom={() => { const [s, e] = span(selectedEntity.dates); const pad = Math.max((e - s) * 0.3, 40); setClamped(s - pad, e + pad) }} />
              </aside>
            )}
          </div>

          {/* detail sheet (tablet/mobile) */}
          {!preview && selectedEntity && (
            <div className="lg:hidden">
              <div className="fixed inset-x-0 bottom-0 z-40 max-h-[75vh] overflow-y-auto rounded-t-3xl bg-paper shadow-[0_-20px_50px_-20px_rgba(0,0,0,.4)] pop-in" role="dialog" aria-label={t('Selected entry')}>
                <DetailCard e={selectedEntity} sheet onClose={() => setSelected(null)} onZoom={() => { const [s, e] = span(selectedEntity.dates); const pad = Math.max((e - s) * 0.3, 40); setClamped(s - pad, e + pad); setSelected(null) }} />
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )

  return preview ? content : <FilterLayout id="tl-filters" panel={filterPanel}>{content}</FilterLayout>
}

/* ------------------------------------------------------------------ */
/* Legend                                                              */
/* ------------------------------------------------------------------ */

function Legend({ preview, view }: { preview: boolean; view: [number, number] }) {
  return (
    <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-[0.8rem] text-muted">
      <span className="inline-flex items-center gap-2"><span className="h-3 w-7 rounded-full bg-f-movement" aria-hidden />{t('Movement or tradition')}</span>
      <span className="inline-flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-f-event" aria-hidden />{t('Event')}</span>
      <span className="inline-flex items-center gap-2"><span className="h-3 w-7 rounded-full bg-f-artist/30 ring-1 ring-f-artist" aria-hidden />{t('Artist')}</span>
      <span className="inline-flex items-center gap-2"><span className="h-3 w-7 rounded-full bg-gradient-to-r from-transparent via-movement to-transparent" aria-hidden />{t('Soft edges mean approximate dates')}</span>
      <span className="ml-auto hidden sm:inline">{preview ? t('Drag to move through time.') : t('Drag to pan · Ctrl/⌘ + scroll or pinch to zoom.')} {t('Showing {from} – {to}', { from: formatYear(Math.round(view[0])), to: formatYear(Math.round(view[1])) })}</span>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Entry (one bar or marker)                                           */
/* ------------------------------------------------------------------ */

function Entry({ p, top, selected, stick, visW, onOpen, onHover }: { p: Placed; top: number; selected: boolean; stick: number; visW: number; onOpen: () => void; onHover: (on: boolean, el?: HTMLElement) => void }) {
  const t = p.e.type
  const c = `rgb(var(${COLOR_VAR[t]}))`
  const approx = !!p.e.dates.approx
  const ongoing = p.e.dates.end === null
  const light = t === 'artist' || t === 'exchange'
  const common = 'absolute z-10 flex h-[30px] items-center text-left text-[0.8rem] leading-none outline-offset-2 transition-transform duration-200 hover:z-20 hover:scale-[1.03]'
  const handlers = {
    onClick: onOpen,
    onMouseEnter: (ev: React.MouseEvent<HTMLElement>) => onHover(true, ev.currentTarget),
    onMouseLeave: () => onHover(false),
    onFocus: (ev: React.FocusEvent<HTMLElement>) => onHover(true, ev.currentTarget),
    onBlur: () => onHover(false),
  }
  const aria = `${p.e.title}, ${TYPE_LABEL[t]}, ${formatDate(p.e.dates)}, ${p.e.regions.map(regionName).join(', ')}`
  const ring = selected ? { boxShadow: '0 0 0 3px rgb(var(--paper)), 0 0 0 5px rgb(var(--accent))' } : undefined

  if (p.bar) {
    const fw = Math.round(Math.min(18, p.w * 0.12))
    const fade = approx ? `linear-gradient(to right, rgba(0,0,0,.25), #000 ${fw}px, #000 calc(100% - ${fw}px), rgba(0,0,0,.25))` : undefined
    return (
      <button type="button" aria-label={aria} aria-pressed={selected} {...handlers} className={`${common} rounded-full`} style={{ left: p.x0, top, width: p.w, ...ring }}>
        <span aria-hidden className="absolute inset-0 rounded-full" style={{
          background: light ? `rgb(var(${COLOR_VAR[t]}) / 0.22)` : c,
          boxShadow: light ? `inset 0 0 0 1.5px rgb(var(${COLOR_VAR[t]}) / 0.9)` : undefined,
          WebkitMaskImage: fade, maskImage: fade,
        }} />
        <span className="relative flex min-w-0 items-center gap-1.5 pl-4 pr-3" style={{ color: light ? 'rgb(var(--onfill))' : TYPE_ON_VAR[t], marginLeft: Math.min(Math.max(stick, 0), Math.max(p.w - 110, 0)) }}>
          <span className="truncate">{visW > 84 ? p.e.title : ''}</span>
          {ongoing && <span aria-hidden className="shrink-0 opacity-70">→</span>}
        </span>
      </button>
    )
  }

  const shapeBase: React.CSSProperties = { width: 11, height: 11, borderRadius: 9999, background: c }
  // a thin dark edge keeps the bright fills legible on the light chart
  const shape: React.CSSProperties = { ...shapeBase, boxShadow: 'inset 0 0 0 1.5px rgb(15 18 18 / .6)' }
  return (
    <button type="button" aria-label={aria} aria-pressed={selected} {...handlers}
      className={`${common} gap-2.5 rounded-full ${p.noLabel ? 'w-6 justify-center' : 'pr-3'}`}
      style={{ left: p.noLabel ? p.x0 - 12 : p.x0 - 8, top, ...ring, background: selected ? 'rgb(var(--paper))' : undefined }}>
      <span aria-hidden className={`shrink-0 ${p.noLabel ? '' : 'ml-2'}`} style={shape} />
      {!p.noLabel && <span className="whitespace-nowrap text-ink">{p.e.title}</span>}
    </button>
  )
}

/* ------------------------------------------------------------------ */
/* Minimap                                                             */
/* ------------------------------------------------------------------ */

function Minimap({ view, onMove }: { view: [number, number]; onMove: (year: number) => void }) {
  const ref = useRef<HTMLDivElement>(null)
  const eras = getEras()
  const toYear = (clientX: number) => {
    const r = ref.current?.getBoundingClientRect()
    if (!r) return 0
    return DOMAIN_MIN + clamp((clientX - r.left) / r.width, 0, 1) * (DOMAIN_MAX - DOMAIN_MIN)
  }
  const pct = (y: number) => ((y - DOMAIN_MIN) / (DOMAIN_MAX - DOMAIN_MIN)) * 100
  return (
    <div className="mb-4">
      <div
        ref={ref}
        className="relative h-3 cursor-pointer touch-none select-none rounded-full bg-sunk"
        role="slider" tabIndex={0} aria-label={t('Overview: drag to choose the visible time window')}
        aria-valuemin={DOMAIN_MIN} aria-valuemax={DOMAIN_MAX} aria-valuenow={Math.round((view[0] + view[1]) / 2)}
        aria-valuetext={t('{from} to {to}', { from: formatYear(Math.round(view[0])), to: formatYear(Math.round(view[1])) })}
        onPointerDown={(e) => { e.currentTarget.setPointerCapture(e.pointerId); onMove(toYear(e.clientX)) }}
        onPointerMove={(e) => { if (e.currentTarget.hasPointerCapture(e.pointerId)) onMove(toYear(e.clientX)) }}
        onKeyDown={(e) => {
          const mid = (view[0] + view[1]) / 2, st = (view[1] - view[0]) * 0.1
          if (e.key === 'ArrowLeft') { e.preventDefault(); onMove(mid - st) }
          if (e.key === 'ArrowRight') { e.preventDefault(); onMove(mid + st) }
        }}
      >
        {eras.slice(1).map((era) => <div key={era.id} aria-hidden className="absolute inset-y-0 w-px bg-paper" style={{ left: `${pct(Math.max(era.dates.start, DOMAIN_MIN))}%` }} />)}
        <div aria-hidden className="absolute inset-y-0 rounded-full bg-ink" style={{ left: `${pct(view[0])}%`, width: `${Math.max(pct(view[1]) - pct(view[0]), 1.2)}%` }} />
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Detail card                                                         */
/* ------------------------------------------------------------------ */

function DetailCard({ e, onClose, onZoom, sheet }: { e: Entity; onClose: () => void; onZoom: () => void; sheet?: boolean }) {
  const hero = heroOfAny(e)
  return (
    <div className={`overflow-hidden bg-paper ${sheet ? '' : 'rounded-3xl ring-1 ring-rule'}`}>
      {hero && !sheet && <ArtworkImage artwork={hero} width={700} ratio={1.5} className="!rounded-none" />}
      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <TypeBadge type={e.type} />
          <button type="button" onClick={onClose} aria-label={t('Close preview')} className="-m-2 flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full text-muted hover:text-ink"><Close size={18} /></button>
        </div>
        <h3 className="mt-2 font-display text-3xl leading-tight">{e.title}</h3>
        <p className="mt-1 text-sm text-muted">{formatDate(e.dates)} · {e.regions.map(regionName).join(', ')}</p>
        <p className="mt-3 text-[0.95rem] leading-relaxed text-ink/80" >{e.summary}</p>
        <div className="mt-5 flex flex-wrap items-center gap-2">
          <Link to={entityPath(e)} className="btn btn-solid">{t('Open page')} <ArrowRight size={16} /></Link>
          <Link to={`/connections?focus=${e.id}`} className="btn btn-ghost">{t('Connections')}</Link>
          <button type="button" className="chip" onClick={onZoom}>{t('Zoom to this')}</button>
          <SaveButton id={e.id} title={e.title} />
        </div>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* List view (accessible alternative)                                  */
/* ------------------------------------------------------------------ */

function ListView({ items }: { items: { e: Entity; lane: RegionId }[] }) {
  const eras = getEras().sort((a, b) => a.dates.start - b.dates.start)
  const uniq = useMemo(() => {
    const m = new Map<string, Entity>()
    items.forEach((i) => m.set(i.e.id, i.e))
    return [...m.values()].sort((a, b) => a.dates.start - b.dates.start)
  }, [items])
  return (
    <div className="space-y-12">
      {eras.map((era) => {
        const lo = era.dates.start, hi = era.dates.end ?? 3000
        const inEra = uniq.filter((e) => e.dates.start >= lo && e.dates.start < hi)
        if (!inEra.length) return null
        return (
          <section key={era.id} aria-labelledby={`l-${era.id}`}>
            <h3 id={`l-${era.id}`} className="mb-4 flex items-baseline gap-4 text-4xl">{era.title}<span className="label">{era.subtitle}</span></h3>
            <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {inEra.map((e) => (
                <li key={e.id}>
                  <Link to={entityPath(e)} className="group block h-full rounded-2xl bg-surface p-5 transition-colors hover:bg-sunk">
                    <TypeBadge type={e.type} />
                    <p className="mt-2 font-display text-2xl leading-tight">{e.title}</p>
                    <p className="mt-1 text-sm text-muted">{formatDate(e.dates)} · {e.regions.map((r) => regionName(r)).join(', ')}</p>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )
      })}
    </div>
  )
}

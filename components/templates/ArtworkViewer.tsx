import { useCallback, useEffect, useRef, useState } from 'react'
import type { Artwork } from '@/types'
import { imageSrc } from '@/lib/images'
import { t } from '@/i18n'
import { REGION_TONE } from '../ui/ArtworkImage'
import { Expand, Minus, Plus, Reset } from '../ui/Icons'

const MAX = 6
const clamp = (v: number, a: number, b: number) => Math.min(Math.max(v, a), b)

/**
 * Zoomable artwork viewer: buttons, ctrl/⌘+wheel, double-click, pinch, drag-to-pan and keyboard.
 * If no verified image is available, it shows a plate and disables zoom rather than faking one.
 */
export function ArtworkViewer({ artwork }: { artwork: Artwork }) {
  const src = imageSrc(artwork.image, 2400)
  const [status, setStatus] = useState<'loading' | 'ok' | 'error'>(src ? 'loading' : 'error')
  const [v, setT] = useState({ s: 1, x: 0, y: 0 })
  const box = useRef<HTMLDivElement>(null)
  const tRef = useRef(v)
  tRef.current = v
  const pointers = useRef(new Map<number, { x: number; y: number }>())
  const gesture = useRef<{ x: number; y: number; tx: number; ty: number; dist: number; s: number } | null>(null)
  const [full, setFull] = useState(false)

  const imgEl = useRef<HTMLImageElement>(null)
  useEffect(() => { setStatus(src ? 'loading' : 'error'); setT({ s: 1, x: 0, y: 0 }) }, [src])
  useEffect(() => { const el = imgEl.current; if (el?.complete && el.naturalWidth > 0) setStatus('ok') }, [src])
  useEffect(() => {
    const on = () => setFull(document.fullscreenElement === box.current)
    document.addEventListener('fullscreenchange', on)
    return () => document.removeEventListener('fullscreenchange', on)
  }, [])

  const bound = useCallback((s: number, x: number, y: number) => {
    const r = box.current?.getBoundingClientRect()
    const w = r?.width ?? 0, h = r?.height ?? 0
    const mx = ((s - 1) * w) / 2, my = ((s - 1) * h) / 2
    return { s, x: clamp(x, -mx, mx), y: clamp(y, -my, my) }
  }, [])

  const zoomTo = useCallback((ns: number, cx?: number, cy?: number) => {
    const cur = tRef.current
    const s = clamp(ns, 1, MAX)
    const r = box.current?.getBoundingClientRect()
    if (!r) return
    // zoom about a point (default: centre) so the thing under the cursor stays put
    const px = (cx ?? r.left + r.width / 2) - (r.left + r.width / 2)
    const py = (cy ?? r.top + r.height / 2) - (r.top + r.height / 2)
    const k = s / cur.s
    setT(bound(s, px - (px - cur.x) * k, py - (py - cur.y) * k))
  }, [bound])

  useEffect(() => {
    const el = box.current
    if (!el) return
    const wheel = (e: WheelEvent) => {
      if (status !== 'ok') return
      if (!(e.ctrlKey || e.metaKey) && tRef.current.s === 1) return // let the page scroll
      e.preventDefault()
      zoomTo(tRef.current.s * Math.exp(-e.deltaY * 0.0025), e.clientX, e.clientY)
    }
    el.addEventListener('wheel', wheel, { passive: false })
    return () => el.removeEventListener('wheel', wheel)
  }, [status, zoomTo])

  const onDown = (e: React.PointerEvent) => {
    if (status !== 'ok' || (e.target as HTMLElement).closest('button')) return
    ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY })
    const pts = [...pointers.current.values()]
    gesture.current = { x: e.clientX, y: e.clientY, tx: v.x, ty: v.y, dist: pts.length === 2 ? Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y) : 0, s: v.s }
  }
  const onMove = (e: React.PointerEvent) => {
    if (!pointers.current.has(e.pointerId) || !gesture.current) return
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY })
    const pts = [...pointers.current.values()]
    if (pts.length === 2 && gesture.current.dist) {
      const d = Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y)
      zoomTo(gesture.current.s * (d / gesture.current.dist), (pts[0].x + pts[1].x) / 2, (pts[0].y + pts[1].y) / 2)
    } else if (tRef.current.s > 1) {
      setT(bound(tRef.current.s, gesture.current.tx + e.clientX - gesture.current.x, gesture.current.ty + e.clientY - gesture.current.y))
    }
  }
  const onUp = (e: React.PointerEvent) => { pointers.current.delete(e.pointerId); gesture.current = null }

  const onKey = (e: React.KeyboardEvent) => {
    if (status !== 'ok') return
    const step = 60
    if (e.key === '+' || e.key === '=') { e.preventDefault(); zoomTo(v.s * 1.4) }
    else if (e.key === '-') { e.preventDefault(); zoomTo(v.s / 1.4) }
    else if (e.key === '0') { e.preventDefault(); setT({ s: 1, x: 0, y: 0 }) }
    else if (v.s > 1 && e.key.startsWith('Arrow')) {
      e.preventDefault()
      setT(bound(v.s, v.x + (e.key === 'ArrowLeft' ? step : e.key === 'ArrowRight' ? -step : 0), v.y + (e.key === 'ArrowUp' ? step : e.key === 'ArrowDown' ? -step : 0)))
    }
  }

  const toggleFull = () => {
    if (document.fullscreenElement) document.exitFullscreen?.()
    else box.current?.requestFullscreen?.().catch(() => undefined)
  }
  const disabled = status !== 'ok'
  const btn = 'flex h-11 w-11 items-center justify-center rounded-full bg-paper/85 text-ink backdrop-blur transition-colors hover:bg-volt disabled:cursor-not-allowed disabled:opacity-40'

  return (
    <div>
      <div
        ref={box}
        tabIndex={0}
        role="group"
        aria-label={t('Image viewer for {title}. Plus and minus zoom, arrow keys pan when zoomed, zero resets.', { title: artwork.title })}
        onKeyDown={onKey}
        onPointerDown={onDown} onPointerMove={onMove} onPointerUp={onUp} onPointerCancel={onUp}
        onDoubleClick={(e) => !disabled && !(e.target as HTMLElement).closest('button') && (v.s > 1 ? setT({ s: 1, x: 0, y: 0 }) : zoomTo(2.6, e.clientX, e.clientY))}
        className={`relative flex items-center justify-center overflow-hidden bg-surface outline-offset-4 ${full ? 'h-screen w-screen p-6' : 'h-[min(78vh,56rem)] min-h-[22rem] rounded-[2rem] p-4 sm:p-10'} ${v.s > 1 ? 'cursor-grab active:cursor-grabbing' : disabled ? '' : 'cursor-zoom-in'} touch-none select-none`}
      >
        {src && status !== 'error' && (
          <img
            ref={imgEl} src={src} alt={artwork.image.alt} draggable={false} referrerPolicy="no-referrer" decoding="async"
            onLoad={() => setStatus('ok')} onError={() => setStatus('error')}
            className={`max-h-full max-w-full rounded-xl object-contain shadow-[0_30px_70px_-28px_rgba(29,33,33,.55)] ${status === 'ok' ? 'opacity-100' : 'opacity-0'} transition-opacity duration-700`}
            style={{ transform: `translate3d(${v.x}px,${v.y}px,0) scale(${v.s})`, transition: pointers.current.size ? 'none' : 'transform .25s cubic-bezier(.22,.61,.36,1), opacity .7s' }}
          />
        )}
        {status === 'loading' && <div className="absolute inset-0 animate-pulse bg-sunk" aria-hidden />}
        {status === 'error' && (
          <div role="img" aria-label={t('{title}: image not available. {alt}', { title: artwork.title, alt: artwork.image.alt })} className="relative flex h-full w-full flex-col items-center justify-center gap-4 overflow-hidden p-8 text-center text-white" style={{ background: REGION_TONE[artwork.regions[0]] ?? '#2B2B35' }}>
            <svg aria-hidden viewBox="0 0 100 100" className="pointer-events-none absolute left-1/2 top-1/2 h-[120%] w-auto -translate-x-1/2 -translate-y-1/2 opacity-[0.1]"><circle cx="50" cy="50" r="48" fill="none" stroke="#fff" strokeWidth="0.3" /><circle cx="50" cy="50" r="33" fill="none" stroke="#fff" strokeWidth="0.3" /><circle cx="50" cy="50" r="18" fill="#fff" /></svg>
            <p className="relative text-sm text-white/70">{artwork.image.restricted ? t('Not shown: in copyright') : t('Image to come')}</p>
            <p className="relative max-w-xl font-display text-4xl leading-tight sm:text-6xl">{artwork.title}</p>
            <p className="relative max-w-md text-sm text-white/75">{artwork.attribution} · {artwork.dateDisplay}</p>
            <p className="relative max-w-md text-xs leading-relaxed text-white/78">
              {artwork.image.restricted ? t('This work is still in copyright, so its image is not reproduced here.') : artwork.image.commonsFile ? t('The remote image could not be loaded just now.') : t('No verified open-licence image has been added for this work yet. Zoom becomes available as soon as one is — it is not simulated.')}
            </p>
            {artwork.image.restricted && <a href={artwork.image.restricted.viewUrl} target="_blank" rel="noreferrer noopener" className="btn btn-ghost relative !border-white !text-white hover:!bg-white hover:!text-ink">{t('See it at {museum}', { museum: artwork.image.restricted.viewLabel })}</a>}
          </div>
        )}

        <div className="absolute right-4 top-4 flex flex-col gap-1.5" role="group" aria-label={t('Zoom controls')}>
          <button type="button" className={btn} onClick={() => zoomTo(v.s * 1.5)} disabled={disabled || v.s >= MAX} aria-label={t('Zoom in')}><Plus /></button>
          <button type="button" className={btn} onClick={() => zoomTo(v.s / 1.5)} disabled={disabled || v.s <= 1} aria-label={t('Zoom out')}><Minus /></button>
          <button type="button" className={btn} onClick={() => setT({ s: 1, x: 0, y: 0 })} disabled={disabled || v.s === 1} aria-label={t('Reset zoom')}><Reset /></button>
          <button type="button" className={btn} onClick={toggleFull} disabled={disabled} aria-label={full ? t('Exit full screen') : t('Full screen')}><Expand /></button>
        </div>
        {!disabled && <p className="pointer-events-none absolute bottom-4 left-4 rounded-full bg-paper/85 px-3 py-1.5 text-xs text-ink backdrop-blur">{v.s === 1 ? t('Double-click or pinch to zoom') : t('{pct}% · drag to pan', { pct: Math.round(v.s * 100) })}</p>}
      </div>
    </div>
  )
}

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { t } from '@/i18n'
import type { Artwork } from '@/types'
import { entityPath, getArtworks } from '@/lib/repo'
import { heroImage } from '@/lib/localImages'
import { usePrefersReducedMotion } from '@/components/ui/hooks'
import { ArrowRight } from '@/components/ui/Icons'

/** Works shown first, in this order; the rest of the bundled images follow. */
const FIRST = ['art-great-wave', 'art-starry-night', 'art-pearl-earring', 'art-mona-lisa', 'art-travelers', 'art-impression-sunrise']
const AUTOPLAY_MS = 4800
const mod = (n: number, m: number) => ((n % m) + m) % m

/**
 * A curved ring of artwork cards: the card in the middle faces you, the others wrap around it in perspective.
 * It advances on its own, and can be dragged (with momentum, settling on the nearest card), clicked, or driven
 * with the arrow keys and the buttons. Respects reduced motion and has a pause button.
 */
export function HeroRing({ className = '' }: { className?: string }) {
  const reduced = usePrefersReducedMotion()
  const works = useMemo(() => {
    const all = getArtworks().filter((w) => heroImage(w.id))
    const first = FIRST.map((id) => all.find((w) => w.id === id)).filter(Boolean) as Artwork[]
    return [...first, ...all.filter((w) => !FIRST.includes(w.id))]
  }, [])
  const n = works.length
  const step = 360 / n

  const stage = useRef<HTMLDivElement>(null)
  const ring = useRef<HTMLDivElement>(null)
  const cards = useRef<(HTMLAnchorElement | null)[]>([])
  const shades = useRef<(HTMLSpanElement | null)[]>([])
  const geo = useRef({ w: 1200, h: 420, cw: 200, ch: 280, pitch: 250 })
  const st = useRef({ angle: 0, target: 0, dragging: false, startX: 0, startAngle: 0, moved: 0, lastX: 0, lastT: 0, vel: 0, hover: false, last: 0, shown: 0 })
  const [current, setCurrent] = useState(0)
  const [playing, setPlaying] = useState(true)
  const playingRef = useRef(true)
  playingRef.current = playing && !reduced

  const layout = useCallback(() => {
    const el = stage.current
    if (!el) return
    const w = el.clientWidth, h = el.clientHeight
    // portrait cards; the row must show the centre card, two neighbours each side (the outer pair fading out), with clear gaps
    const ch = Math.max(190, Math.min(h * 0.8, 560))
    const cw = Math.min(ch * 0.74, w / 6.2)
    const ch2 = cw / 0.74
    geo.current = { w, h, cw, ch: ch2, pitch: cw * 1.24 }
    cards.current.forEach((c) => { if (c) { c.style.width = `${cw}px`; c.style.height = `${ch2}px`; c.style.marginLeft = `${-cw / 2}px`; c.style.marginTop = `${-ch2 / 2}px` } })
    el.style.perspective = `${Math.max(900, w * 0.85)}px`
  }, [])

  const paint = useCallback(() => {
    const { pitch } = geo.current
    const a0 = st.current.angle / step
    let best = 0, bestAbs = 1e9
    for (let i = 0; i < n; i++) {
      const c = cards.current[i]
      if (!c) continue
      // o: signed distance from the centre in card units (positive = to the right), wrapped so the row loops forever
      const o = mod(i + a0 + n / 2, n) - n / 2
      const ao = Math.abs(o)
      if (ao < bestAbs) { bestAbs = ao; best = i }
      const x = Math.sign(o) * (ao <= 1 ? ao * pitch : pitch + (ao - 1) * pitch * 1.02)
      const rot = -Math.sign(o) * Math.min(ao, 1.6) * 34            // neighbours turn in to face the middle
      const z = (1 - Math.min(ao, 1.7)) * 150                         // centre comes forward, the rest recede
      c.style.transform = `translateX(${x}px) translateZ(${z}px) rotateY(${rot}deg)`
      c.style.opacity = String(Math.max(0, Math.min(1, 1 - (ao - 2.1) / 1.1)))
      c.style.pointerEvents = ao > 2.6 ? 'none' : 'auto'
      c.style.zIndex = String(1000 - Math.round(ao * 20))
      const sh = shades.current[i]
      if (sh) sh.style.opacity = String(Math.min(0.7, ao * 0.3))
    }
    if (best !== st.current.shown) { st.current.shown = best; setCurrent(best) }
  }, [n, step])

  const goTo = useCallback((i: number) => {
    const s = st.current
    // shortest way round from where the ring currently is
    const want = -i * step
    s.target = s.angle + (mod(want - s.angle + 180, 360) - 180)
  }, [step])
  const advance = useCallback((dir: number) => { st.current.target = Math.round(st.current.target / step) * step - dir * step }, [step])

  // animation loop
  useEffect(() => {
    layout()
    const el = stage.current
    const ro = el ? new ResizeObserver(() => { layout(); paint() }) : null
    if (el && ro) ro.observe(el)
    let raf = 0, lastAuto = performance.now()
    const tick = (now: number) => {
      const s = st.current
      const dt = Math.min(0.05, (now - (s.last || now)) / 1000)
      s.last = now
      if (!s.dragging) {
        if (playingRef.current && !s.hover && now - lastAuto > AUTOPLAY_MS) { lastAuto = now; advance(1) }
        const k = reduced ? 1 : 1 - Math.exp(-dt * 5.5)
        s.angle += (s.target - s.angle) * k
        if (Math.abs(s.target - s.angle) < 0.01) s.angle = s.target
      }
      paint()
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => { cancelAnimationFrame(raf); ro?.disconnect() }
  }, [layout, paint, advance, reduced])

  // drag
  const down = (e: React.PointerEvent) => {
    const s = st.current
    s.dragging = true; s.startX = s.lastX = e.clientX; s.startAngle = s.angle; s.moved = 0; s.vel = 0; s.lastT = performance.now()
    ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
  }
  const move = (e: React.PointerEvent) => {
    const s = st.current
    if (!s.dragging) return
    const dx = e.clientX - s.startX
    s.moved = Math.max(s.moved, Math.abs(dx))
    // drag right → the ring turns to bring the card on the right of the centre in
    const degPerPx = step / Math.max(60, geo.current.cw * 0.62)
    s.angle = s.startAngle + dx * degPerPx
    s.target = s.angle
    const now = performance.now()
    const dt = Math.max(1, now - s.lastT)
    s.vel = ((e.clientX - s.lastX) * degPerPx) / dt * 1000 * 0.6 + s.vel * 0.4
    s.lastX = e.clientX; s.lastT = now
  }
  const up = () => {
    const s = st.current
    if (!s.dragging) return
    s.dragging = false
    // fling: carry the momentum, then settle on the nearest card
    s.target = Math.round((s.angle + s.vel * 0.28) / step) * step
  }

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowRight') { e.preventDefault(); advance(-1) } else if (e.key === 'ArrowLeft') { e.preventDefault(); advance(1) }
  }

  const cur = works[current]
  return (
    <div className={className}>
      <div
        ref={stage}
        role="group"
        aria-roledescription="carousel"
        aria-label={t('Featured artworks')}
        tabIndex={0}
        onKeyDown={onKey}
        onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={up}
        onMouseEnter={() => { st.current.hover = true }} onMouseLeave={() => { st.current.hover = false }}
        onFocus={() => { st.current.hover = true }} onBlur={() => { st.current.hover = false }}
        className="relative h-full min-h-[260px] w-full cursor-grab touch-pan-y select-none overflow-hidden rounded-[inherit] outline-offset-[-4px] active:cursor-grabbing"
        style={{ WebkitMaskImage: 'linear-gradient(90deg, transparent 0, #000 13%, #000 87%, transparent 100%)', maskImage: 'linear-gradient(90deg, transparent 0, #000 13%, #000 87%, transparent 100%)' }}
      >
        <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(45%_55%_at_50%_58%,rgba(185,237,0,0.16),transparent_72%)]" />
        <div ref={ring} className="absolute inset-0" style={{ transformStyle: 'preserve-3d' }}>
          {works.map((w, i) => (
            <Link
              key={w.id}
              ref={(el) => { cards.current[i] = el }}
              to={entityPath(w)}
              draggable={false}
              tabIndex={i === current ? 0 : -1}
              aria-label={`${w.title}, ${w.attribution}`}
              aria-hidden={i === current ? undefined : true}
              onClick={(e) => {
                if (st.current.moved > 6) { e.preventDefault(); return }
                if (i !== current) { e.preventDefault(); goTo(i) }
              }}
              className="absolute left-1/2 top-1/2 block overflow-hidden rounded-[8px] bg-white/5 will-change-transform [backface-visibility:hidden]"
              style={{ width: 200, height: 270 }}
            >
              <img src={heroImage(w.id)} alt="" draggable={false} loading={i < 8 ? 'eager' : 'lazy'} decoding="async" className="pointer-events-none h-full w-full object-cover" />
              <span ref={(el) => { shades.current[i] = el }} aria-hidden className="pointer-events-none absolute inset-0 bg-black" />
            </Link>
          ))}
        </div>
      </div>

      <div className="page-x flex flex-wrap items-center justify-between gap-x-6 gap-y-3 pb-7 pt-6">
        <div className="min-w-0" aria-live="off">
          <p className="truncate font-display text-xl leading-tight text-white sm:text-2xl">{cur.title.replace(/ \(.*\)$/, '')}</p>
          <p className="mt-1 truncate text-sm text-white/75">{cur.attribution}, {cur.dateDisplay}</p>
        </div>
        <div className="flex shrink-0 items-center gap-1">
          <button type="button" onClick={() => advance(1)} aria-label={t('Previous artwork')} className="flex h-11 w-11 items-center justify-center rounded-full text-white/80 hover:bg-white/10 hover:text-white"><ArrowRight size={18} className="rotate-180" /></button>
          <button type="button" onClick={() => setPlaying((p) => !p)} aria-pressed={!playing} aria-label={playing ? t('Pause automatic rotation') : t('Play automatic rotation')} className="flex h-11 min-w-[44px] items-center justify-center rounded-full px-3 text-sm text-white/80 hover:bg-white/10 hover:text-white">
            {playing && !reduced ? t('Pause') : t('Play')}
          </button>
          <button type="button" onClick={() => advance(-1)} aria-label={t('Next artwork')} className="flex h-11 w-11 items-center justify-center rounded-full text-white/80 hover:bg-white/10 hover:text-white"><ArrowRight size={18} /></button>
          <Link to={entityPath(cur)} className="btn btn-ghost !ml-2 !min-h-[44px] !px-5 !text-sm">{t('Open artwork')} <ArrowRight size={14} /></Link>
        </div>
      </div>
    </div>
  )
}

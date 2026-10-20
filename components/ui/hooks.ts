import { useEffect, useRef, useState } from 'react'
import { t } from '@/i18n'

export function useDocumentTitle(title?: string) {
  useEffect(() => {
    document.title = title ? `${title} — Chronos` : t('Chronos — Global Art History')
  }, [title])
}

export function usePrefersReducedMotion() {
  const [r, setR] = useState(() => typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches)
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const on = () => setR(mq.matches)
    mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  }, [])
  return r
}

export function useMediaQuery(query: string) {
  const [m, setM] = useState(() => typeof window !== 'undefined' && window.matchMedia(query).matches)
  useEffect(() => {
    const mq = window.matchMedia(query)
    const on = () => setM(mq.matches)
    on()
    mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  }, [query])
  return m
}

/** Measures an element’s content box width and keeps it updated. */
export function useElementSize<T extends HTMLElement>() {
  const ref = useRef<T | null>(null)
  const [size, setSize] = useState({ width: 0, height: 0 })
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const ro = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect
      setSize((s) => (s.width === width && s.height === height ? s : { width, height }))
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [])
  return [ref, size] as const
}

/** Trap focus within a container while `active`; restores focus on close. */
export function useFocusTrap<T extends HTMLElement>(active: boolean, onEscape?: () => void) {
  const ref = useRef<T | null>(null)
  useEffect(() => {
    if (!active) return
    const prev = document.activeElement as HTMLElement | null
    const el = ref.current
    const focusables = () => Array.from(el?.querySelectorAll<HTMLElement>('a[href],button:not([disabled]),input,select,textarea,[tabindex]:not([tabindex="-1"])') ?? []).filter((n) => n.offsetParent !== null)
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { onEscape?.(); return }
      if (e.key !== 'Tab') return
      const f = focusables()
      if (!f.length) return
      const first = f[0], last = f[f.length - 1]
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus() }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus() }
    }
    document.addEventListener('keydown', onKey)
    return () => { document.removeEventListener('keydown', onKey); prev?.focus?.() }
  }, [active, onEscape])
  return ref
}

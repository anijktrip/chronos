import { dateLabel } from '@/i18n'
import type { DateSpec } from '@/types'

/** Left edge of the global timeline (800 BCE) and the right edge (present, rounded). */
export const TIMELINE_MIN = -800
export const TIMELINE_MAX = 2030
export const THIS_YEAR = 2026

export function formatYear(y: number): string {
  if (y < 0) return dateLabel(`${-y} BCE`)
  if (y < 1000) return dateLabel(`${y} CE`)
  return String(y)
}

/** Human-readable date. An explicit `label` always wins. */
export function formatDate(d: DateSpec): string {
  if (d.label) return dateLabel(d.label)
  const a = d.approx ? 'c. ' : ''
  if (d.end === undefined || d.end === d.start) return `${dateLabel(a)}${formatYear(d.start)}`
  if (d.end === null) return `${dateLabel(a)}${formatYear(d.start)} – ${dateLabel('present')}`
  return `${dateLabel(a)}${formatYear(d.start)} – ${formatYear(d.end)}`
}

/** Effective [start, end] for layout; ongoing ranges run to the present. */
export function span(d: DateSpec): [number, number] {
  const end = d.end === undefined ? d.start : d.end === null ? THIS_YEAR : d.end
  return [d.start, Math.max(end, d.start)]
}

export function overlaps(d: DateSpec, from: number, to: number): boolean {
  const [s, e] = span(d)
  return e >= from && s <= to
}

export function activeAt(d: DateSpec, year: number): boolean {
  const [s, e] = span(d)
  // points are treated as active within ±15 years so a single-year item still appears when scrubbing
  const pad = s === e ? 15 : 0
  return year >= s - pad && year <= e + pad
}

/** Pick a tidy tick step for the timeline axis given years per pixel. */
export function tickStep(yearsVisible: number, widthPx: number): number {
  const target = (yearsVisible / Math.max(widthPx, 1)) * 110 // ~110px between labelled ticks
  const steps = [1, 2, 5, 10, 20, 25, 50, 100, 200, 250, 500, 1000]
  return steps.find((s) => s >= target) ?? 1000
}

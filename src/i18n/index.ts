/**
 * Minimal i18n. English strings are the keys: `t('Search')` returns the Greek text when the site is in Greek and
 * the English text otherwise (or whenever a translation is missing), so un-translated text never breaks a page.
 *
 * The language lives in localStorage and a change reloads the page (the route is a #hash, so the reader stays where
 * they are). That keeps module-level labels, data lookups and caches simple: there is only ever one language per load.
 */
import { el } from './el'

export type Lang = 'en' | 'el'
const KEY = 'chronos:lang'

function detect(): Lang {
  try {
    const saved = localStorage.getItem(KEY)
    if (saved === 'en' || saved === 'el') return saved
  } catch { /* storage blocked: fall through */ }
  return typeof navigator !== 'undefined' && /^el\b/i.test(navigator.language) ? 'el' : 'en'
}

export const lang: Lang = detect()
export const isEl = lang === 'el'
if (typeof document !== 'undefined') document.documentElement.lang = lang

export function setLang(next: Lang) {
  if (next === lang) return
  try { localStorage.setItem(KEY, next) } catch { /* ignore */ }
  window.location.reload()
}

/** Translate. `{name}` placeholders are filled from `vars` in either language. */
export function t(en: string, vars?: Record<string, string | number>): string {
  const s = (isEl && el[en]) || en
  return vars ? s.replace(/\{(\w+)\}/g, (m, k) => (k in vars ? String(vars[k]) : m)) : s
}

/** Pick by language for text that is not a fixed UI string (data fields, built sentences). */
export const pick = <T,>(en: T, greek?: T): T => (isEl && greek !== undefined ? greek : en)

/**
 * Greek rendering of a date label ("c. 1840 – 1926", "active 470 BCE – 440 BCE", "from the 12th century").
 * Handles the patterns the data uses; anything unrecognised goes through t() so it can be added to the dictionary.
 */
export function dateLabel(label: string): string {
  if (!isEl || !label) return label
  const whole = el[label]
  if (whole) return whole
  let s = label
  const ord = (n: string, gen = false) => `${n}${gen ? 'ου' : 'ος'} αι.`
  s = s.replace(/\b(early|late|mid-?) (\d+)(?:st|nd|rd|th) century/g, (_m, w, n) => `${w === 'early' ? 'αρχές' : w === 'late' ? 'τέλη' : 'μέσα'} ${ord(n, true)}`)
  s = s.replace(/\b(?:from )?the late (\d+)(?:st|nd|rd|th) century/g, (_m, n) => `από τα τέλη του ${n}ου αι.`)
  s = s.replace(/\btraditionally from the late (\d+)(?:st|nd|rd|th) century/g, (_m, n) => `παραδοσιακά από τα τέλη του ${n}ου αι.`)
  s = s.replace(/\bfrom the (\d+)(?:st|nd|rd|th) century/g, (_m, n) => `από τον ${n}ο αι.`)
  s = s.replace(/(\d+)(?:st|nd|rd|th)(?: century)?/g, (_m, n) => ord(n))
  s = s.replace(/\bcentury\b/g, 'αι.')
  s = s.replace(/\bBCE\b/g, 'π.Χ.').replace(/\bCE\b/g, 'μ.Χ.')
  s = s.replace(/\bactive\b/g, 'ακμή').replace(/\bb\. /g, 'γ. ').replace(/\bc\. /g, 'περ. ')
  s = s.replace(/\bfrom\b/g, 'από').replace(/\bto\b/g, 'έως').replace(/\bpresent\b/g, 'σήμερα').replace(/\boriginal\b/g, 'πρωτότυπο')
  s = s.replace(/\bJune\b/g, 'Ιούνιος')
  return s
}

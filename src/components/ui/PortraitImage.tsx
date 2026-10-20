import { useEffect, useRef, useState } from 'react'
import type { Artist } from '@/types'
import { isEl, t } from '@/i18n'

interface Props {
  artist: Artist
  /** Crop to this width / height ratio (faces sit near the top, so the crop is top-weighted). */
  ratio?: number
  className?: string
  priority?: boolean
}

/** A verified likeness of an artist. Only rendered when `artist.portrait` exists; callers fall back to artwork or a date tile otherwise. */
export function PortraitImage({ artist, ratio = 0.8, className = '', priority }: Props) {
  const p = artist.portrait
  const [ok, setOk] = useState(false)
  const img = useRef<HTMLImageElement>(null)
  useEffect(() => { const el = img.current; if (el?.complete && el.naturalWidth > 0) setOk(true) }, [p?.src])
  if (!p?.src) return null
  return (
    <div className={`relative overflow-hidden rounded-2xl bg-sunk ${className}`} style={{ aspectRatio: String(ratio) }}>
      <img
        ref={img} src={p.src} alt={t('Portrait of {name}', { name: artist.title })} loading={priority ? 'eager' : 'lazy'} decoding="async"
        onLoad={() => setOk(true)}
        className={`absolute inset-0 h-full w-full object-cover object-[50%_18%] transition-opacity duration-500 ${ok ? 'opacity-100' : 'opacity-0'}`}
      />
    </div>
  )
}

/** "Attributed to X, via Wikimedia Commons" → Greek wording; names stay as catalogued. */
function creditText(c: string): string {
  if (!isEl) return c
  return c.replace(/, via /, ', μέσω ').replace(/^Attributed to /, 'Απόδοση: ').replace(/Unknown author/g, 'Άγνωστος δημιουργός').replace(/^Anonymous\b/, 'Ανώνυμος')
}

/** One-line credit for a portrait, with a link to its source page. */
export function PortraitCredit({ artist, className = '' }: { artist: Artist; className?: string }) {
  const p = artist.portrait
  if (!p) return null
  return (
    <p className={`text-xs leading-relaxed text-muted ${className}`}>
      {p.note ? `${t(p.note)} ` : ''}{creditText(p.credit)}. {t(p.licence)}
      {p.page && <> <a href={p.page} target="_blank" rel="noreferrer noopener" className="link-u text-ink">{t('Source')}<span className="sr-only"> {t('(opens in a new tab)')}</span></a></>}
    </p>
  )
}

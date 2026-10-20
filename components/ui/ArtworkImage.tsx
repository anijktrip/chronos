import { useEffect, useRef, useState } from 'react'
import type { Artwork } from '@/types'
import { imageSrc } from '@/lib/images'
import { t } from '@/i18n'

interface Props {
  artwork: Artwork
  width?: number
  /** Hide title/attribution on the fallback plate (used in quiz identification questions). */
  concealed?: boolean
  priority?: boolean
  className?: string
  fit?: 'cover' | 'contain'
  /** Crop to this aspect ratio instead of the work’s own. */
  ratio?: number
}

/**
 * Shows the verified image where one exists. Where there is no catalogued open image — or the
 * file cannot be fetched — it shows a clearly-labelled plate. It never substitutes stock imagery
 * for a specific historical artwork.
 */
export function ArtworkImage({ artwork, width = 1200, concealed, priority, className = '', fit = 'cover', ratio }: Props) {
  const src = imageSrc(artwork.image, width)
  const [state, setState] = useState<'loading' | 'ok' | 'error'>(src ? 'loading' : 'error')
  const img = useRef<HTMLImageElement>(null)
  useEffect(() => setState(src ? 'loading' : 'error'), [src])
  // an already-decoded image (cache, data: URI) can finish before React's load handler is attached
  useEffect(() => { const el = img.current; if (el?.complete && el.naturalWidth > 0) setState('ok') }, [src])
  const r = ratio ?? artwork.image.ratio

  return (
    <div className={`relative overflow-hidden rounded-2xl bg-sunk ${className}`} style={{ aspectRatio: String(r) }}>
      {src && state !== 'error' && (
        <img
          ref={img}
          src={src}
          alt={artwork.image.alt}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          referrerPolicy="no-referrer"
          onLoad={() => setState('ok')}
          onError={() => setState('error')}
          className={`absolute inset-0 h-full w-full transition-opacity duration-700 ${fit === 'cover' ? 'object-cover' : 'object-contain'} ${state === 'ok' ? 'opacity-100' : 'opacity-0'}`}
        />
      )}
      {state === 'loading' && <div className="absolute inset-0 animate-pulse bg-sunk" aria-hidden />}
      {state === 'error' && <Plate artwork={artwork} concealed={concealed} />}
    </div>
  )
}

/** Region tones for plates. Abstract by design: they label a missing image, they do not imitate the work. */
export const REGION_TONE: Record<string, string> = {
  europe: '#243B6B', 'east-asia': '#D8452C', 'south-asia': '#B3247A', 'southeast-asia': '#0E7C66', 'west-asia-north-africa': '#0C6E8A',
  'sub-saharan-africa': '#A85F00', 'north-america': '#2B2B35', 'central-america-caribbean': '#6B3FA0', 'south-america': '#2E7D32', oceania: '#1B5E7A',
}

function Plate({ artwork, concealed }: { artwork: Artwork; concealed?: boolean }) {
  const tone = REGION_TONE[artwork.regions[0]] ?? '#2B2B35'
  return (
    <div role="img" aria-label={concealed ? t('Artwork image not available') : t('{title}: image not available. {alt}', { title: artwork.title, alt: artwork.image.alt })}
      className="plate absolute inset-0 flex flex-col justify-between overflow-hidden p-[7%] text-white" style={{ background: tone }}>
      <svg aria-hidden viewBox="0 0 100 100" preserveAspectRatio="xMaxYMin slice" className="pointer-events-none absolute -right-[18%] -top-[18%] h-[90%] w-[90%] opacity-[0.14]">
        <circle cx="50" cy="50" r="48" fill="none" stroke="#fff" strokeWidth="0.6" />
        <circle cx="50" cy="50" r="33" fill="none" stroke="#fff" strokeWidth="0.6" />
        <circle cx="50" cy="50" r="18" fill="#fff" />
      </svg>
      <p className="relative text-[0.8rem] text-white">{artwork.image.restricted ? t('Not shown: in copyright') : t('Image to come')}</p>
      <div className="relative min-w-0">
        {!concealed && <p className="font-display text-[1.15rem] leading-tight sm:text-[1.5rem]">{artwork.title}</p>}
        <p className="mt-1.5 text-[0.8rem] leading-snug text-white">{artwork.dateDisplay.length < 34 ? artwork.dateDisplay : artwork.medium}</p>
      </div>
    </div>
  )
}

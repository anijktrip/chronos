import { useState } from 'react'
import { isEl, t } from '@/i18n'

/** A work found on Wikidata/Commons: title, optional Greek title, maker, year, collection, file, thumbnail, Commons page, licence, aspect ratio, credit. */
export interface W { t: string; tEl?: string; a?: string; y?: string; c?: string; f: string; th: string; p: string; l: string; r: number; by?: string }

export const EXT = 'noreferrer noopener'

/** A justified gallery of freely licensed works; each image links to its Commons page. Images that fail to load drop out. */
export function WorkGrid({ works }: { works: W[] }) {
  const [failed, setFailed] = useState<Set<string>>(new Set())
  const shown = works.filter((w) => !failed.has(w.f))
  if (!shown.length) return null
  return (
    <ul className="flex flex-wrap gap-3 after:grow-[999] after:content-['']">
      {shown.map((w) => {
        const title = (isEl && w.tEl) || w.t
        return (
          <li key={w.f} className="group relative min-w-[8.5rem] overflow-hidden rounded-2xl bg-sunk" style={{ flex: `${Math.round(w.r * 100)} 1 ${Math.round(w.r * 230)}px` }}>
            <a href={w.p} target="_blank" rel={EXT} className="block">
              <img src={w.th} alt={`${title}${w.a ? `, ${w.a}` : ''}${w.y ? `, ${w.y}` : ''}`} loading="lazy" decoding="async" referrerPolicy="no-referrer" style={{ aspectRatio: String(w.r) }}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                onError={() => setFailed((s) => new Set(s).add(w.f))} />
              <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/45 to-transparent px-3 pb-2.5 pt-10 text-[0.82rem] leading-snug text-white">
                <span className="block font-medium">{title}</span>
                <span className="block text-white/80">{[w.a, w.y, w.c].filter(Boolean).join(' · ')}</span>
              </span>
              <span className="sr-only"> {t('(opens in a new tab)')}</span>
            </a>
          </li>
        )
      })}
    </ul>
  )
}

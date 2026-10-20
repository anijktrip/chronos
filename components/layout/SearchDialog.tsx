import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { t } from '@/i18n'
import { entityPath, regionName, TYPE_LABEL_PLURAL } from '@/lib/repo'
import { search } from '@/lib/search'
import { formatDate } from '@/lib/time'
import type { EntityType } from '@/types'
import { useFocusTrap } from '../ui/hooks'
import { ArrowRight, Close, Search } from '../ui/Icons'
import { TypeBadge } from '../ui/TypeBadge'

const SUGGESTIONS = [t('Hokusai'), t('Impressionism'), t('Benin'), t('woodblock'), t('Mughal'), t('Maya'), t('landscape'), t('Harlem')]
const GROUP_ORDER: EntityType[] = ['movement', 'school', 'collective', 'tradition', 'style', 'artist', 'artwork', 'event', 'exchange', 'theme', 'period', 'place']

/** Global search: a modal combobox reachable from every page via the header, “/” or Ctrl/⌘K. */
export function SearchDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const nav = useNavigate()
  const [q, setQ] = useState('')
  const [idx, setIdx] = useState(0)
  const input = useRef<HTMLInputElement>(null)
  const trap = useFocusTrap<HTMLDivElement>(open, onClose)

  useEffect(() => { if (open) { setQ(''); setIdx(0); setTimeout(() => input.current?.focus(), 10) } }, [open])
  useEffect(() => { document.body.style.overflow = open ? 'hidden' : ''; return () => { document.body.style.overflow = '' } }, [open])

  const results = useMemo(() => (q.trim() ? search({ q, types: [], regions: [] }).slice(0, 24) : []), [q])
  const grouped = useMemo(() => {
    const out: { type: EntityType; items: typeof results }[] = []
    for (const ty of GROUP_ORDER) {
      const items = results.filter((r) => r.entity.type === ty).slice(0, 4)
      if (items.length) out.push({ type: ty, items })
    }
    return out
  }, [results])
  const flat = grouped.flatMap((g) => g.items)

  useEffect(() => setIdx(0), [q])
  if (!open) return null

  const noMatch = t('No matches for “{q}”. Try a shorter word, or {link}.', { q, link: '\u0001' }).split('\u0001')
  const seeAll = results.length >= 24 ? t('See all results with filters') : results.length === 1 ? t('See the 1 result with filters') : t('See all {n} results with filters', { n: results.length })
  const go = (path: string) => { onClose(); nav(path) }
  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setIdx((i) => Math.min(i + 1, flat.length - 1)) }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setIdx((i) => Math.max(i - 1, 0)) }
    else if (e.key === 'Enter') {
      e.preventDefault()
      if (flat[idx]) go(entityPath(flat[idx].entity))
      else if (q.trim()) go(`/explore/browse?q=${encodeURIComponent(q.trim())}`)
    }
  }

  return (
    <div className="fixed inset-0 z-[70] flex items-start justify-center bg-ink/40 px-3 pt-[8vh] fade-in sm:px-6" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose() }}>
      <div ref={trap} role="dialog" aria-modal="true" aria-label={t('Search')} className="pop-in flex max-h-[80vh] w-full max-w-2xl flex-col border border-ink bg-paper shadow-[0_30px_80px_-30px_rgba(0,0,0,.5)]">
        <div className="flex items-center gap-3 border-b border-rule px-4">
          <Search size={18} className="text-muted" />
          <input
            ref={input} autoFocus value={q} onChange={(e) => setQ(e.target.value)} onKeyDown={onKey}
            role="combobox" aria-expanded={flat.length > 0} aria-controls="search-results" aria-autocomplete="list"
            aria-activedescendant={flat[idx] ? `sr-${flat[idx].entity.id}` : undefined}
            placeholder={t('Search artists, works, movements, events…')} aria-label={t('Search the site')}
            className="min-h-[56px] w-full bg-transparent text-lg outline-none placeholder:text-muted"
          />
          <button type="button" onClick={onClose} aria-label={t('Close search')} className="flex min-h-[44px] min-w-[44px] items-center justify-center text-muted hover:text-ink"><Close /></button>
        </div>

        <div className="overflow-y-auto" id="search-results" role="listbox" aria-label={t('Search results')}>
          {!q.trim() && (
            <div className="p-5">
              <p className="label mb-3">{t('Try')}</p>
              <div className="flex flex-wrap gap-2">
                {SUGGESTIONS.map((s) => <button key={s} type="button" className="chip" onClick={() => { setQ(s); input.current?.focus() }}>{s}</button>)}
              </div>
              <button type="button" onClick={() => go('/explore/browse')} className="link-u mt-6 inline-flex items-center gap-2 text-sm">{t('Browse everything with filters')} <ArrowRight size={14} /></button>
            </div>
          )}
          {q.trim() && flat.length === 0 && (
            <div className="p-6 text-sm text-muted" role="status">{noMatch[0]}<button type="button" className="link-u text-ink" onClick={() => go('/explore/browse')}>{t('browse with filters')}</button>{noMatch[1]}</div>
          )}
          {grouped.map((g) => (
            <div key={g.type} role="group" aria-label={TYPE_LABEL_PLURAL[g.type]}>
              <p className="label border-t border-rule bg-surface px-5 py-2">{TYPE_LABEL_PLURAL[g.type]}</p>
              {g.items.map((r) => {
                const i = flat.indexOf(r)
                return (
                  <div key={r.entity.id} id={`sr-${r.entity.id}`} role="option" aria-selected={i === idx}
                    onMouseEnter={() => setIdx(i)} onClick={() => go(entityPath(r.entity))}
                    className={`flex cursor-pointer items-center justify-between gap-4 px-5 py-3 ${i === idx ? 'bg-ink text-paper' : ''}`}>
                    <span className="min-w-0">
                      <span className="block truncate font-serif text-xl leading-tight">{r.entity.title}</span>
                      <span className={`block truncate text-xs ${i === idx ? 'text-paper/70' : 'text-muted'}`}>
                        {formatDate(r.entity.dates)}{r.entity.regions[0] ? ` · ${regionName(r.entity.regions[0])}` : ''}
                      </span>
                    </span>
                    <span className={i === idx ? 'text-paper' : ''}><TypeBadge type={r.entity.type} className={i === idx ? '!text-paper' : ''} /></span>
                  </div>
                )
              })}
            </div>
          ))}
        </div>

        {q.trim() && (
          <button type="button" onClick={() => go(`/explore/browse?q=${encodeURIComponent(q.trim())}`)} className="flex min-h-[48px] items-center justify-between border-t border-rule px-5 text-sm hover:bg-surface">
            <span>{seeAll}</span><ArrowRight size={16} />
          </button>
        )}
        <div className="sr-only" role="status" aria-live="polite">{q.trim() ? (results.length === 1 ? t('1 result') : t('{n} results', { n: results.length })) : ''}</div>
      </div>
    </div>
  )
}

import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { isEl, t } from '@/i18n'
import { useProgress } from '@/lib/progress'
import { LangSwitch } from '../ui/LangSwitch'
import { ChronosWordmark } from '../ui/ChronosWordmark'
import { ArrowRight, Bookmark, Chevron, Close, Menu, Search } from '../ui/Icons'
import { NAV } from './nav'

export function Logo({ className = '', dark = false }: { className?: string; dark?: boolean }) {
  return (
    <Link to="/" className={`group flex items-center ${dark ? 'text-white' : 'text-ink'} ${className}`} aria-label={t('Chronos — home')}>
      <ChronosWordmark height={26} className="transition-opacity group-hover:opacity-70" />
    </Link>
  )
}

export function Header({ onSearch }: { onSearch: () => void }) {
  const [open, setOpenRaw] = useState<number | null>(null)
  const [pinned, setPinned] = useState(false)
  const setOpen = (v: number | null) => { setOpenRaw(v); if (v === null) setPinned(false) }
  const [mobile, setMobile] = useState(false)
  const loc = useLocation()
  const wrap = useRef<HTMLDivElement>(null)
  const { saved } = useProgress()

  useEffect(() => { setOpen(null); setMobile(false) }, [loc.pathname, loc.search])
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') { setOpen(null); setMobile(false) } }
    const onDown = (e: MouseEvent) => { if (wrap.current && !wrap.current.contains(e.target as Node)) setOpen(null) }
    document.addEventListener('keydown', onKey)
    document.addEventListener('mousedown', onDown)
    return () => { document.removeEventListener('keydown', onKey); document.removeEventListener('mousedown', onDown) }
  }, [])
  useEffect(() => {
    document.body.style.overflow = mobile ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [mobile])

  const activeIdx = NAV.findIndex((s) => s.match.some((m) => loc.pathname.startsWith(m)))

  return (
    <header ref={wrap} className="sticky top-0 z-50 bg-paper" onMouseLeave={() => { if (!pinned) setOpen(null) }}>
      <div className="page-x flex h-[68px] items-center justify-between gap-6">
        <Logo />

        <nav aria-label={t('Primary')} className={isEl ? 'hidden min-[1440px]:block' : 'hidden min-[1300px]:block'}>
          <ul className="flex items-center gap-1">
            {NAV.map((s, i) => (
              <li key={s.no}>
                <button
                  type="button"
                  aria-expanded={open === i}
                  aria-controls={open === i ? `mega-${i}` : undefined}
                  onClick={() => { if (open === i && pinned) setOpen(null); else { setOpenRaw(i); setPinned(true) } }}
                  onMouseEnter={() => { if (!pinned) setOpenRaw(i) }}
                  className={`flex min-h-[44px] items-center gap-1.5 whitespace-nowrap rounded-full px-3 text-[0.98rem] min-[1500px]:px-4 transition-colors hover:bg-surface ${open === i ? 'bg-surface text-ink' : activeIdx === i ? 'text-ink' : 'text-ink/80'}`}
                >
                  <span className={activeIdx === i ? 'underline decoration-accent decoration-2 underline-offset-[10px]' : ''}>{s.label}</span>
                  <Chevron size={12} className={`transition-transform ${open === i ? 'rotate-180' : ''}`} />
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-1">
          <LangSwitch compact className="mr-1 hidden sm:inline-flex" />
          <button type="button" onClick={onSearch} aria-haspopup="dialog" aria-keyshortcuts="/"
            className="flex min-h-[44px] items-center gap-2 rounded-full bg-surface px-4 text-sm text-muted transition-colors hover:bg-sunk hover:text-ink">
            <Search size={16} /><span className="hidden sm:inline">{t('Search')}</span><kbd className="hidden rounded-md bg-paper px-1.5 text-[0.7rem] sm:inline">/</kbd>
          </button>
          <Link to="/learn/saved" className="relative hidden min-h-[44px] min-w-[44px] items-center justify-center text-muted hover:text-ink sm:flex" aria-label={t('Saved content ({n})', { n: saved.length })}>
            <Bookmark size={18} />
            {saved.length > 0 && <span className="absolute right-1.5 top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-volt px-1 text-[0.8rem] text-ink">{saved.length}</span>}
          </Link>
          <button type="button" className={`flex min-h-[44px] min-w-[44px] items-center justify-center ${isEl ? 'min-[1440px]:hidden' : 'min-[1300px]:hidden'}`} onClick={() => setMobile(!mobile)}
            aria-expanded={mobile} aria-controls="mobile-menu" aria-label={mobile ? t('Close menu') : t('Open menu')}>
            {mobile ? <Close /> : <Menu />}
          </button>
        </div>
      </div>

      {/* desktop mega panel */}
      {open !== null && (
        <div id={`mega-${open}`} className={`fade-in hidden bg-paper pb-4 shadow-[0_30px_60px_-30px_rgba(0,0,0,.25)] ${isEl ? 'min-[1440px]:block' : 'min-[1300px]:block'}`}>
          <div className="page-x grid grid-cols-[18rem_1fr] gap-12 py-8">
            <div>
              <p className="font-display text-5xl leading-[1.02]">{NAV[open].label}</p>
              <p className="mt-3 text-sm text-muted">{NAV[open].blurb}</p>
            </div>
            <ul className="grid grid-cols-2 gap-x-10 xl:grid-cols-3">
              {NAV[open].links.map((l) => (
                <li key={l.to}>
                  <NavLink to={l.to} end className="group flex items-start justify-between gap-4 rounded-2xl p-4 hover:bg-surface">
                    <span>
                      <span className="block text-[1rem]">{l.label}</span>
                      <span className="mt-0.5 block text-[0.82rem] text-muted">{l.blurb}</span>
                    </span>
                    <ArrowRight size={16} className="arrow-nudge mt-1 shrink-0 text-muted" />
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* mobile menu */}
      {mobile && (
        <div id="mobile-menu" className={`fade-in fixed inset-x-0 bottom-0 top-[68px] overflow-y-auto bg-paper ${isEl ? 'min-[1440px]:hidden' : 'min-[1300px]:hidden'}`}>
          <MobileMenu />
        </div>
      )}
    </header>
  )
}

function MobileMenu() {
  const [exp, setExp] = useState<number | null>(0)
  return (
    <nav aria-label={t('Primary mobile')} className="page-x pb-24 pt-4">
      <LangSwitch className="mb-2 sm:hidden" />
      <ul>
        {NAV.map((s, i) => (
          <li key={s.no} className="border-b border-rule">
            <button type="button" aria-expanded={exp === i} onClick={() => setExp(exp === i ? null : i)}
              className="flex min-h-[56px] w-full items-center justify-between text-left">
              <span><span className="font-display text-4xl">{s.label}</span></span>
              <Chevron className={`transition-transform ${exp === i ? 'rotate-180' : ''}`} />
            </button>
            {exp === i && (
              <ul className="pb-4">
                {s.links.map((l) => (
                  <li key={l.to}>
                    <Link to={l.to} className="flex min-h-[48px] items-center justify-between py-2 text-[1rem]">
                      <span>{l.label}<span className="block text-xs text-muted">{l.blurb}</span></span>
                      <ArrowRight size={16} className="text-muted" />
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </nav>
  )
}

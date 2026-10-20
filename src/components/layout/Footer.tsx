import { Link } from 'react-router-dom'
import { t } from '@/i18n'
import { LangSwitch } from '../ui/LangSwitch'
import { Logo } from './Header'
import { NAV } from './nav'

export function Footer() {
  return (
    <footer className="on-dark mt-28 rounded-t-[2.5rem] bg-night text-white">
      <div className="page-x grid gap-14 py-16 lg:grid-cols-[1.2fr_2fr]">
        <div>
          <Logo dark />
          <p className="mt-6 max-w-sm text-[1.05rem] leading-relaxed text-white/70" >
            {t('Art looks different when you can see what else was happening at the same time, and how it all connects.')}
          </p>
          <p className="mt-8 max-w-sm rounded-2xl bg-white/[0.07] p-4 text-sm leading-relaxed text-white/80">
            <span className="text-white">{t('Prototype.')}</span> {t('Everything here is a small sample dataset, written from general reference knowledge and not yet reviewed by specialists. Artwork images appear where a licensed file has been added.')}
          </p>
        </div>
        <nav aria-label={t('Site map')} className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3">
          {NAV.map((s) => (
            <div key={s.no}>
              <p className="font-display text-xl text-white">{s.label}</p>
              <ul className="mt-3 space-y-1 text-[0.92rem]">
                {s.links.map((l) => (
                  <li key={l.to}><Link to={l.to} className="inline-block py-1 text-white/78 transition-colors hover:text-white">{l.label}</Link></li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </div>
      <div className="border-t border-white/10">
        <div className="page-x flex flex-wrap items-center justify-between gap-3 py-6 text-xs text-white/70">
          <span>{t('Explore · Connect · Understand · Learn')}</span>
          <span className="flex flex-wrap items-center gap-4"><span>{t('Progress and saved items stay in this browser.')}</span><LangSwitch dark /></span>
        </div>
      </div>
    </footer>
  )
}

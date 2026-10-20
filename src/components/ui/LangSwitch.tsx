import { lang, setLang } from '@/i18n'

/** EN / ΕΛ toggle. Switching reloads the page in the other language and keeps the current route. */
export function LangSwitch({ dark = false, compact = false, className = '' }: { dark?: boolean; compact?: boolean; className?: string }) {
  if (compact) {
    // One small button that offers the other language (the full EN | ΕΛ pair is in the mobile menu and the footer).
    const other = lang === 'el' ? 'en' : 'el'
    return (
      <button type="button" lang={other} onClick={() => setLang(other)} aria-label={other === 'en' ? 'Switch to English' : 'Αλλαγή σε Ελληνικά'}
        className={`inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full px-3 text-[0.85rem] transition-colors ${dark ? 'text-white/80 hover:text-white' : 'text-muted hover:bg-surface hover:text-ink'} ${className}`}>
        {other === 'en' ? 'EN' : 'ΕΛ'}
      </button>
    )
  }
  const item = (l: 'en' | 'el', label: string, aria: string) => (
    <button
      type="button"
      lang={l}
      aria-label={aria}
      aria-pressed={lang === l}
      onClick={() => setLang(l)}
      className={`min-h-[32px] min-w-[36px] rounded-full px-2.5 text-[0.8rem] transition-colors ${
        lang === l ? (dark ? 'bg-white text-night' : 'bg-ink text-paper') : dark ? 'text-white/70 hover:text-white' : 'text-muted hover:text-ink'
      }`}
    >{label}</button>
  )
  return (
    <div role="group" aria-label="Language / Γλώσσα" className={`inline-flex items-center gap-0.5 rounded-full p-0.5 ${dark ? 'bg-white/10' : 'bg-surface'} ${className}`}>
      {item('en', 'EN', 'English')}
      {item('el', 'ΕΛ', 'Ελληνικά')}
    </div>
  )
}

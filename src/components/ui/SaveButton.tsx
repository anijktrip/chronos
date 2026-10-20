import { t } from '@/i18n'
import { toggleSaved, useProgress } from '@/lib/progress'
import { Bookmark } from './Icons'

export function SaveButton({ id, title, compact = false, className = '' }: { id: string; title: string; compact?: boolean; className?: string }) {
  const { saved } = useProgress()
  const on = saved.includes(id)
  return (
    <button
      type="button"
      onClick={() => toggleSaved(id)}
      aria-pressed={on}
      aria-label={on ? t('Remove from saved: {title}', { title }) : t('Save: {title}', { title })}
      className={`inline-flex min-h-[44px] items-center gap-2 border border-transparent px-2 text-sm transition-colors hover:border-ink ${on ? 'text-ink' : 'text-muted hover:text-ink'} ${className}`}
    >
      <Bookmark size={18} filled={on} />
      {!compact && <span>{on ? t('Saved') : t('Save')}</span>}
    </button>
  )
}

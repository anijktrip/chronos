import { useEffect, useState, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import type { Entity } from '@/types'
import { t } from '@/i18n'
import { sourcesOf, suggestionsFor } from '@/lib/repo'
import { EntityCard } from './EntityCard'
import { ArrowUpRight } from './Icons'
import { Reveal } from './Reveal'

/* ---------- headings ---------- */

export function SectionHeading({ label, title, aside, id, level = 2 }: { no?: string; label?: string; title: string; aside?: ReactNode; id?: string; level?: 2 | 3 }) {
  const H = level === 2 ? 'h2' : 'h3'
  return (
    <header id={id} className="mb-10 flex flex-wrap items-end justify-between gap-x-8 gap-y-3 scroll-mt-32">
      <div>
        {label && <p className="label mb-3">{label}</p>}
        <H className="text-[clamp(1.85rem,3.8vw,2.85rem)] leading-[1.04]">{title}</H>
      </div>
      {aside && <div className="text-sm text-muted">{aside}</div>}
    </header>
  )
}

export function PageHeader({ eyebrow, title, intro, children }: { eyebrow?: ReactNode; title: ReactNode; intro?: ReactNode; children?: ReactNode }) {
  return (
    <header className="page-x pb-8 pt-6 sm:pt-10">
      {eyebrow && <p className="label mb-5">{eyebrow}</p>}
      <h1 className="page-title max-w-[22ch]">{title}</h1>
      {intro && <p className="page-intro mt-4 max-w-2xl">{intro}</p>}
      {children && <div className="mt-8">{children}</div>}
    </header>
  )
}

export function Breadcrumbs({ items }: { items: { label: string; to?: string }[] }) {
  return (
    <nav aria-label={t('Breadcrumb')} className="page-x pt-8">
      <ol className="flex flex-wrap items-center gap-x-2 text-sm text-muted">
        {items.map((it, i) => (
          <li key={i} className="flex items-center gap-2">
            {it.to ? <Link to={it.to} className="link-u hover:text-ink">{it.label}</Link> : <span aria-current="page" className="text-ink">{it.label}</span>}
            {i < items.length - 1 && <span aria-hidden>/</span>}
          </li>
        ))}
      </ol>
    </nav>
  )
}

/* ---------- in-page navigation with scroll-spy ---------- */

export interface SectionDef { id: string; label: string }

export function scrollToSection(id: string) {
  const el = document.getElementById(id)
  if (!el) return
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' })
  el.setAttribute('tabindex', '-1')
  el.focus({ preventScroll: true })
}

/**
 * Sticky section index. Uses buttons + scrollIntoView (not #anchors) because the app uses hash routing.
 */
export function SectionNav({ sections }: { sections: SectionDef[] }) {
  const [active, setActive] = useState(sections[0]?.id)
  useEffect(() => {
    const els = sections.map((s) => document.getElementById(s.id)).filter(Boolean) as HTMLElement[]
    if (!els.length || typeof IntersectionObserver === 'undefined') return
    const io = new IntersectionObserver(
      (entries) => {
        const vis = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
        if (vis[0]) setActive(vis[0].target.id)
      },
      { rootMargin: '-20% 0px -65% 0px' },
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [sections])
  return (
    <nav aria-label={t('On this page')} className="sticky top-[68px] z-30 bg-paper">
      <ul className="page-x no-scrollbar flex gap-1 overflow-x-auto py-2">
        {sections.map((s) => (
          <li key={s.id} className="shrink-0">
            <button type="button" onClick={() => scrollToSection(s.id)} aria-current={active === s.id ? 'true' : undefined}
              className={`min-h-[40px] whitespace-nowrap rounded-full px-4 text-[0.88rem] transition-colors ${active === s.id ? 'bg-ink text-paper' : 'text-muted hover:bg-surface hover:text-ink'}`}>
              {s.label}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  )
}

/* ---------- small blocks ---------- */

export function DefList({ items }: { items: { label: string; value: ReactNode }[] }) {
  return (
    <dl className="divide-y divide-rule rounded-2xl bg-surface px-5">
      {items.map((it) => (
        <div key={it.label} className="grid grid-cols-[7.5rem_1fr] gap-4 py-3 text-sm sm:grid-cols-[9rem_1fr]">
          <dt className="label pt-0.5">{it.label}</dt>
          <dd>{it.value}</dd>
        </div>
      ))}
    </dl>
  )
}

export function StatusNote({ entity, stub }: { entity: Entity; stub?: boolean }) {
  return (
    <aside className="flex gap-3 rounded-2xl bg-surface p-4 text-sm text-muted" aria-label={t('Editorial status')}>
      <span className="shrink-0 rounded-full bg-ink px-2.5 py-0.5 text-xs text-paper self-start">{t('Sample')}</span>
      <p>
        {entity.status?.note ?? t('Prototype sample content.')}
        {stub && ` ${t('This is an intentionally partial stub record, included to demonstrate how relationships link entities.')}`}
      </p>
    </aside>
  )
}

const SOURCE_KIND: Record<string, string> = {
  collection: t('Collection'), scholarship: t('Scholarship'), reference: t('Reference'), primary: t('Primary source'),
}

export function Sources({ entity }: { entity: Entity }) {
  const list = sourcesOf(entity)
  if (!list.length) return <p className="text-sm text-muted">{t('No sources catalogued for this record yet.')}</p>
  return (
    <div>
      <ul className="divide-y divide-rule rounded-2xl bg-surface px-5">
        {list.map((s) => (
          <li key={s.id} className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 py-3 text-sm">
            <span className="max-w-3xl"><span className="label mr-3">{SOURCE_KIND[s.kind] ?? s.kind}</span>{s.citation}</span>
            {s.url && <a href={s.url} target="_blank" rel="noreferrer noopener" className="inline-flex items-center gap-1 text-muted hover:text-ink">{t('Visit')}<ArrowUpRight size={14} /><span className="sr-only"> {t('(opens in a new tab)')}</span></a>}
          </li>
        ))}
      </ul>
      <p className="mt-3 max-w-prose text-xs leading-relaxed text-muted">
        {t('References are starting points to verify against — standard works and holding-institution collection sites. They have not been checked claim by claim, and no page numbers or record URLs are given.')}
      </p>
    </div>
  )
}

export function ContinueExploring({ id, limit = 4, title = t('Continue exploring') }: { id: string; limit?: number; title?: string }) {
  const list = suggestionsFor(id, limit)
  if (!list.length) return null
  return (
    <section className="page-x py-20">
      <SectionHeading id="continue" label={t('Keep going')} title={title} level={2} />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {list.map((e, i) => <Reveal key={e.id} delay={i * 60}><EntityCard entity={e} /></Reveal>)}
      </div>
    </section>
  )
}

export function EmptyState({ title, children }: { title: string; children?: ReactNode }) {
  return (
    <div className="rounded-3xl bg-surface p-10 text-center">
      <p className="font-display text-2xl">{title}</p>
      {children && <div className="mx-auto mt-2 max-w-md text-sm text-muted">{children}</div>}
    </div>
  )
}

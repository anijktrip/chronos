import { Link } from 'react-router-dom'
import { t } from '@/i18n'
import { entityPath, type ResolvedRelation } from '@/lib/repo'
import { TypeBadge } from '../ui/TypeBadge'

/** Relationship records rendered as sentences, with the reason for each link. */
export function RelationList({ subject, relations }: { subject: string; relations: ResolvedRelation[] }) {
  if (!relations.length) return <p className="text-muted">{t('No documented relationships of this kind in the sample dataset yet.')}</p>
  return (
    <ul className="divide-y divide-rule border-y border-rule">
      {relations.map((r) => (
        <li key={r.rel.id} className="grid gap-x-8 gap-y-1 py-4 sm:grid-cols-[minmax(0,22rem)_1fr]">
          <p className="text-lg leading-snug">
            <span className="text-muted">{subject} {r.phrase}</span>{' '}
            <Link to={entityPath(r.other)} className="font-serif text-2xl link-u">{r.other.title}</Link>
            <span className="ml-3 align-middle"><TypeBadge type={r.other.type} /></span>
          </p>
          <p className="text-sm leading-relaxed text-ink/80">{r.rel.note}{r.rel.qualifier ? <span className="text-muted"> ({r.rel.qualifier})</span> : null}</p>
        </li>
      ))}
    </ul>
  )
}

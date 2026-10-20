import type { EntityType } from '@/types'
import { TYPE_LABEL } from '@/lib/repo'
import { TYPE_BG, TYPE_SHAPE, typeFill } from './typeStyles'

const shapeClass = {
  square: '', circle: 'rounded-full', diamond: 'rotate-45 scale-90', triangle: '[clip-path:polygon(50%_0,100%_100%,0_100%)]', hex: '[clip-path:polygon(25%_0,75%_0,100%_50%,75%_100%,25%_100%,0_50%)]',
} as const

export function Marker({ type, className = '' }: { type: EntityType; className?: string }) {
  return <span aria-hidden className={`inline-block h-2 w-2 shrink-0 ring-1 ring-onfill/40 ${TYPE_BG[type]} ${shapeClass[TYPE_SHAPE[type]]} ${className}`} />
}

/** Marker + type name. The label text always carries the meaning; colour and shape are reinforcement. */
export function TypeBadge({ type, label, className = '' }: { type: EntityType; label?: string; className?: string }) {
  return (
    <span style={typeFill(type)} className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-[0.82rem] leading-none ${className}`}>
      {label ?? TYPE_LABEL[type]}
    </span>
  )
}

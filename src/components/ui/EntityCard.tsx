import { Link } from 'react-router-dom'
import { t } from '@/i18n'
import type { Artist, Artwork, Entity } from '@/types'
import { entityPath, regionName } from '@/lib/repo'
import { formatDate } from '@/lib/time'
import { ArtworkImage } from './ArtworkImage'
import { PortraitImage } from './PortraitImage'
import { ArrowRight } from './Icons'
import { TypeBadge } from './TypeBadge'
import { heroOfAny } from './heroOf'
import { typeFill } from './typeStyles'

interface Props {
  entity: Entity
  variant?: 'card' | 'row' | 'tile'
  /** Show the visual (artwork image or hero). */
  image?: boolean
  className?: string
}

/** Typographic tile for entities that have no artwork (events, exchanges, themes…): the date is the picture. */
function DateTile({ entity, className = '' }: { entity: Entity; className?: string }) {
  const big = entity.dates.label ?? formatDate(entity.dates)
  return (
    <div className={`relative flex flex-col justify-between overflow-hidden rounded-2xl p-5 ${className}`} style={typeFill(entity.type)}>
      <p className="font-display text-[clamp(1.6rem,3vw,2.4rem)] leading-none">{big.length > 22 ? big.slice(0, 22) : big}</p>
    </div>
  )
}

/** The one card used across directories, search results and suggestions. */
export function EntityCard({ entity, variant = 'card', image = true, className = '' }: Props) {
  const to = entityPath(entity)
  const art = image ? heroOfAny(entity) : undefined
  const portrait = image && entity.type === 'artist' && (entity as Artist).portrait?.src ? (entity as Artist) : undefined
  const place = entity.regions[0] ? regionName(entity.regions[0]) : ''

  if (variant === 'row') {
    return (
      <Link to={to} className={`group grid grid-cols-[4rem_1fr_auto] items-center gap-x-4 gap-y-1 border-t border-rule py-4 transition-colors hover:bg-surface sm:grid-cols-[5rem_1fr_auto] sm:gap-x-6 sm:px-3 sm:rounded-xl sm:border-t-0 sm:border-b sm:rounded-none ${className}`}>
        <div className="h-16 w-16 overflow-hidden rounded-xl sm:h-20 sm:w-20">
          {portrait ? <PortraitImage artist={portrait} ratio={1} className="h-full !aspect-auto w-full !rounded-xl" /> : art ? <ArtworkImage artwork={art as Artwork} width={300} ratio={1} className="h-full !aspect-auto w-full !rounded-xl" /> : <DateTile entity={entity} className="h-full !rounded-xl !p-2.5" />}
        </div>
        <div className="min-w-0">
          <TypeBadge type={entity.type} />
          <p className="mt-0.5 font-display text-xl leading-tight sm:text-2xl">{entity.title}</p>
          <p className="mt-1 line-clamp-1 text-sm text-muted sm:line-clamp-2">{entity.summary}</p>
        </div>
        <span className="hidden text-right text-sm text-muted sm:block">{formatDate(entity.dates)}<ArrowRight className="arrow-nudge ml-2 inline" size={16} /></span>
      </Link>
    )
  }

  if (variant === 'tile') {
    return (
      <Link to={to} className={`group block rounded-2xl bg-surface p-5 transition-colors hover:bg-sunk ${className}`}>
        <TypeBadge type={entity.type} />
        <p className="mt-2 font-display text-2xl leading-tight">{entity.title}</p>
        <p className="mt-1 text-sm text-muted">{formatDate(entity.dates)}{place && ` · ${place}`}</p>
      </Link>
    )
  }

  return (
    <Link to={to} className={`group card-hover flex h-full flex-col ${className}`}>
      <div className="img-zoom overflow-hidden rounded-2xl">
        {portrait ? <PortraitImage artist={portrait} ratio={1.3} /> : art ? <ArtworkImage artwork={art as Artwork} width={900} ratio={1.3} /> : <DateTile entity={entity} className="aspect-[1.3/1]" />}
      </div>
      <div className="flex flex-1 flex-col pt-4">
        <div className="flex items-center justify-between gap-3"><TypeBadge type={entity.type} /><span className="text-[0.8rem] text-muted">{formatDate(entity.dates)}</span></div>
        <p className="mt-2 font-display text-[1.7rem] leading-[1.1]">{entity.title}</p>
        <p className="mt-2 line-clamp-2 text-[0.95rem] leading-relaxed text-ink/82" >{entity.summary}</p>
        <span className="mt-auto inline-flex items-center gap-2 pt-3 text-sm">{place || t('Open')} <ArrowRight size={15} className="arrow-nudge" /></span>
      </div>
    </Link>
  )
}

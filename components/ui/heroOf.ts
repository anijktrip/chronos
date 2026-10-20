import type { Artwork, Entity } from '@/types'
import { getEntity } from '@/lib/repo'
import { imageSrc } from '@/lib/images'

/** The artwork that visually represents any entity (itself if it is an artwork). */
export function heroOfAny(e: Entity): Artwork | undefined {
  const hero = e.type === 'artwork' ? e : 'hero' in e && e.hero ? (getEntity(e.hero) as Artwork | undefined) : undefined
  return hero && imageSrc(hero.image) ? hero : undefined   // an artwork without a picture is not shown
}

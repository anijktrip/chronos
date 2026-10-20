import type { EntityType } from '@/types'

/**
 * Tailwind needs literal class names to generate CSS, so the per-type colour mapping lives here
 * as complete strings. Colours are CSS variables (see index.css) so they can be re-themed in one place.
 */
export const TYPE_TEXT: Record<EntityType, string> = {
  tradition: 'text-tradition', movement: 'text-movement', style: 'text-style', school: 'text-school', collective: 'text-collective', artist: 'text-artist', artwork: 'text-artwork',
  event: 'text-event', exchange: 'text-exchange', theme: 'text-theme', place: 'text-place', period: 'text-period',
}
export const TYPE_BG: Record<EntityType, string> = {
  tradition: 'bg-f-tradition', movement: 'bg-f-movement', style: 'bg-f-style', school: 'bg-f-school', collective: 'bg-f-collective', artist: 'bg-f-artist', artwork: 'bg-f-artwork',
  event: 'bg-f-event', exchange: 'bg-f-exchange', theme: 'bg-f-theme', place: 'bg-f-place', period: 'bg-f-period',
}
export const TYPE_BORDER: Record<EntityType, string> = {
  tradition: 'border-tradition', movement: 'border-movement', style: 'border-style', school: 'border-school', collective: 'border-collective', artist: 'border-artist', artwork: 'border-artwork',
  event: 'border-event', exchange: 'border-exchange', theme: 'border-theme', place: 'border-place', period: 'border-period',
}
/** Raw rgb() for SVG / canvas where classes are inconvenient. */
export const TYPE_VAR: Record<EntityType, string> = {
  tradition: 'rgb(var(--f-tradition))', movement: 'rgb(var(--f-movement))', style: 'rgb(var(--f-style))', school: 'rgb(var(--f-school))', collective: 'rgb(var(--f-collective))', artist: 'rgb(var(--f-artist))',
  artwork: 'rgb(var(--f-artwork))', event: 'rgb(var(--f-event))', exchange: 'rgb(var(--f-exchange))', theme: 'rgb(var(--f-theme))',
  place: 'rgb(var(--f-place))', period: 'rgb(var(--f-period))',
}
/** Text colour that sits on each type's fill: white on the dark one (movement), near-black on the light ones. */
export const TYPE_ON_VAR: Record<EntityType, string> = {
  tradition: 'rgb(var(--on-movement))', movement: 'rgb(var(--on-movement))', style: 'rgb(var(--on-movement))', school: 'rgb(var(--onfill))', collective: 'rgb(var(--onfill))', artist: 'rgb(var(--onfill))',
  artwork: 'rgb(var(--onfill))', event: 'rgb(var(--onfill))', exchange: 'rgb(var(--onfill))', theme: 'rgb(var(--onfill))', place: 'rgb(var(--on-movement))', period: 'rgb(var(--on-movement))',
}
/** Inline style for anything filled with a type's colour (badges, chips, tiles). */
export const typeFill = (t: EntityType) => ({ background: TYPE_VAR[t], color: TYPE_ON_VAR[t] })
/** Distinct marker shapes so categories are never distinguished by colour alone. */
export const TYPE_SHAPE: Record<EntityType, 'square' | 'circle' | 'diamond' | 'triangle' | 'hex'> = {
  tradition: 'square', movement: 'square', style: 'square', school: 'square', collective: 'hex', artist: 'circle', artwork: 'triangle',
  event: 'diamond', exchange: 'hex', theme: 'hex', place: 'triangle', period: 'square',
}

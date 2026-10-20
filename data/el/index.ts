/**
 * Greek content overlays. Every file exports Record<id, partial record>; see ./merge.ts for how they are applied.
 * Anything not translated here stays English, so partial coverage is safe.
 */
import { artistIndexEl } from './artist-index'
import { artistsEl } from './artists'
import { artworksEl } from './artworks'
import { artworkAltEl } from './artwork-alt'
import { contextEl } from './context'
import { contextBEl } from './context-b'
import { galleryEl } from './gallery'
import { extraEl } from './extra'
import { eventsMoreEl } from './events-more'
import { guernicaEl, guernicaRelEl } from './guernica'
import { keyRestrictedEl, keyRestrictedRelEl } from './key-works-restricted'
import { eventLinksEl } from '../event-links'
import { learningEl } from './learning'
import { movementIndexEl } from './movement-index'
import { movementsEl } from './movements'
import { movementsBEl } from './movements-b'
import { miscEl } from './misc'

export const elEntities: Record<string, Record<string, unknown>> = {
  ...movementIndexEl, ...movementsEl, ...movementsBEl, ...artistIndexEl, ...artistsEl, ...artworksEl, ...galleryEl, ...extraEl, ...eventsMoreEl, ...guernicaEl, ...keyRestrictedEl, ...Object.fromEntries(Object.entries(artworkAltEl).map(([id, alt]) => [id, { ...artworksEl[id], image: { ...((artworksEl[id]?.image as object) ?? {}), alt } }])), ...contextEl, ...contextBEl,
}
export const elRelationships = { ...miscEl.relationships, ...guernicaRelEl, ...keyRestrictedRelEl, ...eventLinksEl }
export const elSources = miscEl.sources
export const elRegions = miscEl.regions
export const elQuestions = learningEl.questions
export const elQuizzes = learningEl.quizzes
export const elPaths = learningEl.paths
export const elObjectives = learningEl.objectives

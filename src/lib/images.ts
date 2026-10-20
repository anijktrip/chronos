import type { ImageRef } from '@/types'

/**
 * Artwork images are referenced by Wikimedia Commons file name, never copied into the repo
 * without a checked licence. `commonsUrl` builds a resizing redirect URL; the UI falls back to a
 * clearly-labelled plate if a file cannot be loaded.
 */
export const commonsUrl = (file: string, width = 1600) =>
  `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(file.replace(/ /g, '_'))}?width=${width}`

export const commonsPage = (file: string) =>
  `https://commons.wikimedia.org/wiki/File:${encodeURIComponent(file.replace(/ /g, '_'))}`

/** Bundled file first (verified, licensed, works offline); a remote Commons link only as a fallback. */
export const imageSrc = (img: ImageRef, width?: number) => img.src ?? (img.commonsFile ? commonsUrl(img.commonsFile, width) : undefined)

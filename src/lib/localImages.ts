/**
 * Images bundled with the app live in src/assets/art/<artwork-id>.jpg and are resolved at build time.
 * (In the single-file preview build they become data: URIs automatically.)
 */
let files: Record<string, string> = {}
try {
  // Vite replaces this call at build time; under plain Node (the data validator) it throws and is ignored.
  files = import.meta.glob('../assets/art/*.{jpg,jpeg,png,webp}', { eager: true, query: '?url', import: 'default' }) as Record<string, string>
} catch { /* no bundler: no local images */ }

export function localImage(artworkId: string): string | undefined {
  const hit = Object.entries(files).find(([path]) => path.split('/').pop()?.replace(/\.[a-z]+$/, '') === artworkId)
  return hit?.[1]
}

/** Artist portraits: src/assets/portraits/<artist-id>.jpg */
let portraits: Record<string, string> = {}
try {
  portraits = import.meta.glob('../assets/portraits/*.{jpg,jpeg,png,webp}', { eager: true, query: '?url', import: 'default' }) as Record<string, string>
} catch { /* no bundler */ }

export function localPortrait(artistId: string): string | undefined {
  const hit = Object.entries(portraits).find(([path]) => path.split('/').pop()?.replace(/\.[a-z]+$/, '') === artistId)
  return hit?.[1]
}

/** Small 3:4 crops for the home-page ring: src/assets/hero/<artwork-id>.jpg */
let hero: Record<string, string> = {}
try {
  hero = import.meta.glob('../assets/hero/*.{jpg,jpeg,png,webp}', { eager: true, query: '?url', import: 'default' }) as Record<string, string>
} catch { /* no bundler */ }

export function heroImage(artworkId: string): string | undefined {
  const hit = Object.entries(hero).find(([path]) => path.split('/').pop()?.replace(/\.[a-z]+$/, '') === artworkId)
  return hit?.[1]
}

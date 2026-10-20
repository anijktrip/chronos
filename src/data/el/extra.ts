import { extraRaw } from '../extra-works'
import { artistIndexEl } from './artist-index'
import { artistsEl } from './artists'

/** Greek overlays for the extra works: titles from Wikidata where a Greek label exists, artist names from the artist records. */
const MAT: Record<string, string> = {
  'Oil paint': 'Λαδομπογιά', Canvas: 'Καμβάς', Wood: 'Ξύλο', 'Wood panel': 'Ξύλινη επιφάνεια', Tempera: 'Τέμπερα', Marble: 'Μάρμαρο', Bronze: 'Μπρούντζος', Paper: 'Χαρτί',
  Ink: 'Μελάνι', Silk: 'Μετάξι', Fresco: 'Νωπογραφία', Gold: 'Χρυσός', 'Gold leaf': 'Φύλλο χρυσού', Paint: 'Χρώμα', Watercolor: 'Ακουαρέλα', 'Watercolour': 'Ακουαρέλα', Terracotta: 'Τερακότα',
  Stone: 'Πέτρα', Copper: 'Χαλκός', Pigment: 'Χρωστική', Parchment: 'Περγαμηνή', Ceramic: 'Κεραμικό', Plaster: 'Γύψος', Gouache: 'Γκουάς', Charcoal: 'Κάρβουνο', Pastel: 'Παστέλ', 'Acrylic paint': 'Ακρυλικό χρώμα',
  Painting: 'Πίνακας', Sculpture: 'Γλυπτό', Drawing: 'Σχέδιο', Print: 'Χαρακτικό', Fresco_: 'Νωπογραφία', Mural: 'Τοιχογραφία', 'Mural painting': 'Τοιχογραφία', Statue: 'Άγαλμα', Icon: 'Εικόνα', Relief: 'Ανάγλυφο',
}
const nameEl = (id: string | undefined, fallback: string) => (id ? ((artistsEl[id] ?? artistIndexEl[id]) as { title?: string } | undefined)?.title : undefined) ?? fallback

export const extraEl: Record<string, Record<string, unknown>> = Object.fromEntries(extraRaw.map((w) => {
  const who = nameEl(w.artist, w.name)
  const title = w.titleEl ?? w.title
  const mats = w.mats.map((m) => MAT[m])
  const o: Record<string, unknown> = {
    title,
    attribution: who,
    summary: `Έργο: ${who}${w.collection ? ` · ${w.collection}` : ''}.`,
    description: `${title} · ${who}.`,
    image: { alt: `${title} · ${who}` },
    status: { note: 'Εγγραφή ευρετηρίου: ο τίτλος, ο δημιουργός, η χρονολογία, τα υλικά, η συλλογή και η εικόνα προέρχονται από το Wikidata και το Wikimedia Commons· δεν έχει γραφτεί ακόμη ανάλυση.' },
  }
  if (mats.length && mats.every(Boolean)) { o.medium = mats.join(', '); o.mediums = mats }
  return [w.id, o]
}))

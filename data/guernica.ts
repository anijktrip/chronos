import type { Artwork, Relationship } from '@/types'
import { artwork } from './helpers'

/**
 * Guernica is in copyright (Picasso died in 1973), so its image is not reproduced; the record, its history and its links to
 * the Spanish Civil War stay, with a link to see the painting at the museum that holds it.
 */
export const guernicaArtwork: Artwork = artwork({
  id: 'art-guernica',
  title: 'Guernica',
  attribution: 'Pablo Picasso',
  dateDisplay: '1937',
  dates: { start: 1937, label: '1937' },
  summary: 'Picasso’s mural-sized painting made in Paris in May and June 1937, after the bombing of the Basque town of Gernika during the Spanish Civil War.',
  regions: ['europe'],
  medium: 'Oil on canvas',
  mediums: ['Oil paint', 'Canvas'],
  techniques: [],
  dimensions: 'About 349 × 777 cm',
  location: 'Museo Nacional Centro de Arte Reina Sofía, Madrid',
  originPlace: 'Paris, France',
  image: {
    alt: 'A very wide painting in black, white and grey: a screaming horse pierced by a spear, a bull, a woman holding a dead child, a fallen soldier with a broken sword, and a woman leaning in from a window with a lamp, under a bare light bulb.',
    credit: 'Not reproduced here: Picasso died in 1973 and the work is in copyright',
    licence: 'In copyright (Pablo Picasso, died 1973). The image is not reproduced; see the painting at the Museo Reina Sofía.',
    ratio: 2.22,
    restricted: { viewUrl: 'https://www.museoreinasofia.es/en/collection/artwork/guernica', viewLabel: 'Museo Reina Sofía' },
  },
  description: 'A very wide painting in black, white and grey: a screaming horse pierced by a spear, a bull, a woman holding a dead child, a fallen soldier with a broken sword, and a woman leaning in from a window with a lamp, under a bare light bulb.',
  context: [
    'In January 1937 the Spanish Republican government asked Picasso, who lived in Paris, for a large work for the Spanish Pavilion at the International Exposition that opened there in July. When he read and saw the reports of the bombing of Gernika on 26 April 1937, he began Guernica in early May and finished it in about five weeks, in his studio in the rue des Grands-Augustins. The photographer Dora Maar recorded the canvas at several stages.',
    'After the Exposition the painting toured Scandinavia and Britain to raise money for Spanish refugees, then went to the United States, where from 1939 it was kept at the Museum of Modern Art in New York. Picasso asked that it not go to Spain until democracy had been restored. It was handed over to Spain in September 1981, six years after Franco’s death, and has been in the Museo Reina Sofía in Madrid since 1992.',
  ],
  analysis: [
    'Picasso used only black, white and grey, a palette that recalls newspaper photographs. The figures are packed into a shallow space that is lit by a lamp and a bare light bulb, and their bodies are broken into flat, angular shapes drawn from his Cubist work.',
    'Picasso did not give a fixed key to the figures, and scholars have offered many readings of the bull, the horse and the other figures. What is not disputed is that the painting names its subject in the title and that it was made as a public statement.',
  ],
  symbolism: ['The screaming horse, the woman with a dead child and the fallen soldier are the most discussed figures; Picasso refused to fix their meaning.'],
  periods: ['per-era-modern'],
  tags: ['painting', 'oil painting', 'Spanish Civil War', 'political art'],
  sources: ['s-reina-sofia', 's-smarthistory'],
} as never)

export const guernicaRelationships: Relationship[] = [
  { id: 'rel-guernica-1', type: 'created_by', from: 'art-guernica', to: 'artist-picasso', note: 'Painted by Pablo Picasso in Paris in 1937.' },
]

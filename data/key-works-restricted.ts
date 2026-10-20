import type { Artwork, Relationship } from '@/types'
import { artwork } from './helpers'

/**
 * Important works that are still in copyright: the record, its context and its links stay, the image is not reproduced, and each
 * record links to the museum that holds the work. See also guernica.ts.
 */
const restricted = (year: string, who: string) => ({
  credit: `Not reproduced here: ${who} and the work is in copyright`,
  licence: `In copyright (${year}). The image is not reproduced; see the work at the museum that holds it.`,
})

export const keyRestrictedArtworks: Artwork[] = [
  artwork({
    id: 'art-persistence-of-memory', title: 'The Persistence of Memory', attribution: 'Salvador Dalí', dateDisplay: '1931', dates: { start: 1931, label: '1931' },
    summary: 'Dalí’s small Surrealist painting of soft, melting watches in a bare landscape.',
    regions: ['europe'], medium: 'Oil on canvas', mediums: ['Oil paint', 'Canvas'], techniques: [], dimensions: 'About 24 × 33 cm', location: 'Museum of Modern Art, New York', originPlace: 'Spain',
    image: {
      alt: 'A small painting of a barren shore at dusk with three soft, melting pocket watches draped over a tree branch, a table and a sleeping, blob-like face.',
      ...restricted('Salvador Dalí died in 1989', 'Salvador Dalí died in 1989'), ratio: 1.37,
      restricted: { viewUrl: 'https://www.moma.org/learn/moma_learning/salvador-dali-the-persistence-of-memory-1931/', viewLabel: 'MoMA' },
    },
    description: 'A small painting of a barren shore at dusk with three soft, melting pocket watches draped over a tree branch, a table and a sleeping, blob-like face.',
    context: ['Painted in 1931, the picture was shown at the Julien Levy Gallery in New York in the early 1930s and given anonymously to the Museum of Modern Art in 1934. It is one of the best-known images of Surrealism.'],
    analysis: ['Dalí painted the melting watches and the barren landscape in a precise, illusionistic manner, so that an impossible scene looks as solid as a photograph. The landscape is usually linked to the coast of Catalonia near his home.'],
    periods: ['per-era-modern'], tags: ['painting', 'oil painting', 'Surrealism'], sources: ['s-grove', 's-smarthistory'],
  } as never),
  artwork({
    id: 'art-campbells-soup-cans', title: 'Campbell’s Soup Cans', attribution: 'Andy Warhol', dateDisplay: '1962', dates: { start: 1962, label: '1962' },
    summary: 'Warhol’s set of thirty-two canvases, one for each flavour of Campbell’s soup then sold, painted in 1962.',
    regions: ['north-america'], medium: 'Acrylic and metallic enamel on 32 canvases', mediums: ['Acrylic paint', 'Canvas'], techniques: [], dimensions: 'Each canvas 50.8 × 40.6 cm', location: 'Museum of Modern Art, New York', originPlace: 'United States',
    image: {
      alt: 'Thirty-two identical canvases, each showing a Campbell’s soup can in red and white, differing only in the flavour named on the label, hung in rows.',
      ...restricted('Andy Warhol died in 1987', 'Andy Warhol died in 1987'), ratio: 1.25,
      restricted: { viewUrl: 'https://www.moma.org/collection/works/79809', viewLabel: 'MoMA' },
    },
    description: 'Thirty-two identical canvases, each showing a Campbell’s soup can in red and white, differing only in the flavour named on the label, hung in rows.',
    context: ['The canvases were first shown together at the Ferus Gallery in Los Angeles in 1962, displayed on a shelf like goods in a shop. They look like printed advertising but are painted by hand; the fleur-de-lis on each can’s base was hand-stamped.'],
    analysis: ['Warhol repeated one image and changed only the label, a method taken from commercial design and mass production. The work is a founding example of American Pop Art.'],
    periods: ['per-era-contemporary'], tags: ['painting', 'Pop Art'], sources: ['s-grove', 's-smarthistory'],
  } as never),
  artwork({
    id: 'art-soft-construction-boiled-beans', title: 'Soft Construction with Boiled Beans (Premonition of Civil War)', attribution: 'Salvador Dalí', dateDisplay: '1936', dates: { start: 1936, label: '1936' },
    summary: 'Dalí’s painting of a huge, distorted body tearing itself apart, made a few months before the Spanish Civil War began.',
    regions: ['europe'], medium: 'Oil on canvas', mediums: ['Oil paint', 'Canvas'], techniques: [], dimensions: 'About 100 × 99 cm', location: 'Philadelphia Museum of Art', originPlace: 'Spain',
    image: {
      alt: 'A huge, grotesque body made of limbs that tear at each other, standing on a small chest in a dry landscape under a cloudy sky, with a small scatter of boiled beans at its feet.',
      ...restricted('Salvador Dalí died in 1989', 'Salvador Dalí died in 1989'), ratio: 1.01,
      restricted: { viewUrl: 'https://philamuseum.org/objects/51315', viewLabel: 'Philadelphia Museum of Art' },
    },
    description: 'A huge, grotesque body made of limbs that tear at each other, standing on a small chest in a dry landscape under a cloudy sky, with a small scatter of boiled beans at its feet.',
    context: ['Dalí painted it in 1936, before the war began in July, and added “Premonition of Civil War” to the title afterwards. The museum describes it as his picture of the political and social tensions that led up to the war.'],
    analysis: ['The body is made from limbs that strangle and tear at one another, an image of a country turning on itself. Like his other work of the 1930s, it combines a precise painting technique with dreamlike distortion.'],
    periods: ['per-era-modern'], tags: ['painting', 'oil painting', 'Surrealism', 'Spanish Civil War'], sources: ['s-grove', 's-smarthistory'],
  } as never),
]

export const keyRestrictedRelationships: Relationship[] = [
  { id: 'rel-keyr-1', type: 'created_by', from: 'art-persistence-of-memory', to: 'artist-salvador-dali', note: 'Painted by Salvador Dalí in 1931.' },
  { id: 'rel-keyr-2', type: 'exemplifies', from: 'art-persistence-of-memory', to: 'mov-surrealism', note: 'One of the best-known Surrealist paintings.' },
  { id: 'rel-keyr-3', type: 'created_by', from: 'art-campbells-soup-cans', to: 'artist-andy-warhol', note: 'Made by Andy Warhol in 1962.' },
  { id: 'rel-keyr-4', type: 'created_by', from: 'art-soft-construction-boiled-beans', to: 'artist-salvador-dali', note: 'Painted by Salvador Dalí in 1936.' },
  { id: 'rel-keyr-5', type: 'exemplifies', from: 'art-soft-construction-boiled-beans', to: 'mov-surrealism', note: 'A Surrealist painting by Dalí.' },
  { id: 'rel-keyr-6', type: 'shaped_by', from: 'art-soft-construction-boiled-beans', to: 'evt-spanish-civil-war', note: 'Painted in 1936, a few months before the war began; Dalí added “Premonition of Civil War” to the title later.' },
]

import type { Domain, RegionId } from '@/types'
import { t } from '@/i18n'

/**
 * Taxonomies for the two master lists. A record can sit in several movement sections
 * (e.g. Arts and Crafts is both a 19th-century movement and a design movement); the artist
 * list uses one primary section per artist because that is how the source list is organised.
 */

export interface Section { id: string; label: string; short: string }

export const MOVEMENT_SECTIONS: Section[] = [
  { id: 'm01', label: t('Ancient, medieval & early traditions'), short: t('Early traditions') },
  { id: 'm02', label: t('Renaissance to the 18th century'), short: t('Renaissance–18th c.') },
  { id: 'm03', label: t('19th-century movements'), short: t('19th century') },
  { id: 'm04', label: t('Early 20th-century modernism'), short: t('Early modernism') },
  { id: 'm05', label: t('Bauhaus, design & architecture'), short: t('Design & architecture') },
  { id: 'm06', label: t('Postwar art'), short: t('Postwar') },
  { id: 'm07', label: t('Late 20th century to contemporary'), short: t('Late 20th c.–now') },
  { id: 'm08', label: t('Global modernisms & artistic developments'), short: t('Global modernisms') },
  { id: 'm09', label: t('Schools & collectives'), short: t('Schools & collectives') },
]

export const ARTIST_SECTIONS: Section[] = [
  { id: 'a01', label: t('Ancient & Classical Art'), short: t('Ancient & Classical') },
  { id: 'a02', label: t('Medieval & Byzantine Art'), short: t('Medieval & Byzantine') },
  { id: 'a03', label: t('Renaissance'), short: t('Renaissance') },
  { id: 'a04', label: t('Baroque & Rococo'), short: t('Baroque & Rococo') },
  { id: 'a05', label: t('Neoclassicism & Romanticism'), short: t('Neoclassicism & Romanticism') },
  { id: 'a06', label: t('Realism, Impressionism & Post-Impressionism'), short: t('Realism to Post-Impressionism') },
  { id: 'a07', label: t('Early Modernism & Avant-Garde'), short: t('Early Modernism') },
  { id: 'a08', label: t('Surrealism & Modern Photography'), short: t('Surrealism & Photography') },
  { id: 'a09', label: t('Abstract Expressionism & Postwar Art'), short: t('Postwar') },
  { id: 'a10', label: t('Pop Art, Minimalism & Conceptual Art'), short: t('Pop to Conceptual') },
  { id: 'a11', label: t('Contemporary Art'), short: t('Contemporary') },
  { id: 'a12', label: t('East Asian Art'), short: t('East Asia') },
  { id: 'a13', label: t('South Asian Art'), short: t('South Asia') },
  { id: 'a14', label: t('Middle Eastern & Islamic Art'), short: t('Middle East & Islamic') },
  { id: 'a15', label: t('African Art'), short: t('Africa') },
  { id: 'a16', label: t('Latin American Art'), short: t('Latin America') },
  { id: 'a17', label: t('Indigenous & Oceanian Art'), short: t('Indigenous & Oceania') },
  { id: 'a18', label: t('Photography, Design & Architecture'), short: t('Photography, design & architecture') },
]

export const DOMAIN_LABEL: Record<Domain, string> = {
  painting: t('Painting'), sculpture: t('Sculpture'), architecture: t('Architecture'), 'graphic-design': t('Graphic design'),
  typography: t('Typography'), photography: t('Photography'), design: t('Product & interior design'), craft: t('Craft'),
  printmaking: t('Printmaking'), performance: t('Performance'), installation: t('Installation'), 'film-video': t('Film & video'),
  digital: t('Digital & computational'), literature: t('Literature & text'), ceramics: t('Ceramics'), urbanism: t('Urbanism'),
}

/** Two-letter codes used by the compact index files. */
export const DOMAIN_CODE: Record<string, Domain> = {
  pt: 'painting', sc: 'sculpture', ar: 'architecture', gd: 'graphic-design', ty: 'typography', ph: 'photography',
  de: 'design', cr: 'craft', pm: 'printmaking', pf: 'performance', in: 'installation', fv: 'film-video',
  di: 'digital', li: 'literature', ce: 'ceramics', ur: 'urbanism',
}

/** Domains that connect fine art to design, type, architecture, photography and visual culture. */
export const APPLIED_DOMAINS: Domain[] = ['architecture', 'graphic-design', 'typography', 'photography', 'design', 'craft', 'urbanism', 'film-video', 'digital']

export const REGION_CODE: Record<string, RegionId> = {
  eu: 'europe', ea: 'east-asia', sa: 'south-asia', sea: 'southeast-asia', wana: 'west-asia-north-africa',
  ssa: 'sub-saharan-africa', na: 'north-america', cac: 'central-america-caribbean', sam: 'south-america', oc: 'oceania',
}

/** Origin labels in the artist list → regions. Labels not listed here fail loudly in the validator. */
export const ORIGIN_REGION: Record<string, RegionId> = {
  'Ancient Egypt': 'west-asia-north-africa', 'Ancient Greece': 'europe', 'Byzantine Empire': 'europe', 'Byzantine': 'europe', 'Russian tradition': 'europe',
  Russia: 'europe', Italy: 'europe', Flanders: 'europe', Netherlands: 'europe', Germany: 'europe', Spain: 'europe', France: 'europe',
  'United Kingdom': 'europe', Switzerland: 'europe', Austria: 'europe', Norway: 'europe', Romania: 'europe', Belgium: 'europe',
  Ukraine: 'europe', 'Russian Empire': 'europe', 'Soviet Union': 'europe', Hungary: 'europe', Ireland: 'europe', Sweden: 'europe',
  Denmark: 'europe', Iceland: 'europe', Serbia: 'europe', Finland: 'europe', Latvia: 'europe',
  'United States': 'north-america', Canada: 'north-america',
  Japan: 'east-asia', China: 'east-asia', Korea: 'east-asia',
  India: 'south-asia', Pakistan: 'south-asia', 'Mughal India': 'south-asia',
  Iran: 'west-asia-north-africa', Iraq: 'west-asia-north-africa', Egypt: 'west-asia-north-africa', Lebanon: 'west-asia-north-africa',
  Palestine: 'west-asia-north-africa', Turkey: 'west-asia-north-africa', 'Ottoman Empire': 'west-asia-north-africa', 'Safavid Iran': 'west-asia-north-africa',
  Persia: 'west-asia-north-africa', Herat: 'west-asia-north-africa', 'Timurid tradition': 'west-asia-north-africa',
  Nigeria: 'sub-saharan-africa', Sudan: 'sub-saharan-africa', Ethiopia: 'sub-saharan-africa', 'South Africa': 'sub-saharan-africa', Ghana: 'sub-saharan-africa',
  Kenya: 'sub-saharan-africa', 'Democratic Republic of the Congo': 'sub-saharan-africa', Mali: 'sub-saharan-africa', Senegal: 'sub-saharan-africa',
  Mexico: 'central-america-caribbean', Cuba: 'central-america-caribbean',
  Argentina: 'south-america', Uruguay: 'south-america', Brazil: 'south-america', Colombia: 'south-america', Venezuela: 'south-america', Chile: 'south-america',
  Australia: 'oceania', 'Aotearoa': 'oceania', 'New Zealand': 'oceania', Pacific: 'oceania', Niue: 'oceania', Samoa: 'oceania',
  'Australian Aboriginal artist collective': 'oceania',
}

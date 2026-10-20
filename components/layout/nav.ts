import { t } from '@/i18n'

export interface NavLinkDef { label: string; to: string; blurb: string }
export interface NavSection { no: string; label: string; to: string; blurb: string; match: string[]; links: NavLinkDef[] }

/** Single source for the header mega-menu, mobile menu and footer. Every entry is a real route. */
export const NAV: NavSection[] = [
  {
    no: '01', label: t('Explore'), to: '/explore', match: ['/explore'], blurb: t('See what was happening, where, and when.'),
    links: [
      { label: t('Overview'), to: '/explore', blurb: t('Four ways into the whole.') },
      { label: t('Global Interactive Timeline'), to: '/explore/timeline', blurb: t('Parallel regional lanes, zoom and filters.') },
      { label: t('Geographic Exploration'), to: '/explore/geography', blurb: t('Ten regions and a year slider.') },
      { label: t('Historical Periods'), to: '/explore/periods', blurb: t('Shared eras and regional periods.') },
      { label: t('Browse All'), to: '/explore/browse', blurb: t('Search and combine every filter.') },
      { label: t('Coverage & Gaps'), to: '/explore/coverage', blurb: t('Who and what is, and is not yet, here.') },
    ],
  },
  {
    no: '02', label: t('Movements & Traditions'), to: '/movements', match: ['/movements'], blurb: t('Schools, styles and long-lived traditions.'),
    links: [
      { label: t('All Movements'), to: '/movements', blurb: t('The full taxonomy, with filters.') },
      { label: t('Schools & Collectives'), to: '/movements?kind=school', blurb: t('Bauhaus, Gutai, Fluxus-era groups and more.') },
      { label: t('Art, Design & Typography'), to: '/movements?domain=graphic-design', blurb: t('Where art meets graphic design and type.') },
      { label: t('Architecture & Photography'), to: '/movements?domain=architecture', blurb: t('Building and picture-making movements.') },
    ],
  },
  {
    no: '03', label: t('Artists'), to: '/artists', match: ['/artists'], blurb: t('Individuals, workshops, guilds and anonymous makers.'),
    links: [
      { label: t('Artist Directory'), to: '/artists', blurb: t('Hundreds of makers, filterable.') },
      { label: t('Contemporary Practitioners'), to: '/artists?era=contemporary', blurb: t('Artists born 1930 or later.') },
      { label: t('Artist Relationships'), to: '/artists/relationships', blurb: t('Who taught, influenced or worked with whom.') },
    ],
  },
  {
    no: '04', label: t('Artworks'), to: '/artworks', match: ['/artworks'], blurb: t('Look closely, then compare.'),
    links: [
      { label: t('Artwork Collection'), to: '/artworks', blurb: t('Gallery with filters.') },
      { label: t('Artwork Comparison'), to: '/artworks/compare', blurb: t('Two works, side by side.') },
    ],
  },
  {
    no: '05', label: t('Connections'), to: '/connections', match: ['/connections', '/places'], blurb: t('How people, places, events and ideas link.'),
    links: [
      { label: t('Interactive Connections Map'), to: '/connections', blurb: t('Explore documented relationships.') },
      { label: t('Historical Events'), to: '/connections/events', blurb: t('What was happening around the art.') },
      { label: t('Cultural Exchanges'), to: '/connections/exchanges', blurb: t('Documented movement of ideas and materials.') },
      { label: t('Themes and Influences'), to: '/connections/themes', blurb: t('Patronage, materials, memory, return.') },
    ],
  },
  {
    no: '06', label: t('Learn'), to: '/learn', match: ['/learn'], blurb: t('Paths, quizzes and your progress.'),
    links: [
      { label: t('Learning Paths'), to: '/learn', blurb: t('Guided routes through the material.') },
      { label: t('Interactive Quizzes'), to: '/learn/quizzes', blurb: t('Five question types.') },
      { label: t('Learning Progress'), to: '/learn/progress', blurb: t('Scores and mastery on this device.') },
      { label: t('Saved Content'), to: '/learn/saved', blurb: t('Your bookmarks.') },
    ],
  },
]

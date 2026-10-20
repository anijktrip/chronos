import { theme } from './helpers'

const d = { start: -800, end: null } as const

export const themes = [
  theme({
    id: 'theme-power', title: 'Patronage and Power', dates: d, regions: ['europe', 'east-asia', 'south-asia', 'southeast-asia', 'sub-saharan-africa', 'south-america'],
    summary: 'How rulers, courts and states commissioned art to display, legitimise and remember authority.',
    sections: [{ heading: 'A recurring pattern', paragraphs: [
      'Across the world, rulers have used art to project power: the Qin emperor’s army of clay soldiers, Khmer temple-mountains, the Oba’s brass plaques, Mughal portraits, and Inka cloth all tie images to authority. Patronage also shaped style, because workshops made what patrons would pay for.',
      'Patronage was not only royal. In the Dutch Republic, merchants and civic companies were the major buyers — a reminder that who pays still shapes what gets made.'] }],
    artSignificance: 'Asking “who paid, and why?” is one of the quickest ways to understand why a work looks the way it does.',
  }),
  theme({
    id: 'theme-trade-materials', title: 'Trade, Materials and Pigments', dates: d, regions: ['europe', 'east-asia', 'sub-saharan-africa', 'south-asia'],
    summary: 'How the movement of goods — pigments, metals, paper, dyes — made new kinds of art possible.',
    sections: [{ heading: 'Materials travel', paragraphs: [
      'Vermeer’s blues rely on natural ultramarine made from lapis lazuli, which was mined in Afghanistan and reached Europe via trade routes. Hokusai’s celebrated blues use Prussian blue, a synthetic pigment first made in Europe in the early 18th century and imported to Japan. Benin’s brass castings drew on metal that analyses suggest arrived through European trade in brass bracelets (manillas).',
      'Material histories connect artworks to economies, labour and distant places that the finished image may not show.'] }],
    artSignificance: 'Knowing what a work is made of often reveals whom its maker was connected to.',
  }),
  theme({
    id: 'theme-sacred', title: 'Sacred Space and Cosmology', dates: d, regions: ['central-america-caribbean', 'southeast-asia', 'west-asia-north-africa', 'oceania'],
    summary: 'Art made to embody, house or communicate a view of the cosmos and its powers.',
    sections: [{ heading: 'Making the sacred visible', paragraphs: [
      'Maya rulers were pictured in relation to the world tree and the underworld; Angkor Wat represents a cosmic mountain; Qur’anic calligraphy gives the divine word visible form; and Māori meeting houses embody the body and genealogy of an ancestor. These works are not illustrations of belief — they are settings for ritual and memory.'] }],
    artSignificance: 'Reading such works means understanding their use and setting, not only their appearance.',
  }),
  theme({
    id: 'theme-landscape', title: 'Landscape and Nature', dates: d, regions: ['east-asia', 'europe'],
    summary: 'The depiction of mountains, water, weather and light, from Song China to Edo Japan and modern France.',
    sections: [{ heading: 'Many ways of seeing land', paragraphs: [
      'Song painters constructed monumental mountains as images of cosmic order. Edo-period print designers made travel and place into popular subjects. Impressionists painted changing light on water; Van Gogh turned a night sky into an expressive field. “Landscape” is not one tradition but many different relationships to the natural world.'] }],
    artSignificance: 'Comparing landscapes across cultures shows how differently nature has been understood and used.',
  }),
  theme({
    id: 'theme-portrait', title: 'Portrait and the Human Figure', dates: d, regions: ['europe', 'south-asia'],
    summary: 'How artists have represented the body, the individual and the ideal.',
    sections: [{ heading: 'Ideal and individual', paragraphs: [
      'Greek sculptors sought an ideal of proportion; Renaissance painters combined observation of individuals with ideal types; Dürer made an assertive self-portrait; Vermeer painted a “tronie” — a study of a character type, not a commissioned likeness; Mughal painters recorded recognisable courtiers and rulers. Each reflects a different idea of what a human image is for.'] }],
    artSignificance: 'The figure is a constant across cultures, which makes it a good place to compare their values.',
  }),
  theme({
    id: 'theme-migration-identity', title: 'Migration, Memory and Identity', dates: { start: 1840, end: null }, regions: ['north-america', 'oceania'],
    summary: 'Art that records movement, displacement and community self-definition.',
    sections: [{ heading: 'Making history visible', paragraphs: [
      'Jacob Lawrence’s Migration Series narrates the movement of Black Americans from the rural South to northern cities. Aaron Douglas shaped a visual language for the Harlem Renaissance. Te Hau ki Tūranga is an ancestral house that carries genealogy and the memory of a community through disruption.'] }],
    artSignificance: 'Art can be a way for communities to tell their own histories.',
  }),
  theme({
    id: 'theme-colonialism-return', title: 'Colonialism, Collecting and Return', dates: { start: 1800, end: null }, regions: ['sub-saharan-africa', 'oceania', 'europe'],
    summary: 'How empire shaped the movement of artworks into museums — and the continuing conversations about return.',
    sections: [{ heading: 'Why provenance matters', paragraphs: [
      'Many museum collections include works taken in colonial contexts. The 1897 British expedition against Benin City removed thousands of objects. Te Hau ki Tūranga was removed from its community in 1867. Today, institutions, governments and source communities negotiate return, shared stewardship and new ways of display.',
      'This prototype treats such histories as part of an artwork’s story, not a footnote to it.'] }],
    artSignificance: 'Provenance — an object’s journey — is part of how it should be understood.',
  }),
  theme({
    id: 'theme-print-technology', title: 'Technology of Making', dates: d, regions: ['europe', 'east-asia', 'north-america'],
    summary: 'How tools and techniques — woodblock, movable type, tube paint, new media — change what art can be.',
    sections: [{ heading: 'Tools shape images', paragraphs: [
      'Woodblock printing allowed Edo publishers to sell images cheaply to thousands. Printing with movable type and the engraving press spread images across Europe in the 15th and 16th centuries. The collapsible paint tube, patented in 1841, made painting outdoors more practical. Pollock’s use of liquid enamel paint poured onto canvas laid on the floor changed how a painting could be made.'] }],
    artSignificance: 'Technique is not neutral: it opens and limits what artists can do.',
  }),
]

import { movement, style } from './helpers'

/** Early modern to contemporary movements and schools. */
export const traditionsB = [
  style({
    id: 'style-mughal-painting', title: 'Mughal Painting', subtitle: 'South Asia · c. 1560 – c. 1750',
    summary: 'The painting of the imperial Mughal workshops, blending Persian, Indian and, later, European elements in manuscripts, albums and portraits.',
    regions: ['south-asia'], places: ['place-agra'], dates: { start: 1560, end: 1750, approx: true, label: 'c. 1560 – c. 1750' },
    themes: ['theme-power', 'theme-portrait', 'theme-trade-materials'], tags: ['painting', 'manuscript', 'album', 'court art'],
    periods: ['per-era-early-modern', 'per-mughal'], hero: 'art-jahangir',
    dateNote: 'Mughal painting began under Akbar in the 1560s and continued in regional and later courts, so its end date is conventional.',
    mediums: ['Opaque watercolour on paper', 'Gold', 'Ink'], techniques: ['Burnishing', 'Fine-brush portraiture', 'Illuminated borders (hashiya)'],
    context: [
      'Mughal painting was a court art, produced in an imperial workshop (kitābkhāna) of designers, colourists, portraitists and gilders. Emperors used painting to record history, display power and satisfy a keen interest in portraiture, nature and spectacle.',
      'Rulers were also enthusiastic collectors. Albums (muraqqaʿ) combined paintings and calligraphy, sometimes alongside European prints and Persian pictures.'],
    origins: [
      'Humayun, during exile in Safavid Persia, met court artists and recruited two of them, Mir Sayyid ʿAli and ʿAbd al-Samad, who joined him in India. Under his son Akbar (r. 1556–1605) they headed a workshop that grew to include many Indian painters, producing manuscripts such as the vast illustrated Hamzanama, begun about 1562.',
      'Under Jahangir (r. 1605–1627) painting turned toward portraiture, natural history and allegory, with artists like Bichitr, Abu’l Hasan and Mansur. European prints and paintings, brought by Jesuits and ambassadors, were studied.'],
    characteristics: [
      { title: 'Persianate foundation', text: 'Early Mughal manuscripts follow Persian conventions of flat decorative colour and elevated viewpoints.' },
      { title: 'Naturalism and portraiture', text: 'Individualised faces, observed animals and plants, and modelled forms increase, especially under Jahangir.' },
      { title: 'European elements', text: 'Shading, aerial perspective and motifs such as putti were selectively adapted from European prints.' },
      { title: 'Collaborative authorship', text: 'Works were often made by teams — a designer, a colourist and a portraitist — and attributions are usually based on inscriptions and style.' }],
    sources: ['s-beach', 's-freer'],
  }),
  style({
    id: 'style-ukiyo-e', title: 'Ukiyo-e', subtitle: 'East Asia · 17th – 19th century',
    summary: 'The “pictures of the floating world”: paintings and, above all, woodblock prints of urban entertainment, beauties, actors and landscapes in Edo-period Japan.',
    regions: ['east-asia'], places: ['place-edo'], dates: { start: 1660, end: 1900, approx: true, label: 'c. 1660 – c. 1900' },
    themes: ['theme-landscape', 'theme-print-technology', 'theme-trade-materials'], tags: ['woodblock print', 'Edo', 'popular culture', 'landscape'],
    periods: ['per-era-early-modern', 'per-era-modern', 'per-edo'], hero: 'art-great-wave',
    mediums: ['Colour woodblock print', 'Ink and colour on paper'], techniques: ['Woodblock carving and printing', 'Multi-block colour printing', 'Embossing and mica backgrounds'],
    context: [
      '“Ukiyo” originally referred to the transience of life; in the Edo period it came to mean the lively pleasure districts, theatres and teahouses of the city. Ukiyo-e depicted this world for the merchants and artisans who enjoyed it.',
      'Prints were commercial products. Publishers commissioned designs, specialist carvers cut the blocks and printers applied colour — a division of labour that made prints cheap enough for a wide audience.'],
    origins: [
      'Black-and-white printed illustrations appeared in the 17th century; artists such as Hishikawa Moronobu in the 1670s made single sheets. Full-colour prints, called nishiki-e, became possible from the mid-1760s.',
      'In the early 19th century, landscape and travel prints became popular subjects. Katsushika Hokusai’s Thirty-six Views of Mount Fuji (c. 1830–32) and Utagawa Hiroshige’s Fifty-three Stations of the Tōkaidō (1830s) brought place and weather to the fore.'],
    characteristics: [
      { title: 'Line and flat colour', text: 'Strong outlines enclose areas of flat colour with minimal modelling.' },
      { title: 'Bold composition', text: 'Dramatic cropping, high viewpoints and asymmetry would later strike European artists.' },
      { title: 'Collaborative production', text: 'Designer, carver, printer and publisher all shaped the final print.' },
      { title: 'Imported pigment', text: 'From about the 1820s printmakers used Prussian blue, enabling intense blues and graded tones.' }],
    sources: ['s-clark-hokusai', 's-thompson-floating'],
  }),
  movement({
    id: 'mov-renaissance', title: 'The Renaissance in Europe', subtitle: 'Europe · c. 1400 – c. 1600',
    summary: 'A period of renewed interest in classical antiquity, empirical observation and the status of the artist, centred on Italy and spreading across Europe.',
    regions: ['europe'], places: ['place-florence', 'place-venice', 'place-nuremberg'], dates: { start: 1400, end: 1600, approx: true, label: 'c. 1400 – c. 1600' },
    themes: ['theme-portrait', 'theme-print-technology', 'theme-power'], tags: ['painting', 'humanism', 'perspective', 'oil paint'],
    periods: ['per-era-early-modern'], hero: 'art-mona-lisa',
    dateNote: '“Renaissance” is a later label that is itself debated; dates vary by region and medium, and the Northern European Renaissance followed its own chronology.',
    mediums: ['Oil on panel', 'Tempera', 'Fresco', 'Engraving and woodcut', 'Marble and bronze'], techniques: ['Linear perspective', 'Sfumato', 'Chiaroscuro', 'Anatomical study'],
    context: [
      'Italian city-states such as Florence, Venice and Rome were commercially wealthy, politically competitive and rich in patrons: merchants, bankers such as the Medici, churches and popes. Artists worked in workshops (botteghe) and moved between courts.',
      'Humanist scholars revived classical learning, and artists engaged with ancient sculpture and architecture. In Northern Europe, centres such as Bruges, Nuremberg and Antwerp developed parallel traditions in oil painting and printmaking.'],
    origins: [
      'In early fifteenth-century Florence artists and theorists — Brunelleschi, Donatello, Masaccio, Alberti — developed linear perspective and a new sculptural naturalism. Alberti’s treatise on painting appeared in 1435.',
      'The High Renaissance (about 1490s–1520s) is associated with Leonardo, Raphael and Michelangelo. By the early 1500s Italian ideas were reaching Northern artists such as Albrecht Dürer, who also contributed print technique and theory in return.'],
    characteristics: [
      { title: 'Linear perspective', text: 'A mathematical system for representing three-dimensional space on a flat surface.' },
      { title: 'Observation of nature', text: 'Artists studied anatomy, light and plants, and compared the observed with ideal proportion.' },
      { title: 'Oil painting', text: 'Slow-drying oils allowed subtle blending and glazing, spreading from Northern Europe to Italy in the later fifteenth century.' },
      { title: 'The artist as author', text: 'Signed self-portraits, biographies and theoretical writing signal an elevated social standing for artists.' }],
    sources: ['s-baxandall', 's-met-toah', 's-gombrich'],
  }),
  style({
    id: 'style-dutch-golden-age', title: 'Dutch Golden Age Painting', subtitle: 'Europe · 17th century',
    summary: 'The painting of the newly independent Dutch Republic, notable for portraits, landscapes, still lifes and scenes of everyday life.',
    regions: ['europe'], places: ['place-amsterdam', 'place-delft'], dates: { start: 1600, end: 1680, approx: true, label: 'c. 1600 – c. 1680' },
    themes: ['theme-portrait', 'theme-trade-materials', 'theme-power'], tags: ['painting', 'oil paint', 'genre', 'portrait', 'market'],
    periods: ['per-era-early-modern', 'per-dutch-golden-age'], hero: 'art-pearl-earring',
    mediums: ['Oil on canvas', 'Oil on panel', 'Etching'], techniques: ['Chiaroscuro', 'Glazing', 'Fine-brush detail', 'Etching'],
    context: [
      'The Dutch Republic was a federation of provinces without a king. A prosperous urban middle class, civic organisations and the Dutch East India Company supplied buyers for paintings, which were sold through dealers, auctions and lotteries as well as by commission.',
      'Because Reformed churches generally excluded images, religious painting declined; secular subjects flourished, and painters tended to specialise in portraits, landscape, still life, genre scenes or history painting.'],
    origins: [
      'The Revolt against Spain (1568–1648) and the formation of the Republic created new institutions and patrons. Utrecht, Haarlem, Amsterdam, Leiden and Delft each developed local schools.',
      'Rembrandt in Amsterdam and Vermeer in Delft are both products of this environment, though their art took very different paths.'],
    characteristics: [
      { title: 'Everyday subjects', text: 'Interiors, taverns, kitchens, street scenes and still lifes were treated as worthy subjects, often with moral overtones.' },
      { title: 'Light and surface', text: 'Painters rendered textures — fabric, metal, glass — with extraordinary care and used light to create mood.' },
      { title: 'Market specialisation', text: 'Artists became known for a genre and produced for a broad market, rather than for a court.' },
      { title: 'Group portraits', text: 'Civic guards and charitable boards commissioned large group portraits to display their members.' }],
    sources: ['s-schama', 's-rijks', 's-mauritshuis'],
  }),
  movement({
    id: 'mov-impressionism', title: 'Impressionism', subtitle: 'Europe · c. 1865 – 1886',
    summary: 'A Paris-based movement of painters who sought to capture fleeting effects of light and modern life with rapid, broken brushwork.',
    regions: ['europe'], places: ['place-paris'], dates: { start: 1865, end: 1886, approx: true, label: 'c. 1865 – 1886' },
    themes: ['theme-landscape', 'theme-print-technology'], tags: ['painting', 'plein air', 'modern life', 'France'],
    periods: ['per-era-modern'], hero: 'art-impression-sunrise',
    dateNote: 'The group held eight joint exhibitions between 1874 and 1886; individual painters developed the approach earlier and continued afterward.',
    mediums: ['Oil on canvas', 'Pastel'], techniques: ['Broken brushwork', 'Painting outdoors (en plein air)', 'Optical colour mixing'],
    context: [
      'Paris was being rebuilt as a modern city, and the railway brought leisure outings to the Seine and the coast. The official Salon, run by the Académie des Beaux-Arts, controlled much of the art market, favouring polished history painting and portraiture.',
      'Frustrated by Salon rejection, a group of artists organised their own exhibitions, beginning in April 1874 in the former studio of the photographer Nadar.'],
    origins: [
      'Painters including Claude Monet, Pierre-Auguste Renoir, Camille Pissarro, Alfred Sisley and Berthe Morisot developed a lighter palette and looser touch in the 1860s, influenced by the Barbizon School, Manet, and Japanese prints.',
      'The name derives from a mocking review by the critic Louis Leroy, who took the title of Monet’s Impression, Sunrise (shown in 1874) as a label for the whole show; the artists later adopted the term.'],
    characteristics: [
      { title: 'Broken brushwork', text: 'Short touches of unmixed colour sit side by side so that forms are suggested rather than outlined.' },
      { title: 'Light and atmosphere', text: 'Painters sought to record the changing effects of light and weather at a particular moment.' },
      { title: 'Modern life', text: 'Boulevards, cafés, stations, gardens and leisure were treated as subjects.' },
      { title: 'Outdoor practice', text: 'Portable easels and tube paints supported painting directly from the motif, though many works were finished in the studio.' }],
    sources: ['s-rewald', 's-marmottan', 's-met-toah'],
  }),
  movement({
    id: 'mov-post-impressionism', title: 'Post-Impressionism', subtitle: 'Europe · c. 1886 – 1905',
    summary: 'A label for artists who built on Impressionism’s colour while turning to structure, symbolism and personal expression.',
    regions: ['europe'], places: ['place-paris', 'place-saint-remy'], dates: { start: 1886, end: 1905, approx: true, label: 'c. 1886 – c. 1905' },
    themes: ['theme-landscape', 'theme-trade-materials'], tags: ['painting', 'colour', 'expression'],
    periods: ['per-era-modern'], hero: 'art-starry-night',
    dateNote: 'The term was coined later by the critic Roger Fry for an exhibition in London in 1910; it groups diverse artists rather than a single organised movement.',
    mediums: ['Oil on canvas'], techniques: ['Impasto', 'Contour outlining', 'Symbolic colour'],
    context: [
      'Post-Impressionism covers painters who, after the last Impressionist exhibition in 1886, pursued individual directions: Cézanne’s analysis of structure, Seurat’s systematic dots, Gauguin’s symbolism, and Van Gogh’s expressive colour and line.',
      'These artists were connected by Paris dealers, exhibitions and personal friendships, including Vincent and Theo van Gogh, who lived in Paris in 1886–88.'],
    origins: [
      'Roger Fry used the label “Post-Impressionism” for the 1910 exhibition Manet and the Post-Impressionists in London. Historians use it as a convenient term and debate its limits.',
      'Van Gogh arrived in Paris in 1886, met Impressionist and Neo-Impressionist painters, and studied Japanese prints; he soon moved to the south of France.'],
    characteristics: [
      { title: 'Colour as expression', text: 'Colour is chosen for emotional or symbolic effect rather than strictly matching appearance.' },
      { title: 'Structure and form', text: 'Many artists reworked Impressionism’s optical sensations into more solid compositions.' },
      { title: 'Visible gesture', text: 'Thick paint and rhythmic brush marks are part of the meaning.' },
      { title: 'Lines of influence', text: 'Cézanne’s late work and Gauguin’s symbolism were important to later painters including Picasso and Matisse.' }],
    sources: ['s-vgm', 's-moma', 's-met-toah'],
  }),
  movement({
    id: 'mov-cubism', title: 'Cubism', subtitle: 'Europe · c. 1907 – c. 1920',
    summary: 'A revolutionary approach to representation, developed by Picasso and Braque, that depicts subjects from multiple viewpoints through fragmented, geometric forms.',
    regions: ['europe'], places: ['place-paris'], dates: { start: 1907, end: 1920, approx: true, label: 'c. 1907 – c. 1920' },
    themes: ['theme-portrait', 'theme-colonialism-return'], tags: ['painting', 'collage', 'avant-garde', 'Paris'],
    periods: ['per-era-modern'], hero: 'art-demoiselles',
    dateNote: 'Cubism is usually divided into Analytic (c. 1909–12) and Synthetic (c. 1912–14) phases, with later Cubist-influenced work continuing into the 1920s.',
    mediums: ['Oil on canvas', 'Collage', 'Papier collé'], techniques: ['Multiple viewpoints', 'Faceting', 'Collage'],
    context: [
      'Paris in the early twentieth century was a magnet for artists from across Europe and beyond. Dealers such as Daniel-Henry Kahnweiler supported experimental work, and artists drew on sources including Cézanne, Iberian sculpture, and African and Oceanic objects seen in Paris.',
      'The advent of new technologies — photography, cinema, rapid transport — and new ideas about space and time are often cited as backgrounds, though historians debate their direct influence.'],
    origins: [
      'Picasso’s Les Demoiselles d’Avignon (1907) is widely seen as a precursor. Beginning around 1908 Picasso and Georges Braque worked in close dialogue, and for some years their pictures are hard to tell apart. The name came from a critic’s remark about “cubes” in Braque’s 1908 landscapes.',
      'Synthetic Cubism, from about 1912, introduced collage and brighter colour; artists such as Juan Gris, Fernand Léger and others extended the idea in different directions.'],
    characteristics: [
      { title: 'Multiple viewpoints', text: 'A subject is shown from several angles at once, shattering the single viewpoint of perspective.' },
      { title: 'Geometric fragmentation', text: 'Forms break into planes and facets, with the background merging into the figure.' },
      { title: 'Restricted palette', text: 'In Analytic Cubism, browns, greys and ochres keep attention on structure.' },
      { title: 'Collage', text: 'Real materials — newspaper, wallpaper — enter the picture, questioning the boundary between art and reality.' }],
    sources: ['s-golding', 's-moma', 's-met-toah'],
  }),
  movement({
    id: 'mov-harlem-renaissance', title: 'Harlem Renaissance', subtitle: 'North America · c. 1918 – 1937',
    summary: 'A flowering of Black art, literature and music centred on Harlem, New York, in the 1920s and 1930s.',
    regions: ['north-america'], places: ['place-harlem'], dates: { start: 1918, end: 1937, approx: true, label: 'c. 1918 – c. 1937' },
    themes: ['theme-migration-identity'], tags: ['painting', 'mural', 'literature', 'African American'],
    periods: ['per-era-modern'], hero: 'art-aspects-of-negro-life',
    dateNote: 'The movement was originally known as the “New Negro Movement”; scholars date its peak between about 1920 and the mid-1930s.',
    mediums: ['Oil on canvas', 'Mural painting', 'Printmaking', 'Sculpture'], techniques: ['Silhouette and layered colour planes', 'Mural painting'],
    context: [
      'The Great Migration brought large Black populations to Harlem and other northern cities. Writers, musicians, and artists gathered there, publishing in magazines such as The Crisis and Opportunity, and in the anthology The New Negro (1925), edited by Alain Locke.',
      'Locke and others urged artists to draw on African heritage and African American life as sources of pride and modern expression. Patronage was mixed: some white patrons supported artists, and later the federal Works Progress Administration funded public art.'],
    origins: [
      'Aaron Douglas, who arrived in Harlem in 1925, illustrated books and magazines and developed a style that combined modernist geometry, silhouette figures and references to African and Egyptian art.',
      'In 1934 Douglas painted a four-panel mural series, Aspects of Negro Life, for a branch of the New York Public Library in Harlem.'],
    characteristics: [
      { title: 'African heritage and modern form', text: 'Artists combined stylised forms from African art with the visual language of Art Deco and Cubism.' },
      { title: 'Silhouette and concentric rings', text: 'Douglas’s figures are flat dark silhouettes within overlapping circles of colour that suggest movement and radiating light.' },
      { title: 'History painting', text: 'Murals and prints presented Black history as monumental subject matter.' },
      { title: 'A multi-arts movement', text: 'Art developed alongside poetry, fiction and jazz, and cross-fertilised with them.' }],
    sources: ['s-powell', 's-locke', 's-schomburg'],
  }),
  movement({
    id: 'mov-abstract-expressionism', title: 'Abstract Expressionism', subtitle: 'North America · c. 1943 – c. 1965',
    summary: 'The postwar New York School of large-scale abstract painting, from gestural “action painting” to fields of colour.',
    regions: ['north-america'], places: ['place-new-york'], dates: { start: 1943, end: 1965, approx: true, label: 'c. 1943 – c. 1965' },
    themes: ['theme-print-technology'], tags: ['painting', 'abstraction', 'New York School', 'postwar'],
    periods: ['per-era-contemporary'], hero: 'art-autumn-rhythm',
    mediums: ['Oil on canvas', 'Enamel paint'], techniques: ['Pouring and dripping', 'Gestural brushwork', 'Colour field'],
    context: [
      'After the Second World War, New York emerged as a leading centre of the art world, with galleries, critics and museum exhibitions that promoted American painting. The presence of exiled European artists had stimulated debate on Surrealism, automatism and abstraction.',
      'The movement was never a unified group: its artists, including Jackson Pollock, Willem de Kooning, Lee Krasner, Mark Rothko, Barnett Newman and Clyfford Still, differed widely in approach.'],
    origins: [
      'Many of the artists had worked on the Federal Art Project in the 1930s and absorbed influences ranging from Mexican muralism and Picasso to Surrealism. The critic Harold Rosenberg coined the term “action painting” in 1952.',
      'Pollock moved to Springs, Long Island, in 1945 and from about 1947 developed his poured paintings, laying canvas on the floor and working from all sides.'],
    characteristics: [
      { title: 'Scale', text: 'Very large canvases surround the viewer, creating a bodily experience.' },
      { title: 'Process visible', text: 'The marks record the artist’s gestures; painting is presented as an event as much as an image.' },
      { title: 'Non-representational', text: 'Pictures rely on line, colour and surface rather than depicting recognisable subjects.' },
      { title: 'Two strands', text: 'Gestural “action” painting and “colour field” painting are often distinguished.' }],
    sources: ['s-sandler', 's-met', 's-moma'],
  }),
]

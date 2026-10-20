import { exchange } from './helpers'

export const exchanges = [
  exchange({
    id: 'exc-japonisme', title: 'Japonisme: Japanese Art and the West', subtitle: 'c. 1860s – 1900',
    flows: 'Japan → France and wider Europe and North America',
    summary: 'The 19th-century vogue for Japanese art — especially colour woodblock prints — among European and American artists, collectors and designers.',
    regions: ['east-asia', 'europe'], places: ['place-paris', 'place-edo'], dates: { start: 1860, end: 1900, approx: true, label: 'c. 1860s – 1900' },
    sections: [
      { heading: 'How the prints travelled', paragraphs: [
        'After Japan’s ports opened in the 1850s, Japanese goods arrived in Europe in growing numbers, and Japan took part in international exhibitions, including Paris in 1867. Prints and illustrated books were sold by dealers such as Siegfried Bing in Paris. The French critic Philippe Burty coined the term “japonisme” in 1872.'] },
      { heading: 'What artists did with them', paragraphs: [
        'Claude Monet collected Japanese prints, and more than two hundred of them remain at his house in Giverny. In 1887 Vincent van Gogh made oil copies of prints by Hiroshige and others, and he collected hundreds of prints with his brother Theo. Compositional features that artists admired included flat colour areas, bold cropping, high viewpoints and unconventional asymmetry.'] },
      { heading: 'Cautions', paragraphs: [
        'Influence ran in more than one direction and was not a simple “borrowing”: Japanese artists were themselves aware of European perspective and imported pigments. Western enthusiasm also reflected a stereotyped, commercial image of Japan. Specific claims about which print influenced which painting should be checked against the scholarship.'] },
    ],
    artSignificance: 'A documented, two-way traffic of images and materials — not a coincidence of style.', sources: ['s-weisberg', 's-clark-hokusai', 's-vgm'],
  }),
  exchange({
    id: 'exc-mughal-europe', title: 'Mughal–European Image Exchange', subtitle: 'c. 1580 – 1630',
    flows: 'Europe ↔ Mughal India',
    summary: 'European prints, paintings and gifts entered the Mughal court through Jesuit missions and embassies, and Mughal artists absorbed, adapted and answered them.',
    regions: ['south-asia', 'europe'], places: ['place-agra'], dates: { start: 1580, end: 1630, approx: true, label: 'c. 1580 – 1630' },
    sections: [
      { heading: 'Channels', paragraphs: [
        'In 1580 Jesuit missionaries visited Akbar’s court bringing, among other things, a multivolume Polyglot Bible illustrated with Flemish engravings. Later, in 1615–1619, the English ambassador Sir Thomas Roe resided at Jahangir’s court. European prints and gifts gave Mughal artists new models for modelling, perspective and iconography.'] },
      { heading: 'In the paintings', paragraphs: [
        'Mughal painters adapted features such as modelled drapery, atmospheric backgrounds and winged figures, often reinterpreting them for imperial ends. In Bichitr’s Jahangir Preferring a Sufi Shaikh to Kings, a portrait of King James I of England appears among the rulers whom the emperor ignores, and winged putti of European derivation appear in the composition.'] },
    ],
    artSignificance: 'Mughal painters were selective and inventive in their use of European sources.', sources: ['s-beach'],
  }),
  exchange({
    id: 'exc-dejima', title: 'Dutch–Japanese Exchange at Dejima', subtitle: '1641 – 1859',
    flows: 'Europe ↔ Japan (via Nagasaki)',
    summary: 'During Japan’s restricted foreign contact, the Dutch trading post at Dejima was the principal channel for European goods, books and ideas.',
    regions: ['east-asia', 'europe'], places: ['place-edo'], dates: { start: 1641, end: 1859, label: '1641 – 1859' },
    sections: [
      { heading: 'A controlled channel', paragraphs: [
        'From 1641 the Dutch East India Company was confined to the artificial island of Dejima at Nagasaki. Through it came books, scientific instruments, prints and materials. A body of study based on Dutch learning (rangaku) developed among Japanese scholars.'] },
      { heading: 'Effects on pictures', paragraphs: [
        'Western-style linear perspective became a feature of some Edo-period prints, called uki-e (“floating pictures”). The synthetic pigment Prussian blue reached Japan through trade by the early 19th century and was used by printmakers, notably in prints of the late 1820s–1830s, including Hokusai’s Thirty-six Views of Mount Fuji.'] },
    ],
    artSignificance: 'Even a highly restricted channel shaped technique and materials.', sources: ['s-clark-hokusai', 's-thompson-floating'],
  }),
  exchange({
    id: 'exc-paris-africa', title: 'African and Oceanic Art in Early 20th-century Paris', subtitle: 'c. 1900 – 1914',
    flows: 'Africa & Oceania (via colonial collecting) → Paris',
    summary: 'Objects collected in colonial contexts reached Paris museums and dealers, and avant-garde artists responded to them — in ways that remain debated.',
    regions: ['europe', 'sub-saharan-africa', 'oceania'], places: ['place-paris'], dates: { start: 1900, end: 1914, approx: true, label: 'c. 1900 – 1914' },
    sections: [
      { heading: 'What is documented', paragraphs: [
        'Paris museums such as the Trocadéro ethnographic museum and dealers handled African and Oceanic objects acquired through colonial expansion. Artists including Matisse, Derain, Vlaminck and Picasso saw, bought or collected such objects. Picasso said he visited the Trocadéro museum in 1907 while working on Les Demoiselles d’Avignon, though the exact sequence and meaning of that encounter have been questioned by historians.'] },
      { heading: 'Critical perspectives', paragraphs: [
        'The older term “primitivism” has been challenged for treating the makers as timeless and anonymous and for ignoring the colonial violence behind acquisition. Contemporary scholarship emphasises the original contexts and makers of the objects and the unequal conditions of exchange, and notes that other sources — such as ancient Iberian sculpture — were also important to Picasso at this time.'] },
    ],
    artSignificance: 'A reminder that “influence” often travelled along colonial routes and was selectively understood.', sources: ['s-golding', 's-met-toah'],
  }),
  exchange({
    id: 'exc-durer-italy', title: 'Dürer and the Italian Renaissance', subtitle: '1494 – 1507',
    flows: 'Italy ↔ Germany',
    summary: 'Albrecht Dürer’s journeys to Venice linked German print culture to Italian ideas of proportion, perspective and the artist’s status.',
    regions: ['europe'], places: ['place-venice', 'place-nuremberg'], dates: { start: 1494, end: 1507, label: '1494 – 1507' },
    sections: [
      { heading: 'Two journeys', paragraphs: [
        'Dürer travelled to Venice in 1494–95 and again in 1505–07. He studied Italian art, met leading artists, and engaged with ideas about ideal proportion and perspective that he later pursued in his theoretical writings.'] },
      { heading: 'Two-way traffic', paragraphs: [
        'Dürer’s prints, widely sold and copied, also travelled south and were admired and imitated in Italy. His 1500 self-portrait, which presents the artist in a frontal, Christ-like pose, expresses a new confidence about the dignity of the artist’s calling.'] },
    ],
    artSignificance: 'Shows how ideas moved by journeys and by prints.', sources: ['s-met-toah', 's-pinakothek'],
  }),
]

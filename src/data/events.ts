import { event } from './helpers'

export const events = [
  event({
    id: 'evt-qin-unification', kindOfEvent: 'political', title: 'Unification of China under Qin', subtitle: '221 BCE',
    summary: 'The Qin state completed its conquest of rival states and the king took the title First Emperor.',
    regions: ['east-asia'], places: ['place-lintong'], dates: { start: -221, label: '221 BCE' },
    sections: [
      { heading: 'What happened', paragraphs: [
        'Between 230 and 221 BCE the state of Qin conquered the remaining rival states. Its king then adopted the new title huangdi (“emperor”), becoming Qin Shi Huang. The state standardised writing, currency, weights and measures, and built roads and fortifications.'] },
      { heading: 'Connection to art', paragraphs: [
        'A unified state could organise labour and materials at a scale no single earlier state had. The emperor’s mausoleum complex near Lintong, with its pits of life-sized terracotta soldiers, horses and chariots, reflects that capacity — and a standardised, modular approach to production.'] },
    ],
    artSignificance: 'State power and standardisation shaped how the Terracotta Army was produced.', sources: ['s-portal'],
  }),
  event({
    id: 'evt-gutenberg', kindOfEvent: 'technological', title: 'Printing with Movable Type in Europe', subtitle: 'c. 1450',
    summary: 'Johannes Gutenberg developed a system of printing with movable metal type in Mainz around 1450.',
    regions: ['europe'], places: ['place-nuremberg'], dates: { start: 1450, approx: true, label: 'c. 1450' },
    sections: [
      { heading: 'What happened', paragraphs: [
        'In Mainz, Johannes Gutenberg developed a printing system that combined movable metal type, an adapted press and oil-based ink. The so-called Gutenberg Bible was printed in the mid-1450s. (Movable type had been developed earlier in East Asia, and woodblock printing is far older; the European system developed independently in its details.)'] },
      { heading: 'Connection to art', paragraphs: [
        'Printing made text and images reproducible and portable. Printmakers working in woodcut and engraving — including Albrecht Dürer, whose godfather Anton Koberger ran one of Europe’s largest printing houses in Nuremberg — circulated pictures widely across Europe.'] },
    ],
    artSignificance: 'Reproducible images changed how artists became known and how styles travelled.', sources: ['s-met-toah'],
  }),
  event({
    id: 'evt-cajamarca', kindOfEvent: 'political', title: 'Spanish Capture of Atahualpa at Cajamarca', subtitle: '1532',
    summary: 'A small Spanish force captured the Inka ruler Atahualpa, beginning the end of the independent empire.',
    regions: ['south-america'], places: ['place-cusco'], dates: { start: 1532, label: '1532' },
    sections: [
      { heading: 'What happened', paragraphs: [
        'In November 1532 Francisco Pizarro’s expedition captured Atahualpa at Cajamarca. Despite a large ransom, Atahualpa was executed in 1533, and the Spanish entered Cusco that year. Civil war within the Inka state and the spread of Old World diseases contributed to the collapse of centralised rule.'] },
      { heading: 'Connection to art', paragraphs: [
        'The Spanish conquest disrupted state weaving and the courtly use of cloth. Inka textile forms and motifs nonetheless continued in colonial-era Andean weaving, which blended Andean and European elements.'] },
    ],
    artSignificance: 'Conquest ended imperial patronage but did not end Andean textile traditions.', sources: ['s-phipps'],
  }),
  event({
    id: 'evt-panipat-1526', kindOfEvent: 'political', title: 'First Battle of Panipat', subtitle: '1526',
    summary: 'Babur’s victory over the Sultan of Delhi laid the foundation of the Mughal Empire.',
    regions: ['south-asia'], places: ['place-agra'], dates: { start: 1526, label: '1526' },
    sections: [
      { heading: 'What happened', paragraphs: [
        'On 21 April 1526 Babur, a Timurid prince from Central Asia, defeated Ibrahim Lodi, the Sultan of Delhi, at Panipat. This established Mughal rule in northern India. Babur’s son Humayun lost and then regained the throne, spending years of exile in the Safavid Persian court.'] },
      { heading: 'Connection to art', paragraphs: [
        'During his exile Humayun encountered Persian court painting and, on his return to India in 1555, brought with him the Persian artists Mir Sayyid ʿAli and ʿAbd al-Samad. Their work, and the large imperial workshop that Akbar later built, was the seedbed of Mughal painting.'] },
    ],
    artSignificance: 'A dynastic change moved artists and styles across Asia.', sources: ['s-beach'],
  }),
  event({
    id: 'evt-dutch-revolt', kindOfEvent: 'political', title: 'The Dutch Revolt (Eighty Years’ War)', subtitle: '1568 – 1648',
    summary: 'A long conflict through which the northern Netherlands broke away from Habsburg Spain.',
    regions: ['europe'], places: ['place-amsterdam'], dates: { start: 1568, end: 1648, label: '1568 – 1648' },
    sections: [
      { heading: 'What happened', paragraphs: [
        'Religious and political tensions under Spanish Habsburg rule erupted into revolt in 1568. The northern provinces declared their independence in 1581 and developed into the Dutch Republic; Spain formally recognised the Republic in the Peace of Münster in 1648. In parallel, the Dutch East India Company (VOC, founded 1602) built a global trading network.'] },
      { heading: 'Connection to art', paragraphs: [
        'The Reformed Church was largely wary of images in churches, and there was no royal court at the centre of the Republic. Painters therefore depended on a broad market of merchants, civic bodies and private buyers, encouraging specialisation in portraits, still life, landscape and scenes of everyday life.'] },
    ],
    artSignificance: 'The political and religious settlement shaped the market and subjects of Dutch painting.', sources: ['s-schama'],
  }),
  event({
    id: 'evt-waitangi', kindOfEvent: 'political', title: 'Treaty of Waitangi', subtitle: '1840',
    summary: 'An agreement between the British Crown and many Māori rangatira (chiefs), foundational to modern Aotearoa New Zealand.',
    regions: ['oceania'], places: ['place-manutuke'], dates: { start: 1840, label: '1840' },
    sections: [
      { heading: 'What happened', paragraphs: [
        'The Treaty of Waitangi was first signed on 6 February 1840. Māori and English texts differ in meaning on key points such as sovereignty and authority, a difference that remains central to historical and legal debate. Settlement and land loss accelerated in the following decades.'] },
      { heading: 'Connection to art', paragraphs: [
        'Māori carving traditions continued and adapted through the early colonial period. Meeting houses such as Te Hau ki Tūranga, carved in 1842–43, were built in the decade after the Treaty and became sites where communities asserted identity and memory amid rapid change.'] },
    ],
    artSignificance: 'Colonial change forms the setting in which many 19th-century Māori carved houses were made and, later, contested.', sources: ['s-tepapa'],
  }),
  event({
    id: 'evt-paint-tube', kindOfEvent: 'technological', title: 'Invention of the Collapsible Paint Tube', subtitle: '1841',
    summary: 'The American portraitist John Goffe Rand patented a collapsible tin tube for storing oil paint.',
    regions: ['europe', 'north-america'], places: ['place-paris'], dates: { start: 1841, label: '1841' },
    sections: [
      { heading: 'What happened', paragraphs: [
        'John Goffe Rand, an American portrait painter living in London, patented a squeezable tin tube for oil paint in 1841. Previously paint was stored in pig’s bladders or glass syringes, which were fragile and awkward to carry. Ready-made paints in tubes became widely available over the following decades.'] },
      { heading: 'Connection to art', paragraphs: [
        'Portable, durable paint made it more practical to paint outdoors and to work quickly on site. This was one of several conditions — alongside the railway, new pigments and a changing art market — that supported the open-air practice of the Impressionists.'] },
    ],
    artSignificance: 'A practical invention widened where and how painters could work.', sources: ['s-met-toah'],
  }),
  event({
    id: 'evt-perry', kindOfEvent: 'political', title: 'Perry Expedition and the Opening of Japan', subtitle: '1853 – 1854',
    summary: 'A US naval squadron under Commodore Matthew Perry pressed Japan to open to foreign trade, ending the shogunate’s restrictions.',
    regions: ['east-asia'], places: ['place-edo'], dates: { start: 1853, end: 1854, label: '1853 – 1854' },
    sections: [
      { heading: 'What happened', paragraphs: [
        'In July 1853 Perry’s “black ships” anchored near Edo and delivered a letter demanding trade. He returned in 1854 and the Convention of Kanagawa opened ports at Shimoda and Hakodate. Further treaties followed, and the Tokugawa shogunate fell in 1868.'] },
      { heading: 'Connection to art', paragraphs: [
        'As trade expanded, Japanese prints, ceramics, lacquer and textiles reached Europe and the United States in far greater numbers, and Japan took part in European international exhibitions. This growing availability underpins the Western vogue for Japanese art known as Japonisme.'] },
    ],
    artSignificance: 'Political opening multiplied the channels by which Japanese art reached the West.', sources: ['s-weisberg'],
  }),
  event({
    id: 'evt-haussmann', kindOfEvent: 'social', title: 'Haussmann’s Renovation of Paris', subtitle: '1853 – 1870',
    summary: 'Under Napoleon III, Baron Haussmann rebuilt central Paris with wide boulevards, parks and new infrastructure.',
    regions: ['europe'], places: ['place-paris'], dates: { start: 1853, end: 1870, label: '1853 – 1870' },
    sections: [
      { heading: 'What happened', paragraphs: [
        'As Prefect of the Seine, Georges-Eugène Haussmann oversaw the demolition of much of medieval Paris and the construction of broad boulevards, new sewers, parks and railway stations. Many working-class residents were displaced.'] },
      { heading: 'Connection to art', paragraphs: [
        'The new city of boulevards, cafés, department stores and leisure grounds became a subject for painters including Monet, Renoir and Caillebotte. Modern urban life was a theme of Impressionism, alongside landscape and the suburbs reached by train.'] },
    ],
    artSignificance: 'A changed city supplied new subjects and new kinds of public life to depict.', sources: ['s-rewald'],
  }),
  event({
    id: 'evt-benin-1897', kindOfEvent: 'political', title: 'British Expedition against Benin City', subtitle: '1897',
    summary: 'A British military expedition captured and burned Benin City and removed thousands of works of art.',
    regions: ['sub-saharan-africa'], places: ['place-benin-city'], dates: { start: 1897, label: '1897' },
    sections: [
      { heading: 'What happened', paragraphs: [
        'In February 1897 a British force took Benin City, ostensibly in reprisal for the killing of a British-led party. The Oba, Ovonramwen, was exiled. Thousands of brass plaques, ivories and other objects were taken; many were sold and entered museums and private collections in Europe and North America.'] },
      { heading: 'Connection to art', paragraphs: [
        'The expedition dispersed the court’s art and the archive of its history, and made the “Benin Bronzes” among the most discussed objects in debates about colonial-era acquisition and restitution. Since 2022 several museums and governments have transferred ownership of, or physically returned, some objects to Nigeria, while discussions continue.'] },
    ],
    artSignificance: 'One event explains both why Benin works are in museums worldwide and why their return is debated.', sources: ['s-hicks', 's-plankensteiner'],
  }),
  event({
    id: 'evt-great-migration', kindOfEvent: 'social', title: 'The Great Migration', subtitle: 'c. 1916 – 1970',
    summary: 'The movement of roughly six million Black Americans from the rural South to cities of the North, Midwest and West.',
    regions: ['north-america'], places: ['place-harlem'], dates: { start: 1916, end: 1970, approx: true, label: 'c. 1916 – 1970' },
    sections: [
      { heading: 'What happened', paragraphs: [
        'Beginning around the First World War, millions of Black Americans left the South, seeking work and escaping racial violence and segregation. Cities such as New York, Chicago, Detroit and Philadelphia grew rapidly. The migration is conventionally divided into a first wave (c. 1916–1940) and a second wave (c. 1940–1970).'] },
      { heading: 'Connection to art', paragraphs: [
        'Harlem became a magnet for writers, musicians and artists, creating the setting for the Harlem Renaissance. Later, Jacob Lawrence made the migration itself the subject of a 60-panel series (1940–41).'] },
    ],
    artSignificance: 'Mass movement shaped both the communities that made art and the stories art told.', sources: ['s-powell'],
  }),
  event({
    id: 'evt-wwii', kindOfEvent: 'political', title: 'The Second World War', subtitle: '1939 – 1945',
    summary: 'A global war that displaced millions, including many European artists who sought refuge in the United States.',
    regions: ['europe', 'north-america', 'east-asia'], places: ['place-new-york'], dates: { start: 1939, end: 1945, label: '1939 – 1945' },
    sections: [
      { heading: 'What happened', paragraphs: [
        'The war in Europe and Asia killed tens of millions and displaced many more. Several prominent European artists and dealers emigrated to New York, including members of the Surrealist circle, before and during the war.'] },
      { heading: 'Connection to art', paragraphs: [
        'The presence of émigré artists, the collections shown at new venues such as Peggy Guggenheim’s Art of This Century gallery (opened 1942), and an atmosphere of existential crisis are among the contexts historians cite for the emergence of Abstract Expressionism in New York.'] },
    ],
    artSignificance: 'War reshaped where art was made and what it needed to say.', sources: ['s-sandler'],
  }),
]

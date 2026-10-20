import { period } from './helpers'

const FRAME =
  'Broad eras are a shared reference frame for comparing regions on one axis. They are a convenience, not a claim that every culture experienced the same turning points — many regions have their own periodisations, which appear alongside as regional periods.'

export const periods = [
  // ------------------------------------------------------------ shared eras
  period({
    id: 'per-era-antiquity', scope: 'era', title: 'Antiquity', subtitle: 'to c. 500 CE',
    summary: 'The first cities, states and monumental art traditions, from the river valleys to the Mediterranean, Mesoamerica and the Andes.',
    regions: ['europe', 'east-asia', 'south-asia', 'west-asia-north-africa', 'sub-saharan-africa', 'central-america-caribbean', 'south-america'],
    dates: { start: -3000, end: 500, approx: true, label: 'to c. 500 CE' },
    sections: [
      { heading: 'What the frame covers', paragraphs: [
        'Antiquity here means the long span from the earliest cities to roughly the fifth century CE. It includes Egypt and Mesopotamia, the Greek and Roman worlds, the Persian empires, Qin and Han China, the Indus and Mauryan–Gupta worlds, Nubia, early Mesoamerican cultures such as the Olmec and Maya, and early Andean societies.',
        FRAME] },
    ],
    artSignificance: 'Many of the techniques that later traditions inherit or react to — monumental stone carving, bronze casting, ceramic modelling, writing as image — were established in this span.',
  }),
  period({
    id: 'per-era-postclassical', scope: 'era', title: 'Post-classical World', subtitle: 'c. 500 – c. 1400',
    summary: 'A thousand years of connected courts, religions and trade routes — Byzantine, Islamic, Tang and Song, Angkorian, Maya and West African worlds.',
    regions: ['europe', 'east-asia', 'south-asia', 'southeast-asia', 'west-asia-north-africa', 'sub-saharan-africa', 'central-america-caribbean', 'oceania'],
    dates: { start: 500, end: 1400, approx: true, label: 'c. 500 – c. 1400' },
    sections: [
      { heading: 'What the frame covers', paragraphs: [
        'Often called the “medieval” period in European history, this span is better understood globally as an era of expanding networks: the spread of Buddhism, Christianity and Islam, the Tang and Song dynasties in China, Angkor in Southeast Asia, Classic Maya city-states and their successors, and the long-distance trade that linked them.',
        FRAME] },
    ],
    artSignificance: 'Religious and courtly patronage organised much of the era’s art, and the movement of people, materials and texts carried styles across regions.',
  }),
  period({
    id: 'per-era-early-modern', scope: 'era', title: 'Early Modern World', subtitle: 'c. 1400 – c. 1800',
    summary: 'Renaissance Europe, the great Asian empires, the Atlantic world and the first sustained global trade in goods, images and people.',
    regions: ['europe', 'east-asia', 'south-asia', 'west-asia-north-africa', 'sub-saharan-africa', 'south-america', 'central-america-caribbean', 'north-america'],
    dates: { start: 1400, end: 1800, approx: true, label: 'c. 1400 – c. 1800' },
    sections: [
      { heading: 'What the frame covers', paragraphs: [
        'This span includes the Renaissance and Reformation in Europe, the Ottoman, Safavid and Mughal empires, Ming and Qing China, Tokugawa Japan, the Inka and their conquest, the Kingdom of Benin and the Atlantic trade. Print, maritime commerce and empire made images and materials travel faster than before — often through violence and extraction as well as exchange.',
        FRAME] },
    ],
    artSignificance: 'The printing press, oceanic trade and imperial courts changed who made art, for whom, and how far images could travel.',
  }),
  period({
    id: 'per-era-modern', scope: 'era', title: 'Modern World', subtitle: 'c. 1800 – 1945',
    summary: 'Industrialisation, photography, empire, nationalism and world war — and an acceleration of artistic movements.',
    regions: ['europe', 'east-asia', 'north-america', 'oceania', 'central-america-caribbean'],
    dates: { start: 1800, end: 1945, label: 'c. 1800 – 1945' },
    sections: [
      { heading: 'What the frame covers', paragraphs: [
        'Industrial cities, new technologies such as photography and the paint tube, expanding empires, mass migration and two world wars frame this era. Movements from Impressionism to Cubism and the Harlem Renaissance emerged in a world already tightly connected by trade and colonial rule.',
        FRAME] },
    ],
    artSignificance: 'Artists responded to modern urban life, new technologies and encounters with art from other parts of the world — encounters that were frequently shaped by colonial power.',
  }),
  period({
    id: 'per-era-contemporary', scope: 'era', title: 'Contemporary World', subtitle: '1945 – present',
    summary: 'Postwar reconstruction, decolonisation, globalisation and an art world with many centres.',
    regions: ['north-america', 'europe', 'oceania', 'east-asia'],
    dates: { start: 1945, end: null, label: '1945 – present' },
    sections: [
      { heading: 'What the frame covers', paragraphs: [
        'After 1945 the art world’s centre of gravity shifted, decolonisation reshaped cultural institutions, and Indigenous and non-Western artists increasingly claimed visibility on their own terms. Living traditions such as Māori carving continue alongside new movements.',
        FRAME] },
    ],
    artSignificance: 'Contemporary art is made in conversation with many pasts at once, and with institutions that are re-examining how they acquired and display older works.',
  }),

  // ------------------------------------------------------- regional periods
  period({
    id: 'per-classical-greece', scope: 'regional', title: 'Classical Greece', subtitle: 'c. 480 – 323 BCE',
    summary: 'The era of the Greek city-states from the end of the Persian Wars to the death of Alexander the Great.',
    regions: ['europe'], dates: { start: -480, end: -323, approx: true, label: 'c. 480 – 323 BCE' },
    sections: [{ heading: 'Setting', paragraphs: [
      'After the Greek victories in the Persian Wars, Athens grew into a major naval and cultural power; its building programme on the Acropolis, including the Parthenon (built c. 447–432 BCE), employed leading sculptors. The period is conventionally closed by the death of Alexander the Great in 323 BCE, after which the Hellenistic kingdoms took shape.'] }],
    artSignificance: 'Sculptors developed ideals of proportion and the naturalistic body that later European traditions repeatedly returned to.',
    sources: ['s-pollitt', 's-stewart-greek'],
  }),
  period({
    id: 'per-qin', scope: 'regional', title: 'Qin Dynasty', subtitle: '221 – 206 BCE',
    summary: 'The short-lived dynasty that first unified China under a single emperor.',
    regions: ['east-asia'], dates: { start: -221, end: -206, label: '221 – 206 BCE' },
    sections: [{ heading: 'Setting', paragraphs: [
      'In 221 BCE the king of Qin completed the conquest of the rival states and took the title First Emperor (Qin Shi Huang). The state standardised writing, weights and measures, and organised enormous labour projects, including his mausoleum complex near present-day Xi’an. The dynasty collapsed within a few years of his death in 210 BCE and was succeeded by the Han.'] }],
    artSignificance: 'State organisation of labour allowed sculpture on an unprecedented scale — and shaped how it was made.',
    sources: ['s-portal'],
  }),
  period({
    id: 'per-classic-maya', scope: 'regional', title: 'Classic Maya Period', subtitle: 'c. 250 – 900 CE',
    summary: 'The florescence of Maya city-states in southern Mesoamerica, marked by dated monuments and hieroglyphic writing.',
    regions: ['central-america-caribbean'], dates: { start: 250, end: 900, approx: true, label: 'c. 250 – 900 CE' },
    sections: [{ heading: 'Setting', paragraphs: [
      'Competing city-states such as Tikal, Calakmul, Palenque and Yaxchilan ruled through hereditary kings who recorded their lineages and ritual acts on stone monuments using the Maya script and the Long Count calendar. Many southern lowland centres declined between roughly 800 and 900 CE, though Maya peoples and cities continued elsewhere.'] }],
    artSignificance: 'Kingship, ancestry and cosmology were written and carved together, so images and inscriptions must be read as one.',
    sources: ['s-miller-martin'],
  }),
  period({
    id: 'per-ifriqiya', scope: 'regional', title: 'Aghlabid and Fatimid Ifriqiya', subtitle: 'c. 800 – 973',
    summary: 'The Islamic-ruled central Maghreb (roughly modern Tunisia), with Kairouan as a major religious and cultural centre.',
    regions: ['west-asia-north-africa'], dates: { start: 800, end: 973, approx: true, label: 'c. 800 – 973' },
    sections: [{ heading: 'Setting', paragraphs: [
      'The Aghlabids governed Ifriqiya from 800 as nominal subordinates of the Abbasid caliphs; the Fatimids took power in 909 and moved their seat to Egypt in 973. Kairouan, with its Great Mosque, was a centre of learning and Qur’an production. Which dynasty patronised particular manuscripts is often debated.'] }],
    artSignificance: 'Calligraphy was the era’s most prestigious visual art, and luxury Qur’ans display how script, colour and material expressed devotion.',
    sources: ['s-blair-calligraphy'],
  }),
  period({
    id: 'per-angkor', scope: 'regional', title: 'Angkorian Period', subtitle: '802 – 1431',
    summary: 'The era of the Khmer Empire, centred on the Angkor region of present-day Cambodia.',
    regions: ['southeast-asia'], dates: { start: 802, end: 1431, label: '802 – 1431' },
    sections: [{ heading: 'Setting', paragraphs: [
      'Tradition dates the empire’s foundation to the consecration of Jayavarman II in 802. Successive kings built temple-mountains and vast water-management systems around Angkor. The period is conventionally ended by the abandonment of Angkor as capital in the 15th century (traditionally 1431, after a Siamese attack).'] }],
    artSignificance: 'Temple building was a royal and religious act, and architecture, relief sculpture and statuary were conceived together.',
    sources: ['s-freeman-jacques'],
  }),
  period({
    id: 'per-song', scope: 'regional', title: 'Song Dynasty', subtitle: '960 – 1279',
    summary: 'A period of urban growth, printing, scholar-official culture and landscape painting in China.',
    regions: ['east-asia'], dates: { start: 960, end: 1279, label: '960 – 1279' },
    sections: [{ heading: 'Setting', paragraphs: [
      'The Song reunified much of China after the fragmentation that followed the Tang. The Northern Song (960–1127) ruled from Kaifeng until the Jurchen captured the capital in 1127; the Southern Song continued from Hangzhou until the Mongol conquest. Civil-service examinations, woodblock printing and a thriving market economy shaped a culture in which scholar-officials valued painting, poetry and calligraphy.'] }],
    artSignificance: 'Painters sought to convey the order of nature, and monumental landscape became a dominant genre.',
    sources: ['s-cahill', 's-hearn'],
  }),
  period({
    id: 'per-benin-kingdom', scope: 'regional', title: 'Kingdom of Benin', subtitle: 'c. 1180 – 1897 (precolonial)',
    summary: 'The Edo kingdom ruled from Benin City by successive Obas, renowned for its court arts in brass and ivory.',
    regions: ['sub-saharan-africa'], dates: { start: 1180, end: 1897, approx: true, label: 'c. 1180 – 1897' },
    sections: [{ heading: 'Setting', paragraphs: [
      'Oral and written traditions place the kingdom’s origins in the late 12th century. Under Oba Ewuare the Great (reigned c. 1440–1473) the city expanded and the court became more centralised; Portuguese traders arrived in the 1480s. Craft guilds attached to the palace — including the brass-casting guild — produced works for the Oba. In 1897 a British military expedition sacked Benin City and removed thousands of works. The Oba’s court was restored in the colonial era and continues today.'] }],
    artSignificance: 'Court workshops produced art as an instrument of kingship and memory, and its violent removal shaped the history of museums.',
    sources: ['s-plankensteiner', 's-hicks'],
  }),
  period({
    id: 'per-dutch-golden-age', scope: 'regional', title: 'Dutch Golden Age', subtitle: 'c. 1588 – 1672',
    summary: 'The Dutch Republic’s peak of commerce, science and painting in the 17th century.',
    regions: ['europe'], dates: { start: 1588, end: 1672, approx: true, label: 'c. 1588 – 1672' },
    sections: [{ heading: 'Setting', paragraphs: [
      'Having broken from Spanish Habsburg rule during the Eighty Years’ War (1568–1648), the Republic grew wealthy through maritime trade, led by the Dutch East India Company (VOC, founded 1602). Without a monarchy or a dominant church patron, art was bought by merchants, regents and civic companies, and the market for paintings of everyday life, portraits and landscapes flourished. The traditional end-point, 1672 (the “Disaster Year” of invasion and civil crisis), is a convention.'] }],
    artSignificance: 'A market-driven art world encouraged specialisation and new subjects in painting.',
    sources: ['s-schama'],
  }),
  period({
    id: 'per-mughal', scope: 'regional', title: 'Mughal Empire', subtitle: '1526 – 1857',
    summary: 'The Indo-Muslim empire founded by Babur that ruled much of the Indian subcontinent.',
    regions: ['south-asia'], dates: { start: 1526, end: 1857, label: '1526 – 1857' },
    sections: [{ heading: 'Setting', paragraphs: [
      'Babur’s victory at Panipat in 1526 established Mughal rule in northern India. The empire reached its greatest cultural confidence under Akbar (r. 1556–1605), Jahangir (r. 1605–1627) and Shah Jahan (r. 1628–1658), and persisted in diminished form until the British formally ended it after the 1857 rebellion.'] }],
    artSignificance: 'Imperial workshops (karkhanas) produced illustrated books and portraits that fused Persianate, Indian and, increasingly, European elements.',
    sources: ['s-beach'],
  }),
  period({
    id: 'per-edo', scope: 'regional', title: 'Edo (Tokugawa) Period', subtitle: '1603 – 1868',
    summary: 'A long era of peace, urban growth and tightly controlled foreign contact in Japan.',
    regions: ['east-asia'], dates: { start: 1603, end: 1868, label: '1603 – 1868' },
    sections: [{ heading: 'Setting', paragraphs: [
      'The Tokugawa shogunate ruled from Edo (modern Tokyo). From the 1630s foreign contact was restricted: Dutch and Chinese merchants were permitted at Nagasaki, and Dutch traders were confined to the island of Dejima. A prosperous merchant class fuelled a commercial culture of theatre, pleasure quarters and printed books and pictures. The period ended with the Meiji Restoration of 1868.'] }],
    artSignificance: 'Commercial woodblock printing made images affordable, and artists worked in publishers’ workshops for a mass urban audience.',
    sources: ['s-thompson-floating'],
  }),
  period({
    id: 'per-inka', scope: 'regional', title: 'Inka Empire (Tawantinsuyu)', subtitle: 'c. 1438 – 1533',
    summary: 'The Andean empire centred on Cusco, which expanded rapidly in the 15th century before the Spanish conquest.',
    regions: ['south-america'], dates: { start: 1438, end: 1533, approx: true, label: 'c. 1438 – 1533' },
    sections: [{ heading: 'Setting', paragraphs: [
      'Under Pachacuti and his successors, the Inka state expanded from the Cusco region along the Andes. Without a writing system in the European sense, the empire administered through knotted-cord records (khipu) and made textiles a central currency of status and statecraft. Spanish forces captured the ruler Atahualpa at Cajamarca in 1532 and took Cusco in 1533.'] }],
    artSignificance: 'Cloth, not paint or stone alone, carried the highest prestige; state-organised weaving shaped style and standardisation.',
    sources: ['s-phipps'],
  }),
]

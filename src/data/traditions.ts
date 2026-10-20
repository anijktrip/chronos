import { style, tradition } from './helpers'

/** Pre-modern traditions and schools. */
export const traditionsA = [
  style({
    id: 'style-classical-greek', title: 'Classical Greek Sculpture', subtitle: 'Europe · c. 480 – 323 BCE',
    summary: 'The sculpture of the Greek city-states in the century and a half after the Persian Wars, known for its idealised yet lifelike human figures.',
    regions: ['europe'], places: ['place-argos', 'place-naples'], dates: { start: -480, end: -323, approx: true, label: 'c. 480 – 323 BCE' },
    themes: ['theme-portrait', 'theme-power'], tags: ['sculpture', 'bronze', 'marble', 'antiquity'],
    periods: ['per-era-antiquity', 'per-classical-greece'], hero: 'art-doryphoros',
    mediums: ['Bronze', 'Marble'], techniques: ['Lost-wax casting', 'Marble carving', 'Copying by measured points'],
    context: [
      'Classical Greek sculpture belongs to a world of competing city-states, of which Athens became the most powerful after the Persian Wars. Sculpture was public: statues stood in sanctuaries, cemeteries and civic spaces, and honoured gods, athletes and the dead.',
      'Most major Greek bronzes were later melted down for their metal. What survives is largely marble, original architectural sculpture such as the Parthenon’s, and Roman marble copies of lost bronzes — which means our knowledge of famous masters comes largely at second hand.'],
    origins: [
      'The “Severe” style of the decades after 480 BCE replaced the stiff frontal poses of the Archaic period with figures that shift their weight. By the mid-fifth century sculptors such as Polykleitos of Argos and Pheidias were formalising ideas of proportion and idealisation.',
      'In the fourth century BCE, sculptors such as Praxiteles and Lysippos introduced softer, more varied and more emotionally expressive figures, leading toward the Hellenistic style after Alexander the Great’s death.'],
    characteristics: [
      { title: 'Weight-shift (contrapposto)', text: 'Figures stand with weight on one leg, so shoulders and hips tilt in opposite directions, producing a sense of natural balance and latent movement.' },
      { title: 'Ideal proportion', text: 'Polykleitos is said to have written a treatise, the Canon, setting out the ideal ratios of the body; his statue of the Doryphoros was regarded as its demonstration.' },
      { title: 'Idealised naturalism', text: 'Anatomy is carefully observed but generalised: faces are calm and individual character is subordinated to an ideal type.' },
      { title: 'Bronze first', text: 'Hollow lost-wax casting allowed open poses and thin supports that marble copies often needed to add as struts or tree-trunks.' }],
    sources: ['s-stewart-greek', 's-pollitt', 's-mann'],
  }),
  tradition({
    id: 'trad-qin-funerary', title: 'Qin Imperial Funerary Sculpture', subtitle: 'East Asia · 3rd century BCE',
    summary: 'The monumental clay sculpture buried with China’s First Emperor, Qin Shi Huang, near present-day Xi’an.',
    regions: ['east-asia'], places: ['place-lintong'], dates: { start: -221, end: -206, label: '221 – 206 BCE' },
    themes: ['theme-power', 'theme-sacred'], tags: ['sculpture', 'terracotta', 'funerary', 'antiquity'],
    periods: ['per-era-antiquity', 'per-qin'], hero: 'art-terracotta-army',
    dateNote: 'The dates are those of the dynasty. The mausoleum’s construction began earlier, when the emperor was still King of Qin, and ended soon after his death in 210 BCE.',
    mediums: ['Terracotta', 'Bronze', 'Lacquer and mineral pigments'], techniques: ['Modular assembly from moulded parts', 'Hand finishing of faces and details', 'Kiln firing', 'Painted polychrome surface'],
    context: [
      'Chinese elites had long buried the dead with objects that they would need in the afterlife; earlier burials had included living human attendants. The Qin tomb complex replaced such sacrifice with a replica retinue in clay, set in underground pits to guard the emperor’s tomb.',
      'The complex was part of the emperor’s project of centralised state-building. Labour was drawn from across the empire, and the classical historian Sima Qian (writing about a century later) recorded that hundreds of thousands of workers were involved.'],
    origins: [
      'The mausoleum was begun when the future emperor became king of Qin as a boy and expanded after the unification of 221 BCE. The pits containing soldiers were found accidentally in 1974 by farmers digging a well near Lintong, and excavation has continued since.',
      'Later dynasties, notably the Han, also buried clay armies and attendants, though on smaller scales, so the Qin works sit at the beginning of a long Chinese tradition of tomb figures.'],
    characteristics: [
      { title: 'Scale and number', text: 'Estimates run to several thousand life-sized warriors in the pits already excavated and more yet to be found, along with horses, chariots, and non-military figures in other pits.' },
      { title: 'Modular production', text: 'Torsos, arms, legs and heads were made in standard parts and assembled, then given individual features — creating the impression of individuality at industrial scale.' },
      { title: 'Makers’ marks', text: 'Many figures carry stamped or inscribed names, which have been read as identifying workshops or craftsmen and show a system of accountability.' },
      { title: 'Colour', text: 'The figures were originally painted in bright pigments; most paint flaked off soon after excavation exposed the surfaces, and conservation research now attempts to preserve what remains.' }],
    sources: ['s-portal', 's-bm'],
  }),
  tradition({
    id: 'trad-maya', title: 'Classic Maya Sculpture and Inscription', subtitle: 'Central America · c. 250 – 900 CE',
    summary: 'The carved stone monuments, buildings and inscriptions through which Maya kings recorded dynastic history and ritual.',
    regions: ['central-america-caribbean'], places: ['place-palenque'], dates: { start: 250, end: 900, approx: true, label: 'c. 250 – 900 CE' },
    themes: ['theme-sacred', 'theme-power'], tags: ['sculpture', 'relief', 'writing', 'stone'],
    periods: ['per-era-antiquity', 'per-era-postclassical', 'per-classic-maya'], hero: 'art-pakal-lid',
    dateNote: 'The “Classic” period is a convention that begins with the earliest dated monuments (c. 250 CE) and ends with the cessation of dated monuments in many southern cities, which varied from place to place.',
    mediums: ['Limestone', 'Stucco', 'Jade', 'Painted ceramic'], techniques: ['Relief carving', 'Stucco modelling', 'Polychrome painting', 'Hieroglyphic inscription'],
    context: [
      'Classic Maya society consisted of competing city-states ruled by dynasties of divine kings. Rulers justified their authority through ancestry, ritual performance and warfare, and recorded these claims on stelae, altars, lintels and building facades.',
      'Writing was a fully developed system combining logograms and syllabic signs. Image and text were designed together, and dates in the Long Count calendar allow many events to be placed with great precision.'],
    origins: [
      'Maya traditions grew out of earlier Mesoamerican cultures, such as the Olmec, and from Preclassic Maya centres. The earliest known Long Count dates on Maya monuments are from the third century CE.',
      'Regional styles developed: Palenque is known for delicate, fluid relief; Yaxchilan for lintels showing intimate ritual scenes; Copán for sculpture almost in the round; Tikal for tall stelae.'],
    characteristics: [
      { title: 'Text and image together', text: 'Inscriptions identify the people shown, the date and the event, so a monument is read as a single composition.' },
      { title: 'Profile, ornament, and sinuous line', text: 'Figures are commonly shown in profile with elaborate headdresses and ornament, using flowing contours.' },
      { title: 'Cosmological structure', text: 'Compositions often express a vertical cosmos — sky, earth and underworld — linked by the “world tree”.' },
      { title: 'Colour', text: 'Stone and stucco sculptures were originally painted, often in red and other bright pigments.' }],
    sources: ['s-miller-martin', 's-bm'],
  }),
  tradition({
    id: 'trad-angkor', title: 'Angkorian Khmer Art and Architecture', subtitle: 'Southeast Asia · 9th – 15th century',
    summary: 'The temple-mountains, bas-reliefs and sculpture of the Khmer Empire at Angkor in present-day Cambodia.',
    regions: ['southeast-asia'], places: ['place-angkor'], dates: { start: 802, end: 1431, label: '802 – 1431' },
    themes: ['theme-sacred', 'theme-power'], tags: ['architecture', 'relief', 'sandstone', 'Hindu', 'Buddhist'],
    periods: ['per-era-postclassical', 'per-angkor'], hero: 'art-angkor-wat',
    mediums: ['Sandstone', 'Laterite', 'Bronze'], techniques: ['Dry-stone construction', 'Bas-relief carving', 'Corbelled vaulting'],
    context: [
      'Khmer kings presented themselves as devotees, and sometimes as embodiments, of Hindu gods or, later, of Buddhist ideals. Temples were royal foundations that combined state shrine, ancestral memorial and cosmological diagram.',
      'Around the temples a huge landscape of reservoirs (barays) and canals supplied water for rice agriculture, and later scholarship stresses that the city was a dispersed, low-density urban region.'],
    origins: [
      'Early Khmer art drew on Indian religious iconography and Sanskrit inscriptions, transformed in local styles. Under Jayavarman II, traditionally consecrated in 802, a state centred around Angkor began to form.',
      'Angkor Wat was built in the early twelfth century under Suryavarman II as a Vaishnava temple; the Bayon, with its giant faces, belongs to the late twelfth–early thirteenth century under Jayavarman VII, whose reign emphasised Mahayana Buddhism.'],
    characteristics: [
      { title: 'Temple-mountain plan', text: 'Rising terraces, concentric galleries and a central tower form a symbolic Mount Meru surrounded by an ocean-like moat.' },
      { title: 'Narrative relief', text: 'Long galleries are carved with scenes from Hindu epics and with historical processions, read at walking pace.' },
      { title: 'Dry-stone technique', text: 'Sandstone blocks are fitted without mortar; stone is carved in place, and roofs use corbelled rather than true arches.' },
      { title: 'Devatas and apsaras', text: 'Thousands of female figures with elaborate hairstyles and jewellery decorate walls, each differently rendered.' }],
    sources: ['s-freeman-jacques', 's-met-toah'],
  }),
  tradition({
    id: 'trad-islamic-calligraphy', title: 'Islamic Calligraphy and the Qur’an Manuscript', subtitle: 'West Asia & North Africa · 7th century – present',
    summary: 'The art of beautiful writing in Arabic script, centred on copying the Qur’an and developed into a rich range of scripts and styles.',
    regions: ['west-asia-north-africa'], places: ['place-kairouan'], dates: { start: 650, end: null, approx: true, label: '7th century – present' },
    themes: ['theme-sacred', 'theme-trade-materials'], tags: ['calligraphy', 'manuscript', 'Qur’an', 'script'],
    periods: ['per-era-postclassical', 'per-ifriqiya'], hero: 'art-blue-quran',
    dateNote: 'The tradition begins in the early centuries of Islam and continues today; the start date is a convenient approximation.',
    mediums: ['Ink', 'Gold and silver', 'Parchment', 'Paper'], techniques: ['Reed-pen calligraphy', 'Gold illumination', 'Dyeing parchment'],
    context: [
      'For Muslims the Qur’an is the word of God, and copying it is an act of devotion. Because religious art in many Islamic contexts avoided figural images, calligraphy and abstract ornament became central arts of the sacred book, the mosque and the court.',
      'Manuscripts were produced in scriptoria and workshops supported by rulers, scholars and pious donors. Paper, which became widespread in the Islamic world from the eighth century, gradually replaced parchment.'],
    origins: [
      'Early Qur’ans were written in angular scripts, often called Kufic, in horizontal format on parchment. From the tenth century, proportioned cursive scripts — systematised by figures such as the vizier and calligrapher Ibn Muqla — came into wide use, and the book format became more vertical.',
      'Over the centuries, regional traditions developed, including Maghribi script in the west, naskh, thuluth and muhaqqaq for Qur’ans, and nastaʿlīq for Persian poetry.'],
    characteristics: [
      { title: 'Script as image', text: 'Letterforms are designed for rhythm and proportion — the dots and diacritics even act as measuring units in classical systems.' },
      { title: 'Luxurious materials', text: 'Gold ink, silver, lapis, and dyed or burnished supports signalled devotion and wealth.' },
      { title: 'Illuminated structure', text: 'Chapter headings, verse markers and borders are decorated with abstract geometric and vegetal patterns.' },
      { title: 'Dispersal of manuscripts', text: 'Many early Qur’ans were later divided into folios, so single pages now sit in different collections.' }],
    sources: ['s-blair-calligraphy', 's-met'],
  }),
  style({
    id: 'style-song-landscape', title: 'Song Dynasty Landscape Painting', subtitle: 'East Asia · 10th – 13th century',
    summary: 'Monumental ink-and-colour landscapes of the Northern Song and the quieter, lyrical compositions of the Southern Song.',
    regions: ['east-asia'], places: ['place-kaifeng'], dates: { start: 960, end: 1279, label: '960 – 1279' },
    themes: ['theme-landscape', 'theme-power'], tags: ['painting', 'ink', 'silk', 'scroll'],
    periods: ['per-era-postclassical', 'per-song'], hero: 'art-travelers',
    mediums: ['Ink on silk', 'Ink and colour on silk', 'Ink on paper'], techniques: ['Brush texture strokes (cun)', 'Ink wash', 'Hanging-scroll composition'],
    context: [
      'Painting in Song China was practised by court painters in the imperial academy and by scholar-officials who regarded it as an extension of poetry and calligraphy. Landscape expressed a vision of the natural order, and was widely collected.',
      'Printing, paper and an educated bureaucracy spread learning more widely than before; painting in turn became a subject of connoisseurship, theory and collecting.'],
    origins: [
      'Landscape painting developed in the Tang dynasty and in the fragmentary Five Dynasties period. In the late tenth and eleventh centuries masters such as Li Cheng, Fan Kuan and Guo Xi created the Northern Song monumental landscape.',
      'After the loss of the north in 1127, the Southern Song court at Hangzhou favoured more intimate, atmospheric compositions with large areas of empty space — often associated with painters such as Ma Yuan and Xia Gui.'],
    characteristics: [
      { title: 'Monumental composition', text: 'A towering central mountain dominates the picture, with tiny figures or travellers establishing scale.' },
      { title: 'Texture strokes', text: 'Painters devised brush techniques, such as the “raindrop” strokes associated with Fan Kuan, to convey the surfaces of rock.' },
      { title: 'Three distances', text: 'The critic Guo Xi described “high”, “deep” and “level” distance as ways to organise a landscape.' },
      { title: 'Silk and scroll', text: 'Works were painted on silk or paper and mounted as hanging scrolls or handscrolls, viewed in turn rather than permanently displayed.' }],
    sources: ['s-cahill', 's-hearn', 's-npm'],
  }),
  tradition({
    id: 'trad-benin-court', title: 'Court Arts of the Kingdom of Benin', subtitle: 'Sub-Saharan Africa · 13th century – present',
    summary: 'Brass, ivory and wood works made by guilds attached to the palace of the Oba of Benin, in what is now southern Nigeria.',
    regions: ['sub-saharan-africa'], places: ['place-benin-city'], dates: { start: 1280, end: null, approx: true, label: 'traditionally from the late 13th century' },
    themes: ['theme-power', 'theme-trade-materials', 'theme-colonialism-return'], tags: ['brass', 'ivory', 'court art', 'guild'],
    periods: ['per-era-postclassical', 'per-era-early-modern', 'per-benin-kingdom'], hero: 'art-benin-plaques',
    dateNote: 'Oral tradition ties the introduction of brass casting to a ruler of the late 13th century; most surviving cast works date to the 16th–19th centuries.',
    mediums: ['Brass and bronze', 'Ivory', 'Wood'], techniques: ['Lost-wax casting', 'Ivory carving'],
    context: [
      'The Oba of Benin was the sacred king of a centralised state. Guilds of specialist craftsmen — one for brass casting, another for ivory and wood carving, among others — worked in the palace and produced works for the Oba and for ancestral altars.',
      'Works functioned as records of reigns and conquests, as offerings to ancestors, and as symbols of the Oba’s control of rare materials, particularly brass and ivory.'],
    origins: [
      'Court tradition says that the brass-casting guild was founded at the request of Oba Oguola, who asked the ruler of Ife for a master caster. Historians note that brass casting existed in the region earlier and that written evidence of the origin story is late.',
      'Rectangular brass plaques, which once decorated palace pillars, are generally dated to the 16th–17th centuries; commemorative heads and altar pieces, and carved ivory tusks, were also produced.'],
    characteristics: [
      { title: 'Relief plaques', text: 'Figures are arranged hierarchically — the Oba is largest — and often accompanied by attendants, warriors and Portuguese visitors.' },
      { title: 'Lost-wax casting', text: 'Wax models were encased in clay, melted out, and replaced with molten brass; each casting is unique.' },
      { title: 'Altars of the ancestors', text: 'Cast heads and carved ivory tusks were placed on royal altars honouring deceased Obas and Queen Mothers.' },
      { title: 'A living tradition', text: 'The casting guild, the Igun Eronmwon, continues to work in Benin City today.' }],
    sources: ['s-plankensteiner', 's-hicks', 's-bm'],
  }),
  tradition({
    id: 'trad-maori-whakairo', title: 'Māori Carving (Whakairo)', subtitle: 'Oceania · c. 13th century – present',
    summary: 'The art of carving wood, bone and stone in Aotearoa New Zealand, expressed most fully in the carved ancestral meeting house.',
    regions: ['oceania'], places: ['place-manutuke'], dates: { start: 1300, end: null, approx: true, label: 'c. 14th century – present' },
    themes: ['theme-sacred', 'theme-migration-identity', 'theme-colonialism-return'], tags: ['wood carving', 'meeting house', 'Indigenous', 'living tradition'],
    periods: ['per-era-postclassical', 'per-era-early-modern', 'per-era-modern', 'per-era-contemporary'], hero: 'art-te-hau',
    dateNote: 'Polynesian voyagers settled Aotearoa roughly in the 13th century CE; the dating of a distinctively Māori carving style is gradual and approximate.',
    mediums: ['Wood', 'Bone', 'Greenstone (pounamu)', 'Pigment'], techniques: ['Carving with stone and, later, metal tools', 'Kōwhaiwhai painted patterns', 'Woven tukutuku panels'],
    context: [
      'Whakairo is an ancestral art, practised by specialists (tohunga whakairo) and governed by tikanga (custom) concerning sacredness and permission. Carvings represent ancestors and carry genealogy — they are not mere decoration.',
      'The wharenui, or carved meeting house, stands for an ancestor’s body: the ridgepole is the backbone, the rafters the ribs, and the carved posts and panels represent descendants and relatives. The house is a meeting place and a repository of community memory.'],
    origins: [
      'Aotearoa was settled by East Polynesian voyagers who brought carving traditions that developed locally into a distinctive regional art, with spiral forms, tattoo-like surface patterns and stylised figures.',
      'The introduction of metal tools in the late 18th and early 19th century allowed deeper and more complex carving. The large carved meeting house in its present form developed in the 19th century and remains a living practice.'],
    characteristics: [
      { title: 'Ancestor figures (tekoteko, poupou)', text: 'Carved posts and wall panels represent specific ancestors with large heads, three-fingered hands and surface patterns.' },
      { title: 'Spirals and the koru', text: 'Curvilinear forms based on the unfurling fern frond, and the manaia, a profile creature, recur throughout.' },
      { title: 'Whole-house design', text: 'Carving, painted rafter patterns (kōwhaiwhai) and woven panels (tukutuku) work together in a single scheme.' },
      { title: 'Kaitiakitanga', text: 'Guardianship is central: communities decide how carvings are cared for, displayed and, if taken, returned.' }],
    sources: ['s-neich', 's-tepapa'],
  }),
  tradition({
    id: 'trad-inka', title: 'Inka Art and Textiles', subtitle: 'South America · 15th – 16th century',
    summary: 'The standardised architecture, metalwork and, above all, fine woven cloth of the Inka Empire.',
    regions: ['south-america'], places: ['place-cusco'], dates: { start: 1438, end: 1533, approx: true, label: 'c. 1438 – 1533' },
    themes: ['theme-power', 'theme-trade-materials'], tags: ['textile', 'tapestry', 'Andean', 'empire'],
    periods: ['per-era-early-modern', 'per-inka'], hero: 'art-inka-tunic',
    mediums: ['Camelid fibre (alpaca, llama, vicuña)', 'Cotton', 'Stone', 'Gold and silver'], techniques: ['Tapestry weave', 'Dry-stone masonry', 'Standardised motifs (tocapu)'],
    context: [
      'The Inka Empire, called Tawantinsuyu (“the four parts together”), grew rapidly from a Cusco-centred polity. It administered a vast territory through roads, storehouses and recorded accounts on knotted cords (khipu).',
      'Cloth was the prime medium of prestige. Specialist weavers, including women who lived in state institutions called aqllawasi, produced fine cloth (qompi) used as gifts, ritual offerings and uniforms of rank.'],
    origins: [
      'Inka textile style drew on a long Andean heritage, including Wari and Chimú traditions, of which it was a standardising and imperial descendant.',
      'After the Spanish conquest of 1532–33, Andean artists continued to weave and carve; colonial works show Andean and European elements together.'],
    characteristics: [
      { title: 'Tocapu', text: 'Small square or rectangular geometric designs, arranged in grids on tunics, are thought to have indicated rank or identity, though their precise meaning is not fully understood.' },
      { title: 'Tapestry weave', text: 'Exceptionally fine, densely packed weaving, produced by specialists for the elite.' },
      { title: 'Standardisation', text: 'Garments and architecture followed state standards, so Inka style is recognisable across the empire.' },
      { title: 'Precisely fitted stone', text: 'Cusco’s walls fit large stones together closely without mortar, an architectural counterpart of the weaver’s precision.' }],
    sources: ['s-phipps', 's-doaks'],
  }),
]

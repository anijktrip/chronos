import { movement, school } from './helpers'

/**
 * Seven complete movement/school records — the worked examples of the full page template.
 * They chart the design lineage the platform is built to show:
 *   Arts and Crafts → Art Nouveau → Bauhaus → Modernist design, with the avant-garde
 *   (Dada → Surrealism; Russian Constructivism ↔ De Stijl) running alongside.
 * Text is prototype sample text (flagged), drafted to be checked against the sources listed.
 */

export const fullMovements = [
  /* ===================================================================== */
  movement({
    id: 'mov-arts-and-crafts', title: 'Arts and Crafts Movement', subtitle: 'Britain, then Europe, North America and Japan · c. 1860 – c. 1920',
    summary: 'A reform movement in design, architecture and the decorative arts that valued handwork, honest materials and the unity of art and everyday life, in reaction to industrial mass production.',
    altNames: ['Arts & Crafts'],
    regions: ['europe', 'north-america'], dates: { start: 1860, end: 1920, approx: true, label: 'c. 1860 – c. 1920' },
    themes: [], tags: ['design reform', 'craft', 'architecture', 'textiles', 'book arts'], periods: ['per-era-modern'],
    taxonomy: ['m03', 'm05'], domains: ['design', 'craft', 'architecture', 'graphic-design', 'typography', 'printmaking'], level: 'full',
    dateNote: 'The name dates from the Arts and Crafts Exhibition Society of 1887; its ideas began earlier with Ruskin and Morris and ran in different forms to the 1920s and beyond.',
    classificationNote: 'A movement and a reform philosophy, not a single style. Its look varied widely (English cottage, American Craftsman, Glasgow Style).',
    mediums: ['Textiles and wallpaper', 'Furniture and joinery', 'Stained glass', 'Metalwork and jewellery', 'Ceramics', 'Printed books'],
    techniques: ['Woodblock printing of wallpaper and cloth', 'Natural-dye (indigo discharge) textile printing', 'Hand-weaving and tapestry', 'Hand-press printing', 'Hand-hammered metalwork', 'Exposed joinery'],
    context: [
      'Britain was the first industrial nation. Factory production had lowered the cost of household goods, but many critics judged the results ornate, poorly made and alienating for the people who made them. Rapid urban growth, social inequality and the loss of traditional trades fed this critique.',
      'The movement was also shaped by the Gothic Revival, by interest in medieval guilds and vernacular building, and by the growth of an educated middle class that wanted tasteful homes.'],
    origins: [
      'John Ruskin’s essay “The Nature of Gothic” (1853) argued that medieval stonecarvers had worked with freedom and joy, while industrial workers were made into machines. William Morris, inspired by Ruskin, turned this into practice: Red House (designed by his friend Philip Webb, 1859–60) and then the decorating firm Morris, Marshall, Faulkner & Co. (1861).',
      'The term “Arts and Crafts” was adopted for the Arts and Crafts Exhibition Society, founded in 1887. By the 1890s guilds, schools and journals carried the ideas across Britain, to Europe and the United States (Gustav Stickley’s Craftsman workshops and magazine from 1901), and later informed Japan’s Mingei movement.'],
    reasons: [
      'A moral and social critique of industrial labour and its products.',
      'A wish to raise the status of the decorative arts to that of painting and sculpture.',
      'Admiration for medieval and vernacular craft as an alternative model of how things might be made.'],
    founders: ['John Ruskin (inspiration)', 'William Morris', 'Philip Webb', 'Walter Crane', 'C. R. Ashbee', 'W. R. Lethaby', 'May Morris', 'C. F. A. Voysey'],
    ideas: [
      'Truth to materials: show how a thing is made and what it is made of.',
      'The unity of the arts — architecture, furniture, textiles and books conceived together as part of a whole life.',
      'Joy and dignity in work: designers and makers should not be separated.',
      'Design for the home, nature as a source of pattern, and respect for tradition and place.'],
    characteristics: [
      { title: 'Visible craft', text: 'Exposed joinery, hammer marks and hand-finished surfaces were treated as qualities, not flaws.' },
      { title: 'Nature-based pattern', text: 'Stylised plants and birds, flat and repeating, as in Morris’s wallpapers and textiles.' },
      { title: 'Vernacular and medieval references', text: 'Forms drawn from cottages, barns, church building and folk traditions.' },
      { title: 'Integrated interiors', text: 'Furniture, fittings, textiles and architecture designed to belong together.' }],
    notableWorks: [
      { title: 'Red House, Bexleyheath', creator: 'Philip Webb for William Morris', date: '1859–60', kind: 'Building' },
      { title: 'The Strawberry Thief', creator: 'William Morris', date: '1883', kind: 'Printed textile' },
      { title: 'The Works of Geoffrey Chaucer (the Kelmscott Chaucer)', creator: 'William Morris, Kelmscott Press; illustrated by Edward Burne-Jones', date: '1896', kind: 'Printed book' },
      { title: 'Gamble House, Pasadena', creator: 'Greene & Greene', date: '1908–09', kind: 'Building' }],
    manifestos: [
      { title: 'The Nature of Gothic (in The Stones of Venice, vol. II)', year: '1853', note: 'John Ruskin; the movement’s founding text.' },
      { title: 'Useful Work versus Useless Toil', year: '1884', note: 'William Morris, a socialist lecture on labour.' },
      { title: 'The Century Guild Hobby Horse; The Studio; The Craftsman', year: '1884–1901', note: 'Journals that spread the movement’s ideas and imagery.' }],
    disagreements: [
      'Morris was a socialist who wanted beautiful things for everyone, yet handmade goods were expensive and sold largely to wealthy buyers. He acknowledged this contradiction.',
      'Members disagreed about the machine. Ruskin and early Morris rejected it; others, such as W. R. Lethaby and later C. R. Ashbee, argued that design should come to terms with industrial production — an argument that fed directly into the Deutscher Werkbund and the Bauhaus.'],
    legacy: [
      'It set the pattern for design reform movements: Art Nouveau, the Wiener Werkstätte, the Werkbund and the Bauhaus all began in dialogue with it.',
      'It shaped studio craft, the idea of the designer-maker, the conservation movement (Morris founded the Society for the Protection of Ancient Buildings in 1877) and Japan’s Mingei movement.'],
    sources: ['s-cumming-kaplan', 's-ruskin', 's-va', 's-pevsner'],
  }),

  /* ===================================================================== */
  movement({
    id: 'mov-art-nouveau', title: 'Art Nouveau', subtitle: 'Europe and the Americas · c. 1890 – c. 1910',
    summary: 'An international style of architecture, design and graphic art built on flowing, organic lines and a wish to unify all the arts in one modern environment.',
    altNames: ['Jugendstil (Germany)', 'Sezessionstil (Austria)', 'Modernisme (Catalonia)', 'Stile Liberty (Italy)', 'Style moderne (France)'],
    regions: ['europe', 'north-america'], places: [], dates: { start: 1890, end: 1910, approx: true, label: 'c. 1890 – c. 1910' },
    themes: [], tags: ['architecture', 'poster', 'glass', 'jewellery', 'ornament'], periods: ['per-era-modern'],
    taxonomy: ['m03', 'm05'], domains: ['architecture', 'design', 'graphic-design', 'craft', 'typography', 'printmaking'], level: 'full',
    dateNote: 'Peak years differ by country: Brussels and Paris in the 1890s, Glasgow, Vienna and Barcelona around 1900, and later in parts of Central and Eastern Europe.',
    classificationNote: 'Called by different names in different countries, and often overlapping with Symbolism, Arts and Crafts and the Secession groups.',
    mediums: ['Cast iron and glass', 'Colour lithography', 'Art glass and ceramics', 'Enamel and jewellery', 'Furniture', 'Stone and tile'],
    techniques: ['Colour lithography for posters', 'Cast and wrought iron', 'Cameo and Favrile glass', 'Plique-à-jour enamel', 'Trencadís tile mosaic', 'Whiplash-curve ornament'],
    context: [
      'Europe’s large cities were growing quickly. Rail, department stores, world’s fairs and mass-circulation magazines created a new commercial visual culture, while new materials — iron, steel and plate glass — opened new possibilities for building.',
      'Artists and designers wanted a style belonging to the modern age rather than a revival of historical ones. The Exposition Universelle in Paris (1900) showed the style to millions of visitors.'],
    origins: [
      'The name comes from Siegfried Bing’s Paris shop, the Maison de l’Art Nouveau, opened in 1895. The first fully formed Art Nouveau architecture is usually identified as Victor Horta’s Hôtel Tassel in Brussels (1893–94).',
      'Regional centres soon emerged: Paris (Guimard), Nancy (Gallé and the École de Nancy), Glasgow (Mackintosh), Barcelona (Gaudí and the Modernistas), Vienna (the Secession, founded 1897), Darmstadt, Prague, Riga and Helsinki.'],
    reasons: [
      'Rejection of historical revival styles in architecture and design.',
      'The Arts and Crafts ideal of total design, adapted to the city and to new materials.',
      'Influences from Japanese art, Celtic and medieval ornament, natural science illustration and Symbolism.',
      'A market for fashionable, branded goods and posters in the expanding consumer economy.'],
    founders: ['Victor Horta', 'Hector Guimard', 'Henry van de Velde', 'Antoni Gaudí', 'Émile Gallé', 'Alphonse Mucha', 'Charles Rennie Mackintosh', 'Otto Wagner', 'Louis Comfort Tiffany'],
    ideas: [
      'A new, modern art not copied from the past.',
      'The total work of art: building, furniture, lighting, textiles and typography designed as one.',
      'Nature as structural and ornamental inspiration — plants, insects, waves and the whiplash curve.',
      'Beauty in everyday objects and the urban environment.'],
    characteristics: [
      { title: 'Organic line', text: 'Sinuous, asymmetrical curves derived from plant stems and tendrils.' },
      { title: 'Stylised nature', text: 'Flowers, insects, water and the female figure turned into flat, decorative pattern.' },
      { title: 'Exposed structure and new materials', text: 'Iron and glass were left visible and shaped into ornament, as in Guimard’s Métro entrances (from 1900).' },
      { title: 'Integrated lettering', text: 'Typography was drawn to match the image; custom display typefaces appeared in posters and journals.' }],
    notableWorks: [
      { title: 'Hôtel Tassel, Brussels', creator: 'Victor Horta', date: '1893–94', kind: 'Building' },
      { title: 'Gismonda (poster for Sarah Bernhardt)', creator: 'Alphonse Mucha', date: '1894–95', kind: 'Poster' },
      { title: 'Paris Métro entrances', creator: 'Hector Guimard', date: 'from 1900', kind: 'Architectural design' },
      { title: 'Casa Batlló, Barcelona (remodelling)', creator: 'Antoni Gaudí', date: '1904–06', kind: 'Building' },
      { title: 'Glasgow School of Art', creator: 'Charles Rennie Mackintosh', date: '1897–1909', kind: 'Building' },
      { title: 'Vienna Secession Building', creator: 'Joseph Maria Olbrich', date: '1897–98', kind: 'Building' }],
    manifestos: [
      { title: 'Journals: The Studio, Jugend, Pan, Ver Sacrum', year: '1893–1903', note: 'Magazines spread the style across borders and carried new graphic design and typography.' }],
    disagreements: [
      'Many architects and designers fell out about ornament. Henry van de Velde defended individual artistic creation against the standardisation argued by Hermann Muthesius at the Werkbund meeting of 1914.',
      'Adolf Loos’s “Ornament and Crime” (1908) attacked decoration of this kind as wasteful and regressive, one of the arguments that cleared the way for Modernism.'],
    legacy: [
      'It fixed the idea that all the arts could be designed together for the modern city, an idea inherited by the Wiener Werkstätte and the Bauhaus.',
      'Its poster and magazine graphics were among the first mass-market commercial visual identities; its buildings are now protected heritage, including Horta’s Brussels townhouses (UNESCO, 2000).'],
    sources: ['s-escritt', 's-va', 's-pevsner', 's-pompidou'],
  }),

  /* ===================================================================== */
  school({
    id: 'school-bauhaus', title: 'Bauhaus', subtitle: 'Weimar, Dessau and Berlin, Germany · 1919 – 1933',
    summary: 'A school of art, craft, design and architecture founded by Walter Gropius, which shaped modern design education by teaching the arts together through workshops and a common preliminary course.',
    altNames: ['The Bauhaus', 'Staatliches Bauhaus'],
    regions: ['europe'], dates: { start: 1919, end: 1933, label: '1919 – 1933' },
    themes: ['theme-migration-identity'], tags: ['design school', 'typography', 'architecture', 'photography', 'weaving', 'furniture'], periods: ['per-era-modern'],
    taxonomy: ['m05', 'm09'], domains: ['design', 'graphic-design', 'typography', 'architecture', 'photography', 'craft', 'painting'], level: 'full',
    classificationNote: 'A school (an institution), not a style or a single movement. “Bauhaus style” is a later simplification of very different work by its teachers and students, and the name is also used loosely for modernist design in general.',
    mediums: ['Furniture and lighting', 'Textiles', 'Metalwork', 'Print and typography', 'Photography and photomontage', 'Architecture'],
    techniques: ['The preliminary course (Vorkurs)', 'Workshop training with a craft master and a form master', 'Tubular steel furniture', 'Prototype design for industry', 'Photograms and the “New Vision”'],
    context: [
      'Germany emerged from the First World War defeated, revolutionary and impoverished. The Weimar Republic (1919–33) supported cultural experiment, but suffered hyperinflation in 1923, political polarisation, and the rise of the Nazi party.',
      'Design reform in Germany had a head start: the Deutscher Werkbund (1907) had already pushed for cooperation between artists, architects and industry. The school was founded amid the Expressionist optimism of 1919 and grew into a centre of rational, industrial design.'],
    origins: [
      'In April 1919 Walter Gropius combined the Weimar Grand-Ducal Saxon Academy of Fine Arts with the School of Arts and Crafts. His founding programme, illustrated with Lyonel Feininger’s woodcut of a cathedral, called for a new guild of craftsmen without class distinction.',
      'Under pressure from conservative Thuringian politics, the school moved to Dessau in 1925, into a new building by Gropius (1925–26). Hannes Meyer directed it from 1928 and Ludwig Mies van der Rohe from 1930; the school moved to a former factory in Berlin in 1932 and dissolved itself in 1933 under Nazi pressure.'],
    reasons: [
      'To overcome the split between fine art and craft, and between design and industry.',
      'To train a new type of designer able to shape the whole modern environment.',
      'To rebuild German culture after the First World War.'],
    founders: ['Walter Gropius (founding director, 1919–28)', 'Hannes Meyer (1928–30)', 'Ludwig Mies van der Rohe (1930–33)'],
    ideas: [
      '“Art and Technology — A New Unity” (the title of the school’s 1923 exhibition): craft and industry are not opposites.',
      'The building as the goal of all the arts.',
      'Learning by making: a shared preliminary course, then specialised workshops.',
      'Design for standardised production, serving social needs (stressed particularly under Hannes Meyer).'],
    characteristics: [
      { title: 'Geometric, functional form', text: 'Simple geometry, flat surfaces, primary colours and an emphasis on how things are used.' },
      { title: 'Sans-serif, asymmetrical typography', text: 'Herbert Bayer’s “universal” lowercase alphabet (1925) and the layouts of Moholy-Nagy shaped the New Typography.' },
      { title: 'Tubular steel and industrial materials', text: 'Marcel Breuer’s tubular steel chairs (from 1925–26) adapted bicycle-frame technology to furniture.' },
      { title: 'Experimental photography', text: 'Photograms, unusual viewpoints and photomontage, the “New Vision” promoted by László Moholy-Nagy.' }],
    notableWorks: [
      { title: 'Bauhaus building, Dessau', creator: 'Walter Gropius', date: '1925–26', kind: 'Building' },
      { title: 'Wagenfeld (Wagenfeld–Jucker) table lamp', creator: 'Wilhelm Wagenfeld and Carl Jakob Jucker', date: '1923–24', kind: 'Lighting design' },
      { title: 'Club chair B3 (“Wassily Chair”)', creator: 'Marcel Breuer', date: '1925–26', kind: 'Furniture design' },
      { title: 'Tea infuser MT 49', creator: 'Marianne Brandt', date: '1924', kind: 'Metalwork' },
      { title: 'Universal alphabet', creator: 'Herbert Bayer', date: '1925', kind: 'Typeface design' },
      { title: 'Haus am Horn, Weimar', creator: 'Georg Muche, Adolf Meyer and the Bauhaus workshops', date: '1923', kind: 'Experimental house' }],
    manifestos: [
      { title: 'Programme of the Staatliche Bauhaus in Weimar', year: '1919', note: 'Walter Gropius; founding programme with Feininger’s Cathedral woodcut on the cover.' },
      { title: 'Bauhaus Books (Bauhausbücher)', year: '1925–30', note: 'A series including Moholy-Nagy’s Painting, Photography, Film and Kandinsky’s Point and Line to Plane.' },
      { title: 'bauhaus (journal)', year: '1926–31', note: 'The school’s own magazine.' }],
    disagreements: [
      'Johannes Itten, who ran the preliminary course with a mystical emphasis, left in 1923 as Gropius shifted to a more technological direction.',
      'Hannes Meyer’s socially-minded, collectively organised approach led to his dismissal in 1930 after political controversy.',
      'Although the school admitted women on equal terms, most were steered into the weaving workshop; Gunta Stölzl and Anni Albers made it one of the most innovative.'],
    legacy: [
      'Its preliminary course and workshop model became a template for design education worldwide.',
      'After 1933 Bauhaus teachers dispersed — Gropius to Harvard, Moholy-Nagy to Chicago’s New Bauhaus (1937), the Alberses to Black Mountain College, Mies to Chicago — spreading its ideas through American design, architecture and education.',
      '“Bauhaus and its Sites in Weimar, Dessau and Bernau” is on the UNESCO World Heritage list (1996).'],
    sources: ['s-wingler', 's-naylor', 's-gropius', 's-bauhaus-archiv', 's-moma'],
  }),

  /* ===================================================================== */
  movement({
    id: 'mov-dada', title: 'Dada', subtitle: 'Zurich, Berlin, New York, Paris and beyond · 1916 – c. 1924',
    summary: 'An international, anti-war and anti-establishment avant-garde that used chance, absurdity, collage, photomontage and performance to attack the values it blamed for the First World War.',
    altNames: ['Dadaism'],
    regions: ['europe', 'north-america'], dates: { start: 1916, end: 1924, approx: true, label: '1916 – c. 1924' },
    themes: [], tags: ['anti-art', 'collage', 'photomontage', 'readymade', 'performance', 'sound poetry'], periods: ['per-era-modern'],
    taxonomy: ['m04'], domains: ['painting', 'sculpture', 'literature', 'performance', 'graphic-design', 'typography', 'photography'], level: 'full',
    dateNote: 'Zurich Dada began in 1916; Berlin, Cologne, Hanover, New York and Paris groups overlapped and ended at different times, around 1922–24, with Paris Dada giving way to Surrealism.',
    classificationNote: 'A movement with several distinct local groups. It is not a style: Dadaists used whatever means attacked convention, and the origin of the name itself is disputed.',
    mediums: ['Collage and photomontage', 'Found objects and readymades', 'Printed matter and journals', 'Performance and sound poetry', 'Assemblage'],
    techniques: ['Photomontage', 'Collage', 'Readymade', 'Chance procedures', 'Sound poetry', 'Typographic experiment'],
    context: [
      'The First World War (1914–18) killed millions. Many artists and writers concluded that the nationalism, rationalism and bourgeois culture that had led to it deserved ridicule rather than reform.',
      'Neutral cities — Zurich and, until 1917, New York — became refuges for exiles and objectors. After the war, political turmoil in Berlin and Cologne gave Dada a sharper satirical edge.'],
    origins: [
      'Hugo Ball and Emmy Hennings opened the Cabaret Voltaire in Zurich in February 1916 with Tristan Tzara, Hans Arp, Richard Huelsenbeck, Marcel Janco and others. Evenings combined poetry, music, dance and costume.',
      'Related groups formed in New York (Duchamp, Man Ray, Picabia), Berlin (Huelsenbeck, Hausmann, Höch, Grosz, Heartfield), Cologne (Max Ernst), Hanover (Kurt Schwitters’s Merz) and Paris (from 1920).'],
    reasons: [
      'Revulsion at the war and at the cultural authorities that had supported it.',
      'The sense that conventional art and language had been discredited.',
      'The influence of Futurist performance and Cubist collage, turned toward satire.'],
    founders: ['Hugo Ball', 'Emmy Hennings', 'Tristan Tzara', 'Hans Arp', 'Richard Huelsenbeck', 'Marcel Janco', 'Marcel Duchamp (New York)', 'Raoul Hausmann (Berlin)'],
    ideas: [
      'Anti-art: attack the institutions and values that defined art.',
      'Chance and spontaneity as alternatives to rational control.',
      'Absurdity, irony and humour as political tools.',
      'The ordinary object or image, recontextualised, as art.'],
    characteristics: [
      { title: 'Collage and photomontage', text: 'Cut-up photographs and printed matter gave Berlin Dada a satirical, political bite.' },
      { title: 'The readymade', text: 'Duchamp’s selected everyday objects, such as the urinal submitted as Fountain (1917), questioned what an artwork is.' },
      { title: 'Disruptive typography and print', text: 'Dada journals and posters used mixed typefaces, sizes and directions to break the page layout; this became a source for later graphic design.' },
      { title: 'Performance and sound', text: 'Ball’s sound poem Karawane (1916) and costumed cabaret evenings made the live event central.' }],
    notableWorks: [
      { title: 'Fountain', creator: 'Marcel Duchamp (as R. Mutt)', date: '1917', kind: 'Readymade' },
      { title: 'L.H.O.O.Q.', creator: 'Marcel Duchamp', date: '1919', kind: 'Altered reproduction' },
      { title: 'Cut with the Kitchen Knife Dada through the Last Weimar Beer-Belly Cultural Epoch of Germany', creator: 'Hannah Höch', date: '1919–20', kind: 'Photomontage' },
      { title: 'Mechanical Head (The Spirit of Our Time)', creator: 'Raoul Hausmann', date: 'c. 1919', kind: 'Assemblage' },
      { title: 'Merzbau', creator: 'Kurt Schwitters', date: 'begun 1923', kind: 'Installation (destroyed 1943)' },
      { title: 'Karawane', creator: 'Hugo Ball', date: '1916', kind: 'Sound poem' }],
    manifestos: [
      { title: 'Dada Manifesto (Zurich)', year: '1916', note: 'Hugo Ball.' },
      { title: 'Dada Manifesto 1918', year: '1918', note: 'Tristan Tzara.' },
      { title: 'Collective Dada Manifesto', year: '1920', note: 'Huelsenbeck and the Berlin group.' },
      { title: 'Journals: Dada, 391, Der Dada, Merz', year: '1916–32', note: 'Edited and designed by members; experimental typography.' }],
    disagreements: [
      'Berlin Dada was explicitly political, close to the left; Zurich Dada was more concerned with poetry and performance.',
      'The Paris group split in 1922–23 between Tzara and André Breton, leading to Breton’s Surrealism.',
      'The movement’s core contradiction: it opposed the art world but was quickly absorbed by it.'],
    legacy: [
      'Its strategies — readymade, collage, performance, chance, provocative graphic design — became staples of Conceptual Art, Fluxus, Neo-Dada, Pop, punk and later graphic design.',
      'Surrealism grew directly from Paris Dada; the Situationists and Neo-Dada artists revived its anti-art stance.'],
    sources: ['s-dickerman', 's-nga', 's-tate', 's-moma'],
  }),

  /* ===================================================================== */
  movement({
    id: 'mov-surrealism', title: 'Surrealism', subtitle: 'Paris, then worldwide · 1924 – c. 1966',
    summary: 'A literary and artistic movement led by André Breton that sought to release the imagination through dream, chance and the unconscious, affecting painting, sculpture, photography, film and graphic imagery.',
    altNames: ['Surréalisme'],
    regions: ['europe', 'central-america-caribbean', 'north-america'], dates: { start: 1924, end: 1966, approx: true, label: '1924 – c. 1966' },
    themes: ['theme-migration-identity'], tags: ['automatism', 'dream', 'photography', 'film', 'collage', 'object'], periods: ['per-era-modern'],
    taxonomy: ['m04'], domains: ['painting', 'sculpture', 'photography', 'film-video', 'literature', 'graphic-design', 'performance'], level: 'full',
    dateNote: 'Breton’s first manifesto appeared in 1924 and he died in 1966, but groups and individual Surrealists continued after that and the label is also used loosely for later art.',
    classificationNote: 'An organised movement with a leader, manifestos and group membership (including expulsions), but with several different artistic approaches — automatist and veristic — and a global spread.',
    mediums: ['Oil painting', 'Collage and photomontage', 'Photography', 'Film', 'Objects and assemblage', 'Poetry and automatic writing'],
    techniques: ['Automatism', 'Frottage', 'Decalcomania', 'Exquisite corpse', 'Photomontage', 'Solarisation', 'Dream-image painting'],
    context: [
      'The movement drew on the shock of the First World War, on Freud’s theories of the unconscious and dreams, and on Marxist ideas of revolution. Many founders came from Paris Dada.',
      'In the 1930s the political crisis in Europe brought exiles and cross-border contacts; during the Second World War many Surrealists moved to New York and Mexico City, spreading its ideas.'],
    origins: [
      'André Breton published the Manifesto of Surrealism in 1924 and defined it as “pure psychic automatism”. The Bureau of Surrealist Research opened in Paris, with the journal La Révolution surréaliste (1924–29).',
      'Important exhibitions include the First Surrealist Exhibition (Paris, 1925), the International Surrealist Exhibition in London (1936) and the Paris International Exhibition of Surrealism (1938). A Belgian group formed around René Magritte.'],
    reasons: [
      'To overcome the split between rational and irrational, dream and waking life.',
      'To make a politically and psychologically liberating art after Dada’s negation.',
      'To explore chance, desire and the “marvellous” in everyday life.'],
    founders: ['André Breton', 'Louis Aragon', 'Paul Éluard', 'Max Ernst', 'Joan Miró', 'André Masson', 'Man Ray'],
    ideas: [
      'Automatism: bypass conscious control in writing and drawing.',
      'Dream and the unconscious as a source of images.',
      'The marvellous and objective chance.',
      'Revolt against social and moral conventions, at times allied with communism.'],
    characteristics: [
      { title: 'Impossible juxtapositions', text: 'Everyday things placed in unexpected combinations, often in precisely painted, dreamlike space.' },
      { title: 'Automatic and biomorphic form', text: 'Fluid, abstract marks and organic shapes in work by Miró, Masson and Tanguy.' },
      { title: 'The Surrealist object', text: 'Found items assembled into strange new objects, such as Meret Oppenheim’s fur-lined teacup (1936).' },
      { title: 'Photography and film', text: 'Solarised and manipulated photographs, and films such as Un Chien Andalou (1929).' }],
    notableWorks: [
      { title: 'The Harlequin’s Carnival', creator: 'Joan Miró', date: '1924–25', kind: 'Painting' },
      { title: 'The Treachery of Images', creator: 'René Magritte', date: '1929', kind: 'Painting' },
      { title: 'The Persistence of Memory', creator: 'Salvador Dalí', date: '1931', kind: 'Painting' },
      { title: 'Object (Le Déjeuner en fourrure)', creator: 'Meret Oppenheim', date: '1936', kind: 'Assemblage' },
      { title: 'Un Chien Andalou', creator: 'Luis Buñuel and Salvador Dalí', date: '1929', kind: 'Film' }],
    manifestos: [
      { title: 'Manifesto of Surrealism', year: '1924', note: 'André Breton.' },
      { title: 'Second Manifesto of Surrealism', year: '1929', note: 'André Breton.' },
      { title: 'Journals: La Révolution surréaliste; Le Surréalisme au service de la révolution; Minotaure', year: '1924–39', note: 'Minotaure (1933–39) was notable for its covers by leading artists.' }],
    disagreements: [
      'Breton led the group with exclusions and reconciliations. Dalí fell out with the Paris group in the late 1930s; others left over politics.',
      'Debates between Surrealism and the Communist Party over art and revolution divided members in the early 1930s.',
      'Women were prominent practitioners (Carrington, Varo, Oppenheim, Tanning, Cahun, Maar, Miller), though group discourse often cast women as muses.'],
    legacy: [
      'Surrealist imagery entered advertising, fashion, film and editorial graphic design.',
      'Automatism influenced Abstract Expressionism; Surrealist object-making and photography influenced later conceptual and installation art.',
      'Surrealism had global branches, among them Mexico, Egypt (Art et Liberté), Japan and the Caribbean (with writers such as Aimé Césaire).'],
    sources: ['s-breton', 's-nadeau', 's-tate', 's-nga', 's-pompidou'],
  }),

  /* ===================================================================== */
  movement({
    id: 'mov-russian-constructivism', title: 'Russian Constructivism', subtitle: 'Russia and the Soviet Union · c. 1915 – 1932',
    summary: 'An avant-garde that treated the artist as an engineer and the work as a construction in real space, then pushed art into industrial design, posters, typography, photomontage and architecture for the new Soviet society.',
    altNames: ['Konstruktivizm'],
    regions: ['europe'], dates: { start: 1915, end: 1932, approx: true, label: 'c. 1915 – 1932' },
    themes: ['theme-power'], tags: ['Soviet avant-garde', 'productivism', 'photomontage', 'poster', 'typography', 'architecture'], periods: ['per-era-modern'],
    taxonomy: ['m04', 'm05'], domains: ['sculpture', 'graphic-design', 'typography', 'photography', 'architecture', 'design', 'painting', 'film-video'], level: 'full',
    dateNote: 'Tatlin’s reliefs date from 1914–15, the Constructivist group formed in 1921, and the 1932 decree on cultural organisations ended independent avant-garde groups.',
    classificationNote: 'Part of the wider Constructivist current, which spread to Central Europe and beyond; “Constructivism” alone can also mean this wider international current or the specific Soviet group.',
    mediums: ['Sculpture and reliefs from industrial materials', 'Posters and book design', 'Photography and photomontage', 'Textile and clothing design', 'Architecture and stage design'],
    techniques: ['Photomontage', 'Asymmetrical typographic layout', 'Construction from metal, glass and wood', 'Axonometric drawing', 'Geometric abstraction'],
    context: [
      'After the 1917 revolutions and the Civil War, the new Soviet state needed a visual language for mass literacy, propaganda and reconstruction. Materials were scarce, and artists were drawn into state institutions such as INKhUK and Vkhutemas.',
      'The New Economic Policy (1921–28) brought limited private enterprise, with demand for posters, packaging and publishing, and attracted designers.'],
    origins: [
      'Vladimir Tatlin’s Corner Counter-Reliefs (1914–15), influenced by Picasso’s Cubist constructions, are the usual starting point. His model for a Monument to the Third International (1919–20) became its emblem.',
      'In 1920–21 discussions at INKhUK moved from “composition” to “construction”. The First Working Group of Constructivists (Rodchenko, Stepanova, the Stenberg brothers, Gan and others) formed in 1921, and Alexei Gan published Constructivism in 1922. The journal LEF (1923–25), with Mayakovsky, gave it a platform.'],
    reasons: [
      'To make art useful to the new society rather than an elite pursuit.',
      'The use of modern materials and industrial methods.',
      'A break with “composition” and easel painting.'],
    founders: ['Vladimir Tatlin', 'Alexander Rodchenko', 'Varvara Stepanova', 'Lyubov Popova', 'El Lissitzky', 'Alexei Gan', 'Vladimir and Georgii Stenberg'],
    ideas: [
      'Construction rather than composition: structure and material as the artwork’s subject.',
      'The artist as engineer; art joined to production (Productivism).',
      'Art for mass communication and everyday use.',
      'Total transformation of daily life through design.'],
    characteristics: [
      { title: 'Geometric, dynamic composition', text: 'Diagonals, circles, bars and strong red-black-white colour schemes.' },
      { title: 'Photomontage and photography', text: 'Cut and combined photographs with bold type, as in Rodchenko’s covers and Lissitzky’s page designs.' },
      { title: 'Sans-serif, asymmetrical type', text: 'Lettering and rules used as structural elements of the layout.' },
      { title: 'Industrial materials and open structure', text: 'Metal, glass and wood used to show how things are put together.' }],
    notableWorks: [
      { title: 'Corner Counter-Relief', creator: 'Vladimir Tatlin', date: '1914–15', kind: 'Sculpture' },
      { title: 'Monument to the Third International (model)', creator: 'Vladimir Tatlin', date: '1919–20', kind: 'Architectural model' },
      { title: 'Beat the Whites with the Red Wedge', creator: 'El Lissitzky', date: '1919–20', kind: 'Poster' },
      { title: 'Books (Lengiz advertising poster)', creator: 'Alexander Rodchenko', date: '1924', kind: 'Poster' },
      { title: 'Textile designs for the First State Cotton-Printing Factory', creator: 'Lyubov Popova and Varvara Stepanova', date: '1923–24', kind: 'Textile design' },
      { title: 'Narkomfin Building, Moscow', creator: 'Moisei Ginzburg and Ignaty Milinis', date: '1928–32', kind: 'Building' }],
    manifestos: [
      { title: 'Realistic Manifesto', year: '1920', note: 'Naum Gabo and Antoine Pevsner; they later developed a differently oriented “constructive” art abroad.' },
      { title: 'Constructivism (book)', year: '1922', note: 'Alexei Gan.' },
      { title: 'LEF / Novyi LEF (journals)', year: '1923–28', note: 'Edited by Mayakovsky; with Rodchenko’s covers.' }],
    disagreements: [
      'Gabo and Pevsner argued for art as an autonomous construction, against Tatlin and the Productivists who wanted art to merge with production.',
      'Constructivists and Suprematists disagreed about utility: Malevich’s work was spiritual and non-objective, while Constructivists stressed social function.',
      'Many designs were never built; Tatlin’s Monument remained a model.'],
    legacy: [
      'Its asymmetrical layout, photomontage and bold sans-serif type shaped the Bauhaus, De Stijl, the New Typography and the International Typographic Style, and recurs in graphic design today.',
      'Its ideas fed architecture and later Minimalism, kinetic art and Deconstructivism.',
      'A 1932 decree dissolved independent groups, and Socialist Realism became official doctrine; many Constructivists were sidelined.'],
    sources: ['s-lodder', 's-moma', 's-tate', 's-pompidou'],
  }),

  /* ===================================================================== */
  movement({
    id: 'mov-de-stijl', title: 'De Stijl', subtitle: 'The Netherlands · 1917 – 1931',
    summary: 'A Dutch group of painters, architects and designers who pursued a universal visual language of straight lines and primary colours, applied across painting, furniture, architecture and typography.',
    altNames: ['The Style', 'Neoplasticism (related theory)'],
    regions: ['europe'], dates: { start: 1917, end: 1931, label: '1917 – 1931' },
    themes: [], tags: ['abstraction', 'neo-plasticism', 'architecture', 'furniture', 'typography', 'journal'], periods: ['per-era-modern'],
    taxonomy: ['m04', 'm05'], domains: ['painting', 'architecture', 'design', 'graphic-design', 'typography', 'sculpture'], level: 'full',
    dateNote: 'The journal De Stijl was founded in 1917; its last regular issue appeared around the time of Theo van Doesburg’s death in 1931.',
    classificationNote: 'A group and a journal as well as a style. Neo-Plasticism, Piet Mondrian’s term and theory, is the core of De Stijl painting but not identical with the whole movement.',
    mediums: ['Oil painting', 'Furniture', 'Architecture', 'Stained glass', 'Printed matter and typography', 'Interior colour schemes'],
    techniques: ['Orthogonal grid composition', 'Primary colours with black, white and grey', 'Asymmetrical balance', 'Standardised, modular construction', 'Geometric lettering'],
    context: [
      'The Netherlands stayed neutral in the First World War, so Dutch artists could continue working while elsewhere culture was disrupted. Many were influenced by Theosophy and by ideas of spiritual order and universal harmony.',
      'The postwar housing shortage and the growth of modern architecture created chances for built collaboration between artists and architects.'],
    origins: [
      'Theo van Doesburg founded the journal De Stijl in Leiden in 1917 with Piet Mondrian, Vilmos Huszár, Bart van der Leck, Georges Vantongerloo and the architects J. J. P. Oud, Robert van ’t Hoff and Jan Wils. Gerrit Rietveld joined soon after.',
      'The group’s first manifesto appeared in 1918. Mondrian, living in Paris from 1919, developed Neo-Plasticism there; van Doesburg later travelled and taught, including in Weimar in 1921–22.'],
    reasons: [
      'The pursuit of a universal, impersonal art that transcends individual feeling.',
      'The wish to unify painting, architecture and design into one environment.',
      'Hope for a new society after the First World War.'],
    founders: ['Theo van Doesburg', 'Piet Mondrian', 'Vilmos Huszár', 'Bart van der Leck', 'Georges Vantongerloo', 'J. J. P. Oud', 'Gerrit Rietveld'],
    ideas: [
      'Reduction to essentials: horizontal and vertical lines, rectangles and primary colours.',
      'Universal over individual; harmony through balance of opposites.',
      'A total art in which painting, architecture and furniture merge.',
      'Abstraction as a spiritual and social ideal.'],
    characteristics: [
      { title: 'Grid and primary colour', text: 'Black lines on a white ground, with planes of red, yellow and blue, as in Mondrian’s mature compositions.' },
      { title: 'Planes in space', text: 'Architects and designers extended the planes into three dimensions: separate surfaces slipping past each other, as in Rietveld’s Schröder House.' },
      { title: 'Geometric typography', text: 'Letterforms built from straight lines and squares, used on the journal and in posters.' },
      { title: 'Asymmetrical balance', text: 'Compositions balance unequal elements rather than mirror them.' }],
    notableWorks: [
      { title: 'Composition II in Red, Blue, and Yellow', creator: 'Piet Mondrian', date: '1930', kind: 'Painting' },
      { title: 'Red and Blue Chair', creator: 'Gerrit Rietveld', date: 'designed c. 1918; coloured c. 1923', kind: 'Furniture' },
      { title: 'Rietveld Schröder House, Utrecht', creator: 'Gerrit Rietveld with Truus Schröder-Schräder', date: '1924', kind: 'Building' },
      { title: 'Café Aubette, Strasbourg (interiors)', creator: 'Theo van Doesburg with Hans Arp and Sophie Taeuber-Arp', date: '1926–28', kind: 'Interior' },
      { title: 'Counter-Composition VI', creator: 'Theo van Doesburg', date: '1925', kind: 'Painting' }],
    manifestos: [
      { title: 'De Stijl Manifesto I', year: '1918', note: 'Signed by van Doesburg, Huszár, Vantongerloo and others.' },
      { title: 'De Stijl (journal)', year: '1917–31', note: 'Edited by van Doesburg; the group’s main platform and an exercise in typographic design.' }],
    disagreements: [
      'Mondrian left in 1924 after van Doesburg introduced the diagonal in “Elementarism”, which Mondrian considered a violation of Neo-Plastic principles.',
      'Oud left earlier in the 1920s over different views on architecture and decoration.',
      'Van Doesburg also published Dada work under the pseudonym I. K. Bonset — a tension with the movement’s rational image.'],
    legacy: [
      'De Stijl planes influenced the Bauhaus (van Doesburg’s Weimar visit) and the International Style in architecture.',
      'The Red and Blue Chair and Schröder House have become icons of modern design; the grid and primary colours became a lasting graphic idiom, referenced in fashion, packaging and branding.',
      'The Rietveld Schröder House is a UNESCO World Heritage site (2000).'],
    sources: ['s-blotkamp', 's-troy', 's-kmd', 's-moma', 's-tate'],
  }),
]

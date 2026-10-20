import { event } from './helpers'

/**
 * Historical events that shaped well-known works and artists, added so that every work with a clear historical context can point to it.
 * Each has a short "what happened" and a "connection to art" section; the works, artists and movements it touched are linked in
 * event-links.ts. Dates and facts are the commonly agreed ones; contested figures are described as contested.
 */
export const eventsMore = [
  event({
    id: 'evt-spanish-civil-war', kindOfEvent: 'political', title: 'The Spanish Civil War', subtitle: '1936 – 1939',
    summary: 'A war between the Spanish Republic and a military rebellion led by General Francisco Franco, ending in a Nationalist victory and a dictatorship that lasted until 1975.',
    regions: ['europe'], dates: { start: 1936, end: 1939, label: '1936 – 1939' },
    sections: [
      { heading: 'What happened', paragraphs: [
        'In July 1936 part of the army rose against Spain’s elected Republican government. The coup failed to take the whole country and turned into a three-year civil war. The Nationalists, led by Franco, received weapons and troops from Nazi Germany and Fascist Italy; the Republic received Soviet aid and the volunteers of the International Brigades, while Britain and France stayed officially neutral. The Nationalists won in April 1939, and Franco ruled Spain until his death in 1975.'] },
      { heading: 'Connection to art', paragraphs: [
        'The Republic used art to win support abroad. Its pavilion at the 1937 Paris International Exposition showed Picasso’s Guernica, Joan Miró’s mural The Reaper (now lost) and Alexander Calder’s Mercury Fountain. Photographers, poster designers and painters recorded and argued about the war, and many Spanish artists went into exile. Picasso asked that Guernica not go to Spain until democracy was restored, and it did not return until 1981.'] },
    ],
    artSignificance: 'The war turned painting and photography into political testimony, and scattered Spain’s artists abroad.', sources: ['s-smarthistory', 's-reina-sofia'],
  }),
  event({
    id: 'evt-bombing-guernica', kindOfEvent: 'political', title: 'The Bombing of Gernika', subtitle: '26 April 1937',
    summary: 'Aircraft of the German Condor Legion and the Italian air force bombed the Basque town of Gernika in support of Franco’s forces.',
    regions: ['europe'], dates: { start: 1937, label: '26 April 1937' },
    sections: [
      { heading: 'What happened', paragraphs: [
        'On the afternoon of 26 April 1937, a market day, German and Italian aircraft fighting for the Nationalists bombed Gernika (in Spanish, Guernica), a small town in the Basque Country that was a symbol of Basque tradition. Much of the town was destroyed. Early reports spoke of more than 1,600 dead; later research gives much lower figures, and the exact toll is still debated. The attack became one of the first widely reported bombings of a civilian town.'] },
      { heading: 'Connection to art', paragraphs: [
        'Picasso, working in Paris on a large commission for the Spanish Pavilion, read the newspaper reports in early May 1937 and began Guernica within days. He finished it in about five weeks. Dora Maar photographed the canvas at several stages. The painting made the town’s name known worldwide, and it became a standard image of the suffering of civilians in war.'] },
    ],
    artSignificance: 'A single bombing became the subject of one of the most reproduced paintings of the twentieth century.', sources: ['s-smarthistory', 's-reina-sofia'],
  }),
  event({
    id: 'evt-wwi', kindOfEvent: 'political', title: 'The First World War', subtitle: '1914 – 1918',
    summary: 'A war involving most of the world’s great powers, which killed millions, ended four empires and shaped a generation of artists.',
    regions: ['europe', 'west-asia-north-africa'], dates: { start: 1914, end: 1918, label: '1914 – 1918' },
    sections: [
      { heading: 'What happened', paragraphs: [
        'The war began in July 1914 and ended with the armistice of 11 November 1918. Industrial weapons, trench warfare and mass conscription killed around nine million soldiers and many civilians. The German, Austro-Hungarian, Russian and Ottoman empires collapsed.'] },
      { heading: 'Connection to art', paragraphs: [
        'Several artists were killed or damaged by the war: August Macke in 1914, Franz Marc and Umberto Boccioni in 1916. Käthe Kollwitz lost her son Peter in 1914 and made her memorial figures, now in the German war cemetery at Vladslo in Belgium, in his memory. Ernst Ludwig Kirchner’s service ended in a breakdown. In neutral Zurich in 1916 a group of writers and artists founded Dada, partly as a protest against the war and the society that produced it.'] },
    ],
    artSignificance: 'The war ended careers, drove some artists to protest, and gave twentieth-century art its sense of rupture.', sources: ['s-smarthistory', 's-gombrich'],
  }),
  event({
    id: 'evt-french-revolution', kindOfEvent: 'political', title: 'The French Revolution', subtitle: '1789 – 1799',
    summary: 'The overthrow of the French monarchy and the old social order, followed by a republic, terror and the rise of Napoleon.',
    regions: ['europe'], places: ['place-paris'], dates: { start: 1789, end: 1799, label: '1789 – 1799' },
    sections: [
      { heading: 'What happened', paragraphs: [
        'Beginning in 1789, a revolution in France abolished feudal privileges, executed Louis XVI in 1793, declared a republic and went through a period of political terror before ending in Napoleon Bonaparte’s seizure of power in 1799.'] },
      { heading: 'Connection to art', paragraphs: [
        'The Revolution closed the royal academy in 1793 and opened the Louvre as a public museum the same year. Jacques-Louis David became a leading political painter of the Revolution, while court portraitists such as Élisabeth Vigée Le Brun, painter to Queen Marie Antoinette, left France in 1789. The severe, civic style of Neoclassicism became linked with revolutionary ideals.'] },
    ],
    artSignificance: 'It changed who commissioned art, who saw it, and which styles looked political.', sources: ['s-smarthistory', 's-gombrich'],
  }),
  event({
    id: 'evt-peninsular-war', kindOfEvent: 'political', title: 'The Peninsular War and the Uprising of 2–3 May 1808', subtitle: '1808 – 1814',
    summary: 'The war that followed Napoleon’s occupation of Spain, which began in Madrid with the uprising of 2 May 1808 and the executions of 3 May.',
    regions: ['europe'], dates: { start: 1808, end: 1814, label: '1808 – 1814' },
    sections: [
      { heading: 'What happened', paragraphs: [
        'In 1808 French troops occupied Spain and Napoleon placed his brother Joseph on the throne. On 2 May the people of Madrid rose against the occupation; French troops put the rising down, and on the night of 2–3 May they shot a number of prisoners. A long guerrilla and conventional war followed until the French were driven out in 1813–14.'] },
      { heading: 'Connection to art', paragraphs: [
        'Francisco Goya, who stayed in Spain, recorded the war in a series of etchings, The Disasters of War, made between about 1810 and 1820. In 1814, after the return of King Ferdinand VII, he painted The Second of May 1808 and The Third of May 1808 as commemorations. The Third of May, with its lit, faceless firing squad, became a model for later paintings of state violence.'] },
    ],
    artSignificance: 'Goya turned a specific night of killing into a lasting picture of the victims of war.', sources: ['s-smarthistory', 's-gombrich'],
  }),
  event({
    id: 'evt-july-revolution', kindOfEvent: 'political', title: 'The July Revolution of 1830', subtitle: '27 – 29 July 1830',
    summary: 'Three days of street fighting in Paris that overthrew King Charles X and brought Louis-Philippe to the throne.',
    regions: ['europe'], places: ['place-paris'], dates: { start: 1830, label: '27 – 29 July 1830' },
    sections: [
      { heading: 'What happened', paragraphs: [
        'After Charles X issued ordinances limiting the press and the electorate, Parisians built barricades and fought the royal troops for three days, known as the “Trois Glorieuses”. Charles X abdicated, and Louis-Philippe, the “citizen king”, took the throne.'] },
      { heading: 'Connection to art', paragraphs: [
        'Eugène Delacroix, who did not fight, painted Liberty Leading the People in the autumn of 1830 and showed it at the Salon of 1831. The state bought it, then kept it out of sight for years because its subject was thought too inflammatory. Honoré Daumier’s satirical prints of the new regime and its ministers brought him a prison sentence in 1832.'] },
    ],
    artSignificance: 'A recent political event was treated as a subject for a monumental history painting.', sources: ['s-smarthistory', 's-louvre'],
  }),
  event({
    id: 'evt-wreck-medusa', kindOfEvent: 'social', title: 'The Wreck of the Méduse', subtitle: '1816',
    summary: 'A French naval frigate ran aground off West Africa; its abandoned raft became a public scandal in France.',
    regions: ['europe', 'sub-saharan-africa'], dates: { start: 1816, label: '1816' },
    sections: [
      { heading: 'What happened', paragraphs: [
        'In July 1816 the frigate Méduse, commanded by a captain appointed through political favour after the restoration of the Bourbon monarchy, ran aground off the coast of present-day Mauritania. About 150 people were put on an improvised raft that was towed and then cut loose. After thirteen days adrift only about fifteen were still alive. Two survivors published an account that turned the wreck into a political scandal.'] },
      { heading: 'Connection to art', paragraphs: [
        'Théodore Géricault read the survivors’ account, interviewed them, studied corpses in hospitals and had a model of the raft built in his studio. The Raft of the Medusa, shown at the Salon of 1819, treated a contemporary disaster on the scale of a history painting.'] },
    ],
    artSignificance: 'A contemporary scandal was painted with the scale and seriousness of classical history.', sources: ['s-smarthistory', 's-louvre'],
  }),
  event({
    id: 'evt-industrial-revolution', kindOfEvent: 'technological', title: 'The Industrial Revolution', subtitle: 'c. 1760 – 1840',
    summary: 'The shift to machine manufacture, steam power and railways, which began in Britain and changed how people worked, travelled and saw.',
    regions: ['europe'], dates: { start: 1760, end: 1840, approx: true, label: 'c. 1760 – 1840' },
    sections: [
      { heading: 'What happened', paragraphs: [
        'From the later eighteenth century, factories, steam engines and later railways transformed manufacturing and transport, first in Britain and then across Europe and North America. Cities grew rapidly, and mass-produced goods replaced much hand-made work.'] },
      { heading: 'Connection to art', paragraphs: [
        'Painters took up the new subjects: J. M. W. Turner’s Rain, Steam and Speed (1844) shows a locomotive crossing the Thames; Honoré Daumier painted poor passengers in third-class railway carriages. A reaction against machine-made goods inspired William Morris and the Arts and Crafts Movement.'] },
    ],
    artSignificance: 'New machines became subjects, and their products provoked a revival of handcraft.', sources: ['s-smarthistory', 's-gombrich'],
  }),
  event({
    id: 'evt-russian-revolution', kindOfEvent: 'political', title: 'The Russian Revolution and Civil War', subtitle: '1917 – 1922',
    summary: 'The fall of the tsar in 1917, the Bolshevik seizure of power and a civil war that created the Soviet state.',
    regions: ['europe'], dates: { start: 1917, end: 1922, label: '1917 – 1922' },
    sections: [
      { heading: 'What happened', paragraphs: [
        'The tsar abdicated in February 1917 and the Bolsheviks took power in October. A civil war between the Red Army and the anti-Bolshevik “Whites” followed, ending in 1922 with the founding of the Soviet Union.'] },
      { heading: 'Connection to art', paragraphs: [
        'Many avant-garde artists worked for the new state, designing posters, street decorations, books and propaganda trains. El Lissitzky’s poster Beat the Whites with the Red Wedge (1919) used abstract geometry to carry a political message. The same circle developed Constructivism, which aimed to put art to practical use in everyday life.'] },
    ],
    artSignificance: 'Abstraction was put to work as public communication for a new state.', sources: ['s-smarthistory', 's-gombrich'],
  }),
  event({
    id: 'evt-mexican-revolution', kindOfEvent: 'political', title: 'The Mexican Revolution', subtitle: '1910 – 1920',
    summary: 'A decade of civil war that overthrew the long dictatorship of Porfirio Díaz and reshaped Mexican politics and national identity.',
    regions: ['central-america-caribbean'], dates: { start: 1910, end: 1920, label: '1910 – 1920' },
    sections: [
      { heading: 'What happened', paragraphs: [
        'Beginning in 1910, uprisings against the president Porfirio Díaz grew into a civil war between several factions. It ended in about 1920 and led to a new constitution in 1917 and, over the following years, land reform and a new national politics.'] },
      { heading: 'Connection to art', paragraphs: [
        'From 1921 the government, under its education minister José Vasconcelos, commissioned large public murals about Mexican history and the Revolution. Diego Rivera, José Clemente Orozco and David Alfaro Siqueiros became the leading painters of Mexican Muralism, and Orozco and Rivera also painted murals in the United States.'] },
    ],
    artSignificance: 'A revolution produced a state-sponsored public art about its own history.', sources: ['s-smarthistory', 's-met-toah'],
  }),
  event({
    id: 'evt-reformation', kindOfEvent: 'cultural', title: 'The Protestant Reformation', subtitle: 'from 1517',
    summary: 'The movement that began with Martin Luther’s challenge to the Catholic Church and divided Western Christianity.',
    regions: ['europe'], dates: { start: 1517, end: null, label: 'from 1517' },
    sections: [
      { heading: 'What happened', paragraphs: [
        'In 1517 Martin Luther circulated his Ninety-five Theses against the sale of indulgences. The dispute grew into a break between Protestant and Catholic churches. Reformers disagreed over religious images, and waves of image-breaking (iconoclasm) swept through parts of Europe, including the Netherlands in 1566.'] },
      { heading: 'Connection to art', paragraphs: [
        'Lucas Cranach the Elder, a friend of Luther, painted his portraits and made Reformation prints. In Calvinist Dutch churches, altarpieces were no longer wanted, and painters turned to portraits, still lifes, landscapes and scenes of daily life for private buyers. Hans Holbein’s The Ambassadors (1533) includes a Lutheran hymnbook and a lute with a broken string, which scholars often read as signs of religious division.'] },
    ],
    artSignificance: 'It changed what churches commissioned and pushed painters toward secular subjects.', sources: ['s-smarthistory', 's-gombrich'],
  }),
  event({
    id: 'evt-great-depression', kindOfEvent: 'economic', title: 'The Great Depression and the New Deal arts programmes', subtitle: '1929 – 1939',
    summary: 'A worldwide economic collapse; in the United States, federal programmes paid thousands of artists to make public art.',
    regions: ['north-america'], places: ['place-new-york'], dates: { start: 1929, end: 1939, label: '1929 – 1939' },
    sections: [
      { heading: 'What happened', paragraphs: [
        'After the stock market crash of 1929, unemployment in the United States rose to a quarter of the workforce. Under the New Deal, federal programmes of the 1930s — including the Public Works of Art Project and the Works Progress Administration’s Federal Art Project — employed thousands of artists.'] },
      { heading: 'Connection to art', paragraphs: [
        'The programmes paid for murals, posters and easel paintings and created networks of artists, among them Jackson Pollock, Willem de Kooning and Lee Krasner, who later became leading Abstract Expressionists. Federal photographers, including Dorothea Lange and Walker Evans, documented rural poverty. Aaron Douglas’s Aspects of Negro Life murals (1934) for a New York library were made in this setting.'] },
    ],
    artSignificance: 'Public money kept a generation of American artists working and made public art a national project.', sources: ['s-smarthistory', 's-met-toah'],
  }),
  event({
    id: 'evt-sino-japanese-war', kindOfEvent: 'political', title: 'The Second Sino-Japanese War', subtitle: '1937 – 1945',
    summary: 'The Japanese invasion of China, which became part of the Second World War.',
    regions: ['east-asia'], dates: { start: 1937, end: 1945, label: '1937 – 1945' },
    sections: [
      { heading: 'What happened', paragraphs: [
        'Full-scale war between China and Japan began in July 1937 after a clash near Beijing. Japan occupied much of eastern China, and the war ended with Japan’s surrender in 1945. Millions of Chinese civilians and soldiers died, and millions more became refugees.'] },
      { heading: 'Connection to art', paragraphs: [
        'Xu Beihong, who combined Chinese ink and Western academic training, raised money for war relief through exhibitions abroad, including in Southeast Asia and India. His large painting Put Down Your Whip (1939) shows a street performer, in a scene from a well-known patriotic play about refugees, being urged to drop the whip and turn it against the invader.'] },
    ],
    artSignificance: 'Painting was used as a tool of national resistance and fundraising.', sources: ['s-met-toah', 's-cahill'],
  }),
  event({
    id: 'evt-norman-conquest', kindOfEvent: 'political', title: 'The Norman Conquest of England', subtitle: '1066',
    summary: 'Duke William of Normandy defeated King Harold at the Battle of Hastings and became King of England.',
    regions: ['europe'], dates: { start: 1066, label: '1066' },
    sections: [
      { heading: 'What happened', paragraphs: [
        'After the death of Edward the Confessor in January 1066, Harold Godwinson was crowned king. William of Normandy, who claimed the throne, landed in southern England and defeated and killed Harold at the Battle of Hastings on 14 October 1066. William was crowned king on Christmas Day and the Norman conquest of England followed.'] },
      { heading: 'Connection to art', paragraphs: [
        'The Bayeux Tapestry, an embroidered strip about 70 metres long, tells the story of the conquest from the Norman side. It is generally thought to have been commissioned in the 1070s by Bishop Odo of Bayeux, William’s half-brother, and made by embroiderers in England. It is one of the most detailed pictorial sources for the events of 1066.'] },
    ],
    artSignificance: 'A single conquest produced the most extensive surviving picture-story of the early Middle Ages.', sources: ['s-grove', 's-smarthistory'],
  }),
]

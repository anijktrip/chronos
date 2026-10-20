import { place } from './helpers'

type P = [id: string, title: string, country: string, lonlat: [number, number], region: Parameters<typeof place>[0]['regions'][number], summary: string, sig: string]

const rows: P[] = [
  ['place-argos', 'Argos', 'Greece', [22.73, 37.63], 'europe', 'City in the Peloponnese, associated with the sculptor Polykleitos.', 'A major centre of bronze sculpture in the 5th century BCE.'],
  ['place-naples', 'Naples', 'Italy', [14.27, 40.85], 'europe', 'Home to the Museo Archeologico Nazionale, which holds major finds from Pompeii and Herculaneum.', 'Its collections preserve many Roman copies of lost Greek originals.'],
  ['place-lintong', 'Lintong, Shaanxi', 'China', [109.27, 34.38], 'east-asia', 'District near Xi’an containing the mausoleum complex of Qin Shi Huang.', 'The pits of the Terracotta Army, found in 1974, lie east of the emperor’s burial mound.'],
  ['place-kaifeng', 'Kaifeng (Bianjing)', 'China', [114.31, 34.8], 'east-asia', 'Capital of the Northern Song dynasty until 1127.', 'The court and scholarly milieu of the capital shaped Northern Song painting.'],
  ['place-edo', 'Edo (Tokyo)', 'Japan', [139.69, 35.69], 'east-asia', 'Seat of the Tokugawa shogunate and one of the world’s largest cities by the 18th century.', 'Its publishers, theatres and pleasure quarters made the city the engine of ukiyo-e.'],
  ['place-agra', 'Agra', 'India', [78.01, 27.18], 'south-asia', 'A principal Mughal capital and the site of the imperial painting workshops under Akbar and his successors.', 'Court ateliers here and in other Mughal cities produced illustrated manuscripts and albums.'],
  ['place-angkor', 'Angkor', 'Cambodia', [103.87, 13.41], 'southeast-asia', 'Archaeological region near Siem Reap containing the temples and cities of the Khmer Empire.', 'Angkor Wat, Bayon and hundreds of other monuments lie within a single landscape.'],
  ['place-kairouan', 'Kairouan', 'Tunisia', [10.1, 35.68], 'west-asia-north-africa', 'Early Islamic city in central Tunisia, founded in the 670s and long a centre of learning.', 'Its Great Mosque and scriptoria are associated with early North African Qur’an production.'],
  ['place-benin-city', 'Benin City', 'Nigeria', [5.63, 6.34], 'sub-saharan-africa', 'Capital of the Kingdom of Benin and seat of the Oba today.', 'The palace guilds worked here; the city was sacked by a British force in 1897.'],
  ['place-palenque', 'Palenque', 'Mexico', [-92.05, 17.48], 'central-america-caribbean', 'Classic Maya city in Chiapas, noted for its refined relief carving and inscriptions.', 'The Temple of the Inscriptions houses the tomb of the ruler K’inich Janaab’ Pakal.'],
  ['place-cusco', 'Cusco', 'Peru', [-71.97, -13.52], 'south-america', 'Capital of the Inka Empire.', 'The administrative and ritual centre where state weaving and stone-working were organised.'],
  ['place-manutuke', 'Manutuke, Tūranganui-a-Kiwa (Poverty Bay)', 'Aotearoa New Zealand', [177.93, -38.65], 'oceania', 'Rongowhakaata homeland on the east coast of the North Island.', 'Te Hau ki Tūranga was carved here in the early 1840s.'],
  ['place-florence', 'Florence', 'Italy', [11.25, 43.77], 'europe', 'Tuscan city-state and a leading centre of Renaissance workshops.', 'Artists such as Leonardo trained in its bottegas.'],
  ['place-venice', 'Venice', 'Italy', [12.33, 45.44], 'europe', 'Maritime republic and printing centre.', 'Albrecht Dürer visited Venice in 1494–95 and again in 1505–07.'],
  ['place-nuremberg', 'Nuremberg', 'Germany', [11.08, 49.45], 'europe', 'Free imperial city and a hub of printing and metalwork.', 'Dürer’s workshop was based here.'],
  ['place-amsterdam', 'Amsterdam', 'Netherlands', [4.9, 52.37], 'europe', 'Commercial heart of the Dutch Republic.', 'A major market for paintings and prints, and home to Rembrandt for most of his career.'],
  ['place-delft', 'Delft', 'Netherlands', [4.36, 52.01], 'europe', 'Dutch town known for ceramics and as Vermeer’s home.', 'Vermeer lived and worked here for his whole life.'],
  ['place-paris', 'Paris', 'France', [2.35, 48.86], 'europe', 'Capital of France and a leading centre of the modern art world in the 19th and early 20th centuries.', 'The setting for Impressionism, Post-Impressionism and Cubism.'],
  ['place-saint-remy', 'Saint-Rémy-de-Provence', 'France', [4.83, 43.79], 'europe', 'Town in southern France where Van Gogh stayed at an asylum in 1889–90.', 'Van Gogh painted The Starry Night from his room there.'],
  ['place-new-york', 'New York City', 'United States', [-74.0, 40.71], 'north-america', 'Became a leading centre of the art world in the mid-20th century.', 'Home to the Abstract Expressionists.'],
  ['place-harlem', 'Harlem, New York', 'United States', [-73.95, 40.81], 'north-america', 'Neighbourhood in upper Manhattan that became a cultural capital of Black America in the 1920s–30s.', 'The setting of the Harlem Renaissance.'],
]

export const places = rows.map(([id, title, country, coordinates, r, summary, artSignificance]) =>
  place({
    id, title, country, coordinates, regions: [r], dates: { start: 0 }, summary, artSignificance,
    sections: [{ heading: 'About this place', paragraphs: [summary, artSignificance] }],
  }),
)

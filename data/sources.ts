import type { SourceRef } from '@/types'

/**
 * Source catalogue.
 *
 * Honesty note: these are *starting points to verify against*, not footnotes for specific
 * claims. Institutional entries point at the holding museum's collection site (root URL only).
 * Scholarship entries are standard works named from general knowledge; page references are
 * deliberately absent because the prototype text has not been checked claim-by-claim.
 */
export const sources: SourceRef[] = [
  // ---- general reference ----
  { id: 's-met-toah', kind: 'reference', citation: 'Metropolitan Museum of Art, Heilbrunn Timeline of Art History', url: 'https://www.metmuseum.org/toah/' },
  { id: 's-smarthistory', kind: 'reference', citation: 'Smarthistory (open art history textbook and videos)', url: 'https://smarthistory.org' },
  { id: 's-grove', kind: 'reference', citation: 'Grove Art Online (Oxford Art Online)', url: 'https://www.oxfordartonline.com' },
  { id: 's-commons', kind: 'reference', citation: 'Wikimedia Commons — image files and licence information', url: 'https://commons.wikimedia.org' },
  { id: 's-gombrich', kind: 'scholarship', citation: 'E. H. Gombrich, The Story of Art (Phaidon)' },

  // ---- holding institutions ----
  { id: 's-louvre', kind: 'collection', citation: 'Musée du Louvre — collections database', url: 'https://collections.louvre.fr' },
  { id: 's-bm', kind: 'collection', citation: 'British Museum — collection online', url: 'https://www.britishmuseum.org/collection' },
  { id: 's-rijks', kind: 'collection', citation: 'Rijksmuseum — collection', url: 'https://www.rijksmuseum.nl/en/collection' },
  { id: 's-mauritshuis', kind: 'collection', citation: 'Mauritshuis, The Hague — collection', url: 'https://www.mauritshuis.nl' },
  { id: 's-vgm', kind: 'collection', citation: 'Van Gogh Museum, Amsterdam — collection', url: 'https://www.vangoghmuseum.nl/en/collection' },
  { id: 's-moma', kind: 'collection', citation: 'Museum of Modern Art, New York — collection', url: 'https://www.moma.org/collection' },
  { id: 's-met', kind: 'collection', citation: 'Metropolitan Museum of Art — collection', url: 'https://www.metmuseum.org/art/collection' },
  { id: 's-freer', kind: 'collection', citation: 'Smithsonian National Museum of Asian Art (Freer Gallery of Art) — collections', url: 'https://asia.si.edu' },
  { id: 's-npm', kind: 'collection', citation: 'National Palace Museum, Taipei — collection', url: 'https://www.npm.gov.tw/en' },
  { id: 's-tepapa', kind: 'collection', citation: 'Museum of New Zealand Te Papa Tongarewa — collections online', url: 'https://collections.tepapa.govt.nz' },
  { id: 's-doaks', kind: 'collection', citation: 'Dumbarton Oaks, Washington DC — museum collections', url: 'https://museum.doaks.org' },
  { id: 's-reina-sofia', kind: 'collection', citation: 'Museo Nacional Centro de Arte Reina Sofía, Madrid — collection (Guernica)', url: 'https://www.museoreinasofia.es/en/collection/artwork/guernica' },
  { id: 's-marmottan', kind: 'collection', citation: 'Musée Marmottan Monet, Paris', url: 'https://www.marmottan.fr' },
  { id: 's-mann', kind: 'collection', citation: 'Museo Archeologico Nazionale di Napoli', url: 'https://mann-napoli.it' },
  { id: 's-pinakothek', kind: 'collection', citation: 'Alte Pinakothek, Munich (Bavarian State Painting Collections)', url: 'https://www.pinakothek.de/en/' },
  { id: 's-schomburg', kind: 'collection', citation: 'Schomburg Center for Research in Black Culture, New York Public Library', url: 'https://www.nypl.org/locations/schomburg' },
  { id: 's-phillips', kind: 'collection', citation: 'The Phillips Collection, Washington DC', url: 'https://www.phillipscollection.org' },

  // ---- scholarship (named from general knowledge; not checked claim-by-claim) ----
  { id: 's-stewart-greek', kind: 'scholarship', citation: 'Andrew Stewart, Greek Sculpture: An Exploration (Yale University Press, 1990)' },
  { id: 's-pollitt', kind: 'scholarship', citation: 'J. J. Pollitt, Art and Experience in Classical Greece (Cambridge University Press, 1972)' },
  { id: 's-portal', kind: 'scholarship', citation: 'Jane Portal (ed.), The First Emperor: China’s Terracotta Army (British Museum Press, 2007)' },
  { id: 's-miller-martin', kind: 'scholarship', citation: 'Mary Miller and Simon Martin, Courtly Art of the Ancient Maya (Thames & Hudson, 2004)' },
  { id: 's-freeman-jacques', kind: 'scholarship', citation: 'Michael Freeman and Claude Jacques, Ancient Angkor (River Books)' },
  { id: 's-blair-calligraphy', kind: 'scholarship', citation: 'Sheila S. Blair, Islamic Calligraphy (Edinburgh University Press, 2006)' },
  { id: 's-cahill', kind: 'scholarship', citation: 'James Cahill, Chinese Painting (Skira, 1960)' },
  { id: 's-hearn', kind: 'scholarship', citation: 'Maxwell K. Hearn, How to Read Chinese Paintings (Metropolitan Museum of Art, 2008)' },
  { id: 's-plankensteiner', kind: 'scholarship', citation: 'Barbara Plankensteiner (ed.), Benin: Kings and Rituals — Court Arts from Nigeria (Snoeck, 2007)' },
  { id: 's-hicks', kind: 'scholarship', citation: 'Dan Hicks, The Brutish Museums: The Benin Bronzes, Colonial Violence and Cultural Restitution (Pluto Press, 2020)' },
  { id: 's-neich', kind: 'scholarship', citation: 'Roger Neich, Carved Histories: Rotorua Ngati Tarawhai Woodcarving (Auckland University Press, 2001)' },
  { id: 's-phipps', kind: 'scholarship', citation: 'Elena Phipps, Johanna Hecht and Cristina Esteras Martín (eds), The Colonial Andes: Tapestries and Silverwork, 1530–1830 (Metropolitan Museum of Art, 2004)' },
  { id: 's-baxandall', kind: 'scholarship', citation: 'Michael Baxandall, Painting and Experience in Fifteenth-Century Italy (Oxford University Press, 1972)' },
  { id: 's-schama', kind: 'scholarship', citation: 'Simon Schama, The Embarrassment of Riches: An Interpretation of Dutch Culture in the Golden Age (Knopf, 1987)' },
  { id: 's-beach', kind: 'scholarship', citation: 'Milo Cleveland Beach, The Imperial Image: Paintings for the Mughal Court (Freer Gallery of Art, 1981)' },
  { id: 's-clark-hokusai', kind: 'scholarship', citation: 'Timothy Clark (ed.), Hokusai: Beyond the Great Wave (British Museum, 2017)' },
  { id: 's-thompson-floating', kind: 'scholarship', citation: 'Sarah E. Thompson and H. D. Harootunian, Undercurrents in the Floating World: Censorship and Japanese Prints (Asia Society, 1991)' },
  { id: 's-weisberg', kind: 'scholarship', citation: 'Gabriel P. Weisberg et al., Japonisme: Japanese Influence on French Art, 1854–1910 (Cleveland Museum of Art, 1975)' },
  { id: 's-rewald', kind: 'scholarship', citation: 'John Rewald, The History of Impressionism (Museum of Modern Art, 1946)' },
  { id: 's-golding', kind: 'scholarship', citation: 'John Golding, Cubism: A History and an Analysis, 1907–1914 (Faber, 1959)' },
  { id: 's-powell', kind: 'scholarship', citation: 'Richard J. Powell, Black Art: A Cultural History (Thames & Hudson, 1997)' },
  { id: 's-locke', kind: 'primary', citation: 'Alain Locke (ed.), The New Negro: An Interpretation (1925)' },
  { id: 's-sandler', kind: 'scholarship', citation: 'Irving Sandler, The Triumph of American Painting: A History of Abstract Expressionism (Praeger, 1970)' },
  { id: 's-vangogh-letters', kind: 'primary', citation: 'Vincent van Gogh: The Letters (Van Gogh Museum / Huygens ING online edition)', url: 'https://vangoghletters.org' },
  // ---- design history & modern movements (added with the movements taxonomy) ----
  { id: 's-va', kind: 'collection', citation: 'Victoria and Albert Museum — collections and design-history resources', url: 'https://www.vam.ac.uk' },
  { id: 's-tate', kind: 'reference', citation: 'Tate — art terms glossary and collection', url: 'https://www.tate.org.uk' },
  { id: 's-pompidou', kind: 'collection', citation: 'Centre Pompidou — collection online', url: 'https://www.centrepompidou.fr' },
  { id: 's-bauhaus-archiv', kind: 'collection', citation: 'Bauhaus-Archiv / Museum für Gestaltung, Berlin; Stiftung Bauhaus Dessau; Klassik Stiftung Weimar', url: 'https://www.bauhaus.de' },
  { id: 's-kmd', kind: 'collection', citation: 'Kunstmuseum Den Haag (Mondrian and De Stijl holdings); Centraal Museum Utrecht (Rietveld Schröder House)', url: 'https://www.kunstmuseum.nl' },
  { id: 's-nga', kind: 'collection', citation: 'National Gallery of Art, Washington — Dada and Surrealism holdings', url: 'https://www.nga.gov' },
  { id: 's-pevsner', kind: 'scholarship', citation: 'Nikolaus Pevsner, Pioneers of Modern Design (Penguin, rev. 1960)' },
  { id: 's-wingler', kind: 'scholarship', citation: 'Hans M. Wingler, The Bauhaus: Weimar, Dessau, Berlin, Chicago (MIT Press, 1969)' },
  { id: 's-naylor', kind: 'scholarship', citation: 'Gillian Naylor, The Bauhaus Reassessed (Herbert Press, 1985)' },
  { id: 's-cumming-kaplan', kind: 'scholarship', citation: 'Elizabeth Cumming and Wendy Kaplan, The Arts and Crafts Movement (Thames & Hudson, 1991)' },
  { id: 's-escritt', kind: 'scholarship', citation: 'Stephen Escritt, Art Nouveau (Phaidon, 2000)' },
  { id: 's-dickerman', kind: 'scholarship', citation: 'Leah Dickerman (ed.), Dada: Zurich, Berlin, Hannover, Cologne, New York, Paris (National Gallery of Art, 2005)' },
  { id: 's-nadeau', kind: 'scholarship', citation: 'Maurice Nadeau, The History of Surrealism (Jonathan Cape, 1968)' },
  { id: 's-breton', kind: 'primary', citation: 'André Breton, Manifestoes of Surrealism (University of Michigan Press, 1969)' },
  { id: 's-lodder', kind: 'scholarship', citation: 'Christina Lodder, Russian Constructivism (Yale University Press, 1983)' },
  { id: 's-troy', kind: 'scholarship', citation: 'Nancy J. Troy, The De Stijl Environment (MIT Press, 1983)' },
  { id: 's-blotkamp', kind: 'scholarship', citation: 'Carel Blotkamp (ed.), De Stijl: The Formative Years (MIT Press, 1986)' },
  { id: 's-gropius', kind: 'primary', citation: 'Walter Gropius, Programme of the Staatliche Bauhaus in Weimar (1919)' },
  { id: 's-ruskin', kind: 'primary', citation: 'John Ruskin, The Stones of Venice, vol. II, “The Nature of Gothic” (1853)' },
]

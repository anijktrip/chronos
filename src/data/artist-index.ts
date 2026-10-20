import type { Artist, Gender, RegionId, Relationship } from '@/types'
import { SAMPLE, artist } from './helpers'
import { idOfSlug } from './movement-index'
import { ORIGIN_REGION } from './taxonomy'

/**
 * MASTER ARTIST INDEX — the initial 400-entry foundation list, normalised and de-duplicated.
 *
 * Index records carry identity, dates, origin, regions, practice, taxonomy section, gender field,
 * movement tags and editorial flags. They deliberately carry NO biography. A "profile" level record
 * (artists.ts) exists for a small verified sample; those rows below use `=artist-id` to merge onto it.
 *
 * Row format (pipe-separated):
 *   Name | origin label | dates | role | gender | movement slugs (,) | alt names (;) | flags (;;)
 *   dates   a..b  = life dates ("c" = approximate) · f a..b = active period · b1946 = born (no status asserted)
 *   gender  w woman · m man · n non-binary or gender-diverse · - not applicable (collective/anonymous)
 *   "=artist-x" at the start of flags merges the row onto an existing full profile.
 *
 * Normalisation done against the source list (see src/data/AUDIT.md):
 *   – three artists listed twice (Eliasson, Varo, Carrington) are combined, with the duplicate numbers kept in flags;
 *   – #313 could not be matched to a documented artist and is kept as an explicit unresolved placeholder;
 *   – Gentileschi is reclassified from "Renaissance" to Baroque (period and movement), as the source list itself hints;
 *   – artists known only through ancient texts or later copies are flagged rather than given works.
 */

const SECTIONS: { id: string; rows: string }[] = [
{ id: 'a01', rows: `
Imhotep|Ancient Egypt|c-2650|architect, physician and royal official|m|egyptian||Historical official of King Djoser; traditionally credited with the Step Pyramid at Saqqara (attribution rests on a statue-base inscription and later tradition);;Later deified, which blurs historical and legendary accounts.
Thutmose|Ancient Egypt|f-1350..-1335|sculptor|m|egyptian||Sculptor of the Amarna court under Akhenaten;;The workshop in which the painted bust of Nefertiti was found (1912) is identified with him; attribution of individual works is inferred.
Exekias|Ancient Greece|f-550..-525|vase painter and potter|m|ancient-greek||Athenian black-figure master; signed as potter and painter.
Euphronios|Ancient Greece|f-520..-470|vase painter and potter|m|ancient-greek||Athenian red-figure painter and potter.
Phidias|Ancient Greece|c-480..c-430|sculptor|m|classical-greek|Pheidias|Associated with the Parthenon sculptural programme;;No securely attributed original works survive; known from ancient sources and later copies.
Polykleitos|Ancient Greece|=|sculptor|m|classical-greek||=artist-polykleitos
Myron|Ancient Greece|f-470..-440|sculptor|m|classical-greek||Best known for the lost bronze Diskobolos;;Known mainly through Roman copies after lost bronzes.
Praxiteles|Ancient Greece|f-370..-330|sculptor|m|classical-greek||Late Classical sculptor;;Works known mainly through Roman copies; attribution of surviving statues is debated.
Lysippos|Ancient Greece|f-370..-315|sculptor|m|classical-greek,hellenistic||Court sculptor to Alexander the Great according to ancient sources;;Known from copies and ancient descriptions.
Apelles|Ancient Greece|f-340..-310|painter|m|ancient-greek||Celebrated painter at the court of Alexander;;No works survive. Known only from ancient writers such as Pliny, so accounts are literary rather than visual evidence.
Zeuxis|Ancient Greece|f-430..-390|painter|m|ancient-greek||;;No works survive; known only from ancient literary anecdotes.
Parrhasius|Ancient Greece|f-430..-390|painter|m|ancient-greek||;;No works survive; known only from ancient literary anecdotes.
` },
{ id: 'a02', rows: `
Anthemius of Tralles|Byzantine Empire|f532..537|architect and mathematician|m|byzantine||Co-architect of the Hagia Sophia, Constantinople (532–537), with Isidore of Miletus.
Isidore of Miletus|Byzantine Empire|f532..537|architect and mathematician|m|byzantine||Co-architect of the Hagia Sophia, Constantinople (532–537), with Anthemius of Tralles.
Andrei Rublev|Russia|c1360..1428|icon painter|m|byzantine||Moscow-school icon painter;;Russian icon painting is not yet a separate entry in the movement taxonomy; tagged with the Byzantine tradition for now. Birth date is approximate.
Theophanes the Greek|Byzantine / Russian tradition|c1340..c1410|icon and fresco painter|m|byzantine|Feofan Grek|Born in the Byzantine world and worked in Novgorod and Moscow;;Russian icon painting is not yet a separate taxonomy entry.
Cimabue|Italy|c1240..1302|painter|m|byzantine,gothic||Florentine painter working in the “Greek manner” (Italo-Byzantine).
Duccio di Buoninsegna|Italy|c1255..c1319|painter|m|byzantine,gothic||Sienese painter; Maestà for Siena Cathedral (1308–11).
Giotto di Bondone|Italy|c1267..1337|painter and architect|m|gothic,early-renaissance||Scrovegni (Arena) Chapel frescoes, Padua;;Often labelled “proto-Renaissance”; the label is conventional and debated.
Simone Martini|Italy|c1284..1344|painter|m|gothic||Sienese painter active in Siena, Naples and Avignon.
Ambrogio Lorenzetti|Italy|c1290..c1348|painter|m|gothic||Sienese painter; Allegory of Good and Bad Government, Siena (1338–39);;Death date is uncertain, probably in the plague of 1348.
` },
{ id: 'a03', rows: `
Filippo Brunelleschi|Italy|1377..1446|architect|m|early-renaissance||Dome of Florence Cathedral; formulation of linear perspective.
Donatello|Italy|c1386..1466|sculptor|m|early-renaissance|Donato di Niccolò di Betto Bardi|
Masaccio|Italy|1401..c1428|painter|m|early-renaissance||
Fra Angelico|Italy|c1395..1455|painter|m|early-renaissance||
Sandro Botticelli|Italy|c1445..1510|painter|m|early-renaissance|Alessandro Filipepi|
Leonardo da Vinci|Italy|=|painter, draughtsman and engineer|m|high-renaissance||=artist-leonardo
Michelangelo Buonarroti|Italy|1475..1564|sculptor, painter and architect|m|high-renaissance||
Raphael|Italy|1483..1520|painter and architect|m|high-renaissance|Raffaello Sanzio|
Titian|Italy|c1488..1576|painter|m|venetian-renaissance|Tiziano Vecellio|;;Birth date uncertain (c. 1488–90).
Giorgione|Italy|c1477..1510|painter|m|venetian-renaissance||;;Few secure attributions; much is debated.
Giovanni Bellini|Italy|c1430..1516|painter|m|venetian-renaissance,early-renaissance||
Andrea Mantegna|Italy|c1431..1506|painter and engraver|m|early-renaissance||
Piero della Francesca|Italy|c1415..1492|painter and mathematician|m|early-renaissance||
Jan van Eyck|Flanders|c1390..1441|painter|m|northern-renaissance||
Rogier van der Weyden|Flanders|c1399..1464|painter|m|northern-renaissance||
Hieronymus Bosch|Netherlands|c1450..1516|painter|m|northern-renaissance|Jheronimus Bosch|
Pieter Bruegel the Elder|Flanders|c1525..1569|painter and printmaker|m|northern-renaissance||
Albrecht Dürer|Germany|=|painter and printmaker|m|northern-renaissance||=artist-durer
Hans Holbein the Younger|Germany|c1497..1543|painter and printmaker|m|northern-renaissance||
Lucas Cranach the Elder|Germany|1472..1553|painter and printmaker|m|northern-renaissance||
Sofonisba Anguissola|Italy|c1532..1625|painter|w|renaissance||One of the first women painters to gain international reputation in Renaissance Europe.
Artemisia Gentileschi|Italy|1593..c1656|painter|w|baroque||Classification corrected: listed under Renaissance in the source list, but active in the Baroque period (early 17th century), so tagged Baroque.
` },
{ id: 'a04', rows: `
Caravaggio|Italy|1571..1610|painter|m|baroque|Michelangelo Merisi da Caravaggio|
Gian Lorenzo Bernini|Italy|1598..1680|sculptor and architect|m|baroque||
Peter Paul Rubens|Flanders|1577..1640|painter|m|baroque||
Anthony van Dyck|Flanders|1599..1641|painter|m|baroque|Anthonis van Dyck|
Rembrandt van Rijn|Netherlands|=|painter and printmaker|m|dutch-golden-age,baroque||=artist-rembrandt
Johannes Vermeer|Netherlands|=|painter|m|dutch-golden-age||=artist-vermeer
Frans Hals|Netherlands|c1582..1666|painter|m|dutch-golden-age,baroque||
Diego Velázquez|Spain|1599..1660|painter|m|baroque||
Francisco de Zurbarán|Spain|1598..1664|painter|m|baroque||
Bartolomé Esteban Murillo|Spain|1617..1682|painter|m|baroque||
Nicolas Poussin|France|1594..1665|painter|m|baroque||Often described as a French classicist within the wider Baroque period.
Claude Lorrain|France|c1600..1682|landscape painter|m|baroque|Claude Gellée|
Judith Leyster|Netherlands|1609..1660|painter|w|dutch-golden-age||
Rachel Ruysch|Netherlands|1664..1750|painter|w|dutch-golden-age||Still-life painter.
Jean-Antoine Watteau|France|1684..1721|painter|m|rococo||
François Boucher|France|1703..1770|painter|m|rococo||
Jean-Honoré Fragonard|France|1732..1806|painter|m|rococo||
Élisabeth Vigée Le Brun|France|1755..1842|painter|w|rococo,neoclassicism||
` },
{ id: 'a05', rows: `
Jacques-Louis David|France|1748..1825|painter|m|neoclassicism||
Jean-Auguste-Dominique Ingres|France|1780..1867|painter|m|neoclassicism,academic-art||
Antonio Canova|Italy|1757..1822|sculptor|m|neoclassicism||
Francisco Goya|Spain|1746..1828|painter and printmaker|m|romanticism|Francisco de Goya|His long career spans late Rococo, Neoclassical and Romantic currents, so the single tag is a simplification.
Eugène Delacroix|France|1798..1863|painter|m|romanticism||
Théodore Géricault|France|1791..1824|painter|m|romanticism||
Caspar David Friedrich|Germany|1774..1840|painter|m|romanticism||
J. M. W. Turner|United Kingdom|1775..1851|painter|m|romanticism|Joseph Mallord William Turner|
John Constable|United Kingdom|1776..1837|painter|m|romanticism||
William Blake|United Kingdom|1757..1827|painter, printmaker and poet|m|romanticism||
Henry Fuseli|Switzerland / United Kingdom|1741..1825|painter|m|romanticism|Johann Heinrich Füssli|Born in Zurich; worked mainly in London.
` },
{ id: 'a06', rows: `
Gustave Courbet|France|1819..1877|painter|m|realism||
Jean-François Millet|France|1814..1875|painter|m|realism,barbizon||
Honoré Daumier|France|1808..1879|printmaker, caricaturist and painter|m|realism||
Édouard Manet|France|1832..1883|painter|m|realism,impressionism||Often described as a bridge between Realism and Impressionism.
Claude Monet|France|=|painter|m|impressionism||=artist-monet
Pierre-Auguste Renoir|France|1841..1919|painter|m|impressionism||
Edgar Degas|France|1834..1917|painter, sculptor and printmaker|m|impressionism||
Camille Pissarro|France|1830..1903|painter and printmaker|m|impressionism,neo-impressionism||Born in St Thomas (then the Danish West Indies) and worked in France; the source list gives “France”.
Berthe Morisot|France|1841..1895|painter|w|impressionism||
Mary Cassatt|United States|1844..1926|painter and printmaker|w|impressionism||Worked mainly in France.
Alfred Sisley|United Kingdom / France|1839..1899|painter|m|impressionism||Born in Paris to British parents.
Gustave Caillebotte|France|1848..1894|painter|m|impressionism||
Georges Seurat|France|1859..1891|painter|m|neo-impressionism,pointillism||
Paul Signac|France|1863..1935|painter|m|neo-impressionism,pointillism||
Vincent van Gogh|Netherlands|=|painter|m|post-impressionism||=artist-van-gogh
Paul Cézanne|France|1839..1906|painter|m|post-impressionism||
Paul Gauguin|France|1848..1903|painter, printmaker and sculptor|m|post-impressionism,symbolism||
Henri de Toulouse-Lautrec|France|1864..1901|painter and printmaker|m|post-impressionism||
Émile Bernard|France|1868..1941|painter|m|post-impressionism,symbolism||
Odilon Redon|France|1840..1916|painter and printmaker|m|symbolism||
Edvard Munch|Norway|1863..1944|painter and printmaker|m|symbolism,expressionism||
Gustav Klimt|Austria|1862..1918|painter|m|symbolism,vienna-secession,art-nouveau||
Egon Schiele|Austria|1890..1918|painter and draughtsman|m|expressionism||
James McNeill Whistler|United States / United Kingdom|1834..1903|painter and printmaker|m|aesthetic||
John Singer Sargent|United States|1856..1925|painter|m|academic-art||Born in Florence to American parents; worked in Paris and London.
Winslow Homer|United States|1836..1910|painter|m|realism||
` },
{ id: 'a07', rows: `
Henri Matisse|France|1869..1954|painter, sculptor and printmaker|m|fauvism||
Pablo Picasso|Spain|=|painter, sculptor and printmaker|m|cubism||=artist-picasso
Georges Braque|France|=|painter|m|cubism||=artist-braque
Juan Gris|Spain|1887..1927|painter|m|cubism,synthetic-cubism||
Fernand Léger|France|1881..1955|painter|m|cubism||
Robert Delaunay|France|1885..1941|painter|m|orphism||
Sonia Delaunay|Ukraine / France|1885..1979|painter and designer|w|orphism||Born near Odesa in the Russian Empire (now Ukraine); worked in Paris. Textile, fashion and graphic design were central to her work.
André Derain|France|1880..1954|painter|m|fauvism||
Maurice de Vlaminck|France|1876..1958|painter|m|fauvism||
Wassily Kandinsky|Russia|1866..1944|painter and theorist|m|der-blaue-reiter,expressionism|Vasily Kandinsky|Also taught at the Bauhaus.
Franz Marc|Germany|1880..1916|painter|m|der-blaue-reiter||
August Macke|Germany|1887..1914|painter|m|der-blaue-reiter||
Gabriele Münter|Germany|1877..1962|painter|w|der-blaue-reiter||
Paul Klee|Switzerland / Germany|1879..1940|painter|m|der-blaue-reiter,bauhaus||
Ernst Ludwig Kirchner|Germany|1880..1938|painter and printmaker|m|die-brucke||
Emil Nolde|Germany|1867..1956|painter and printmaker|m|expressionism,die-brucke||Briefly a member of Die Brücke; his Nazi-era support for the regime, and subsequent official ban, are part of the record to be covered in his profile.
Käthe Kollwitz|Germany|1867..1945|printmaker and sculptor|w|expressionism||
Oskar Kokoschka|Austria|1886..1980|painter|m|expressionism||
Amedeo Modigliani|Italy / France|1884..1920|painter and sculptor|m|||Associated with the École de Paris, which is not yet an entry in the movement taxonomy.
Constantin Brâncuși|Romania / France|1876..1957|sculptor|m|||Pioneer of modern abstract sculpture; no single movement fits.
Umberto Boccioni|Italy|1882..1916|painter and sculptor|m|futurism||
Giacomo Balla|Italy|1871..1958|painter|m|futurism||
Gino Severini|Italy|1883..1966|painter|m|futurism||
Kazimir Malevich|Ukraine / Russian Empire|1879..1935|painter and theorist|m|suprematism,russian-futurism||Born in Kyiv; Ukrainian, Polish and Russian identities all feature in scholarship.
El Lissitzky|Russian Empire / Soviet Union|1890..1941|painter, designer and architect|m|suprematism,russian-constructivism,constructivist-design,new-typography||Lazar Markovich Lissitzky
Vladimir Tatlin|Russian Empire / Soviet Union|1885..1953|sculptor, painter and designer|m|russian-constructivism||
Alexander Rodchenko|Russian Empire / Soviet Union|1891..1956|artist, photographer and designer|m|russian-constructivism,constructivist-design||
Lyubov Popova|Russian Empire / Soviet Union|1889..1924|painter and designer|w|russian-constructivism,suprematism||
Natalia Goncharova|Russia / France|1881..1962|painter and designer|w|rayonism,russian-futurism||
Mikhail Larionov|Russia / France|1881..1964|painter|m|rayonism,russian-futurism||
Piet Mondrian|Netherlands|1872..1944|painter|m|de-stijl,neo-plasticism|Piet Mondriaan|
Theo van Doesburg|Netherlands|1883..1931|painter, architect and writer|m|de-stijl||Also published Dada poetry under the pseudonym I. K. Bonset.
Gerrit Rietveld|Netherlands|1888..1964|architect and furniture designer|m|de-stijl||
Marcel Duchamp|France / United States|1887..1968|artist|m|dada||Readymades; later worked in the United States.
Francis Picabia|France|1879..1953|painter|m|dada,orphism||Born in Paris to a Cuban father and French mother.
Hannah Höch|Germany|1889..1978|artist|w|dada||
Kurt Schwitters|Germany|1887..1948|artist and poet|m|dada||
Jean Arp|France / Germany|1886..1966|sculptor, painter and poet|m|dada,surrealism|Hans Arp|Born in Strasbourg, then in the German Empire.
Tristan Tzara|Romania / France|1896..1963|poet|m|dada||A poet and Dada founder rather than a visual artist; included as a key figure in the movement.
László Moholy-Nagy|Hungary|1895..1946|artist, photographer and designer|m|bauhaus,russian-constructivism,new-typography||Later directed the New Bauhaus in Chicago.
Anni Albers|Germany / United States|1899..1994|textile artist and designer|w|bauhaus,black-mountain||
Josef Albers|Germany / United States|1888..1976|painter, designer and teacher|m|bauhaus,black-mountain||
` },
{ id: 'a08', rows: `
Salvador Dalí|Spain|1904..1989|painter|m|surrealism||
René Magritte|Belgium|1898..1967|painter|m|surrealism||
Max Ernst|Germany / France|1891..1976|painter and sculptor|m|dada,surrealism||
Joan Miró|Spain|1893..1983|painter and sculptor|m|surrealism||
André Masson|France|1896..1987|painter|m|surrealism||
Yves Tanguy|France / United States|1900..1955|painter|m|surrealism||
Leonora Carrington|United Kingdom / Mexico|1917..2011|painter and writer|w|surrealism||Listed twice in the source list (#147 and #335); combined here.
Remedios Varo|Spain / Mexico|1908..1963|painter|w|surrealism||Listed twice in the source list (#148 and #334); combined here.
Dorothea Tanning|United States|1910..2012|painter and sculptor|w|surrealism||
Meret Oppenheim|Switzerland|1913..1985|artist|w|surrealism||
Man Ray|United States / France|1890..1976|photographer and painter|m|dada,surrealism|Emmanuel Radnitzky|
Lee Miller|United States / United Kingdom|1907..1977|photographer|w|surrealism||
Dora Maar|France|1907..1997|photographer and painter|w|surrealism|Henriette Theodora Markovitch|
Claude Cahun|France|1894..1954|photographer and writer|n|surrealism|Lucy Schwob|Used they/them or neutral forms for Cahun; the name was chosen as a gender-neutral pseudonym.
André Kertész|Hungary / United States|1894..1985|photographer|m|||Modern photography; no movement in the taxonomy yet fits exactly.
Henri Cartier-Bresson|France|1908..2004|photographer|m|surrealism||Early work associated with Surrealist circles; later a founder of the Magnum agency.
Dorothea Lange|United States|1895..1965|photographer|w|social-realism||Documentary photography for the Farm Security Administration.
Walker Evans|United States|1903..1975|photographer|m|social-realism||Documentary photography.
Alfred Stieglitz|United States|1864..1946|photographer|m|pictorialism||Pictorialist early in his career; later a champion of modernism and “straight” photography.
Edward Weston|United States|1886..1958|photographer|m|pictorialism||Moved from Pictorialism to “straight” photography (Group f/64), which is not yet in the taxonomy.
` },
{ id: 'a09', rows: `
Jackson Pollock|United States|=|painter|m|abstract-expressionism||=artist-pollock
Mark Rothko|Latvia / United States|1903..1970|painter|m|abstract-expressionism,colour-field|Marcus Rothkowitz|Born in Dvinsk (now Daugavpils, Latvia), then in the Russian Empire.
Willem de Kooning|Netherlands / United States|1904..1997|painter|m|abstract-expressionism||
Lee Krasner|United States|1908..1984|painter|w|abstract-expressionism||
Helen Frankenthaler|United States|1928..2011|painter|w|colour-field||
Joan Mitchell|United States|1925..1992|painter|w|abstract-expressionism||Lived in France from 1959.
Barnett Newman|United States|1905..1970|painter|m|colour-field,abstract-expressionism||
Clyfford Still|United States|1904..1980|painter|m|abstract-expressionism,colour-field||
Franz Kline|United States|1910..1962|painter|m|abstract-expressionism,action-painting||
Robert Motherwell|United States|1915..1991|painter|m|abstract-expressionism||
Agnes Martin|Canada / United States|1912..2004|painter|w|minimalism||Rejected the Minimalist label, preferring to be seen as an abstract expressionist.
Louise Bourgeois|France / United States|1911..2010|sculptor|w|||Independent; frequently linked to Surrealism and Feminist art, but her affiliation is contested.
Alberto Giacometti|Switzerland|1901..1966|sculptor and painter|m|surrealism||Member of the Surrealist group in the early 1930s.
Henry Moore|United Kingdom|1898..1986|sculptor|m|||British modernism is not yet an entry in the taxonomy.
Barbara Hepworth|United Kingdom|1903..1975|sculptor|w|||British modernism is not yet an entry in the taxonomy.
Lucio Fontana|Argentina / Italy|1899..1968|painter and sculptor|m|||Founder of Spatialism (Spazialismo), which is not yet in the taxonomy.
Yves Klein|France|1928..1962|artist|m|nouveau-realisme||
Jean Dubuffet|France|1901..1985|painter and sculptor|m|art-informel||Founder of the concept of Art Brut, not yet in the taxonomy.
Francis Bacon|Ireland / United Kingdom|1909..1992|painter|m|||Figurative painter; no taxonomy entry fits (School of London is not yet included).
Lucian Freud|Germany / United Kingdom|1922..2011|painter|m|||Figurative painter; School of London is not yet in the taxonomy.
` },
{ id: 'a10', rows: `
Andy Warhol|United States|1928..1987|artist|m|pop-art||
Roy Lichtenstein|United States|1923..1997|painter and sculptor|m|pop-art||
Richard Hamilton|United Kingdom|1922..2011|painter and printmaker|m|pop-art,independent-group||
Robert Rauschenberg|United States|1925..2008|artist|m|neo-dada,pop-art||
Jasper Johns|United States|b1930|artist|m|neo-dada,pop-art||
Claes Oldenburg|Sweden / United States|1929..2022|sculptor|m|pop-art||
James Rosenquist|United States|1933..2017|painter|m|pop-art||
Tom Wesselmann|United States|1931..2004|painter|m|pop-art||
David Hockney|United Kingdom|b1937|painter and printmaker|m|pop-art||
Yayoi Kusama|Japan|b1929|artist|w|pop-art,minimalism,installation-art||
Donald Judd|United States|1928..1994|sculptor|m|minimalism||
Dan Flavin|United States|1933..1996|artist|m|minimalism||
Carl Andre|United States|b1935|sculptor|m|minimalism||
Sol LeWitt|United States|1928..2007|artist|m|minimalism,conceptual-art||
Robert Morris|United States|1931..2018|artist|m|minimalism,post-minimalism||
Eva Hesse|Germany / United States|1936..1970|sculptor|w|post-minimalism||
Richard Serra|United States|b1938|sculptor|m|post-minimalism||
Joseph Kosuth|United States|b1945|artist|m|conceptual-art||
Lawrence Weiner|United States|b1942|artist|m|conceptual-art||
On Kawara|Japan|1932..2014|artist|m|conceptual-art||Lived in New York from the mid-1960s.
Yoko Ono|Japan / United States|b1933|artist|w|fluxus,conceptual-art,performance-art||
Nam June Paik|Korea / United States|1932..2006|artist|m|fluxus,video-art||
Marina Abramović|Serbia|b1946|performance artist|w|performance-art||Born in Belgrade, then in Yugoslavia.
Joseph Beuys|Germany|1921..1986|artist|m|fluxus,performance-art||
` },
{ id: 'a11', rows: `
Gerhard Richter|Germany|b1932|painter|m|||Capitalist Realism, with which he is associated, is not yet in the taxonomy.
Anselm Kiefer|Germany|b1945|painter and sculptor|m|neo-expressionism||
Georg Baselitz|Germany|b1938|painter and sculptor|m|neo-expressionism||
Sigmar Polke|Germany|1941..2010|painter|m|||Capitalist Realism is not yet in the taxonomy.
Jean-Michel Basquiat|United States|1960..1988|painter|m|neo-expressionism,graffiti-art||
Keith Haring|United States|1958..1990|painter|m|street-art,graffiti-art,pop-art||
Cindy Sherman|United States|b1954|photographer|w|pictures-generation||
Barbara Kruger|United States|b1945|artist|w|pictures-generation,feminist-art,appropriation-art||
Jenny Holzer|United States|b1950|artist|w|conceptual-art||
Jeff Koons|United States|b1955|artist|m|appropriation-art||
Damien Hirst|United Kingdom|b1965|artist|m|yba||
Tracey Emin|United Kingdom|b1963|artist|w|yba||
Sarah Lucas|United Kingdom|b1962|artist|w|yba||
Rachel Whiteread|United Kingdom|b1963|sculptor|w|yba||
Olafur Eliasson|Denmark / Iceland|b1967|installation artist|m|installation-art||Listed twice in the source list (#219 and #234); combined here.
Ai Weiwei|China|b1957|artist and activist|m|chinese-contemporary,conceptual-art||
Takashi Murakami|Japan|b1962|artist|m|||Superflat, which he founded, is not yet in the taxonomy.
Yoshitomo Nara|Japan|b1959|painter and sculptor|m|||Associated with Superflat-era Japanese pop; not yet in the taxonomy.
Hiroshi Sugimoto|Japan|b1948|photographer|m|||
Shirin Neshat|Iran / United States|b1957|artist and filmmaker|w|video-art,postcolonial-art||
Mona Hatoum|Palestine / United Kingdom|b1952|artist|w|installation-art,postcolonial-art||Born in Beirut to a Palestinian family.
Anish Kapoor|India / United Kingdom|b1954|sculptor|m|||
Kara Walker|United States|b1969|artist|w|identity-based,postcolonial-art||
Theaster Gates|United States|b1973|artist|m|socially-engaged||
Julie Mehretu|Ethiopia / United States|b1970|painter|w|||
Kehinde Wiley|United States|b1977|painter|m|identity-based||
Njideka Akunyili Crosby|Nigeria / United States|b1983|painter|w|identity-based,postcolonial-art||
Tania Bruguera|Cuba|b1968|artist|w|performance-art,socially-engaged||
Doris Salcedo|Colombia|b1958|sculptor|w|installation-art||
Hito Steyerl|Germany|b1966|artist and filmmaker|w|video-art,new-media-art||
Refik Anadol|Turkey / United States|b1985|media artist|m|ai-art,new-media-art,immersive-art||
` },
{ id: 'a12', rows: `
Gu Kaizhi|China|c344..c406|painter|m|||Surviving works attributed to him are later copies (for example the Admonitions scroll in the British Museum); his own paintings do not survive.
Wu Daozi|China|f710..760|painter|m|||Celebrated Tang painter; no securely attributed works survive.
Wang Wei|China|699..759|poet and painter|m|chinese-literati||Traditionally regarded as an ancestor of literati painting; no securely attributed paintings survive.
Fan Kuan|China|=|painter|m|song-landscape||=artist-fan-kuan
Guo Xi|China|c1020..c1090|painter|m|song-landscape||
Zhang Zeduan|China|c1085..c1145|painter|m|song-landscape||Best known for Along the River During the Qingming Festival (attribution traditional).
Ma Yuan|China|f1190..1225|painter|m|song-landscape||Southern Song court painter; “Ma–Xia school” with Xia Gui.
Xia Gui|China|f1195..1230|painter|m|song-landscape||Southern Song court painter; “Ma–Xia school” with Ma Yuan.
Zhao Mengfu|China|1254..1322|painter and calligrapher|m|chinese-literati||
Ni Zan|China|1301..1374|painter|m|chinese-literati||
Shen Zhou|China|1427..1509|painter|m|chinese-literati||Wu School.
Wen Zhengming|China|1470..1559|painter and calligrapher|m|chinese-literati||Wu School.
Dong Qichang|China|1555..1636|painter and theorist|m|chinese-literati||His theory of Northern and Southern schools shaped later literati painting.
Bada Shanren|China|1626..c1705|painter|m|chinese-literati|Zhu Da|Ming-dynasty prince who became a monk after the Qing conquest.
Shitao|China|1642..1707|painter and theorist|m|chinese-literati|Zhu Ruoji; Daoji|Dates approximate.
Qi Baishi|China|1864..1957|painter|m|chinese-literati||
Xu Beihong|China|1895..1953|painter|m|||Blended Western academic and Chinese ink painting.
Zhang Daqian|China|1899..1983|painter|m|chinese-literati||
Katsushika Hokusai|Japan|=|printmaker and painter|m|ukiyo-e||=artist-hokusai
Utagawa Hiroshige|Japan|=|printmaker|m|ukiyo-e||=artist-hiroshige
Kitagawa Utamaro|Japan|c1753..1806|printmaker|m|ukiyo-e||
Suzuki Harunobu|Japan|c1725..1770|printmaker|m|ukiyo-e||Pioneer of full-colour (nishiki-e) prints.
Ogata Kōrin|Japan|1658..1716|painter and designer|m|yamato-e||Rinpa school artist; Rinpa is not yet in the taxonomy.
Sesshū Tōyō|Japan|1420..1506|painter and Zen priest|m|sumi-e||
Kanō Eitoku|Japan|1543..1590|painter|m|||Kanō school, which is not yet in the taxonomy.
Tawaraya Sōtatsu|Japan|f1600..1640|painter|m|yamato-e||Rinpa school founder; Rinpa is not yet in the taxonomy. Dates unknown.
Itō Jakuchū|Japan|1716..1800|painter|m|||Edo-period individualist; no taxonomy entry yet.
Yokoyama Taikan|Japan|1868..1958|painter|m|nihonga||
Foujita Tsuguharu|Japan / France|1886..1968|painter|m|yoga||Worked in Paris from 1913 and later became a French citizen.
Park Su-geun|Korea|1914..1965|painter|m|||Korean modern realism is not yet in the taxonomy.
Kim Whanki|Korea|1913..1974|painter|m|||Pioneer of Korean abstraction; precursor of later movements such as Dansaekhwa.
Lee Ufan|Korea / Japan|b1936|artist and philosopher|m|mono-ha,dansaekhwa||
` },
{ id: 'a13', rows: `
Raja Ravi Varma|India|1848..1906|painter|m|academic-art||
Abanindranath Tagore|India|1871..1951|painter|m|bengal-school||
Nandalal Bose|India|1882..1966|painter|m|bengal-school,santiniketan||
Amrita Sher-Gil|Hungary / India|1913..1941|painter|w|||Born in Budapest to a Sikh father and Hungarian mother.
Jamini Roy|India|1887..1972|painter|m|||Drew on Bengali folk painting.
Rabindranath Tagore|India|1861..1941|poet and painter|m|santiniketan||A poet and Nobel laureate who took up painting late in life; also the founder of Visva-Bharati.
Benode Behari Mukherjee|India|1904..1980|painter|m|santiniketan||
M. F. Husain|India|1915..2011|painter|m|progressive-artists-group|Maqbool Fida Husain|
F. N. Souza|India|1924..2002|painter|m|progressive-artists-group|Francis Newton Souza|
S. H. Raza|India / France|1922..2016|painter|m|progressive-artists-group|Sayed Haider Raza|
Tyeb Mehta|India|1925..2009|painter|m|||Associated with the Bombay modernists; not an original member of the Progressive Artists' Group.
Akbar Padamsee|India|1928..2020|painter|m|||Associated with the Bombay modernists.
Nasreen Mohamedi|India|1937..1990|artist|w|||
Bhupen Khakhar|India|1934..2003|painter|m|||The Baroda group is not yet in the taxonomy.
Nalini Malani|India|b1946|artist|w|video-art,feminist-art||
Vivan Sundaram|India|b1943|artist|m|||
Zarina|India / United States|1937..2020|printmaker and sculptor|w||Zarina Hashmi|
Shahzia Sikander|Pakistan / United States|b1969|artist|w|mughal-painting||Trained in Indo-Persian miniature painting at the National College of Arts, Lahore.
Rashid Rana|Pakistan|b1968|artist|m|||
` },
{ id: 'a14', rows: `
Kamāl ud-Dīn Behzād|Herat / Timurid tradition|c1450..c1535|painter|m|persian-miniature|Behzad; Kamaleddin Behzad|Timurid and early Safavid court painter.
Reza Abbasi|Safavid Iran|c1565..1635|painter|m|persian-miniature|Rezā-ye ʿAbbāsī|
Sultan Muhammad|Safavid Iran|f1500..1550|painter|m|persian-miniature|Sultan Muhammad Naqqash|
Mir Sayyid Ali|Persia / Mughal India|f1530..1570|painter|m|persian-miniature,mughal-painting||Joined Humayun in exile and worked in the Mughal workshop.
Abd al-Samad|Persia / Mughal India|f1540..1595|painter|m|persian-miniature,mughal-painting|ʿAbd al-Ṣamad|Joined Humayun in exile and headed the Mughal workshop with Mir Sayyid Ali.
Basawan|Mughal India|f1580..1600|painter|m|mughal-painting||Leading artist in Akbar's workshop.
Bichitr|Mughal India|=|painter|m|mughal-painting||=artist-bichitr
Osman Hamdi Bey|Ottoman Empire|1842..1910|painter, archaeologist and museum founder|m|academic-art||Founder of the Istanbul Archaeological Museums and the Academy of Fine Arts.
Mahmoud Mokhtar|Egypt|1891..1934|sculptor|m|||Egyptian modernism is not yet in the taxonomy.
Mahmoud Said|Egypt|1897..1964|painter|m|||Egyptian modernism is not yet in the taxonomy.
Hamed Nada|Egypt|1924..1990|painter|m|||
Dia al-Azzawi|Iraq|b1935|artist|m|hurufiyya||
Shakir Hassan Al Said|Iraq|1925..2004|painter and writer|m|hurufiyya,baghdad-modern||
Saloua Raouda Choucair|Lebanon|1916..2017|artist|w|||Her work draws on Islamic geometry and abstraction.
Etel Adnan|Lebanon / United States|1925..2021|poet and painter|w|||A poet and writer as well as a painter.
Monir Shahroudy Farmanfarmaian|Iran|1922..2019|artist|w|||Best known for mirror mosaic and geometric works.
Parviz Tanavoli|Iran|b1937|sculptor|m|saqqakhaneh||
Farhad Moshiri|Iran|b1963|artist|m|||
` },
{ id: 'a15', rows: `
Aina Onabolu|Nigeria|1882..1963|painter|m|||Pioneer of modern art education in Nigeria.
Ben Enwonwu|Nigeria|1917..1994|sculptor and painter|m|||
Uche Okeke|Nigeria|1933..2016|artist|m|zaria-art-society,nsukka-school||
Bruce Onobrakpeya|Nigeria|b1932|printmaker and sculptor|m|zaria-art-society||
Twins Seven Seven|Nigeria|1944..2011|artist|m|||The Oshogbo school, with which he is associated, is not yet in the taxonomy.
Ibrahim El-Salahi|Sudan|b1930|painter|m|khartoum-school,hurufiyya||
Skunder Boghossian|Ethiopia|1937..2003|painter|m|||
Ernest Akeem Igloliorte|South Africa|?|unresolved|-|||Unresolved: the name does not match a documented artist. “Igloliorte” is an Inuit family name from Nunatsiavut (Canada), which does not fit the stated South African origin; Ernest Mancoba (1904–2002, South Africa) may have been intended. Left as a placeholder pending verification.
Gerard Sekoto|South Africa|1913..1993|painter|m|||Moved to Paris in 1947.
Dumile Feni|South Africa|1939..1991|artist|m|||
William Kentridge|South Africa|b1955|artist|m|||
Marlene Dumas|South Africa / Netherlands|b1953|painter|w|||
Zanele Muholi|South Africa|b1972|photographer and visual activist|n|identity-based||Uses they/them pronouns.
El Anatsui|Ghana / Nigeria|b1944|sculptor|m|nsukka-school||Taught at the University of Nigeria, Nsukka.
Yinka Shonibare|United Kingdom / Nigeria|b1962|artist|m|postcolonial-art||
Wangechi Mutu|Kenya / United States|b1972|artist|w|postcolonial-art,identity-based||
Chéri Samba|Democratic Republic of the Congo|b1956|painter|m|||Kinshasa popular painting is not yet in the taxonomy.
Bodys Isek Kingelez|Democratic Republic of the Congo|1948..2015|sculptor|m|||
Seydou Keïta|Mali|1921..2001|photographer|m|||Studio portraiture in Bamako.
Malick Sidibé|Mali|1936..2016|photographer|m|||
Omar Victor Diop|Senegal|b1980|photographer|m|||
Abdoulaye Konaté|Mali|b1953|textile artist|m|||
` },
{ id: 'a16', rows: `
Diego Rivera|Mexico|1886..1957|painter and muralist|m|mexican-muralism||
Frida Kahlo|Mexico|1907..1954|painter|w|||André Breton called her work Surrealist; she rejected the label.
José Clemente Orozco|Mexico|1883..1949|muralist|m|mexican-muralism||
David Alfaro Siqueiros|Mexico|1896..1974|muralist|m|mexican-muralism||
Rufino Tamayo|Mexico|1899..1991|painter|m|||
María Izquierdo|Mexico|1902..1955|painter|w|||
Dr. Atl|Mexico|1875..1964|painter and writer|m|mexican-muralism|Gerardo Murillo|Precursor of Mexican Muralism.
Joaquín Torres-García|Uruguay|1874..1949|painter and theorist|m|||Founder of Constructive Universalism, which is not yet in the taxonomy.
Pedro Figari|Uruguay|1861..1938|painter|m|||
Tarsila do Amaral|Brazil|1886..1973|painter|w|brazilian-modernism,anthropophagic||
Anita Malfatti|Brazil|1889..1964|painter|w|brazilian-modernism||
Candido Portinari|Brazil|1903..1962|painter|m|brazilian-modernism|Cândido Portinari|
Lygia Clark|Brazil|1920..1988|artist|w|neo-concrete||
Hélio Oiticica|Brazil|1937..1980|artist|m|neo-concrete||
Lygia Pape|Brazil|1927..2004|artist|w|neo-concrete||
Mira Schendel|Switzerland / Brazil|1919..1988|artist|w|||
Beatriz Milhazes|Brazil|b1960|painter|w|||
Adriana Varejão|Brazil|b1964|painter|w|||
Fernando Botero|Colombia|b1932|painter and sculptor|m|||
Alejandro Obregón|Colombia|1920..1992|painter|m|||
Wifredo Lam|Cuba|1902..1982|painter|m|surrealism||
Ana Mendieta|Cuba / United States|1948..1985|artist|w|land-art,performance-art,feminist-art||
Carlos Cruz-Diez|Venezuela|1923..2019|artist|m|kinetic-art,op-art||
Jesús Rafael Soto|Venezuela|1923..2005|artist|m|kinetic-art,op-art||
Roberto Matta|Chile|1911..2002|painter|m|surrealism||
Alfredo Jaar|Chile / United States|b1956|artist|m|installation-art||
Cecilia Vicuña|Chile|b1948|artist and poet|w|||
` },
{ id: 'a17', rows: `
Albert Namatjira|Australia|1902..1959|painter|m|indigenous-australian-contemporary||Western Arrernte watercolourist; the Hermannsburg School is not yet in the taxonomy.
Emily Kame Kngwarreye|Australia|c1910..1996|painter|w|indigenous-australian-contemporary||Anmatyerre artist; birth year approximate.
Clifford Possum Tjapaltjarri|Australia|c1932..2002|painter|m|papunya-tula-movement||Birth year approximate.
Rover Thomas|Australia|c1926..1998|painter|m|indigenous-australian-contemporary||Kimberley (Warmun) painter; dates approximate.
Papunya Tula Artists|Australian Aboriginal artist collective|f1972..|artist collective|-|papunya-tula-movement||Same organisation as the collective record “Papunya Tula Artists” in the schools & collectives list; recorded here as a maker.
Fiona Foley|Australia|b1964|artist|w|indigenous-australian-contemporary||
Gordon Bennett|Australia|1955..2014|artist|m|indigenous-australian-contemporary||
Brook Andrew|Australia|b1970|artist|m|indigenous-australian-contemporary||
Lisa Reihana|Aotearoa / New Zealand|b1964|artist|w|contemporary-maori,contemporary-pacific||
Ralph Hotere|Aotearoa / New Zealand|1931..2013|artist|m|contemporary-maori||
Shane Cotton|Aotearoa / New Zealand|b1964|painter|m|contemporary-maori||
Robyn Kahukiwa|Aotearoa / New Zealand|b1940|painter|w|contemporary-maori||
John Pule|Niue / Aotearoa|b1962|artist and writer|m|contemporary-pacific||
Michel Tuffery|Aotearoa / New Zealand / Pacific|b1966|artist|m|contemporary-pacific||
Yuki Kihara|Samoa / Aotearoa|b1975|artist|n|contemporary-pacific||Fa'afafine (Samoan gender identity); listed here as gender-diverse.
` },
{ id: 'a18', rows: `
William Morris|United Kingdom|1834..1896|designer, writer and socialist|m|arts-and-crafts||
Charles Rennie Mackintosh|United Kingdom|1868..1928|architect and designer|m|art-nouveau,arts-and-crafts||Glasgow Style.
Antoni Gaudí|Spain|1852..1926|architect|m|art-nouveau||Catalan Modernisme.
Victor Horta|Belgium|1861..1947|architect|m|art-nouveau||
Hector Guimard|France|1867..1942|architect and designer|m|art-nouveau||
Walter Gropius|Germany|1883..1969|architect|m|bauhaus,werkbund,modernist-architecture||Founder of the Bauhaus.
Ludwig Mies van der Rohe|Germany / United States|1886..1969|architect|m|bauhaus,international-style,modernist-architecture||
Le Corbusier|Switzerland / France|1887..1965|architect, painter and theorist|m|purism,modernist-architecture,brutalism|Charles-Édouard Jeanneret|
Frank Lloyd Wright|United States|1867..1959|architect|m|modernist-architecture,arts-and-crafts||
Eileen Gray|Ireland / France|1878..1976|designer and architect|w|art-deco,modernist-architecture||
Charlotte Perriand|France|1903..1999|designer and architect|w|modernist-architecture||
Marcel Breuer|Hungary / United States|1902..1981|architect and furniture designer|m|bauhaus,mid-century-modern||
Alvar Aalto|Finland|1898..1976|architect and designer|m|scandinavian-modern,functionalism||
Lina Bo Bardi|Italy / Brazil|1914..1992|architect and designer|w|modernist-architecture||
Oscar Niemeyer|Brazil|1907..2012|architect|m|modernist-architecture||
Zaha Hadid|Iraq / United Kingdom|1950..2016|architect|w|deconstructivism||
Tadao Ando|Japan|b1941|architect|m|modernist-architecture||
Issey Miyake|Japan|1938..2022|fashion designer|m|||
Saul Bass|United States|1920..1996|graphic designer and filmmaker|m|mid-century-modern||
Paul Rand|United States|1914..1996|graphic designer|m|mid-century-modern,international-typographic||
Massimo Vignelli|Italy / United States|1931..2014|designer|m|international-typographic||
Milton Glaser|United States|1929..2020|graphic designer|m|postmodern-design||
Susan Kare|United States|b1954|graphic designer|w|digital-design||Designed the original Macintosh icons and typefaces.
Paula Scher|United States|b1948|graphic designer|w|postmodern-design||
April Greiman|United States|b1948|graphic designer|w|new-wave-typography,digital-design||
Neville Brody|United Kingdom|b1957|graphic designer|m|postmodern-design,digital-design||
David Carson|United States|b1954|graphic designer|m|postmodern-design||
Stefan Sagmeister|Austria / United States|b1962|graphic designer|m|postmodern-design||
Jessica Walsh|United States|b1986|designer|w|digital-design||
` },
]

/* ------------------------------------------------------------------ */

const strip = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '')
const slugify = (s: string) => strip(s).toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

const GENDER: Record<string, Gender | undefined> = { w: 'woman', m: 'man', n: 'non-binary or gender-diverse', '-': undefined }

export interface ParsedArtist {
  n: number; id: string; name: string; origin: string; section: string; role: string; gender?: Gender
  start: number; end: number | null | undefined; approx: boolean; label: string; born?: number
  movs: string[]; alts: string[]; flags: string[]; existing?: string; regions: RegionId[]; unresolved: boolean
}

function fmtY(y: number) { return y < 0 ? `${-y} BCE` : y < 1000 ? `${y} CE` : String(y) }
function parseDates(d: string): { start: number; end: number | null | undefined; approx: boolean; label: string; born?: number; active: boolean } {
  if (d === '=') return { start: 0, end: undefined, approx: true, label: '', active: false }
  if (d === '?') return { start: 1900, end: undefined, approx: true, label: 'dates not established', active: false }
  if (d.startsWith('b')) { const y = Number(d.slice(1)); return { start: y, end: null, approx: false, label: `b. ${y}`, born: y, active: false } }
  const active = d.startsWith('f')
  const body = d.replace(/^f/, '')
  if (!body.includes('..')) { const c = body.startsWith('c'); const y = Number(c ? body.slice(1) : body); return { start: y, end: undefined, approx: c, label: `${active ? 'active ' : ''}${c ? 'c. ' : ''}${fmtY(y)}`, active } }
  const [a, b] = body.split('..')
  const ca = a.startsWith('c'), cb = b.startsWith('c')
  const ya = Number(ca ? a.slice(1) : a), yb = b ? Number(cb ? b.slice(1) : b) : null
  const text = `${ca ? 'c. ' : ''}${fmtY(ya)}${yb === null ? ' –' : ` – ${cb ? 'c. ' : ''}${fmtY(yb)}`}`
  return { start: ya, end: yb, approx: ca || cb || active, label: active ? `active ${text}` : text, active }
}

export const parsedArtists: ParsedArtist[] = []
let counter = 0
for (const sec of SECTIONS) {
  for (const line of sec.rows.trim().split('\n')) {
    counter++
    const cols = line.split('|').map((c) => c.trim())
    const [name, origin, dates, role, g, movs, alts, flagCol] = cols
    const flagText = flagCol ?? ''
    const existing = flagText.startsWith('=') ? flagText.slice(1).split(';;')[0].trim() : undefined
    const flags = flagText.replace(/^=[^;]*;?;?/, '').split(';;').map((x) => x.trim()).filter(Boolean)
    const dt = parseDates(dates)
    const tokens = origin.split('/').map((t) => t.trim())
    const regions = [...new Set(tokens.map((t) => ORIGIN_REGION[t]).filter(Boolean))] as RegionId[]
    parsedArtists.push({
      n: counter, id: existing ?? `artist-${slugify(name)}`, name, origin, section: sec.id, role, gender: GENDER[g],
      start: dt.start, end: dt.end, approx: dt.approx, label: dt.label, born: dt.born,
      movs: movs ? movs.split(',').map((s) => s.trim()).filter(Boolean) : [],
      alts: alts ? alts.split(';').map((s) => s.trim()).filter(Boolean) : [],
      flags, existing, regions, unresolved: name.startsWith('Ernest Akeem'),
    })
  }
}

/** Contemporary practitioners: born 1930 or later (careers developing after about 1960). Everyone else is historical. */
const isContemporary = (p: ParsedArtist) => p.start >= 1930 && p.label !== 'dates not established' && !p.label.startsWith('active')

const INDEX_NOTE = 'Index record: identity, dates, origin and movement links are recorded; no biography has been written yet.'
const capital = (s: string) => s.charAt(0).toUpperCase() + s.slice(1)

export const indexArtists: Artist[] = parsedArtists
  .filter((p) => !p.existing)
  .map((p) => artist({
    id: p.id, kind: p.gender === undefined && p.name.includes('Artists') ? 'collective' : 'individual',
    title: p.name,
    subtitle: `${capital(p.role)} · ${p.origin}`,
    summary: p.unresolved ? 'Unresolved entry from the source list — see the verification note.' : `${capital(p.role)}. ${p.origin}. ${p.label}.`,
    regions: p.regions.length ? p.regions : ['europe'],
    dates: { start: p.start, end: p.end, approx: p.approx, label: p.label },
    altTitles: p.alts,
    essentials: [], lifeEvents: [], context: [], development: [], legacy: [], mediums: [], periods: [],
    level: 'index', gender: p.gender, taxonomy: p.section, originLabel: p.origin,
    contemporary: isContemporary(p) || undefined, flags: p.flags.length ? p.flags : undefined,
    status: { level: 'sample', note: INDEX_NOTE },
  } as never))

/** Overlays that bring the 14 hand-written profiles into the master list. */
export const artistOverlays: Record<string, Partial<Artist>> = {}
for (const p of parsedArtists.filter((x) => x.existing)) {
  artistOverlays[p.existing!] = {
    level: 'profile', gender: p.gender, taxonomy: p.section, originLabel: p.origin, altTitles: p.alts.length ? p.alts : undefined,
    flags: p.flags.length ? p.flags : undefined, contemporary: isContemporary(p) || undefined,
  }
}

/** Artist → movement links from the movement tags. */
export const artistMovementRelationships: Relationship[] = []
{
  let k = 0
  for (const p of parsedArtists) for (const slug of p.movs) {
    artistMovementRelationships.push({
      id: `rel-am-${String(++k).padStart(4, '0')}`, type: 'associated_with', from: p.id, to: idOfSlug(slug),
      note: 'Conventional art-historical association recorded from the master artist list; to be checked against specialist sources when the profile is written.',
    })
  }
}

/** Maker records listed in the movement data but that are also collectives in the movement list. */
export const ARTIST_ROW_COUNT = parsedArtists.length
export { SAMPLE }

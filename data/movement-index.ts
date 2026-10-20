import type { Domain, MovementLike, RegionId } from '@/types'
import { formatYear } from '@/lib/time'
import { DOMAIN_CODE, REGION_CODE } from './taxonomy'
import { collective, movement, school, style, tradition } from './helpers'

/**
 * MOVEMENT TAXONOMY — index records.
 *
 * One row per movement, school, collective, tradition or style named in the master list. Rows
 * carry structure only: classification, dates, origins, practice domains, taxonomy sections,
 * parent (part_of) and any naming/overlap caveat. Prose pages are written for a small number of
 * "full" records (see movements-full.ts); everything else shows exactly what is recorded and
 * says plainly that the page has not been written yet.
 *
 * Row format (pipe-separated):
 *   slug | Name | kind | sections | regions | dates | domains | parent | alt names (;) | note
 *   kind     M movement · S school/workshop · C collective/group/organisation · T tradition · Y style/strand   (* = umbrella)
 *   sections 1–9 → m01–m09 (a record may sit in several)
 *   dates    a..b   ("c" prefix = approximate edge; empty b = continuing)
 *   parent   slug of the larger movement this belongs to (becomes a part_of relationship)
 */

const ROWS = `
egyptian|Ancient Egyptian Art|T|1|wana|c-3100..-30|sc,pt,ar,cr||Pharaonic art|Conventional span: Early Dynastic period to the Roman conquest in 30 BCE; styles changed markedly within it.
ancient-greek|Ancient Greek Art|T*|1|eu|c-900..c-31|sc,pt,ar,ce,cr|||Umbrella for Geometric, Archaic, Classical and (by many accounts) Hellenistic art. Hellenistic art is listed separately and linked as a part.
hellenistic|Hellenistic Art|Y|1|eu,wana|c-323..c-31|sc,pt,ar|ancient-greek||From Alexander's death to the Roman annexation of Egypt; art of the Greek-speaking world well beyond Greece itself.
roman|Roman Art|T|1|eu,wana|c-509..c476|sc,pt,ar,ur,cr||Roman Empire art|Western Empire end date is conventional; art in the Eastern empire continues as Byzantine art.
etruscan|Etruscan Art|T|1|eu|c-700..c-100|sc,pt,ar,ce,cr||| Absorbed into Roman culture across the later first millennium BCE.
byzantine|Byzantine Art|T|1|eu,wana|c330..1453|pt,ar,cr,li||Eastern Roman art|Dates run from the foundation of Constantinople to its fall; icon traditions continue in Orthodox cultures afterwards.
early-christian|Early Christian Art|T|1|eu,wana|c200..c500|pt,sc,ar||Paleochristian art|
romanesque|Romanesque Art|Y|1|eu|c1000..c1200|ar,sc,pt|||Regional variants; a 19th-century label for what came before Gothic.
gothic|Gothic Art|Y|1|eu|c1140..c1500|ar,sc,pt,cr||| Begins with the choir of Saint-Denis; late Gothic persists later in some regions.
islamic-art|Islamic Art|T*|1|wana,sa,eu,sea,ssa|c650..|ar,pt,cr,li,ce||Art of the Islamic world|Umbrella with regional and dynastic subdivisions (Umayyad, Abbasid, Fatimid, Persianate, Ottoman, Mughal, Maghrebi and more). Covers art made in or for Muslim-majority societies, not only religious art.
chinese-literati|Chinese Literati Painting|Y|1,8|ea|c1070..|pt,li||Wenrenhua; scholar-amateur painting|Associated with scholar-officials who valued calligraphic brushwork and poetry; the theory was most influentially systematised in the late Ming.
yamato-e|Japanese Yamato-e|Y|1|ea|c900..c1868|pt||Yamato-e|Distinguished from Chinese-style painting; the label persists in later schools such as Tosa.
sumi-e|Japanese Sumi-e|Y|1|ea|c1300..|pt||Suibokuga; ink wash painting|Monochrome ink painting introduced with Zen Buddhism from China.
persian-miniature|Persian Miniature Painting|Y|1|wana|c1250..c1800|pt,li|islamic-art|Persianate book painting|Illustrations and illuminations in manuscripts of the Persianate world.
rajput|Rajput Painting|Y|1|sa|c1550..c1900|pt||Rajasthani painting|Court painting of the Rajasthan and Himalayan foothill courts; distinct regional schools.
tibetan-buddhist|Tibetan Buddhist Art|T|1|ea,sa|c700..|pt,sc,ar,cr||Himalayan Buddhist art|Thangka painting, sculpture and monastic architecture.
indigenous-american|Indigenous American Artistic Traditions|T*|1|na,cac,sam|-10000..|sc,pt,ar,cr||First Nations, Native American, Mesoamerican, Andean and other traditions|Umbrella category only: it covers hundreds of distinct peoples and traditions across two continents, many continuing today.
west-african|West African Artistic Traditions|T*|1|ssa|c-1000..|sc,cr,ar||| Umbrella category covering many distinct cultures and courts (for example Nok, Ife, Benin, Yoruba, Akan, Dogon, Bamana).
aboriginal-australian|Aboriginal Australian Artistic Traditions|T*|1|oc|-40000..|pt,sc,cr||First Peoples' art of Australia|Umbrella category for a very large number of distinct Nations and traditions, among the longest continuing art traditions in the world.
early-renaissance|Early Renaissance|Y|2|eu|c1400..c1490|pt,sc,ar|renaissance||Principally Florence; the Quattrocento.
high-renaissance|High Renaissance|Y|2|eu|c1490..c1527|pt,sc,ar|renaissance||Centred on Rome and Florence; often ended at the Sack of Rome (1527).
northern-renaissance|Northern Renaissance|Y|2|eu|c1430..c1580|pt,pm,sc|renaissance||Renaissance in the Low Countries, German lands and France; follows its own chronology.
venetian-renaissance|Venetian Renaissance|Y|2|eu|c1450..c1600|pt,ar|renaissance||Venetian emphasis on colour and oil technique.
mannerism|Mannerism|M|2|eu|c1520..c1600|pt,sc,ar||Maniera|Stylised, elongated, artificial forms; whether it is a style or a period is debated.
baroque|Baroque|M|2|eu,cac,sam|c1600..c1750|pt,sc,ar,ur||| Spread to colonial Latin America and parts of Asia through Catholic missions and trade. Later strands overlap with Rococo.
dutch-golden-age|Dutch Golden Age Painting|Y|2|eu|c1600..c1700|pt,pm|baroque||Often treated as the Dutch strand of Baroque; its secular, market-driven character distinguishes it.
rococo|Rococo|M|2|eu|c1720..c1780|pt,sc,ar,de||Late Baroque|Lighter, ornamental successor to the Baroque in French and German-speaking courts.
neoclassicism|Neoclassicism|M|2,3|eu,na|c1750..c1830|pt,sc,ar||| Prompted partly by excavations at Herculaneum and Pompeii and by Enlightenment values.
academic-art|Academic Art|Y|2,3|eu,na|c1648..c1900|pt,sc,ar||Academicism; Salon painting|The art taught and exhibited under royal academies and their Salons. "Academic" is a descriptive term, not a unified style.
romanticism|Romanticism|M|3|eu,na|c1790..c1850|pt,sc,li||| Emphasised emotion, nature and individual imagination; widely varied across countries.
realism|Realism|M|3|eu|c1840..c1880|pt,pm||Réalisme|Courbet exhibited a "Pavilion of Realism" in 1855.
barbizon|Barbizon School|S|3|eu|c1830..c1875|pt||École de Barbizon|An artists' colony and informal school of landscape painters near the Forest of Fontainebleau, rather than a teaching institution.
neo-impressionism|Neo-Impressionism|M|3|eu|c1886..c1910|pt|||Associated with Seurat and Signac; the term was introduced by the critic Félix Fénéon.
pointillism|Pointillism|Y|3|eu|c1886..c1900|pt|neo-impressionism|Divisionism|A technique of small dots of colour. Seurat preferred other terms; Divisionism (Italian) is a related but separate practice.
symbolism|Symbolism|M|3|eu|c1886..c1910|pt,sc,li||| A literary manifesto by Jean Moréas appeared in 1886; visual and literary Symbolism overlap but are not identical.
naturalism|Naturalism|M|3|eu,na|c1860..c1900|pt,li||| Overlaps heavily with Realism; the labels are used differently in painting and literature.
arts-and-crafts|Arts and Crafts Movement|M|3,5|eu,na|c1860..c1920|de,cr,ar,gd,ty,pm|||
art-nouveau|Art Nouveau|M|3,5|eu,na|c1890..c1910|ar,de,gd,cr,ty||Jugendstil; Modernisme; Stile Liberty; Sezessionstil|Known under different names in different countries.
aesthetic|Aesthetic Movement|M|3|eu,na|c1860..c1900|pt,de,ar,gd||"Art for art's sake"|
vienna-secession|Vienna Secession|C|3,5|eu|1897..c1914|pt,ar,gd,de||Vereinigung bildender Künstler Österreichs|An association of artists that broke away from the conservative Vienna Künstlerhaus; also names a style. The association itself continues to exhibit.
nabis|Les Nabis|C|3|eu|1888..c1900|pt,pm,de||The Nabis|A group of Paris painters influenced by Gauguin; "nabi" means prophet in Hebrew and Arabic.
japonisme|Japonisme|M|3,5|eu,na|c1854..c1910|pt,pm,de,gd,cr||Japonism|Better described as a wide cultural fashion and influence than as a cohesive movement; linked to the documented cultural exchange record.
pictorialism|Art Photography / Pictorialism|M|3|eu,na|c1885..c1915|ph||Pictorial photography|Photographers sought recognition as artists through soft focus, hand-worked printing processes and painterly composition.
fauvism|Fauvism|M|4|eu|1905..c1908|pt||Les Fauves|Named by the critic Louis Vauxcelles after the 1905 Salon d'Automne.
expressionism|Expressionism|M*|4|eu|c1905..c1935|pt,pm,ar,li||| An umbrella label, most often applied to German-speaking art; also used for film, literature and architecture.
analytical-cubism|Analytical Cubism|Y|4|eu|c1909..c1912|pt,sc|cubism|Hermetic Cubism|
synthetic-cubism|Synthetic Cubism|Y|4|eu|c1912..c1920|pt,sc|cubism||Includes collage and papier collé.
futurism|Futurism|M|4|eu|1909..c1944|pt,sc,ar,gd,ty,li,pf||Futurismo|Launched by Marinetti's manifesto in Le Figaro in 1909; a "second Futurism" followed in the 1920s–30s.
russian-futurism|Russian Futurism|M|4|eu|c1910..c1930|pt,li,gd,ty||Cubo-Futurism; Budetlyane|Closely tied to poets (Khlebnikov, Mayakovsky) as well as painters; independent of, though in dialogue with, Italian Futurism.
suprematism|Suprematism|M|4|eu|1915..c1927|pt,sc,ar,de||| Introduced by Malevich in 1915 (the "0.10" exhibition).
constructivism|Constructivism|M*|4,5|eu|c1914..c1940|sc,ar,gd,ty,de,ph,fv||| International umbrella with Russian, Central European and other strands.
russian-constructivism|Russian Constructivism|M|4,5|eu|c1915..c1932|sc,ar,gd,ty,de,ph,fv|constructivism|| Groups: the Working Group of Constructivists (1921) and later LEF/Novyi LEF.
constructivist-design|Constructivist Design|Y|5|eu|c1919..c1935|gd,ty,de,ar|russian-constructivism||Posters, book design, textiles, stage and exhibition design.
de-stijl|De Stijl|M|4,5|eu|1917..1931|pt,ar,de,gd,ty||The Style; Neoplasticism|Named for the journal founded in Leiden in 1917 by Theo van Doesburg.
neo-plasticism|Neo-Plasticism|Y|4|eu|1917..c1944|pt||Neoplasticism; Nieuwe Beelding|Piet Mondrian's term and theory; often used as a synonym for De Stijl painting, though Mondrian left the group in 1924.
orphism|Orphism|M|4|eu|c1912..c1914|pt||Orphic Cubism|Term coined by Apollinaire; associated with Robert and Sonia Delaunay, among others.
rayonism|Rayonism|M|4|eu|1911..c1914|pt||Rayonnism; Luchizm|Developed by Mikhail Larionov and Natalia Goncharova.
vorticism|Vorticism|M|4|eu|1914..c1920|pt,sc,li,ty||| The BLAST journal appeared in 1914 and 1915.
dada|Dada|M|4|eu,na|1916..c1924|pt,sc,li,pf,gd,ty,ph||Dadaism|Founded at the Cabaret Voltaire in Zurich in 1916; parallel centres in Berlin, Cologne, Hanover, Paris and New York.
surrealism|Surrealism|M|4|eu,cac,na|1924..c1966|pt,sc,li,ph,fv,pf||| Launched by André Breton's first manifesto in 1924.
metaphysical|Metaphysical Painting|M|4|eu|c1910..c1921|pt||Pittura metafisica|Giorgio de Chirico and Carlo Carrà; an influence on Surrealism.
purism|Purism|M|4,5|eu|1918..c1925|pt,ar,de||| Amédée Ozenfant and Charles-Édouard Jeanneret (Le Corbusier); the journal L'Esprit Nouveau (1920–25).
neue-sachlichkeit|Neue Sachlichkeit / New Objectivity|M|4|eu|c1919..1933|pt,pm,ph||New Objectivity|Named by the museum director Gustav Hartlaub for a 1925 exhibition in Mannheim.
precisionism|Precisionism|M|4|na|c1915..c1940|pt,ph||Cubist-Realism|Crisp depictions of industry and architecture in the United States.
mexican-muralism|Mexican Muralism|M|4,8|cac|c1921..c1960|pt||Muralismo mexicano|State-sponsored public murals after the Mexican Revolution; Rivera, Orozco and Siqueiros are known as "los tres grandes". Influenced murals in the United States and beyond.
social-realism|Social Realism|M|4|eu,na|c1920..c1950|pt,pm,ph||| Critical depictions of social conditions. Not the same as Socialist Realism, the state doctrine of the USSR.
socialist-realism|Socialist Realism|M|4|eu,ea|1932..c1991|pt,sc,ar,gd||| Official doctrine in the Soviet Union from 1932, later adopted in other states, including China.
bauhaus|Bauhaus|S|5,9|eu|1919..1933|de,gd,ty,ar,ph,cr,pt||Staatliches Bauhaus|A school of art, craft and design, not a style; the term "Bauhaus style" is a later simplification.
pre-raphaelite-brotherhood|The Pre-Raphaelite Brotherhood|C|3,9|eu|1848..c1853|pt||PRB; Pre-Raphaelites|Founded in London in 1848 by Hunt, Millais and Rossetti among others. The Brotherhood itself was short-lived; the wider Pre-Raphaelite movement continued with changing members into the 1900s.
die-brucke|Die Brücke|C|4,9|eu|1905..1913|pt,pm||The Bridge|An Expressionist artists' group founded in Dresden.
der-blaue-reiter|Der Blaue Reiter|C|4,9|eu|1911..1914|pt,pm,li,pf||The Blue Rider|A Munich group around Kandinsky and Franz Marc; also the name of their 1912 almanac.
cobra|CoBrA|C|6,9|eu|1948..1951|pt,sc,pm,li||COBRA; Cobra|Name from Copenhagen, Brussels, Amsterdam. Both a collective and a movement; classified here as a collective.
gutai|Gutai Art Association|C|6,9|ea|1954..1972|pt,pf,in||Gutai; 具体|Founded in the Kansai region by Yoshihara Jirō. Both an association and a movement; classified here as a collective.
memphis|Memphis Group|C|5,9|eu|1980..1988|de,gd,ar||Memphis Milano|Milan design group founded by Ettore Sottsass; also the name of the style it produced.
zaria-art-society|Zaria Art Society|C|8,9|ssa|1958..1961|pt,gd,li||The Zaria Rebels|Students at the Nigerian College of Arts, Science and Technology, Zaria.
progressive-artists-group|Progressive Artists' Group|C|8,9|sa|1947..c1956|pt||PAG|Founded in Bombay in 1947.
africobra|AfriCOBRA|C|8,9|na|1968..|pt,gd||African Commune of Bad Relevant Artists|Chicago collective of Black artists; both a collective and an aesthetic.
wiener-werkstatte|Wiener Werkstätte|S|5,9|eu|1903..1932|de,cr,gd,ar||Vienna Workshops|A craft and design workshop founded by Josef Hoffmann, Koloman Moser and Fritz Waerndorfer. Classified as a workshop-school rather than a style.
werkbund|Deutscher Werkbund|C|5,9|eu|1907..1934|de,ar,gd,ty||German Werkbund|An association of artists, architects, designers and industrialists, not an art movement; re-founded after 1945.
international-typographic|International Typographic Style|Y|5|eu|c1945..c1975|gd,ty||Swiss Style|Emerged mainly in Switzerland; grid systems, sans-serif type, photography.
new-typography|New Typography|M|5|eu|c1923..c1938|gd,ty||Die neue Typographie|Jan Tschichold codified it in 1928.
art-deco|Art Deco|Y|5|eu,na,ea,sam|c1920..c1940|ar,de,gd,cr,ty||Style Moderne|Named after the 1925 Paris Exposition des Arts Décoratifs; a global style of design and architecture.
streamline-moderne|Streamline Moderne|Y|5|na|c1930..c1945|ar,de,gd||| Aerodynamic forms in architecture and industrial design.
international-style|International Style|Y|5|eu,na|c1925..c1975|ar||| Named by Henry-Russell Hitchcock and Philip Johnson in a 1932 exhibition at the Museum of Modern Art.
modernist-architecture|Modernist Architecture|M*|5|eu,na,sam,ea|c1900..c1975|ar,ur||Modern Movement|Umbrella label for several overlapping currents including Functionalism, Purism and the International Style.
functionalism|Functionalism|M|5|eu|c1920..c1950|ar,de,gd||Funktionalismus; Funkis|Associated with the idea that form follows use; especially strong in Germany, Scandinavia and the Netherlands.
brutalism|Brutalism|M|5|eu,na,ea,sa|c1950..c1975|ar,ur||Béton brut|Exposed concrete and monumental massing; the term was popularised by Reyner Banham in the 1950s.
scandinavian-modern|Scandinavian Modern Design|Y|5|eu|c1930..c1970|de,cr,ar||Nordic design|
mid-century-modern|Mid-Century Modern|Y|5|na,eu|c1945..c1969|de,ar,gd|||
italian-radical|Italian Radical Design|M|5|eu|c1966..c1975|de,ar,in||Radical architecture; Anti-design|Critical, speculative design and architecture, mainly by groups such as Archizoom and Superstudio.
postmodern-design|Postmodern Design|M|5|eu,na|c1970..c1995|de,ar,gd||Postmodernism in design and architecture|
new-wave-typography|New Wave Typography|Y|5|eu,na|c1970..c1990|gd,ty||Swiss Punk; Basel School|Wolfgang Weingart's teaching in Basel was an important source.
deconstructivism|Deconstructivism|M|5|eu,na|c1980..c2000|ar||Deconstructivist architecture|Named in the 1988 MoMA exhibition Deconstructivist Architecture.
digital-design|Digital Design|Y|5,7|eu,na|c1984..|gd,ty,di,de||| A field of practice defined by technology rather than a cohesive movement.
generative-design|Generative Design|Y|5,7|eu,na|c1960..|di,gd,ar,de||| Rule- and algorithm-based form making in design and architecture.
interaction-design|Contemporary Interaction Design|Y|5|eu,na|c1990..|di,gd,de||Interaction design; UX|A practice field rather than a movement.
action-painting|Action Painting|Y|6|na|c1947..c1960|pt|abstract-expressionism||Term introduced by the critic Harold Rosenberg in 1952; applies to some, not all, Abstract Expressionists.
colour-field|Colour Field Painting|Y|6|na|c1948..c1970|pt|||A strand of postwar abstraction with large areas of flat colour.
art-informel|Art Informel|M|6|eu|c1945..c1960|pt,sc||Informalism|European postwar gestural abstraction.
tachisme|Tachisme|Y|6|eu|c1950..c1960|pt|art-informel||French strand of Art Informel.
neo-dada|Neo-Dada|M|6|na,eu|c1953..c1965|pt,sc,pf||| Rauschenberg and Johns are often placed here, though some critics prefer other labels.
nouveau-realisme|Nouveau Réalisme|M|6|eu|1960..c1970|sc,pf||New Realism|Founded in 1960 with Pierre Restany's manifesto; Yves Klein, Arman, Jean Tinguely and others.
pop-art|Pop Art|M|6|eu,na|c1955..c1970|pt,pm,sc,gd||| Parallel developments in Britain and the United States.
op-art|Op Art|M|6|eu,na,sam|c1955..c1970|pt,gd,de||Optical Art|Popularised by the 1965 exhibition The Responsive Eye at MoMA.
minimalism|Minimalism|M|6|na|c1960..c1975|sc,pt,in|||
post-minimalism|Post-Minimalism|M|6|na|c1966..c1980|sc,in||| Term used by Robert Pincus-Witten in the early 1970s.
hard-edge|Hard-Edge Painting|Y|6|na|c1958..c1970|pt||| Term coined by the critic Jules Langsner in 1958.
arte-povera|Arte Povera|M|6|eu|c1967..c1975|sc,in||"Poor art"|Named by Germano Celant in 1967.
fluxus|Fluxus|M|6,9|eu,na,ea|c1960..c1978|pf,gd,pm,fv,li||| An international, loosely organised network associated with George Maciunas, not a formal group; it appears under both movements and collectives.
conceptual-art|Conceptual Art|M|6|na,eu,sam,ea|c1965..c1975|in,li,pf,ph,gd||Conceptualism|The idea takes precedence over the object; strands continue far beyond the 1970s.
performance-art|Performance Art|M|6|eu,na,ea|c1960..|pf,fv||| Earlier precedents in Futurist, Dada and Bauhaus performance; widely practised worldwide today.
land-art|Land Art / Earthworks|M|6|na,eu|c1966..c1980|sc,in,ph||Earth art; Earthworks|
installation-art|Installation Art|Y|6|eu,na,ea|c1960..|in,sc,fv|||
video-art|Video Art|M|6|na,ea,eu|c1963..|fv,in|||
feminist-art|Feminist Art|M|6|na,eu|c1970..|pt,pf,in,ph,fv||Feminist art movement|Closely tied to second-wave feminism; includes many practices and critiques of art history itself.
institutional-critique|Institutional Critique|M|6|na,eu|c1968..|in,pf,ph|||
photorealism|Photorealism|M|6|na|c1965..c1980|pt,pm,ph||Superrealism|
hyperrealism|Hyperrealism|Y|6|na,eu|c1970..|pt,sc||| Overlaps with Photorealism; the term is used for painting and sculpture.
neo-expressionism|Neo-Expressionism|M|7|eu,na|c1978..c1990|pt,sc||Neue Wilde; Transavantgarde (Italian); Figuration libre (French)|Several national variants are sometimes listed separately.
transavantgarde|Transavantgarde|M|7|eu|c1979..c1990|pt,sc||Transavanguardia|Italian painting group named by the critic Achille Bonito Oliva.
appropriation-art|Appropriation Art|Y|7|na,eu|c1977..|pt,ph,sc|||
pictures-generation|Pictures Generation|M|7|na|c1975..c1990|ph,pt,pf||| A generation of artists named for the 1977 exhibition Pictures.
postmodern-art|Postmodern Art|M|7|eu,na|c1965..c2000|pt,sc,ph,ar,in||Postmodernism|Contested umbrella; "postmodern" is used in different senses across disciplines.
street-art|Street Art|M|7|eu,na,sam,oc|c1980..|pt,gd,in||Urban art|Public-space art outside commercial gallery systems; overlaps with Graffiti Art.
graffiti-art|Graffiti Art|M|7|na,eu|c1967..|pt,gd,ty||Writing; aerosol art|Name-based writing culture beginning in Philadelphia and New York in the late 1960s.
yba|Young British Artists|M|7|eu|c1988..c2000|pt,sc,in||YBAs|A label for a generation shaped by the Freeze (1988) and Sensation (1997) exhibitions; not a collective.
relational-aesthetics|Relational Aesthetics|M|7|eu|c1990..c2005|in,pf||| Term from Nicolas Bourriaud's 1998 book.
socially-engaged|Socially Engaged Art|M|7|na,eu,sam|c1990..|pf,in,ur||Social practice|
participatory|Participatory Art|Y|7|eu,na|c1960..|in,pf||| Overlaps Socially Engaged Art and Relational Aesthetics.
identity-based|Identity-Based Art Practices|Y|7|na,eu|c1980..|pt,ph,in,fv||| A broad grouping of practices addressing race, gender, sexuality, disability and other identities, not a single movement.
postcolonial-art|Postcolonial Art|M|7|eu,na,sa,ssa,oc|c1960..|pt,in,fv,ph||| A critical field rather than a style; cuts across many regions.
contemporary-indigenous|Contemporary Indigenous Art|T*|7,8|na,cac,sam,oc|c1950..|pt,sc,in,fv,cr||| Umbrella across many Indigenous nations and communities worldwide; see regional entries.
new-media-art|New Media Art|M|7|eu,na,ea|c1960..|di,fv,in|||
internet-art|Internet Art|Y|7|eu,na|c1993..|di||Net-based art|
net-art|Net Art|M|7|eu|c1994..c2000|di|internet-art|net.art|The specific 1990s network-based practice (JODI, Olia Lialina, Vuk Ćosić and others), within the broader field of Internet Art.
digital-art|Digital Art|Y|7|eu,na|c1960..|di,pt,fv|||
bio-art|Bio Art|M|7|na,eu,oc|c1990..|di,in|||
interactive-art|Interactive Art|Y|7|eu,na|c1960..|di,in|||
generative-art|Generative Art|Y|7|eu,na|c1965..|di,pt,gd||| Early computer art exhibitions in Stuttgart, Hanover and New York in 1965.
ai-art|AI Art|Y|7|eu,na|c2015..|di,pt||| Earlier precedents include Harold Cohen's AARON program from the 1970s.
immersive-art|Immersive Art|Y|7|eu,na,ea|c1990..|in,di,fv||| Lineage includes expanded cinema and installation of the 1960s.
nft-art|NFT Art|Y|7|na,eu|c2014..|di||| A market- and technology-linked category, not necessarily a coherent artistic movement.
bengal-school|Bengal School of Art|S|8|sa|c1905..c1945|pt||| Associated with Abanindranath Tagore; nationalist revival of Indian painting.
santiniketan|Santiniketan Artistic Tradition|S|8|sa|1919..|pt,pm,cr,li||Kala Bhavana; Visva-Bharati|Centred on Kala Bhavana at Rabindranath Tagore's Visva-Bharati.
nihonga|Nihonga|M|8|ea|c1885..|pt||| Created in the Meiji period as "Japanese-style painting" in contrast with Western-style yōga.
yoga|Yōga|M|8|ea|c1870..|pt||Western-style painting in Japan|
sosaku-hanga|Sōsaku-hanga|M|8|ea|c1904..c1970|pm||Creative prints|Prints designed, carved and printed by the artist, in contrast to the ukiyo-e division of labour.
mingei|Mingei Movement|M|8|ea|1925..|cr,ce,de||Folk craft movement|Founded by Yanagi Sōetsu with potters including Hamada Shōji and Kawai Kanjirō.
dansaekhwa|Dansaekhwa|M|8|ea|c1970..c1980|pt||Korean monochrome painting|
minjung|Minjung Art|M|8|ea|c1980..c1992|pt,pm||People's art|Socially engaged Korean art tied to democratisation movements.
mono-ha|Mono-ha|M|8|ea|c1968..c1975|sc,in||School of Things|
stars-group|Stars Art Group|C|8|ea|1979..c1983|pt,sc||The Stars; Xingxing|Beijing group that exhibited outside the Chinese National Art Museum in 1979.
new-wave-85|'85 New Wave|M|8|ea|c1985..c1989|pt,in,pf||'85 Art Movement|A decentralised network of groups across China.
chinese-contemporary|Chinese Contemporary Art|M*|8|ea|c1979..|pt,in,fv,pf,ph||| Umbrella for post-1979 developments, including the Stars, '85 New Wave and later practices.
saqqakhaneh|Saqqakhaneh Movement|M|8|wana|c1960..c1975|pt,sc||Saqqa-khaneh|Iranian modernist art drawing on popular Shiʿi votive imagery.
hurufiyya|Hurufiyya Movement|M*|8|wana|c1950..|pt,sc,ty||Letterism (Arabic); calligraphic modernism|Modern art that works with Arabic letters and calligraphy, across several countries.
baghdad-modern|Baghdad Modern Art Group|C|8|wana|1951..c1960|pt,sc||Jamaʿat Baghdad lil-Fann al-Hadith|Founded by Jewad Selim in 1951.
khartoum-school|Khartoum School|S|8|wana,ssa|c1960..|pt,gd||| Associated with artists from the College of Fine and Applied Art in Khartoum.
nsukka-school|Nsukka School|S|8|ssa|c1970..|pt,gd,li||Nsukka group|Centred on the University of Nigeria, Nsukka, and the revival of uli design.
casablanca-school|Casablanca Art School|S|8|wana|c1962..c1974|pt,gd,cr||| Under Farid Belkahia's directorship; integrated craft traditions with modernist practice.
ecole-de-dakar|École de Dakar|S|8|ssa|c1960..c1980|pt,sc,cr||School of Dakar|
negritude|Négritude|M|8|ssa,cac,eu|c1934..c1965|li||| A cultural and intellectual movement (Césaire, Senghor, Damas) with strong effects on the visual arts; it is not primarily a visual style.
brazilian-modernism|Brazilian Modernism|M|8|sam|1922..c1945|pt,sc,ar,li||Modernismo|Launched with the Semana de Arte Moderna in São Paulo in 1922.
anthropophagic|Anthropophagic Movement|M|8|sam|1928..c1930|pt,li||Antropofagia|Oswald de Andrade's 1928 manifesto; Tarsila do Amaral's Abaporu.
concrete-latin-america|Concrete Art — Latin America|M|8|sam|c1944..c1960|pt,sc,gd,ar||Arte Concreto| Argentine and Brazilian groups; international links to Max Bill and the Ulm school.
neo-concrete|Neo-Concrete Movement|M|8|sam|1959..c1961|pt,sc,pf||Neoconcretismo|Rio de Janeiro; the Neo-Concrete Manifesto appeared in 1959.
madi|Madí Movement|M|8|sam|1946..c1955|pt,sc||Arte Madí|Buenos Aires and Montevideo.
kinetic-art|Kinetic Art|M|8|sam,eu|c1955..c1975|sc,in||Cinétisme|Venezuelan artists such as Soto and Cruz-Diez worked in Paris; international.
chicano|Chicano Art Movement|M|8|na|c1965..|pt,pm,gd||Chicano/a art|Tied to the Chicano civil-rights movement; murals, posters and prints.
black-arts-movement|Black Arts Movement|M|8|na|1965..1975|li,pt,pf,gd||BAM|The artistic wing of Black Power, associated with Amiri Baraka.
indigenous-australian-contemporary|Indigenous Australian Contemporary Art|M*|8|oc|c1970..|pt,sc,in,fv,ph||| Umbrella for modern and contemporary practice by Aboriginal and Torres Strait Islander artists.
papunya-tula-movement|Papunya Tula Movement|M|8|oc|1971..|pt||Western Desert art movement|Began at Papunya in 1971 with Geoffrey Bardon's school-teaching; the collective Papunya Tula Artists was formed in 1972.
contemporary-maori|Contemporary Māori Art|M*|8|oc|c1950..|pt,sc,in,cr||Toi Māori|
contemporary-pacific|Contemporary Pacific Art|M*|8|oc|c1960..|pt,sc,in,cr,fv||| Umbrella across many Pacific nations and diasporas.
black-mountain|Black Mountain College|S|9|na|1933..1957|pt,ph,li,pf,ar,de||| An experimental college in North Carolina.
ulm|Ulm School of Design|S|5,9|eu|1953..1968|de,gd,ty,ar||Hochschule für Gestaltung Ulm; HfG Ulm|
vkhutemas|Vkhutemas|S|9|eu|1920..1930|ar,de,gd,pt,sc||Higher Art and Technical Studios|Moscow state art and design school.
academie-julian|Académie Julian|S|9|eu|1868..1968|pt,sc||| A private Paris art school that admitted women to life drawing earlier than the state school.
ecole-des-beaux-arts|École des Beaux-Arts|S|9|eu|1648..|pt,sc,ar,pm||Académie royale de peinture et de sculpture (precursor)|Paris; the modern school descends from the Académie royale of 1648. Its architecture teaching shaped the "Beaux-Arts" style internationally.
bloomsbury|The Bloomsbury Group|C|9|eu|c1905..c1940|pt,li,de||Bloomsbury set|A circle of writers and artists in London, including Vanessa Bell, Duncan Grant and Roger Fry (Omega Workshops).
november-group|November Group|C|9|eu|1918..1933|pt,ar,li||Novembergruppe|Berlin artists' association formed after the November Revolution.
group-of-seven|The Group of Seven|C|9|na|1920..1933|pt||| Canadian landscape painters.
independent-group|Independent Group|C|9|eu|1952..c1955|pt,ar,ph,gd||IG|London ICA discussion group often cited as an origin of British Pop.
situationist|Situationist International|C|9|eu|1957..1972|li,ur,fv,pf||SI|A revolutionary group of artists and theorists; psychogeography, détournement.
art-and-language|Art & Language|C|9|eu,na|1968..|in,li,pt|||
guerrilla-girls|Guerrilla Girls|C|9|na|1985..|gd,pf||| An anonymous feminist activist collective who use posters and public actions.
superstudio|Superstudio|C|9|eu|1966..1978|ar,de,in,fv|||
archizoom|Archizoom Associati|C|9|eu|1966..1974|ar,de,in||Archizoom|
ant-farm|Ant Farm|C|9|na|1968..1978|ar,in,fv,pf|||
papunya-tula-artists|Papunya Tula Artists|C|9|oc|1972..|pt||| An Aboriginal-owned artists' company; distinct from the wider Papunya Tula Movement.
black-audio|Black Audio Film Collective|C|9|eu|1982..1998|fv,ph|||
`.trim().split('\n')

/* Existing, fully written records in the prototype, matched to taxonomy slugs. */
export const EXISTING: Record<string, { id: string; sections: number[]; domains: Domain[]; alts?: string[] }> = {
  renaissance: { id: 'mov-renaissance', sections: [2], domains: ['painting', 'sculpture', 'architecture', 'printmaking'], alts: ['Rinascimento'] },
  impressionism: { id: 'mov-impressionism', sections: [3], domains: ['painting', 'printmaking', 'photography'] },
  'post-impressionism': { id: 'mov-post-impressionism', sections: [3], domains: ['painting', 'printmaking'] },
  cubism: { id: 'mov-cubism', sections: [4], domains: ['painting', 'sculpture'] },
  'harlem-renaissance': { id: 'mov-harlem-renaissance', sections: [4], domains: ['painting', 'photography', 'literature', 'graphic-design'], alts: ['New Negro Movement'] },
  'abstract-expressionism': { id: 'mov-abstract-expressionism', sections: [6], domains: ['painting'], alts: ['New York School'] },
  'ukiyo-e': { id: 'style-ukiyo-e', sections: [1], domains: ['printmaking', 'painting'] },
  'mughal-painting': { id: 'style-mughal-painting', sections: [1], domains: ['painting'] },
  'khmer-art': { id: 'trad-angkor', sections: [1], domains: ['architecture', 'sculpture'], alts: ['Khmer Art'] },
  'classical-greek': { id: 'style-classical-greek', sections: [1], domains: ['sculpture'] },
  maya: { id: 'trad-maya', sections: [1], domains: ['sculpture', 'literature', 'architecture'] },
  'islamic-calligraphy': { id: 'trad-islamic-calligraphy', sections: [1], domains: ['literature', 'typography', 'craft'] },
  inka: { id: 'trad-inka', sections: [1], domains: ['craft', 'architecture'] },
  benin: { id: 'trad-benin-court', sections: [1], domains: ['sculpture', 'craft'] },
  whakairo: { id: 'trad-maori-whakairo', sections: [1, 8], domains: ['sculpture', 'architecture'] },
  'song-landscape': { id: 'style-song-landscape', sections: [1], domains: ['painting'] },
  'qin-funerary': { id: 'trad-qin-funerary', sections: [1], domains: ['sculpture'] },
  'dutch-golden-age': { id: 'style-dutch-golden-age', sections: [2], domains: ['painting', 'printmaking'] },
}

/** Slug → entity id. Rows that already exist as full records resolve to those ids. */
const PREFIX = { M: 'mov', S: 'school', C: 'coll', T: 'trad', Y: 'style' } as const
type Kind = keyof typeof PREFIX

interface Parsed {
  slug: string; title: string; kind: Kind; umbrella: boolean; sections: string[]; regions: RegionId[]
  start: number; end: number | null; approx: boolean; domains: Domain[]; parent?: string; alts: string[]; note?: string
}

function parseYear(s: string): { y: number; c: boolean } {
  const c = s.startsWith('c')
  return { y: Number(c ? s.slice(1) : s), c }
}

const parsed: Parsed[] = ROWS.map((line) => {
  const [slug, title, k, secs, regs, dates, doms, parent, alts, note] = line.split('|').map((x) => x.trim())
  const umbrella = k.endsWith('*')
  const [a, b] = dates.split('..')
  const A = parseYear(a)
  const B = b ? parseYear(b) : null
  return {
    slug, title, kind: k.replace('*', '') as Kind, umbrella,
    sections: secs.split(',').map((n) => `m0${n.trim()}`),
    regions: regs.split(',').map((r) => REGION_CODE[r.trim()]),
    start: A.y, end: B ? B.y : null, approx: A.c || !!B?.c,
    domains: doms.split(',').filter(Boolean).map((d) => DOMAIN_CODE[d.trim()]),
    parent: parent || undefined,
    alts: alts ? alts.split(';').map((x) => x.trim()).filter(Boolean) : [],
    note: note || undefined,
    ...{ _a: A, _b: B },
  } as Parsed
})

/** Parsed rows that map to hand-written records (carry taxonomy/domain overlays instead of being rebuilt). */
export const idOfSlug = (slug: string): string => {
  const ex = EXISTING[slug]
  if (ex) return ex.id
  const p = parsed.find((x) => x.slug === slug)
  if (!p) throw new Error(`movement-index: unknown slug "${slug}"`)
  return `${PREFIX[p.kind]}-${p.slug}`
}

const label = (p: Parsed & { _a?: { y: number; c: boolean }; _b?: { y: number; c: boolean } | null }) => {
  const a = p._a!, b = p._b
  const fa = `${a.c ? 'c. ' : ''}${formatYear(a.y)}`
  if (!b) return `from ${fa}`
  return `${fa} – ${b.c ? 'c. ' : ''}${formatYear(b.y)}`
}

const INDEX_NOTE = 'Index record: classification, dates, origins and relationships are recorded; the full page has not been written yet.'

const KIND_WORD: Record<Kind, string> = { M: 'Movement', S: 'School', C: 'Collective', T: 'Tradition', Y: 'Style' }
const builders = { M: movement, S: school, C: collective, T: tradition, Y: style } as const

const DATE_LABEL_OVERRIDE: Record<string, string> = {
  'indigenous-american': 'many thousands of years; continuing',
  'aboriginal-australian': 'tens of thousands of years; continuing',
  'west-african': 'ancient to present',
  'islamic-art': 'from the 7th century',
}

export const indexMovements: MovementLike[] = parsed
  .filter((p) => !EXISTING[p.slug])
  .map((p) => {
    const rec = p as Parsed & { _a: { y: number; c: boolean }; _b: { y: number; c: boolean } | null }
    return builders[p.kind]({
      id: idOfSlug(p.slug), title: p.title,
      subtitle: undefined,
      summary: `${KIND_WORD[p.kind]}${p.umbrella ? ' (umbrella category)' : ''}, ${label(rec)}.${p.note ? ' ' + p.note : ''}`,
      regions: p.regions, dates: { start: p.start, end: p.end, approx: p.approx, label: DATE_LABEL_OVERRIDE[p.slug] ?? label(rec) },
      periods: [], context: [], origins: [], characteristics: [], mediums: [], techniques: [],
      altNames: p.alts, umbrella: p.umbrella || undefined, taxonomy: p.sections, domains: p.domains,
      level: 'index', status: { level: 'sample', note: INDEX_NOTE },
    } as never)
  })

/** Taxonomy overlays for the already-written records. */
export const movementOverlays: Record<string, Partial<MovementLike>> = {}
for (const ex of Object.values(EXISTING)) {
  movementOverlays[ex.id] = { taxonomy: ex.sections.map((n) => `m0${n}`), domains: ex.domains, altNames: ex.alts, level: 'full' }
}

/** (child, parent) pairs from the `parent` column; turned into part_of relationships. */
export const movementParents: { child: string; parent: string }[] = parsed
  .filter((p) => p.parent).map((p) => ({ child: idOfSlug(p.slug), parent: idOfSlug(p.parent!) }))

/** Extra part_of pairs for rows resolving to existing records. */
export const MOVEMENT_ROW_COUNT = parsed.length

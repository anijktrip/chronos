# Data audit — master artist list and movement taxonomy

What was received, what was changed, what is uncertain, and what is missing. Everything here is also visible in the app
(`/explore/coverage`, and the "Editorial notes" on each record). Nothing in this file is presented as final scholarship:
all prose is prototype sample text.

## 1. Master artist list (400 entries)

**Result: 397 distinct records** — 14 hand-written profiles merged onto master-list rows, 383 index records, plus 10 profile
records that are not in the list (Verrocchio, Aaron Douglas, Jacob Lawrence, Rukupō, and anonymous or workshop makers kept from the earlier sample).

### Duplicates merged
| Source numbers | Artist | Kept |
|---|---|---|
| #147, #335 | Leonora Carrington | one record, both numbers noted |
| #148, #334 | Remedios Varo | one record, both numbers noted |
| #219, #234 | Olafur Eliasson | one record, both numbers noted |

### Classification and identity corrections
| # | Entry | Issue | Treatment |
|---|---|---|---|
| 43 | Artemisia Gentileschi | Listed in the Renaissance section; her career (c. 1610–1650s) is Baroque | Tagged **Baroque**, section kept as listed, correction noted on the record |
| 313 | "Ernest Akeem Igloliorte" — South Africa | Does not match a documented artist; *Igloliorte* is an Inuit family name from Nunatsiavut (Canada), which conflicts with the stated origin. Ernest Mancoba (South Africa, 1904–2002) may have been intended | **Unresolved placeholder**, flagged, no dates, no tags, never guessed |
| 80 | Camille Pissarro — France | Born in St Thomas (then Danish West Indies) | Origin kept as listed; birthplace noted |
| 83 | Alfred Sisley — UK / France | Born in Paris to British parents | Noted |
| 97 | John Singer Sargent — United States | Born in Florence to American parents | Noted |
| 105 | Sonia Delaunay — Ukraine / France | Born near Odesa in the Russian Empire | Kept; noted |
| 122 | Kazimir Malevich — Ukraine / Russian Empire | Born in Kyiv; national identity contested in scholarship | Kept; noted |
| 136 | Jean Arp — France / Germany | Born in Strasbourg when it was in the German Empire | Noted |
| 162 | Mark Rothko — Latvia / United States | Born in Dvinsk (now Daugavpils), Russian Empire | Noted |
| 225 | Mona Hatoum — Palestine / UK | Born in Beirut to a Palestinian family | Noted |
| 272 | Amrita Sher-Gil — Hungary / India | Born in Budapest | Kept |
| 65 | Francisco Goya | Career spans Rococo, Neoclassicism, Romanticism | Single tag is flagged as a simplification |
| 172 | Louise Bourgeois | Movement affiliation contested (Surrealism, Feminist art, none) | Left untagged |
| 329 | Frida Kahlo | Breton called her Surrealist; she rejected the label | Left untagged, note kept |

### Attribution caveats (no works are listed for these)
Imhotep, Thutmose, Phidias, Myron, Praxiteles, Lysippos, Apelles, Zeuxis, Parrhasius, Gu Kaizhi, Wu Daozi, Wang Wei — known through ancient texts,
later copies or attributed works. Records say so rather than listing works. Dates for Greek and medieval figures are *active periods*, not life dates.

### Not an artist in the usual sense
Tristan Tzara (poet), Rabindranath Tagore (poet and late-career painter), Etel Adnan (poet and painter) — kept because they are named in the list,
with the role recorded.

### Historical vs contemporary
`contemporary: true` = born 1930 or later. People with only a birth year are written "b. 1946", so the data never asserts that someone is living
or has died; deaths are recorded only where well established.

## 2. Movement taxonomy (≈190 names across nine sections)

**Result: 208 entries** (190 index + 18 earlier full records), classified as movement, school, collective, tradition or style, with umbrella
categories marked. Seven are complete pages: Arts and Crafts, Art Nouveau, Bauhaus, Dada, Surrealism, Russian Constructivism, De Stijl.

### Names appearing in several sections (one entry, several sections)
Arts and Crafts · Art Nouveau · Vienna Secession · De Stijl · Bauhaus · Mexican Muralism · Die Brücke · Der Blaue Reiter · Pre-Raphaelite Brotherhood ·
CoBrA · Gutai · Fluxus · Memphis · Ulm School · AfriCOBRA · Progressive Artists' Group · Zaria Art Society · Contemporary Indigenous Art.

### Classification decisions (preserved, not flattened)
| Entry | Classified as | Why |
|---|---|---|
| Bauhaus, Black Mountain College, Ulm School, Vkhutemas, Académie Julian, École des Beaux-Arts, Wiener Werkstätte | school | Teaching institutions or workshops |
| Barbizon School, Bengal School, Casablanca School, Khartoum School, Nsukka School, École de Dakar, Santiniketan | school | School in the art-historical sense (a teaching centre or a regional grouping around one) |
| Die Brücke, Der Blaue Reiter, Pre-Raphaelite Brotherhood, CoBrA, Gutai, Les Nabis, Bloomsbury, Group of Seven, November Group, Independent Group, Situationist International, Art & Language, Guerrilla Girls, Superstudio, Archizoom, Ant Farm, Memphis Group, AfriCOBRA, Zaria Art Society, Progressive Artists' Group, Papunya Tula Artists, Black Audio Film Collective, Stars Group, Baghdad Modern Art Group | collective | Named groups with members |
| Vienna Secession, Deutscher Werkbund | collective | Associations (the Werkbund also includes industrialists); the Secession also names a style |
| Fluxus | movement | An international network, not a formal group — appears under movements *and* collectives |
| Papunya Tula Artists vs Papunya Tula Movement | collective vs movement | An Aboriginal-owned company (1972) and the painting movement it grew out of (1971) are separate entities, linked |
| Négritude | movement | A cultural and intellectual movement; note says it is not primarily a visual style |
| Young British Artists | movement | A generational label, not a collective |
| NFT Art | style | The brief itself says it is a market/technology category, not necessarily a movement |
| Digital Design, Interaction Design, Generative Design | style | Practice fields defined by technology |
| Islamic Art, Indigenous American, West African, Aboriginal Australian, Contemporary Indigenous, Constructivism, Chinese Contemporary, Expressionism, Modernist Architecture | umbrella | Group many regional or historical subdivisions |

### Overlaps resolved with `part_of`
Cubism ⊃ Analytical, Synthetic · Neo-Impressionism ⊃ Pointillism · De Stijl ⊃ Neo-Plasticism · Constructivism ⊃ Russian Constructivism ⊃ Constructivist Design ·
Internet Art ⊃ Net Art · Art Informel ⊃ Tachisme · Renaissance ⊃ Early, High, Northern, Venetian · Ancient Greek ⊃ Classical, Hellenistic ·
Islamic Art ⊃ Persian Miniature, Calligraphy · Modernist Architecture ⊃ International Style · Expressionism ⊃ Die Brücke, Der Blaue Reiter ·
Contemporary Indigenous ⊃ Australian, Māori, Pacific.

### Relationships
280 movement↔movement records, each with a note stating the documented basis. Simplified by design: the example chains from the brief are present
(Arts and Crafts → Art Nouveau → Bauhaus; Cubism → Constructivism ↔ De Stijl; Dada → Surrealism; Dada → Neo-Dada → Fluxus → Conceptual Art) but the data holds
many more influences, reactions and overlaps around each. About 440 artist→movement links come from the movement tags on the artist list; each is a conventional
association to be checked when the profile is written.

## 3. Known gaps (also on the Coverage page)

* **Geography:** no Southeast Asian artist in the list; Central Asia and the Caucasus have no region in the ten-region frame; Indigenous artists of the Americas are almost absent.
* **Gender:** women are about one in five records overall and very few before 1800.
* **Periods:** the medieval section ends with the Italian Trecento; no medieval artists from the Islamic world, Africa or Asia are named.
* **Design:** few type designers and photographers; limited non-Western architecture.
* **Movements missing from the taxonomy:** Rinpa, Kanō school, Lingnan school, Russian icon painting, School of Paris, Group f/64 / straight photography, Spatialism, Capitalist Realism,
  Art Brut, Superflat, Oshogbo school, Baroda group, Hermannsburg school, Egyptian modernism / Art et Liberté, Hudson River / Ashcan / Regionalism, Gandhara / Pala / Chola art.
* **Artists without a movement tag:** left untagged where no taxonomy entry fits honestly (Brâncuși, Bacon, Moore, Kapoor, Richter and others).

## 4. How to expand to 1,000+ artists

1. Add rows to `src/data/artist-index.ts` (one line per artist; format documented at the top of the file). Add any new origin label to `ORIGIN_REGION` in `taxonomy.ts`.
2. Add any new movement to `ROWS` in `src/data/movement-index.ts` (one line) and relationships to `movement-relations.ts`.
3. `npm run validate` checks unique ids, resolvable references, origin mapping, taxonomy ids, `part_of` cycles and duplicate relationship ids.
4. Promote an index record to a profile by writing it in `artists.ts` and putting `=artist-id` in the flags column of its row.
5. Run `npx tsx scripts/find-portraits.ts` then `node scripts/fetch-portraits.mjs` to look for verified portraits for new individuals.
6. The directories paginate, filter and search client-side; at several thousand records they would move to a server or a prebuilt search index without UI changes (all reads go through `lib/repo.ts`).

import type { Relationship, RelationType } from '@/types'

/**
 * Links from historical events to the works, artists and movements they touched. Every link carries the reason, in English and Greek;
 * nothing is linked merely because dates overlap. "depicts" means the work shows the event; "shaped_by" means the event is part
 * of the documented context of the work, artist or movement.
 */
type L = [from: string, type: RelationType, to: string, note: string, el: string]

const SCW = 'evt-spanish-civil-war', GER = 'evt-bombing-guernica', WW1 = 'evt-wwi', FR = 'evt-french-revolution', PEN = 'evt-peninsular-war', JUL = 'evt-july-revolution'
const MED = 'evt-wreck-medusa', IND = 'evt-industrial-revolution', RUS = 'evt-russian-revolution', MEX = 'evt-mexican-revolution', REF = 'evt-reformation'
const DEP = 'evt-great-depression', SJW = 'evt-sino-japanese-war', NOR = 'evt-norman-conquest'

const rows: L[] = [
  // Spanish Civil War and Guernica
  ['art-guernica', 'depicts', GER, 'Picasso painted it in response to the bombing of Gernika on 26 April 1937.', 'Ο Πικάσο το ζωγράφισε ως απάντηση στον βομβαρδισμό της Γκέρνικα στις 26 Απριλίου 1937.'],
  ['art-guernica', 'shaped_by', SCW, 'It was made for the Spanish Republic’s pavilion at the 1937 Paris Exposition, during the war.', 'Φιλοτεχνήθηκε για το περίπτερο της Ισπανικής Δημοκρατίας στην Έκθεση του Παρισιού το 1937, εν μέσω του πολέμου.'],
  ['artist-picasso', 'shaped_by', SCW, 'He made Guernica for the Republic’s pavilion and asked that it not go to Spain while Franco ruled.', 'Φιλοτέχνησε τη Γκουέρνικα για το περίπτερο της Δημοκρατίας και ζήτησε να μην πάει στην Ισπανία όσο κυβερνούσε ο Φράνκο.'],
  ['artist-picasso', 'shaped_by', GER, 'The newspaper reports of the bombing started the painting of Guernica in May 1937.', 'Οι εφημερίδες που ανέφεραν τον βομβαρδισμό ξεκίνησαν τη ζωγραφική της Γκουέρνικα τον Μάιο του 1937.'],
  ['artist-joan-miro', 'shaped_by', SCW, 'He painted the mural The Reaper (now lost) for the Republic’s pavilion in 1937.', 'Ζωγράφισε την τοιχογραφία Ο θεριστής (σήμερα χαμένη) για το περίπτερο της Δημοκρατίας το 1937.'],
  ['artist-salvador-dali', 'shaped_by', SCW, 'He painted Soft Construction with Boiled Beans (Premonition of Civil War) in 1936.', 'Ζωγράφισε το έργο Μαλακή κατασκευή με βραστά φασόλια (Προαίσθηση εμφυλίου πολέμου) το 1936.'],
  // First World War
  ['art-kathe-kollwitz-mourning-parents', 'shaped_by', WW1, 'The figures commemorate her son Peter, killed in 1914; they stand in the German war cemetery at Vladslo.', 'Οι μορφές τιμούν τον γιο της Πέτερ, που σκοτώθηκε το 1914· βρίσκονται στο γερμανικό στρατιωτικό νεκροταφείο του Βλάντσλο.'],
  ['artist-kathe-kollwitz', 'shaped_by', WW1, 'Her son Peter was killed in October 1914, and the loss shaped her later work.', 'Ο γιος της Πέτερ σκοτώθηκε τον Οκτώβριο του 1914 και η απώλεια σημάδεψε το μετέπειτα έργο της.'],
  ['artist-franz-marc', 'shaped_by', WW1, 'He was killed at Verdun in 1916.', 'Σκοτώθηκε στο Βερντέν το 1916.'],
  ['artist-august-macke', 'shaped_by', WW1, 'He was killed in the first weeks of the war, in September 1914.', 'Σκοτώθηκε τις πρώτες εβδομάδες του πολέμου, τον Σεπτέμβριο του 1914.'],
  ['artist-umberto-boccioni', 'shaped_by', WW1, 'He volunteered for the war and died in 1916 after a fall from a horse during military training.', 'Κατατάχθηκε εθελοντής και πέθανε το 1916 έπειτα από πτώση από άλογο σε στρατιωτική εκπαίδευση.'],
  ['artist-ernst-ludwig-kirchner', 'shaped_by', WW1, 'He volunteered in 1915, suffered a breakdown and was discharged.', 'Κατατάχθηκε εθελοντής το 1915, υπέστη νευρική κατάρρευση και απολύθηκε.'],
  ['artist-egon-schiele', 'shaped_by', WW1, 'He served in the Austrian army from 1915 and died in the 1918 influenza epidemic.', 'Υπηρέτησε στον αυστριακό στρατό από το 1915 και πέθανε στην επιδημία γρίπης του 1918.'],
  ['mov-dada', 'shaped_by', WW1, 'Dada began in neutral Zurich in 1916, partly as a protest against the war.', 'Ο Ντανταϊσμός ξεκίνησε στην ουδέτερη Ζυρίχη το 1916, εν μέρει ως διαμαρτυρία για τον πόλεμο.'],
  // French Revolution and the Napoleonic period
  ['artist-jacques-louis-david', 'shaped_by', FR, 'He became a leading painter of the Revolution and sat in its assembly.', 'Έγινε κορυφαίος ζωγράφος της Επανάστασης και συμμετείχε στη συνέλευσή της.'],
  ['art-elisabeth-vigee-le-brun-marie-antoinette-and-her-children', 'shaped_by', FR, 'A royal portrait of 1787; the artist left France in 1789, as the Revolution began.', 'Βασιλική προσωπογραφία του 1787· η ζωγράφος έφυγε από τη Γαλλία το 1789, όταν άρχισε η Επανάσταση.'],
  ['artist-elisabeth-vigee-le-brun', 'shaped_by', FR, 'As painter to Marie Antoinette she left France in 1789 and worked abroad for years.', 'Ως ζωγράφος της Μαρίας Αντουανέτας έφυγε από τη Γαλλία το 1789 και εργάστηκε χρόνια στο εξωτερικό.'],
  ['mov-neoclassicism', 'shaped_by', FR, 'Its severe, civic style became linked with revolutionary ideals, above all through David.', 'Το αυστηρό, πολιτικό ύφος του συνδέθηκε με τα επαναστατικά ιδεώδη, κυρίως μέσα από τον Νταβίντ.'],
  ['art-francisco-goya-the-third-of-may-1808', 'depicts', PEN, 'It shows French soldiers shooting Spanish prisoners in Madrid on the night of 3 May 1808.', 'Δείχνει Γάλλους στρατιώτες να εκτελούν Ισπανούς κρατούμενους στη Μαδρίτη τη νύχτα της 3ης Μαΐου 1808.'],
  ['artist-francisco-goya', 'shaped_by', PEN, 'He recorded the war in The Disasters of War and painted the May 1808 pictures in 1814.', 'Κατέγραψε τον πόλεμο στα Δεινά του πολέμου και ζωγράφισε τους πίνακες του Μαΐου 1808 το 1814.'],
  ['art-eugene-delacroix-liberty-leading-the-people', 'depicts', JUL, 'It shows the street fighting of the July Revolution of 1830.', 'Δείχνει τις οδομαχίες της Επανάστασης του Ιουλίου του 1830.'],
  ['artist-eugene-delacroix', 'shaped_by', JUL, 'He painted Liberty Leading the People in the autumn of 1830.', 'Ζωγράφισε την Ελευθερία οδηγεί τον λαό το φθινόπωρο του 1830.'],
  ['artist-honore-daumier', 'shaped_by', JUL, 'His satirical prints of the July Monarchy led to a prison sentence in 1832.', 'Τα σατιρικά χαρακτικά του για τη Μοναρχία του Ιουλίου του έφεραν ποινή φυλάκισης το 1832.'],
  ['art-theodore-gericault-the-raft-of-the-medusa', 'depicts', MED, 'It shows the survivors on the raft of the wrecked frigate Méduse.', 'Δείχνει τους επιζώντες πάνω στη σχεδία της ναυαγισμένης φρεγάτας Méduse.'],
  ['artist-theodore-gericault', 'shaped_by', MED, 'He researched the survivors’ accounts for The Raft of the Medusa (1819).', 'Μελέτησε τις μαρτυρίες των διασωθέντων για τη Σχεδία της Μεδούσας (1819).'],
  // Industrial Revolution
  ['art-j-m-w-turner-rain-steam-and-speed-the-great-western-railway', 'shaped_by', IND, 'It shows a steam locomotive on Brunel’s Great Western Railway bridge over the Thames.', 'Δείχνει μια ατμομηχανή στη γέφυρα του Μπρούνελ της Great Western Railway πάνω από τον Τάμεση.'],
  ['artist-j-m-w-turner', 'shaped_by', IND, 'Steam and railways became subjects of his late paintings.', 'Ο ατμός και οι σιδηρόδρομοι έγιναν θέματα των ύστερων πινάκων του.'],
  ['art-honore-daumier-the-third-class-carriage', 'shaped_by', IND, 'It shows poor passengers in a railway carriage, a new setting of the industrial age.', 'Δείχνει φτωχούς επιβάτες σε βαγόνι τρένου, ένα νέο σκηνικό της βιομηχανικής εποχής.'],
  ['mov-arts-and-crafts', 'shaped_by', IND, 'It was a reaction against machine-made goods and factory labour.', 'Ήταν αντίδραση στα βιομηχανικά προϊόντα και στην εργοστασιακή εργασία.'],
  ['artist-william-morris', 'shaped_by', IND, 'He promoted handcraft as an alternative to industrial production.', 'Προώθησε τη χειροτεχνία ως εναλλακτική στη βιομηχανική παραγωγή.'],
  // Russian and Mexican revolutions
  ['art-el-lissitzky-beat-the-whites-with-the-red-wedge', 'shaped_by', RUS, 'A 1919 propaganda poster for the Red Army in the civil war.', 'Αφίσα προπαγάνδας του 1919 για τον Κόκκινο Στρατό στον εμφύλιο.'],
  ['artist-el-lissitzky', 'shaped_by', RUS, 'He worked for the new Soviet state, designing posters, books and exhibitions.', 'Εργάστηκε για το νέο σοβιετικό κράτος, σχεδιάζοντας αφίσες, βιβλία και εκθέσεις.'],
  ['artist-alexander-rodchenko', 'shaped_by', RUS, 'He designed posters, books and photographs for the new state.', 'Σχεδίασε αφίσες, βιβλία και φωτογραφίες για το νέο κράτος.'],
  ['artist-lyubov-popova', 'shaped_by', RUS, 'After 1917 she turned to textile, theatre and book design for the new state.', 'Μετά το 1917 στράφηκε στο σχέδιο υφασμάτων, θεάτρου και βιβλίων για το νέο κράτος.'],
  ['mov-russian-constructivism', 'shaped_by', RUS, 'It aimed to put art to practical use in the new Soviet society.', 'Στόχευε να βάλει την τέχνη σε πρακτική χρήση στη νέα σοβιετική κοινωνία.'],
  ['mov-mexican-muralism', 'shaped_by', MEX, 'Its murals were commissioned by the post-revolutionary government to teach the nation’s history.', 'Οι τοιχογραφίες του παραγγέλθηκαν από την μετεπαναστατική κυβέρνηση για να διδάξουν την ιστορία του έθνους.'],
  ['artist-jose-clemente-orozco', 'shaped_by', MEX, 'He painted murals on the Revolution and its aftermath, in Mexico and the United States.', 'Ζωγράφισε τοιχογραφίες για την Επανάσταση και τις συνέπειές της, στο Μεξικό και στις ΗΠΑ.'],
  ['artist-diego-rivera', 'shaped_by', MEX, 'His state-commissioned murals told the history of Mexico after the Revolution.', 'Οι κρατικές τοιχογραφίες του αφηγήθηκαν την ιστορία του Μεξικού μετά την Επανάσταση.'],
  ['artist-david-alfaro-siqueiros', 'shaped_by', MEX, 'He fought in the Revolution and became a leading muralist.', 'Πολέμησε στην Επανάσταση και έγινε κορυφαίος τοιχογράφος.'],
  ['art-jose-clemente-orozco-the-epic-of-american-civilization', 'shaped_by', MEX, 'A mural cycle by a painter formed by the Mexican Revolution and its public-art programme.', 'Κύκλος τοιχογραφιών ζωγράφου που διαμορφώθηκε από τη Μεξικανική Επανάσταση και το πρόγραμμα δημόσιας τέχνης της.'],
  // Reformation
  ['art-hans-holbein-the-younger-the-ambassadors', 'shaped_by', REF, 'It includes a Lutheran hymnbook and a lute with a broken string, often read as signs of religious division.', 'Περιλαμβάνει ένα λουθηρανικό υμνολόγιο και ένα λαούτο με σπασμένη χορδή, που συχνά διαβάζονται ως σημεία θρησκευτικού διχασμού.'],
  ['artist-hans-holbein-the-younger', 'shaped_by', REF, 'He worked in Basel and England during the religious upheavals of the 1520s–40s.', 'Εργάστηκε στη Βασιλεία και στην Αγγλία κατά τις θρησκευτικές αναταραχές των δεκαετιών 1520–40.'],
  ['artist-lucas-cranach-the-elder', 'shaped_by', REF, 'A friend of Luther, he painted his portraits and made Reformation prints.', 'Φίλος του Λούθηρου, ζωγράφισε προσωπογραφίες του και έφτιαξε χαρακτικά της Μεταρρύθμισης.'],
  ['style-northern-renaissance', 'shaped_by', REF, 'The Reformation changed what churches commissioned and what private buyers wanted.', 'Η Μεταρρύθμιση άλλαξε το τι παράγγελναν οι εκκλησίες και τι ήθελαν οι ιδιώτες αγοραστές.'],
  ['style-dutch-golden-age', 'shaped_by', REF, 'Calvinist churches no longer wanted altarpieces, so painters turned to portraits, still lifes and landscapes.', 'Οι καλβινιστικές εκκλησίες δεν ήθελαν πια ιερά τέμπλα, και οι ζωγράφοι στράφηκαν σε προσωπογραφίες, νεκρές φύσεις και τοπία.'],
  // Existing events: now linked to works and artists
  ['art-night-watch', 'shaped_by', 'evt-dutch-revolt', 'It shows an Amsterdam civic militia company; such companies helped defend the city during the revolt against Spain.', 'Δείχνει μια πολιτοφυλακή του Άμστερνταμ· τέτοιες ομάδες βοήθησαν στην άμυνα της πόλης κατά την εξέγερση κατά της Ισπανίας.'],
  ['art-terracotta-army', 'shaped_by', 'evt-qin-unification', 'It was made for the tomb of the First Emperor, the ruler of the newly unified state.', 'Φτιάχτηκε για τον τάφο του Πρώτου Αυτοκράτορα, ηγεμόνα του πρόσφατα ενοποιημένου κράτους.'],
  ['art-benin-plaques', 'associated_with', 'evt-benin-1897', 'Many plaques were taken from the royal palace in 1897 and are now in museums abroad.', 'Πολλές πλάκες αφαιρέθηκαν από το βασιλικό ανάκτορο το 1897 και βρίσκονται σήμερα σε μουσεία του εξωτερικού.'],
  ['art-inka-tunic', 'associated_with', 'evt-cajamarca', 'The Spanish conquest ended the Inka state workshops that produced such tunics.', 'Η ισπανική κατάκτηση έβαλε τέλος στα κρατικά εργαστήρια των Ίνκας που παρήγαν τέτοιους χιτώνες.'],
  ['art-impression-sunrise', 'shaped_by', 'evt-paint-tube', 'Quick painting on the spot, as Impressionists did, was made practical by paint sold in tubes.', 'Η γρήγορη ζωγραφική επιτόπου, όπως την έκαναν οι Ιμπρεσιονιστές, έγινε πρακτική χάρη στα χρώματα σε σωληνάρια.'],
  ['art-gustave-caillebotte-paris-street-rainy-day', 'depicts', 'evt-haussmann', 'It shows a junction in the new Paris street plan laid out under Haussmann.', 'Δείχνει μια διασταύρωση στο νέο ρυμοτομικό σχέδιο του Παρισιού υπό τον Οσμάν.'],
  ['artist-gustave-caillebotte', 'shaped_by', 'evt-haussmann', 'His best-known paintings show the new boulevards and buildings of Haussmann’s Paris.', 'Οι πιο γνωστοί πίνακές του δείχνουν τις νέες λεωφόρους και τα κτίρια του Παρισιού του Οσμάν.'],
  // Great Depression, the Great Migration and the Second World War
  ['art-aspects-of-negro-life', 'shaped_by', DEP, 'Painted in 1934 for a New York library during the Depression-era federal arts programmes.', 'Ζωγραφίστηκαν το 1934 για βιβλιοθήκη της Νέας Υόρκης στο πλαίσιο των ομοσπονδιακών προγραμμάτων τέχνης της Ύφεσης.'],
  ['art-aspects-of-negro-life', 'shaped_by', 'evt-great-migration', 'The fourth panel looks at the move of Black Americans from the rural South to northern cities.', 'Το τέταρτο πάνελ αφορά τη μετακίνηση των Αφροαμερικανών από τον αγροτικό Νότο προς τις πόλεις του Βορρά.'],
  ['artist-douglas', 'shaped_by', DEP, 'He painted murals under the federal arts programmes of the 1930s.', 'Ζωγράφισε τοιχογραφίες στο πλαίσιο των ομοσπονδιακών προγραμμάτων τέχνης της δεκαετίας του 1930.'],
  ['artist-lawrence', 'shaped_by', 'evt-great-migration', 'His Migration Series (1940–41) tells the story of the Great Migration.', 'Η σειρά του Migration (1940–41) αφηγείται την ιστορία της Μεγάλης Μετανάστευσης.'],
  ['artist-pollock', 'shaped_by', DEP, 'He worked for the Federal Art Project of the Works Progress Administration from 1935.', 'Εργάστηκε για το Federal Art Project της Works Progress Administration από το 1935.'],
  ['artist-willem-de-kooning', 'shaped_by', DEP, 'He worked for the Federal Art Project in the mid-1930s.', 'Εργάστηκε για το Federal Art Project στα μέσα της δεκαετίας του 1930.'],
  ['artist-lee-krasner', 'shaped_by', DEP, 'She worked for the Federal Art Project in the 1930s.', 'Εργάστηκε για το Federal Art Project τη δεκαετία του 1930.'],
  ['artist-dorothea-lange', 'shaped_by', DEP, 'She photographed rural poverty for a federal agency in the 1930s.', 'Φωτογράφισε την αγροτική φτώχεια για μια ομοσπονδιακή υπηρεσία τη δεκαετία του 1930.'],
  ['artist-walker-evans', 'shaped_by', DEP, 'He photographed rural poverty for a federal agency in the 1930s.', 'Φωτογράφισε την αγροτική φτώχεια για μια ομοσπονδιακή υπηρεσία τη δεκαετία του 1930.'],
  ['art-piet-mondrian-broadway-boogie-woogie', 'shaped_by', 'evt-wwii', 'Painted in New York in 1942–43, after Mondrian left Europe because of the war.', 'Ζωγραφίστηκε στη Νέα Υόρκη το 1942–43, αφού ο Μοντριάν έφυγε από την Ευρώπη λόγω του πολέμου.'],
  ['artist-piet-mondrian', 'shaped_by', 'evt-wwii', 'He left Paris for London in 1938 and for New York in 1940.', 'Έφυγε από το Παρίσι για το Λονδίνο το 1938 και για τη Νέα Υόρκη το 1940.'],
  ['artist-max-ernst', 'shaped_by', 'evt-wwii', 'He reached the United States in 1941 and became part of the émigré circle in New York.', 'Έφτασε στις ΗΠΑ το 1941 και έγινε μέρος του κύκλου των μεταναστών στη Νέα Υόρκη.'],
  ['artist-marcel-duchamp', 'shaped_by', 'evt-wwii', 'He moved to New York in 1942 and joined the émigré artists there.', 'Μετακόμισε στη Νέα Υόρκη το 1942 και εντάχθηκε στους μετανάστες καλλιτέχνες εκεί.'],
  ['mov-abstract-expressionism', 'shaped_by', DEP, 'Several of its leading painters were first paid as artists by the federal arts programmes.', 'Αρκετοί από τους κορυφαίους ζωγράφους του πληρώθηκαν για πρώτη φορά ως καλλιτέχνες από τα ομοσπονδιακά προγράμματα τέχνης.'],
  // Works added later
  ['art-jacques-louis-david-the-death-of-marat', 'depicts', FR, 'It shows the revolutionary journalist Jean-Paul Marat after his assassination in 1793, painted as a memorial of the Revolution.', 'Δείχνει τον επαναστάτη δημοσιογράφο Ζαν-Πολ Μαρά μετά τη δολοφονία του το 1793, ζωγραφισμένο ως μνημείο της Επανάστασης.'],
  ['art-jacques-louis-david-the-oath-of-the-horatii', 'shaped_by', FR, 'Painted in 1784, it was read as a call for civic duty above private feeling, and became linked with the revolutionary generation.', 'Ζωγραφίστηκε το 1784 και διαβάστηκε ως κάλεσμα για πολιτικό καθήκον πάνω από το προσωπικό συναίσθημα· συνδέθηκε με την επαναστατική γενιά.'],
  ['art-diego-velazquez-the-surrender-of-breda', 'depicts', 'evt-dutch-revolt', 'It shows the surrender of the Dutch city of Breda to Spain in 1625, during the Eighty Years’ War.', 'Δείχνει την παράδοση της ολλανδικής πόλης Μπρέντα στην Ισπανία το 1625, κατά τον Ογδοηκονταετή Πόλεμο.'],
  ['art-michelangelo-buonarroti-the-last-judgment', 'shaped_by', REF, 'Painted in 1536–41, in the years of the Reformation; after the Council of Trent parts of its nudity were covered.', 'Ζωγραφίστηκε το 1536–41, στα χρόνια της Μεταρρύθμισης· μετά τη Σύνοδο του Τριδέντου καλύφθηκε μέρος της γύμνιας.'],
  ['art-bayeux-tapestry', 'depicts', NOR, 'It tells the story of the conquest of 1066, from the Norman side.', 'Αφηγείται την ιστορία της κατάκτησης του 1066, από τη νορμανδική πλευρά.'],
  // Second Sino-Japanese War
  ['art-xu-beihong-put-down-your-whip', 'shaped_by', SJW, 'Painted in 1939 in support of the Chinese resistance to Japan.', 'Ζωγραφίστηκε το 1939 υπέρ της κινεζικής αντίστασης στην Ιαπωνία.'],
  ['artist-xu-beihong', 'shaped_by', SJW, 'He raised money for war relief with exhibitions abroad.', 'Συγκέντρωσε χρήματα για την ανακούφιση του πολέμου με εκθέσεις στο εξωτερικό.'],
]

export const eventLinks: Relationship[] = rows.map(([from, type, to, note], i) => ({ id: `rel-ev-${String(i + 1).padStart(3, '0')}`, type, from, to, note }))
export const eventLinksEl: Record<string, { note: string }> = Object.fromEntries(rows.map(([, , , , el], i) => [`rel-ev-${String(i + 1).padStart(3, '0')}`, { note: el }]))

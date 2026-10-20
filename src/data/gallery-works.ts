import credits from './image-credits.json'
import { localImage } from '@/lib/localImages'
import type { Artwork, Relationship } from '@/types'
import { artist, artwork } from './helpers'

type Credit = { file: string; credit: string; licence: string; page: string; ratio?: number }

/**
 * Works supplied by the project owner from a design file (Monet, Gauguin, Hopper).
 * Titles, dates and collections that could not be confirmed from the images alone are marked "to be verified".
 */
const base: Artwork[] = ([
  {
    "id": "art-monet-train-countryside",
    "title": "The Train in the Countryside",
    "attribution": "Claude Monet",
    "dateDisplay": "c. 1870 – 1871",
    "dates": {
      "start": 1870,
      "end": 1871,
      "approx": true,
      "label": "c. 1870 – 1871"
    },
    "summary": "A painting by Claude Monet.",
    "regions": [
      "europe"
    ],
    "medium": "Oil on canvas",
    "mediums": [
      "Oil paint",
      "Canvas"
    ],
    "techniques": [],
    "location": "Musée d’Orsay, Paris",
    "originPlace": "France",
    "image": {
      "ratio": 1.33,
      "alt": "A green meadow and a belt of trees, with a thin line of train smoke crossing the background and tiny figures walking in the grass.",
      "credit": "",
      "licence": ""
    },
    "description": "A green meadow and a belt of trees, with a thin line of train smoke crossing the background and tiny figures walking in the grass.",
    "context": [],
    "analysis": [],
    "periods": [
      "per-era-modern"
    ],
    "tags": [
      "painting",
      "oil painting"
    ]
  },
  {
    "id": "art-monet-chrysanthemums",
    "title": "Chrysanthemums",
    "attribution": "Claude Monet",
    "dateDisplay": "1897",
    "dates": {
      "start": 1897,
      "approx": false,
      "label": "1897"
    },
    "summary": "A painting by Claude Monet.",
    "regions": [
      "europe"
    ],
    "medium": "Oil on canvas",
    "mediums": [
      "Oil paint",
      "Canvas"
    ],
    "techniques": [],
    "location": "Collection to be verified",
    "originPlace": "France",
    "image": {
      "ratio": 0.672,
      "alt": "A close-cropped mass of red, white, pink and yellow chrysanthemum blooms filling the whole canvas.",
      "credit": "",
      "licence": ""
    },
    "description": "A close-cropped mass of red, white, pink and yellow chrysanthemum blooms filling the whole canvas.",
    "context": [],
    "analysis": [],
    "periods": [
      "per-era-modern"
    ],
    "tags": [
      "painting",
      "oil painting"
    ]
  },
  {
    "id": "art-monet-suzanne-sunflowers",
    "title": "Suzanne Hoschedé with Sunflowers",
    "attribution": "Claude Monet",
    "dateDisplay": "1890",
    "dates": {
      "start": 1890,
      "approx": false,
      "label": "1890"
    },
    "summary": "A painting by Claude Monet.",
    "regions": [
      "europe"
    ],
    "medium": "Oil on canvas",
    "mediums": [
      "Oil paint",
      "Canvas"
    ],
    "techniques": [],
    "location": "Collection to be verified",
    "originPlace": "France",
    "image": {
      "ratio": 0.66,
      "alt": "A young woman in a lilac dress sits at a small table with her chin on her hand, with a vase of tall sunflowers rising above her head.",
      "credit": "",
      "licence": ""
    },
    "description": "A young woman in a lilac dress sits at a small table with her chin on her hand, with a vase of tall sunflowers rising above her head.",
    "context": [],
    "analysis": [],
    "periods": [
      "per-era-modern"
    ],
    "tags": [
      "painting",
      "oil painting"
    ]
  },
  {
    "id": "art-monet-poppy-field",
    "title": "Poppy Field near Giverny",
    "attribution": "Claude Monet",
    "dateDisplay": "c. 1890",
    "dates": {
      "start": 1890,
      "approx": true,
      "label": "c. 1890"
    },
    "summary": "A painting by Claude Monet.",
    "regions": [
      "europe"
    ],
    "medium": "Oil on canvas",
    "mediums": [
      "Oil paint",
      "Canvas"
    ],
    "techniques": [],
    "location": "Collection to be verified",
    "originPlace": "France",
    "image": {
      "ratio": 1.415,
      "alt": "A field of red poppies below a row of blue-violet trees under a pale, cloudy sky.",
      "credit": "",
      "licence": ""
    },
    "description": "A field of red poppies below a row of blue-violet trees under a pale, cloudy sky.",
    "context": [],
    "analysis": [],
    "periods": [
      "per-era-modern"
    ],
    "tags": [
      "painting",
      "oil painting"
    ]
  },
  {
    "id": "art-monet-grainstacks-hoarfrost",
    "title": "Grainstacks, Hoarfrost",
    "attribution": "Claude Monet",
    "dateDisplay": "c. 1889",
    "dates": {
      "start": 1889,
      "approx": true,
      "label": "c. 1889"
    },
    "summary": "A painting by Claude Monet.",
    "regions": [
      "europe"
    ],
    "medium": "Oil on canvas",
    "mediums": [
      "Oil paint",
      "Canvas"
    ],
    "techniques": [],
    "location": "Collection to be verified",
    "originPlace": "France",
    "image": {
      "ratio": 1.399,
      "alt": "Two haystacks in a frosty field, glowing in pink and orange against a pale lilac, misty hillside.",
      "credit": "",
      "licence": ""
    },
    "description": "Two haystacks in a frosty field, glowing in pink and orange against a pale lilac, misty hillside.",
    "context": [],
    "analysis": [],
    "periods": [
      "per-era-modern"
    ],
    "tags": [
      "painting",
      "oil painting"
    ]
  },
  {
    "id": "art-monet-rose-path",
    "title": "The Rose Path, Giverny",
    "attribution": "Claude Monet",
    "dateDisplay": "c. 1920 – 1922",
    "dates": {
      "start": 1920,
      "end": 1922,
      "approx": true,
      "label": "c. 1920 – 1922"
    },
    "summary": "A painting by Claude Monet.",
    "regions": [
      "europe"
    ],
    "medium": "Oil on canvas",
    "mediums": [
      "Oil paint",
      "Canvas"
    ],
    "techniques": [],
    "location": "Musée Marmottan Monet, Paris",
    "originPlace": "France",
    "image": {
      "ratio": 1.04,
      "alt": "A path running between flower beds and a tunnel of foliage, dappled with sunlight and loosely painted in warm pinks, greens and violets.",
      "credit": "",
      "licence": ""
    },
    "description": "A path running between flower beds and a tunnel of foliage, dappled with sunlight and loosely painted in warm pinks, greens and violets.",
    "context": [],
    "analysis": [],
    "periods": [
      "per-era-modern"
    ],
    "tags": [
      "painting",
      "oil painting"
    ]
  },
  {
    "id": "art-monet-seine-autumn",
    "title": "Autumn on the Seine",
    "attribution": "Claude Monet",
    "dateDisplay": "Date to be verified",
    "dates": {
      "start": 1884,
      "approx": true,
      "label": "Date to be verified"
    },
    "summary": "A painting by Claude Monet.",
    "regions": [
      "europe"
    ],
    "medium": "Oil on canvas",
    "mediums": [
      "Oil paint",
      "Canvas"
    ],
    "techniques": [],
    "location": "Collection to be verified",
    "originPlace": "France",
    "image": {
      "ratio": 1.364,
      "alt": "A bend of the river reflecting orange and pink autumn trees, with blue hills behind and bright grass in the foreground.",
      "credit": "",
      "licence": ""
    },
    "description": "A bend of the river reflecting orange and pink autumn trees, with blue hills behind and bright grass in the foreground.",
    "context": [],
    "analysis": [],
    "periods": [
      "per-era-modern"
    ],
    "tags": [
      "painting",
      "oil painting"
    ],
    "status": {
      "level": "sample",
      "note": "Identified from a supplied image: the title, date and collection are to be verified before publication."
    }
  },
  {
    "id": "art-monet-autumn-wood",
    "title": "Path through an Autumn Wood",
    "attribution": "Claude Monet",
    "dateDisplay": "Date to be verified",
    "dates": {
      "start": 1881,
      "approx": true,
      "label": "Date to be verified"
    },
    "summary": "A painting by Claude Monet.",
    "regions": [
      "europe"
    ],
    "medium": "Oil on canvas",
    "mediums": [
      "Oil paint",
      "Canvas"
    ],
    "techniques": [],
    "location": "Collection to be verified",
    "originPlace": "France",
    "image": {
      "ratio": 0.787,
      "alt": "A tunnel of golden and green trees over a path strewn with orange leaves.",
      "credit": "",
      "licence": ""
    },
    "description": "A tunnel of golden and green trees over a path strewn with orange leaves.",
    "context": [],
    "analysis": [],
    "periods": [
      "per-era-modern"
    ],
    "tags": [
      "painting",
      "oil painting"
    ],
    "status": {
      "level": "sample",
      "note": "Identified from a supplied image: the title, date and collection are to be verified before publication."
    }
  },
  {
    "id": "art-monet-mediterranean-coast",
    "title": "Mediterranean Coast",
    "attribution": "Claude Monet",
    "dateDisplay": "Date to be verified",
    "dates": {
      "start": 1888,
      "approx": true,
      "label": "Date to be verified"
    },
    "summary": "A painting by Claude Monet.",
    "regions": [
      "europe"
    ],
    "medium": "Oil on canvas",
    "mediums": [
      "Oil paint",
      "Canvas"
    ],
    "techniques": [],
    "location": "Collection to be verified",
    "originPlace": "France",
    "image": {
      "ratio": 1.238,
      "alt": "A sunny bay with a bushy, yellow-green hillside in the foreground, turquoise water and a distant blue horizon.",
      "credit": "",
      "licence": ""
    },
    "description": "A sunny bay with a bushy, yellow-green hillside in the foreground, turquoise water and a distant blue horizon.",
    "context": [],
    "analysis": [],
    "periods": [
      "per-era-modern"
    ],
    "tags": [
      "painting",
      "oil painting"
    ],
    "status": {
      "level": "sample",
      "note": "Identified from a supplied image: the title, date and collection are to be verified before publication."
    }
  },
  {
    "id": "art-monet-water-lilies-vertical",
    "title": "Water Lilies",
    "attribution": "Claude Monet",
    "dateDisplay": "Date to be verified",
    "dates": {
      "start": 1916,
      "approx": true,
      "label": "Date to be verified"
    },
    "summary": "A painting by Claude Monet.",
    "regions": [
      "europe"
    ],
    "medium": "Oil on canvas",
    "mediums": [
      "Oil paint",
      "Canvas"
    ],
    "techniques": [],
    "location": "Collection to be verified",
    "originPlace": "France",
    "image": {
      "ratio": 0.713,
      "alt": "A tall view of a pond surface in blues and violets, with pale lily pads and pink blooms among vertical reflections.",
      "credit": "",
      "licence": ""
    },
    "description": "A tall view of a pond surface in blues and violets, with pale lily pads and pink blooms among vertical reflections.",
    "context": [],
    "analysis": [],
    "periods": [
      "per-era-modern"
    ],
    "tags": [
      "painting",
      "oil painting"
    ],
    "status": {
      "level": "sample",
      "note": "Identified from a supplied image: the title, date and collection are to be verified before publication."
    }
  },
  {
    "id": "art-monet-willow-lily-pond",
    "title": "Water Lily Pond with Willow",
    "attribution": "Claude Monet",
    "dateDisplay": "Date to be verified",
    "dates": {
      "start": 1916,
      "approx": true,
      "label": "Date to be verified"
    },
    "summary": "A painting by Claude Monet.",
    "regions": [
      "europe"
    ],
    "medium": "Oil on canvas",
    "mediums": [
      "Oil paint",
      "Canvas"
    ],
    "techniques": [],
    "location": "Collection to be verified",
    "originPlace": "France",
    "image": {
      "ratio": 0.673,
      "alt": "Hanging willow branches over a pond, with yellow-green lily pads in the foreground and deep blue-green shade.",
      "credit": "",
      "licence": ""
    },
    "description": "Hanging willow branches over a pond, with yellow-green lily pads in the foreground and deep blue-green shade.",
    "context": [],
    "analysis": [],
    "periods": [
      "per-era-modern"
    ],
    "tags": [
      "painting",
      "oil painting"
    ],
    "status": {
      "level": "sample",
      "note": "Identified from a supplied image: the title, date and collection are to be verified before publication."
    }
  },
  {
    "id": "art-monet-children-meadow",
    "title": "Children in a Meadow, Giverny",
    "attribution": "Claude Monet",
    "dateDisplay": "Date to be verified",
    "dates": {
      "start": 1888,
      "approx": true,
      "label": "Date to be verified"
    },
    "summary": "A painting by Claude Monet.",
    "regions": [
      "europe"
    ],
    "medium": "Oil on canvas",
    "mediums": [
      "Oil paint",
      "Canvas"
    ],
    "techniques": [],
    "location": "Collection to be verified",
    "originPlace": "France",
    "image": {
      "ratio": 1.24,
      "alt": "Three children in straw hats stand in a sunlit meadow, with two small figures walking far behind them under golden trees.",
      "credit": "",
      "licence": ""
    },
    "description": "Three children in straw hats stand in a sunlit meadow, with two small figures walking far behind them under golden trees.",
    "context": [],
    "analysis": [],
    "periods": [
      "per-era-modern"
    ],
    "tags": [
      "painting",
      "oil painting"
    ],
    "status": {
      "level": "sample",
      "note": "Identified from a supplied image: the title, date and collection are to be verified before publication."
    }
  },
  {
    "id": "art-gauguin-still-life-puppies",
    "title": "Still Life with Three Puppies",
    "attribution": "Paul Gauguin",
    "dateDisplay": "1888",
    "dates": {
      "start": 1888,
      "approx": false,
      "label": "1888"
    },
    "summary": "A painting by Paul Gauguin.",
    "regions": [
      "europe"
    ],
    "medium": "Oil on canvas",
    "mediums": [
      "Oil paint",
      "Canvas"
    ],
    "techniques": [],
    "location": "Museum of Modern Art, New York",
    "originPlace": "France",
    "image": {
      "ratio": 0.69,
      "alt": "Three small puppies drink from a bowl at the top of a tilted table, above a row of goblets and a plate of fruit, on a patterned ground.",
      "credit": "",
      "licence": ""
    },
    "description": "Three small puppies drink from a bowl at the top of a tilted table, above a row of goblets and a plate of fruit, on a patterned ground.",
    "context": [],
    "analysis": [],
    "periods": [
      "per-era-modern"
    ],
    "tags": [
      "painting",
      "oil painting"
    ]
  },
  {
    "id": "art-gauguin-tahitian-landscape",
    "title": "Tahitian Landscape",
    "attribution": "Paul Gauguin",
    "dateDisplay": "c. 1891",
    "dates": {
      "start": 1891,
      "approx": true,
      "label": "c. 1891"
    },
    "summary": "A painting by Paul Gauguin.",
    "regions": [
      "oceania"
    ],
    "medium": "Oil on canvas",
    "mediums": [
      "Oil paint",
      "Canvas"
    ],
    "techniques": [],
    "location": "Collection to be verified",
    "originPlace": "Tahiti, French Polynesia",
    "image": {
      "ratio": 0.785,
      "alt": "A slender tree rises over a red-earth path and dense green foliage, with blue sea and hills in the distance.",
      "credit": "",
      "licence": ""
    },
    "description": "A slender tree rises over a red-earth path and dense green foliage, with blue sea and hills in the distance.",
    "context": [],
    "analysis": [],
    "periods": [
      "per-era-modern"
    ],
    "tags": [
      "painting",
      "oil painting"
    ],
    "status": {
      "level": "sample",
      "note": "Identified from a supplied image: the title, date and collection are to be verified before publication."
    }
  },
  {
    "id": "art-gauguin-vision-after-the-sermon",
    "title": "The Vision after the Sermon (Jacob Wrestling with the Angel)",
    "attribution": "Paul Gauguin",
    "dateDisplay": "1888",
    "dates": {
      "start": 1888,
      "approx": false,
      "label": "1888"
    },
    "summary": "A painting by Paul Gauguin.",
    "regions": [
      "europe"
    ],
    "medium": "Oil on canvas",
    "mediums": [
      "Oil paint",
      "Canvas"
    ],
    "techniques": [],
    "location": "National Galleries of Scotland, Edinburgh",
    "originPlace": "Brittany, France",
    "image": {
      "ratio": 1.256,
      "alt": "Breton women in white caps pray in the foreground, while Jacob and the angel wrestle on a flat field of vivid red, divided by a diagonal tree trunk.",
      "credit": "",
      "licence": ""
    },
    "description": "Breton women in white caps pray in the foreground, while Jacob and the angel wrestle on a flat field of vivid red, divided by a diagonal tree trunk.",
    "context": [],
    "analysis": [],
    "periods": [
      "per-era-modern"
    ],
    "tags": [
      "painting",
      "oil painting"
    ]
  },
  {
    "id": "art-gauguin-tahitian-women-beach",
    "title": "Tahitian Women on the Beach",
    "attribution": "Paul Gauguin",
    "dateDisplay": "1891",
    "dates": {
      "start": 1891,
      "approx": false,
      "label": "1891"
    },
    "summary": "A painting by Paul Gauguin.",
    "regions": [
      "oceania"
    ],
    "medium": "Oil on canvas",
    "mediums": [
      "Oil paint",
      "Canvas"
    ],
    "techniques": [],
    "location": "Musée d’Orsay, Paris",
    "originPlace": "Tahiti, French Polynesia",
    "image": {
      "ratio": 1.332,
      "alt": "Two Tahitian women sit on yellow sand, one in a pink dress and one in a red patterned skirt, in front of a dark band of sea.",
      "credit": "",
      "licence": ""
    },
    "description": "Two Tahitian women sit on yellow sand, one in a pink dress and one in a red patterned skirt, in front of a dark band of sea.",
    "context": [],
    "analysis": [],
    "periods": [
      "per-era-modern"
    ],
    "tags": [
      "painting",
      "oil painting"
    ]
  },
  {
    "id": "art-gauguin-hut-with-livestock",
    "title": "Tahitian Hut with Palms and Livestock",
    "attribution": "Paul Gauguin",
    "dateDisplay": "Date to be verified",
    "dates": {
      "start": 1892,
      "approx": true,
      "label": "Date to be verified"
    },
    "summary": "A painting by Paul Gauguin.",
    "regions": [
      "oceania"
    ],
    "medium": "Oil on canvas",
    "mediums": [
      "Oil paint",
      "Canvas"
    ],
    "techniques": [],
    "location": "Collection to be verified",
    "originPlace": "Tahiti, French Polynesia",
    "image": {
      "ratio": 0.782,
      "alt": "A thatched hut under palms, with a brown cow, a black pig and a seated woman in a bright green and violet clearing.",
      "credit": "",
      "licence": ""
    },
    "description": "A thatched hut under palms, with a brown cow, a black pig and a seated woman in a bright green and violet clearing.",
    "context": [],
    "analysis": [],
    "periods": [
      "per-era-modern"
    ],
    "tags": [
      "painting",
      "oil painting"
    ],
    "status": {
      "level": "sample",
      "note": "Identified from a supplied image: the title, date and collection are to be verified before publication."
    }
  },
  {
    "id": "art-gauguin-village-road",
    "title": "Tahitian Village Road",
    "attribution": "Paul Gauguin",
    "dateDisplay": "Date to be verified",
    "dates": {
      "start": 1892,
      "approx": true,
      "label": "Date to be verified"
    },
    "summary": "A painting by Paul Gauguin.",
    "regions": [
      "oceania"
    ],
    "medium": "Oil on canvas",
    "mediums": [
      "Oil paint",
      "Canvas"
    ],
    "techniques": [],
    "location": "Collection to be verified",
    "originPlace": "Tahiti, French Polynesia",
    "image": {
      "ratio": 0.755,
      "alt": "A red-and-green path leads between thatched huts toward violet mountains and a yellow banana plant.",
      "credit": "",
      "licence": ""
    },
    "description": "A red-and-green path leads between thatched huts toward violet mountains and a yellow banana plant.",
    "context": [],
    "analysis": [],
    "periods": [
      "per-era-modern"
    ],
    "tags": [
      "painting",
      "oil painting"
    ],
    "status": {
      "level": "sample",
      "note": "Identified from a supplied image: the title, date and collection are to be verified before publication."
    }
  },
  {
    "id": "art-gauguin-seed-of-the-areoi",
    "title": "The Seed of the Areoi (Te aa no areois)",
    "attribution": "Paul Gauguin",
    "dateDisplay": "1892",
    "dates": {
      "start": 1892,
      "approx": false,
      "label": "1892"
    },
    "summary": "A painting by Paul Gauguin.",
    "regions": [
      "oceania"
    ],
    "medium": "Oil on canvas",
    "mediums": [
      "Oil paint",
      "Canvas"
    ],
    "techniques": [],
    "location": "Museum of Modern Art, New York",
    "originPlace": "Tahiti, French Polynesia",
    "image": {
      "ratio": 0.792,
      "alt": "A seated Tahitian woman holds a flower on a dark blue patterned cloth, before a bank of pink blossom and violet mountains, with a bowl of fruit at her feet.",
      "credit": "",
      "licence": ""
    },
    "description": "A seated Tahitian woman holds a flower on a dark blue patterned cloth, before a bank of pink blossom and violet mountains, with a bowl of fruit at her feet.",
    "context": [],
    "analysis": [],
    "periods": [
      "per-era-modern"
    ],
    "tags": [
      "painting",
      "oil painting"
    ]
  },
  {
    "id": "art-gauguin-matamoe",
    "title": "Matamoe (Landscape with Peacocks)",
    "attribution": "Paul Gauguin",
    "dateDisplay": "1892",
    "dates": {
      "start": 1892,
      "approx": false,
      "label": "1892"
    },
    "summary": "A painting by Paul Gauguin.",
    "regions": [
      "oceania"
    ],
    "medium": "Oil on canvas",
    "mediums": [
      "Oil paint",
      "Canvas"
    ],
    "techniques": [],
    "location": "Pushkin Museum of Fine Arts, Moscow",
    "originPlace": "Tahiti, French Polynesia",
    "image": {
      "ratio": 0.738,
      "alt": "A tropical landscape of orange and green foliage, with a peacock in the foreground, a small figure in the middle distance and a red-roofed building beyond.",
      "credit": "",
      "licence": ""
    },
    "description": "A tropical landscape of orange and green foliage, with a peacock in the foreground, a small figure in the middle distance and a red-roofed building beyond.",
    "context": [],
    "analysis": [],
    "periods": [
      "per-era-modern"
    ],
    "tags": [
      "painting",
      "oil painting"
    ]
  },
  {
    "id": "art-gauguin-parau-api",
    "title": "What News? (Parau api)",
    "attribution": "Paul Gauguin",
    "dateDisplay": "1892",
    "dates": {
      "start": 1892,
      "approx": false,
      "label": "1892"
    },
    "summary": "A painting by Paul Gauguin.",
    "regions": [
      "oceania"
    ],
    "medium": "Oil on canvas",
    "mediums": [
      "Oil paint",
      "Canvas"
    ],
    "techniques": [],
    "location": "Gemäldegalerie Neue Meister, Dresden",
    "originPlace": "Tahiti, French Polynesia",
    "image": {
      "ratio": 1.371,
      "alt": "Two Tahitian women sit close together on a warm yellow ground, one in a red floral dress and one wrapped in a black and orange cloth, with green fruit at the front.",
      "credit": "",
      "licence": ""
    },
    "description": "Two Tahitian women sit close together on a warm yellow ground, one in a red floral dress and one wrapped in a black and orange cloth, with green fruit at the front.",
    "context": [],
    "analysis": [],
    "periods": [
      "per-era-modern"
    ],
    "tags": [
      "painting",
      "oil painting"
    ],
    "status": {
      "level": "sample",
      "note": "Identified from a supplied image: the title, date and collection are to be verified before publication."
    }
  },
  {
    "id": "art-gauguin-palms-red-ground",
    "title": "Tahitian Landscape with Palms",
    "attribution": "Paul Gauguin",
    "dateDisplay": "Date to be verified",
    "dates": {
      "start": 1892,
      "approx": true,
      "label": "Date to be verified"
    },
    "summary": "A painting by Paul Gauguin.",
    "regions": [
      "oceania"
    ],
    "medium": "Oil on canvas",
    "mediums": [
      "Oil paint",
      "Canvas"
    ],
    "techniques": [],
    "location": "Collection to be verified",
    "originPlace": "Tahiti, French Polynesia",
    "image": {
      "ratio": 0.777,
      "alt": "Two small seated figures on a field of red earth and curling orange roots, with a row of palm trees and a pale sky behind.",
      "credit": "",
      "licence": ""
    },
    "description": "Two small seated figures on a field of red earth and curling orange roots, with a row of palm trees and a pale sky behind.",
    "context": [],
    "analysis": [],
    "periods": [
      "per-era-modern"
    ],
    "tags": [
      "painting",
      "oil painting"
    ],
    "status": {
      "level": "sample",
      "note": "Identified from a supplied image: the title, date and collection are to be verified before publication."
    }
  },
  {
    "id": "art-gauguin-women-by-the-pond",
    "title": "Women by a Pond",
    "attribution": "Paul Gauguin",
    "dateDisplay": "Date to be verified",
    "dates": {
      "start": 1892,
      "approx": true,
      "label": "Date to be verified"
    },
    "summary": "A painting by Paul Gauguin.",
    "regions": [
      "oceania"
    ],
    "medium": "Oil on canvas",
    "mediums": [
      "Oil paint",
      "Canvas"
    ],
    "techniques": [],
    "location": "Collection to be verified",
    "originPlace": "Tahiti, French Polynesia",
    "image": {
      "ratio": 1.252,
      "alt": "Figures gather by a still pond among pink rocks and tall dark trees, with reflections of pale clouds and a black bird in the foreground.",
      "credit": "",
      "licence": ""
    },
    "description": "Figures gather by a still pond among pink rocks and tall dark trees, with reflections of pale clouds and a black bird in the foreground.",
    "context": [],
    "analysis": [],
    "periods": [
      "per-era-modern"
    ],
    "tags": [
      "painting",
      "oil painting"
    ],
    "status": {
      "level": "sample",
      "note": "Identified from a supplied image: the title, date and collection are to be verified before publication."
    }
  },
  {
    "id": "art-gauguin-tree-trunk-scene",
    "title": "Tahitian Scene with a Tree Trunk",
    "attribution": "Paul Gauguin",
    "dateDisplay": "Date to be verified",
    "dates": {
      "start": 1892,
      "approx": true,
      "label": "Date to be verified"
    },
    "summary": "A painting by Paul Gauguin.",
    "regions": [
      "oceania"
    ],
    "medium": "Oil on canvas",
    "mediums": [
      "Oil paint",
      "Canvas"
    ],
    "techniques": [],
    "location": "Collection to be verified",
    "originPlace": "Tahiti, French Polynesia",
    "image": {
      "ratio": 0.725,
      "alt": "A tall dark tree trunk divides the picture; two women sit on the ground at the lower left, with violet mountains and orange foliage behind.",
      "credit": "",
      "licence": ""
    },
    "description": "A tall dark tree trunk divides the picture; two women sit on the ground at the lower left, with violet mountains and orange foliage behind.",
    "context": [],
    "analysis": [],
    "periods": [
      "per-era-modern"
    ],
    "tags": [
      "painting",
      "oil painting"
    ],
    "status": {
      "level": "sample",
      "note": "Identified from a supplied image: the title, date and collection are to be verified before publication."
    }
  },
  {
    "id": "art-gauguin-arearea-no-varua-ino",
    "title": "Arearea no varua ino (Amusement of the Evil Spirit)",
    "attribution": "Paul Gauguin",
    "dateDisplay": "1894",
    "dates": {
      "start": 1894,
      "approx": false,
      "label": "1894"
    },
    "summary": "A painting by Paul Gauguin.",
    "regions": [
      "oceania"
    ],
    "medium": "Oil on canvas",
    "mediums": [
      "Oil paint",
      "Canvas"
    ],
    "techniques": [],
    "location": "Ny Carlsberg Glyptotek, Copenhagen",
    "originPlace": "Tahiti, French Polynesia",
    "image": {
      "ratio": 1.63,
      "alt": "Two Tahitian women lie and sit on a white and violet ground beside a large tree trunk, with a carved figure at upper left and small dancing figures in the distance.",
      "credit": "",
      "licence": ""
    },
    "description": "Two Tahitian women lie and sit on a white and violet ground beside a large tree trunk, with a carved figure at upper left and small dancing figures in the distance.",
    "context": [],
    "analysis": [],
    "periods": [
      "per-era-modern"
    ],
    "tags": [
      "painting",
      "oil painting"
    ]
  },
  {
    "id": "art-gauguin-day-of-the-god",
    "title": "The Day of the God (Mahana no atua)",
    "attribution": "Paul Gauguin",
    "dateDisplay": "1894",
    "dates": {
      "start": 1894,
      "approx": false,
      "label": "1894"
    },
    "summary": "A painting by Paul Gauguin.",
    "regions": [
      "oceania"
    ],
    "medium": "Oil on canvas",
    "mediums": [
      "Oil paint",
      "Canvas"
    ],
    "techniques": [],
    "location": "Art Institute of Chicago",
    "originPlace": "Tahiti, French Polynesia",
    "image": {
      "ratio": 1.356,
      "alt": "A carved idol with a halo of dark forms looks over a beach, with a sinuous shoreline in pink, orange and violet and bathers in the foreground.",
      "credit": "",
      "licence": ""
    },
    "description": "A carved idol with a halo of dark forms looks over a beach, with a sinuous shoreline in pink, orange and violet and bathers in the foreground.",
    "context": [],
    "analysis": [],
    "periods": [
      "per-era-modern"
    ],
    "tags": [
      "painting",
      "oil painting"
    ]
  },
  {
    "id": "art-gauguin-nave-nave-mahana",
    "title": "Delightful Day (Nave Nave Mahana)",
    "attribution": "Paul Gauguin",
    "dateDisplay": "1896",
    "dates": {
      "start": 1896,
      "approx": false,
      "label": "1896"
    },
    "summary": "A painting by Paul Gauguin.",
    "regions": [
      "oceania"
    ],
    "medium": "Oil on canvas",
    "mediums": [
      "Oil paint",
      "Canvas"
    ],
    "techniques": [],
    "location": "Musée des Beaux-Arts de Lyon",
    "originPlace": "Tahiti, French Polynesia",
    "image": {
      "ratio": 1.346,
      "alt": "Two women sit side by side in a pink-and-orange landscape, one resting her cheek on her hand, with figures bathing and walking in the background.",
      "credit": "",
      "licence": ""
    },
    "description": "Two women sit side by side in a pink-and-orange landscape, one resting her cheek on her hand, with figures bathing and walking in the background.",
    "context": [],
    "analysis": [],
    "periods": [
      "per-era-modern"
    ],
    "tags": [
      "painting",
      "oil painting"
    ]
  },
  {
    "id": "art-gauguin-three-women-shore",
    "title": "Three Women by the Shore",
    "attribution": "Paul Gauguin",
    "dateDisplay": "Date to be verified",
    "dates": {
      "start": 1892,
      "approx": true,
      "label": "Date to be verified"
    },
    "summary": "A painting by Paul Gauguin.",
    "regions": [
      "oceania"
    ],
    "medium": "Oil on canvas",
    "mediums": [
      "Oil paint",
      "Canvas"
    ],
    "techniques": [],
    "location": "Collection to be verified",
    "originPlace": "Tahiti, French Polynesia",
    "image": {
      "ratio": 0.67,
      "alt": "Two women in lilac and blue wraps stand beside a seated figure seen from behind, on a pink shore among slender trees.",
      "credit": "",
      "licence": ""
    },
    "description": "Two women in lilac and blue wraps stand beside a seated figure seen from behind, on a pink shore among slender trees.",
    "context": [],
    "analysis": [],
    "periods": [
      "per-era-modern"
    ],
    "tags": [
      "painting",
      "oil painting"
    ],
    "status": {
      "level": "sample",
      "note": "Identified from a supplied image: the title, date and collection are to be verified before publication."
    }
  },
  {
    "id": "art-hopper-soir-bleu",
    "title": "Soir Bleu",
    "attribution": "Edward Hopper",
    "dateDisplay": "1914",
    "dates": {
      "start": 1914,
      "approx": false,
      "label": "1914"
    },
    "summary": "A painting by Edward Hopper.",
    "regions": [
      "north-america"
    ],
    "medium": "Oil on canvas",
    "mediums": [
      "Oil paint",
      "Canvas"
    ],
    "techniques": [],
    "location": "Whitney Museum of American Art, New York",
    "originPlace": "United States",
    "image": {
      "ratio": 2.049,
      "alt": "A clown in white sits among café-goers at a terrace table under paper lanterns, with a dark blue sea band behind.",
      "credit": "",
      "licence": ""
    },
    "description": "A clown in white sits among café-goers at a terrace table under paper lanterns, with a dark blue sea band behind.",
    "context": [],
    "analysis": [],
    "periods": [
      "per-era-modern"
    ],
    "tags": [
      "painting",
      "oil painting"
    ]
  },
  {
    "id": "art-hopper-automat",
    "title": "Automat",
    "attribution": "Edward Hopper",
    "dateDisplay": "1927",
    "dates": {
      "start": 1927,
      "approx": false,
      "label": "1927"
    },
    "summary": "A painting by Edward Hopper.",
    "regions": [
      "north-america"
    ],
    "medium": "Oil on canvas",
    "mediums": [
      "Oil paint",
      "Canvas"
    ],
    "techniques": [],
    "location": "Des Moines Art Center, Iowa",
    "originPlace": "United States",
    "image": {
      "ratio": 1.261,
      "alt": "A woman in a yellow hat and green coat sits alone with a cup at a table in an automat, with a row of ceiling lights reflected in the dark window.",
      "credit": "",
      "licence": ""
    },
    "description": "A woman in a yellow hat and green coat sits alone with a cup at a table in an automat, with a row of ceiling lights reflected in the dark window.",
    "context": [],
    "analysis": [],
    "periods": [
      "per-era-modern"
    ],
    "tags": [
      "painting",
      "oil painting"
    ]
  },
  {
    "id": "art-hopper-night-windows",
    "title": "Night Windows",
    "attribution": "Edward Hopper",
    "dateDisplay": "1928",
    "dates": {
      "start": 1928,
      "approx": false,
      "label": "1928"
    },
    "summary": "A painting by Edward Hopper.",
    "regions": [
      "north-america"
    ],
    "medium": "Oil on canvas",
    "mediums": [
      "Oil paint",
      "Canvas"
    ],
    "techniques": [],
    "location": "Museum of Modern Art, New York",
    "originPlace": "United States",
    "image": {
      "ratio": 1.139,
      "alt": "Three lit windows glimpsed from outside at night: a curtain blowing at one and a figure bending in a red room at another.",
      "credit": "",
      "licence": ""
    },
    "description": "Three lit windows glimpsed from outside at night: a curtain blowing at one and a figure bending in a red room at another.",
    "context": [],
    "analysis": [],
    "periods": [
      "per-era-modern"
    ],
    "tags": [
      "painting",
      "oil painting"
    ]
  },
  {
    "id": "art-hopper-nighthawks",
    "title": "Nighthawks",
    "attribution": "Edward Hopper",
    "dateDisplay": "1942",
    "dates": {
      "start": 1942,
      "approx": false,
      "label": "1942"
    },
    "summary": "A painting by Edward Hopper.",
    "regions": [
      "north-america"
    ],
    "medium": "Oil on canvas",
    "mediums": [
      "Oil paint",
      "Canvas"
    ],
    "techniques": [],
    "location": "Art Institute of Chicago",
    "originPlace": "United States",
    "image": {
      "ratio": 1.834,
      "alt": "Four figures sit in a brightly lit corner diner at night, seen through a curved glass window onto an empty street.",
      "credit": "",
      "licence": ""
    },
    "description": "Four figures sit in a brightly lit corner diner at night, seen through a curved glass window onto an empty street.",
    "context": [],
    "analysis": [],
    "periods": [
      "per-era-modern"
    ],
    "tags": [
      "painting",
      "oil painting"
    ]
  },
  {
    "id": "art-hopper-woman-in-the-sun",
    "title": "A Woman in the Sun",
    "attribution": "Edward Hopper",
    "dateDisplay": "1961",
    "dates": {
      "start": 1961,
      "approx": false,
      "label": "1961"
    },
    "summary": "A painting by Edward Hopper.",
    "regions": [
      "north-america"
    ],
    "medium": "Oil on canvas",
    "mediums": [
      "Oil paint",
      "Canvas"
    ],
    "techniques": [],
    "location": "Whitney Museum of American Art, New York",
    "originPlace": "United States",
    "image": {
      "ratio": 1.491,
      "alt": "A nude woman stands in a bare room beside an unmade bed, lit by a bar of sunlight from a window that looks onto green hills.",
      "credit": "",
      "licence": ""
    },
    "description": "A nude woman stands in a bare room beside an unmade bed, lit by a bar of sunlight from a window that looks onto green hills.",
    "context": [],
    "analysis": [],
    "periods": [
      "per-era-modern"
    ],
    "tags": [
      "painting",
      "oil painting"
    ]
  }
] as unknown[]).map((w) => artwork({ sources: ['s-grove', 's-smarthistory'], ...(w as object) } as never))

export const galleryArtworks: Artwork[] = base.map((w) => {
  const c = (credits as Record<string, Credit>)[w.id]
  const src = localImage(w.id)
  if (!c || !src) return w
  return { ...w, image: { ...w.image, src, credit: c.credit, licence: c.licence, ratio: c.ratio ?? w.image.ratio } }
})

export const galleryArtists = [
  artist({
    id: 'artist-edward-hopper', kind: 'individual', title: 'Edward Hopper', subtitle: 'Painter · 1882 – 1967', gender: 'man', originLabel: 'United States', level: 'index',
    summary: 'American realist painter of quiet, solitary scenes of city and small-town life.',
    regions: ['north-america'], dates: { start: 1882, end: 1967, label: '1882 – 1967' },
    essentials: [{ label: 'Born', value: 'Nyack, New York, 1882' }, { label: 'Died', value: 'New York City, 1967' }],
    lifeEvents: [{ year: 1882, label: 'Born in Nyack, New York' }, { year: 1967, label: 'Dies in New York City' }],
    context: [], development: [], legacy: [], mediums: ['Oil on canvas'], periods: ['per-era-modern'], flags: ['Added with five supplied works; no biography has been written yet.'], sources: ['s-grove', 's-smarthistory'],
    status: { level: 'sample', note: 'Index record: identity, dates, origin and movement links are recorded; no biography has been written yet.' },
  } as never),
]

export const galleryRelationships: Relationship[] = [
  {
    "id": "rel-g-001a",
    "type": "created_by",
    "from": "art-monet-train-countryside",
    "to": "artist-monet",
    "note": "Painted by Claude Monet."
  },
  {
    "id": "rel-g-001b",
    "type": "exemplifies",
    "from": "art-monet-train-countryside",
    "to": "mov-impressionism",
    "note": "A work by Claude Monet, an artist of the movement."
  },
  {
    "id": "rel-g-002a",
    "type": "created_by",
    "from": "art-monet-chrysanthemums",
    "to": "artist-monet",
    "note": "Painted by Claude Monet."
  },
  {
    "id": "rel-g-002b",
    "type": "exemplifies",
    "from": "art-monet-chrysanthemums",
    "to": "mov-impressionism",
    "note": "A work by Claude Monet, an artist of the movement."
  },
  {
    "id": "rel-g-003a",
    "type": "created_by",
    "from": "art-monet-suzanne-sunflowers",
    "to": "artist-monet",
    "note": "Painted by Claude Monet."
  },
  {
    "id": "rel-g-003b",
    "type": "exemplifies",
    "from": "art-monet-suzanne-sunflowers",
    "to": "mov-impressionism",
    "note": "A work by Claude Monet, an artist of the movement."
  },
  {
    "id": "rel-g-004a",
    "type": "created_by",
    "from": "art-monet-poppy-field",
    "to": "artist-monet",
    "note": "Painted by Claude Monet."
  },
  {
    "id": "rel-g-004b",
    "type": "exemplifies",
    "from": "art-monet-poppy-field",
    "to": "mov-impressionism",
    "note": "A work by Claude Monet, an artist of the movement."
  },
  {
    "id": "rel-g-005a",
    "type": "created_by",
    "from": "art-monet-grainstacks-hoarfrost",
    "to": "artist-monet",
    "note": "Painted by Claude Monet."
  },
  {
    "id": "rel-g-005b",
    "type": "exemplifies",
    "from": "art-monet-grainstacks-hoarfrost",
    "to": "mov-impressionism",
    "note": "A work by Claude Monet, an artist of the movement."
  },
  {
    "id": "rel-g-006a",
    "type": "created_by",
    "from": "art-monet-rose-path",
    "to": "artist-monet",
    "note": "Painted by Claude Monet."
  },
  {
    "id": "rel-g-006b",
    "type": "exemplifies",
    "from": "art-monet-rose-path",
    "to": "mov-impressionism",
    "note": "A work by Claude Monet, an artist of the movement."
  },
  {
    "id": "rel-g-007a",
    "type": "created_by",
    "from": "art-monet-seine-autumn",
    "to": "artist-monet",
    "note": "Painted by Claude Monet."
  },
  {
    "id": "rel-g-007b",
    "type": "exemplifies",
    "from": "art-monet-seine-autumn",
    "to": "mov-impressionism",
    "note": "A work by Claude Monet, an artist of the movement."
  },
  {
    "id": "rel-g-008a",
    "type": "created_by",
    "from": "art-monet-autumn-wood",
    "to": "artist-monet",
    "note": "Painted by Claude Monet."
  },
  {
    "id": "rel-g-008b",
    "type": "exemplifies",
    "from": "art-monet-autumn-wood",
    "to": "mov-impressionism",
    "note": "A work by Claude Monet, an artist of the movement."
  },
  {
    "id": "rel-g-009a",
    "type": "created_by",
    "from": "art-monet-mediterranean-coast",
    "to": "artist-monet",
    "note": "Painted by Claude Monet."
  },
  {
    "id": "rel-g-009b",
    "type": "exemplifies",
    "from": "art-monet-mediterranean-coast",
    "to": "mov-impressionism",
    "note": "A work by Claude Monet, an artist of the movement."
  },
  {
    "id": "rel-g-010a",
    "type": "created_by",
    "from": "art-monet-water-lilies-vertical",
    "to": "artist-monet",
    "note": "Painted by Claude Monet."
  },
  {
    "id": "rel-g-010b",
    "type": "exemplifies",
    "from": "art-monet-water-lilies-vertical",
    "to": "mov-impressionism",
    "note": "A work by Claude Monet, an artist of the movement."
  },
  {
    "id": "rel-g-011a",
    "type": "created_by",
    "from": "art-monet-willow-lily-pond",
    "to": "artist-monet",
    "note": "Painted by Claude Monet."
  },
  {
    "id": "rel-g-011b",
    "type": "exemplifies",
    "from": "art-monet-willow-lily-pond",
    "to": "mov-impressionism",
    "note": "A work by Claude Monet, an artist of the movement."
  },
  {
    "id": "rel-g-012a",
    "type": "created_by",
    "from": "art-monet-children-meadow",
    "to": "artist-monet",
    "note": "Painted by Claude Monet."
  },
  {
    "id": "rel-g-012b",
    "type": "exemplifies",
    "from": "art-monet-children-meadow",
    "to": "mov-impressionism",
    "note": "A work by Claude Monet, an artist of the movement."
  },
  {
    "id": "rel-g-013a",
    "type": "created_by",
    "from": "art-gauguin-still-life-puppies",
    "to": "artist-paul-gauguin",
    "note": "Painted by Paul Gauguin."
  },
  {
    "id": "rel-g-013b",
    "type": "exemplifies",
    "from": "art-gauguin-still-life-puppies",
    "to": "mov-post-impressionism",
    "note": "A work by Paul Gauguin, an artist of the movement."
  },
  {
    "id": "rel-g-014a",
    "type": "created_by",
    "from": "art-gauguin-tahitian-landscape",
    "to": "artist-paul-gauguin",
    "note": "Painted by Paul Gauguin."
  },
  {
    "id": "rel-g-014b",
    "type": "exemplifies",
    "from": "art-gauguin-tahitian-landscape",
    "to": "mov-post-impressionism",
    "note": "A work by Paul Gauguin, an artist of the movement."
  },
  {
    "id": "rel-g-015a",
    "type": "created_by",
    "from": "art-gauguin-vision-after-the-sermon",
    "to": "artist-paul-gauguin",
    "note": "Painted by Paul Gauguin."
  },
  {
    "id": "rel-g-015b",
    "type": "exemplifies",
    "from": "art-gauguin-vision-after-the-sermon",
    "to": "mov-post-impressionism",
    "note": "A work by Paul Gauguin, an artist of the movement."
  },
  {
    "id": "rel-g-016a",
    "type": "created_by",
    "from": "art-gauguin-tahitian-women-beach",
    "to": "artist-paul-gauguin",
    "note": "Painted by Paul Gauguin."
  },
  {
    "id": "rel-g-016b",
    "type": "exemplifies",
    "from": "art-gauguin-tahitian-women-beach",
    "to": "mov-post-impressionism",
    "note": "A work by Paul Gauguin, an artist of the movement."
  },
  {
    "id": "rel-g-017a",
    "type": "created_by",
    "from": "art-gauguin-hut-with-livestock",
    "to": "artist-paul-gauguin",
    "note": "Painted by Paul Gauguin."
  },
  {
    "id": "rel-g-017b",
    "type": "exemplifies",
    "from": "art-gauguin-hut-with-livestock",
    "to": "mov-post-impressionism",
    "note": "A work by Paul Gauguin, an artist of the movement."
  },
  {
    "id": "rel-g-018a",
    "type": "created_by",
    "from": "art-gauguin-village-road",
    "to": "artist-paul-gauguin",
    "note": "Painted by Paul Gauguin."
  },
  {
    "id": "rel-g-018b",
    "type": "exemplifies",
    "from": "art-gauguin-village-road",
    "to": "mov-post-impressionism",
    "note": "A work by Paul Gauguin, an artist of the movement."
  },
  {
    "id": "rel-g-019a",
    "type": "created_by",
    "from": "art-gauguin-seed-of-the-areoi",
    "to": "artist-paul-gauguin",
    "note": "Painted by Paul Gauguin."
  },
  {
    "id": "rel-g-019b",
    "type": "exemplifies",
    "from": "art-gauguin-seed-of-the-areoi",
    "to": "mov-post-impressionism",
    "note": "A work by Paul Gauguin, an artist of the movement."
  },
  {
    "id": "rel-g-020a",
    "type": "created_by",
    "from": "art-gauguin-matamoe",
    "to": "artist-paul-gauguin",
    "note": "Painted by Paul Gauguin."
  },
  {
    "id": "rel-g-020b",
    "type": "exemplifies",
    "from": "art-gauguin-matamoe",
    "to": "mov-post-impressionism",
    "note": "A work by Paul Gauguin, an artist of the movement."
  },
  {
    "id": "rel-g-021a",
    "type": "created_by",
    "from": "art-gauguin-parau-api",
    "to": "artist-paul-gauguin",
    "note": "Painted by Paul Gauguin."
  },
  {
    "id": "rel-g-021b",
    "type": "exemplifies",
    "from": "art-gauguin-parau-api",
    "to": "mov-post-impressionism",
    "note": "A work by Paul Gauguin, an artist of the movement."
  },
  {
    "id": "rel-g-022a",
    "type": "created_by",
    "from": "art-gauguin-palms-red-ground",
    "to": "artist-paul-gauguin",
    "note": "Painted by Paul Gauguin."
  },
  {
    "id": "rel-g-022b",
    "type": "exemplifies",
    "from": "art-gauguin-palms-red-ground",
    "to": "mov-post-impressionism",
    "note": "A work by Paul Gauguin, an artist of the movement."
  },
  {
    "id": "rel-g-023a",
    "type": "created_by",
    "from": "art-gauguin-women-by-the-pond",
    "to": "artist-paul-gauguin",
    "note": "Painted by Paul Gauguin."
  },
  {
    "id": "rel-g-023b",
    "type": "exemplifies",
    "from": "art-gauguin-women-by-the-pond",
    "to": "mov-post-impressionism",
    "note": "A work by Paul Gauguin, an artist of the movement."
  },
  {
    "id": "rel-g-024a",
    "type": "created_by",
    "from": "art-gauguin-tree-trunk-scene",
    "to": "artist-paul-gauguin",
    "note": "Painted by Paul Gauguin."
  },
  {
    "id": "rel-g-024b",
    "type": "exemplifies",
    "from": "art-gauguin-tree-trunk-scene",
    "to": "mov-post-impressionism",
    "note": "A work by Paul Gauguin, an artist of the movement."
  },
  {
    "id": "rel-g-025a",
    "type": "created_by",
    "from": "art-gauguin-arearea-no-varua-ino",
    "to": "artist-paul-gauguin",
    "note": "Painted by Paul Gauguin."
  },
  {
    "id": "rel-g-025b",
    "type": "exemplifies",
    "from": "art-gauguin-arearea-no-varua-ino",
    "to": "mov-post-impressionism",
    "note": "A work by Paul Gauguin, an artist of the movement."
  },
  {
    "id": "rel-g-026a",
    "type": "created_by",
    "from": "art-gauguin-day-of-the-god",
    "to": "artist-paul-gauguin",
    "note": "Painted by Paul Gauguin."
  },
  {
    "id": "rel-g-026b",
    "type": "exemplifies",
    "from": "art-gauguin-day-of-the-god",
    "to": "mov-post-impressionism",
    "note": "A work by Paul Gauguin, an artist of the movement."
  },
  {
    "id": "rel-g-027a",
    "type": "created_by",
    "from": "art-gauguin-nave-nave-mahana",
    "to": "artist-paul-gauguin",
    "note": "Painted by Paul Gauguin."
  },
  {
    "id": "rel-g-027b",
    "type": "exemplifies",
    "from": "art-gauguin-nave-nave-mahana",
    "to": "mov-post-impressionism",
    "note": "A work by Paul Gauguin, an artist of the movement."
  },
  {
    "id": "rel-g-028a",
    "type": "created_by",
    "from": "art-gauguin-three-women-shore",
    "to": "artist-paul-gauguin",
    "note": "Painted by Paul Gauguin."
  },
  {
    "id": "rel-g-028b",
    "type": "exemplifies",
    "from": "art-gauguin-three-women-shore",
    "to": "mov-post-impressionism",
    "note": "A work by Paul Gauguin, an artist of the movement."
  },
  {
    "id": "rel-g-029a",
    "type": "created_by",
    "from": "art-hopper-soir-bleu",
    "to": "artist-edward-hopper",
    "note": "Painted by Edward Hopper."
  },
  {
    "id": "rel-g-030a",
    "type": "created_by",
    "from": "art-hopper-automat",
    "to": "artist-edward-hopper",
    "note": "Painted by Edward Hopper."
  },
  {
    "id": "rel-g-031a",
    "type": "created_by",
    "from": "art-hopper-night-windows",
    "to": "artist-edward-hopper",
    "note": "Painted by Edward Hopper."
  },
  {
    "id": "rel-g-032a",
    "type": "created_by",
    "from": "art-hopper-nighthawks",
    "to": "artist-edward-hopper",
    "note": "Painted by Edward Hopper."
  },
  {
    "id": "rel-g-033a",
    "type": "created_by",
    "from": "art-hopper-woman-in-the-sun",
    "to": "artist-edward-hopper",
    "note": "Painted by Edward Hopper."
  }
]

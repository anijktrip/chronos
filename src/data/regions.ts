import type { Region } from '@/types'

/** The ten regional lanes of the shared chronological framework. */
export const regions: Region[] = [
  { id: 'europe', name: 'Europe', short: 'Europe', anchor: [15, 50],
    blurb: 'From Greek and Roman antiquity through medieval, Renaissance and modern movements.' },
  { id: 'east-asia', name: 'East Asia', short: 'E. Asia', anchor: [115, 36],
    blurb: 'China, Japan and Korea: imperial court painting, ceramics, calligraphy and the woodblock print.' },
  { id: 'south-asia', name: 'South Asia', short: 'S. Asia', anchor: [78, 23],
    blurb: 'The Indian subcontinent: temple sculpture, court painting and the arts of successive empires.' },
  { id: 'southeast-asia', name: 'Southeast Asia', short: 'SE Asia', anchor: [105, 10],
    blurb: 'Mainland and island Southeast Asia: Khmer, Javanese and other temple-building cultures.' },
  { id: 'west-asia-north-africa', name: 'West Asia & North Africa', short: 'W. Asia & N. Africa', anchor: [40, 30],
    blurb: 'Mesopotamia, Persia, Arabia and the Maghreb: the book arts, calligraphy and architecture of the Islamic world.' },
  { id: 'sub-saharan-africa', name: 'Sub-Saharan Africa', short: 'Sub-Saharan Africa', anchor: [20, 2],
    blurb: 'Royal courts, masquerade and sculptural traditions across West, Central, East and Southern Africa.' },
  { id: 'north-america', name: 'North America', short: 'N. America', anchor: [-100, 42],
    blurb: 'Indigenous nations’ arts, and the modern movements of the United States and Canada.' },
  { id: 'central-america-caribbean', name: 'Central America & the Caribbean', short: 'C. America & Caribbean', anchor: [-86, 17],
    blurb: 'Mesoamerica (including southern Mexico), the isthmus and the Caribbean islands.' },
  { id: 'south-america', name: 'South America', short: 'S. America', anchor: [-62, -15],
    blurb: 'The Andes and beyond: textile, metalwork and architecture across pre-Columbian and colonial worlds.' },
  { id: 'oceania', name: 'Oceania', short: 'Oceania', anchor: [150, -22],
    blurb: 'Australia, Aotearoa New Zealand and the Pacific islands: carving, tattoo, bark and canvas painting.' },
]

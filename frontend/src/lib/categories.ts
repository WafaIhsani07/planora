export const CATEGORIES = [
  { id: 'wedding-organizer', name: 'Wedding Organizer' },
  { id: 'venue', name: 'Venue' },
  { id: 'katering', name: 'Katering' },
  { id: 'fotografi', name: 'Fotografi' },
  { id: 'videografi', name: 'Videografi' },
  { id: 'dekorasi', name: 'Dekorasi & Florist' },
  { id: 'mua', name: 'Make Up Artist (MUA)' },
  { id: 'busana', name: 'Busana Pengantin' },
  { id: 'mc', name: 'MC' },
  { id: 'hiburan', name: 'Hiburan Musik' },
  { id: 'undangan', name: 'Undangan Digital' },
  { id: 'souvenir', name: 'Souvenir' },
];

export type Category = typeof CATEGORIES[number];

export function getCategoryById(id: string) {
  return CATEGORIES.find((c) => c.id === id) ?? null;
}

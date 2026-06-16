export const CATEGORIES = [
  { id: 'wedding-organizer', name: 'Wedding Organizer' },
  { id: 'venue', name: 'Venue' },
  { id: 'katering', name: 'Catering' },
  { id: 'fotografi', name: 'Photography' },
  { id: 'videografi', name: 'Videography' },
  { id: 'dekorasi', name: 'Decoration & Florist' },
  { id: 'mua', name: 'Make Up Artist (MUA)' },
  { id: 'busana', name: 'Bridal Wear' },
  { id: 'mc', name: 'MC' },
  { id: 'hiburan', name: 'Music & Entertainment' },
  { id: 'undangan', name: 'Digital Invitation' },
  { id: 'souvenir', name: 'Souvenir' },
];

export type Category = typeof CATEGORIES[number];

export function getCategoryById(id: string) {
  return CATEGORIES.find((c) => c.id === id) ?? null;
}

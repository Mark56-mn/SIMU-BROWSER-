export interface Tribe {
  id: string;
  name: string;
  weapon: string;
  color: string;
  bonus: string;
  desc: string;
}

export interface Level {
  id: number;
  name: string;
  background: string;
  themeColor: string;
  difficulty: number;
  enemyTribeId: string;
}

export const TRIBES: Tribe[] = [
  { id: 'zulu', name: 'Zulu', weapon: 'Spear', color: '#f59e0b', bonus: 'Attack Power', desc: 'Masters of the short spear, dealing heavy damage.' },
  { id: 'maasai', name: 'Maasai', weapon: 'Shield', color: '#ef4444', bonus: 'Defense', desc: 'Resilient warriors utilizing iconic strong shields.' },
  { id: 'yoruba', name: 'Yoruba', weapon: 'Axe', color: '#10b981', bonus: 'Agility', desc: 'Swift fighters using traditional battle axes.' },
  { id: 'hausa', name: 'Hausa', weapon: 'Staff', color: '#8b5cf6', bonus: 'Stamina', desc: 'Skilled with the long staff, outlasting opponents.' },
  { id: 'san', name: 'San', weapon: 'Bow', color: '#f97316', bonus: 'Precision', desc: 'Elite trackers delivering precise ranged attacks.' },
];

export const LEVELS: Level[] = [
  { id: 1, name: 'Zulu Training', background: 'Savannah', themeColor: '#f59e0b', difficulty: 1.0, enemyTribeId: 'zulu' },
  { id: 2, name: 'Maasai Village', background: 'River', themeColor: '#ef4444', difficulty: 1.2, enemyTribeId: 'maasai' },
  { id: 3, name: 'Yoruba River', background: 'Jungle', themeColor: '#10b981', difficulty: 1.5, enemyTribeId: 'yoruba' },
  { id: 4, name: 'Hausa Mountain', background: 'Mountain', themeColor: '#8b5cf6', difficulty: 1.8, enemyTribeId: 'hausa' },
  { id: 5, name: 'San Desert', background: 'Desert', themeColor: '#f97316', difficulty: 2.2, enemyTribeId: 'san' },
];

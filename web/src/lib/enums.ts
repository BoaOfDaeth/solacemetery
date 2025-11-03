// Alignment enum
export enum Alignment {
  GOOD = 'Good',
  NEUTRAL = 'Neutral',
  EVIL = 'Evil',
}

// Race enum
export enum Race {
  HUMAN = 'Human',
  HALF_ELF = 'Half-Elf',
  DWARF = 'Dwarf',
  ELF = 'Elf',
  WILD_ELF = 'Wild-Elf',
  DARK_ELF = 'Dark-Elf',
  KENDER = 'Kender',
  HALF_KENDER = 'Half-Kender',
  GNOME = 'Gnome',
  MINOTAUR = 'Minotaur',
  AURAK = 'Aurak',
  BAAZ = 'Baaz',
  BOZAK = 'Bozak',
  KAPAK = 'Kapak',
  SIVAK = 'Sivak',
}

// Class enum
export enum Class {
  FIGHTER = 'Fighter',
  KNIGHT = 'Knight',
  RANGER = 'Ranger',
  CLERIC = 'Cleric',
  DRUID = 'Druid',
  THIEF = 'Thief',
  ASSASSIN = 'Assassin',
  TRANSMUTER = 'Transmuter',
  INVOKER = 'Invoker',
  NECROMANCER = 'Necromancer',
  OUTCAST = 'Outcast',
}

export enum Specs {
  // Fighter specializations
  SWORD = 'Sword',
  DAGGER = 'Dagger',
  WHIP_FLAIL = 'Whip/Flail',
  MACE = 'Mace',
  AXE = 'Axe',
  STAFF = 'Staff',
  SPEAR = 'Spear',
  HAND_TO_HAND = 'Hand to Hand',
  RANGED = 'Ranged',
  SHIELD = 'Shield',
  // Magic majors
  ABJURATION = 'Abjuration',
  ALTERATION = 'Alteration',
  // Assassin ways
  WAY_SHADOWS = 'Shadows',
  WAY_BEASTS = 'Beasts',
  WAY_SEASONS = 'Seasons',
  // Druid kinships
  KINSHIP_ALL = 'All Animals',
  KINSHIP_WOLF = 'Greater Wolf',
  KINSHIP_BOAR = 'Greater Boar',
  KINSHIP_ORANGUTAN = 'Powerful Orangutan',
  // Cleric gods (Good)
  GOD_KIRI_JOLITH = 'Kiri-Jolith',
  GOD_PALADINE = 'Paladine',
  GOD_MISHAKAL = 'Mishakal',
  GOD_MAJERE = 'Majere',
}

// Helper functions to get all values
export function getAllAlignments(): Alignment[] {
  return Object.values(Alignment);
}

export function getAllRaces(): Race[] {
  return Object.values(Race);
}

export function getAllClasses(): Class[] {
  return Object.values(Class);
}

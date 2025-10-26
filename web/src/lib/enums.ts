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

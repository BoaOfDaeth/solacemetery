import { Race, CharacterStats } from './types';

// Maximum stat cap for all races
const MAX_STAT = 25;

export const races: Record<string, Race> = {
  Human: {
    name: 'Human',
    description: 'The most common race of the world, humans are versatile and adaptable. They have no racial restrictions and can excel in any class or alignment.',
    features: 'No racial restrictions, balanced stat growth, fastest learning rate, can be any alignment',
    maxStats: {
      strength: MAX_STAT,
      intelligence: MAX_STAT,
      wisdom: MAX_STAT,
      dexterity: MAX_STAT,
      constitution: MAX_STAT,
    },
    xpPenalty: 0,
    allowedAlignments: ['Good', 'Neutral', 'Evil'],
    availableClasses: ['Fighter', 'Knight', 'Ranger', 'Cleric', 'Druid', 'Thief', 'Assassin', 'Transmuter', 'Invoker', 'Necromancer', 'Outcast'],
  },

  'Half-Elf': {
    name: 'Half-Elf',
    description: 'Offspring of humans and elves, half-elves combine the best traits of both races. They are more intelligent than humans but less physically strong.',
    features: 'Enhanced intelligence, natural magic affinity, longer lifespan than humans, keen senses',
    maxStats: {
      strength: 23,
      intelligence: MAX_STAT,
      wisdom: MAX_STAT,
      dexterity: MAX_STAT,
      constitution: 22,
    },
    xpPenalty: 5,
    allowedAlignments: ['Good', 'Neutral', 'Evil'],
    availableClasses: ['Fighter', 'Knight', 'Ranger', 'Cleric', 'Druid', 'Thief', 'Assassin', 'Transmuter', 'Invoker', 'Necromancer', 'Outcast'],
  },

  Dwarf: {
    name: 'Dwarf',
    description: 'Short and stout fellows, dwarves are natural warriors and craftsmen. They are incredibly strong and tough, with natural resistance to magic.',
    features: 'Exceptional strength and constitution, natural magic resistance, darkvision, stonecunning, weapon proficiency',
    maxStats: {
      strength: MAX_STAT,
      intelligence: 20,
      wisdom: MAX_STAT,
      dexterity: 18,
      constitution: MAX_STAT,
    },
    xpPenalty: 10,
    allowedAlignments: ['Good', 'Neutral'],
    availableClasses: ['Fighter', 'Knight', 'Ranger', 'Cleric', 'Druid', 'Thief', 'Assassin', 'Transmuter', 'Invoker', 'Outcast'],
  },

  Elf: {
    name: 'Elf',
    description: 'Graceful and intelligent, elves are masters of magic and archery. They are not very strong physically but possess exceptional mental capabilities.',
    features: 'Superior intelligence and wisdom, natural magic ability, enhanced dexterity, immunity to sleep, keen senses',
    maxStats: {
      strength: 18,
      intelligence: MAX_STAT,
      wisdom: MAX_STAT,
      dexterity: MAX_STAT,
      constitution: 20,
    },
    xpPenalty: 20,
    allowedAlignments: ['Good'],
    availableClasses: ['Fighter', 'Knight', 'Ranger', 'Cleric', 'Druid', 'Thief', 'Assassin', 'Transmuter', 'Invoker', 'Outcast'],
  },

  'Wild-Elf': {
    name: 'Wild-Elf',
    description: 'Cross breed between Dark and normal Elves, wild elves combine the magical prowess of elves with some of the darker traits of their ancestors.',
    features: 'Enhanced magical abilities, natural stealth, forest affinity, resistance to charm effects, wild magic',
    maxStats: {
      strength: 19,
      intelligence: MAX_STAT,
      wisdom: MAX_STAT,
      dexterity: MAX_STAT,
      constitution: 21,
    },
    xpPenalty: 20,
    allowedAlignments: ['Good', 'Neutral'],
    availableClasses: ['Fighter', 'Knight', 'Ranger', 'Cleric', 'Druid', 'Thief', 'Assassin', 'Transmuter', 'Invoker', 'Outcast'],
  },

  'Dark-Elf': {
    name: 'Dark-Elf',
    description: 'Frail but exceptionally intelligent, dark elves are masters of dark magic and subterfuge. They excel as clerics and mages.',
    features: 'Superior intelligence, natural dark magic affinity, enhanced magical abilities, darkvision, spell resistance',
    maxStats: {
      strength: 16,
      intelligence: MAX_STAT,
      wisdom: MAX_STAT,
      dexterity: MAX_STAT,
      constitution: 18,
    },
    xpPenalty: 20,
    allowedAlignments: ['Evil'],
    availableClasses: ['Fighter', 'Knight', 'Ranger', 'Cleric', 'Druid', 'Thief', 'Assassin', 'Transmuter', 'Invoker', 'Necromancer', 'Outcast'],
  },

  Kender: {
    name: 'Kender',
    description: 'Small, nimble kleptomaniacs with an insatiable curiosity. Kender are naturally stealthy and have an uncanny ability to "find" things.',
    features: 'Natural stealth abilities, kleptomania (finds random items), fear immunity, enhanced dexterity, natural luck',
    maxStats: {
      strength: 15,
      intelligence: 22,
      wisdom: 20,
      dexterity: MAX_STAT,
      constitution: 18,
    },
    xpPenalty: 10,
    allowedAlignments: ['Good'],
    availableClasses: ['Fighter', 'Knight', 'Ranger', 'Cleric', 'Druid', 'Thief', 'Assassin', 'Transmuter', 'Invoker', 'Outcast'],
  },

  'Half-Kender': {
    name: 'Half-Kender',
    description: 'Offspring of humans and kenders, half-kenders inherit some of the kender traits while maintaining human versatility.',
    features: 'Enhanced dexterity, natural curiosity, improved luck, some stealth abilities, balanced traits',
    maxStats: {
      strength: 20,
      intelligence: 24,
      wisdom: 22,
      dexterity: MAX_STAT,
      constitution: 20,
    },
    xpPenalty: 10,
    allowedAlignments: ['Good', 'Neutral'],
    availableClasses: ['Fighter', 'Knight', 'Ranger', 'Cleric', 'Druid', 'Thief', 'Assassin', 'Transmuter', 'Invoker', 'Outcast'],
  },

  Gnome: {
    name: 'Gnome',
    description: 'Short and smart inventors by nature, gnomes are masters of tinkering and mechanical devices. They are always neutral in alignment.',
    features: 'Superior intelligence, natural inventing abilities, mechanical aptitude, illusion resistance, tinkering skills',
    maxStats: {
      strength: 16,
      intelligence: MAX_STAT,
      wisdom: MAX_STAT,
      dexterity: 22,
      constitution: 20,
    },
    xpPenalty: 10,
    allowedAlignments: ['Neutral'],
    availableClasses: ['Fighter', 'Knight', 'Ranger', 'Cleric', 'Druid', 'Thief', 'Assassin', 'Transmuter', 'Invoker', 'Outcast'],
  },

  Minotaur: {
    name: 'Minotaur',
    description: 'Big, strong, and slow, minotaurs are excellent warriors with incredible physical power. They can be of any alignment.',
    features: 'Exceptional strength and constitution, natural weapon proficiency, intimidating presence, enhanced carrying capacity',
    maxStats: {
      strength: MAX_STAT,
      intelligence: 18,
      wisdom: 20,
      dexterity: 16,
      constitution: MAX_STAT,
    },
    xpPenalty: 25,
    allowedAlignments: ['Good', 'Neutral', 'Evil'],
    availableClasses: ['Fighter', 'Knight', 'Ranger', 'Cleric', 'Druid', 'Thief', 'Assassin', 'Transmuter', 'Invoker', 'Necromancer', 'Outcast'],
  },

  Draconian: {
    name: 'Draconian',
    description: 'Dragon offspring corrupted by dark magic, draconians are powerful but always evil. They possess draconic abilities and resistances.',
    features: 'Draconic abilities, natural armor, breath weapon potential, magic resistance, enhanced physical capabilities',
    maxStats: {
      strength: MAX_STAT,
      intelligence: 22,
      wisdom: 20,
      dexterity: 20,
      constitution: MAX_STAT,
    },
    xpPenalty: 20,
    allowedAlignments: ['Evil'],
    availableClasses: ['Fighter', 'Knight', 'Ranger', 'Cleric', 'Druid', 'Thief', 'Assassin', 'Transmuter', 'Invoker', 'Necromancer', 'Outcast'],
  },
};

// Helper function to get race by name
export function getRace(name: string): Race | undefined {
  return races[name];
}

// Helper function to get all races
export function getAllRaces(): Race[] {
  return Object.values(races);
}

// Helper function to get races by alignment
export function getRacesByAlignment(alignment: string): Race[] {
  return Object.values(races).filter(race => 
    race.allowedAlignments.includes(alignment as any)
  );
}

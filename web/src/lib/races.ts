import { RaceData, CharacterStats } from './types';
import { Race, Alignment, Class } from './enums';

// Maximum stat cap for all races
const MAX_STAT = 25;

export const races: Record<Race, RaceData> = {
  [Race.HUMAN]: {
    name: Race.HUMAN,
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
    allowedAlignments: [Alignment.GOOD, Alignment.NEUTRAL, Alignment.EVIL],
    availableClasses: [Class.FIGHTER, Class.KNIGHT, Class.RANGER, Class.CLERIC, Class.DRUID, Class.THIEF, Class.ASSASSIN, Class.TRANSMUTER, Class.INVOKER, Class.NECROMANCER, Class.OUTCAST],
  },

  [Race.HALF_ELF]: {
    name: Race.HALF_ELF,
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
    allowedAlignments: [Alignment.GOOD, Alignment.NEUTRAL, Alignment.EVIL],
    availableClasses: [Class.FIGHTER, Class.KNIGHT, Class.RANGER, Class.CLERIC, Class.DRUID, Class.THIEF, Class.ASSASSIN, Class.TRANSMUTER, Class.INVOKER, Class.NECROMANCER, Class.OUTCAST],
  },

  [Race.DWARF]: {
    name: Race.DWARF,
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
    allowedAlignments: [Alignment.GOOD, Alignment.NEUTRAL],
    availableClasses: [Class.FIGHTER, Class.KNIGHT, Class.RANGER, Class.CLERIC, Class.DRUID, Class.THIEF, Class.ASSASSIN, Class.TRANSMUTER, Class.INVOKER, Class.OUTCAST],
  },

  [Race.ELF]: {
    name: Race.ELF,
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
    allowedAlignments: [Alignment.GOOD],
    availableClasses: [Class.FIGHTER, Class.KNIGHT, Class.RANGER, Class.CLERIC, Class.DRUID, Class.THIEF, Class.ASSASSIN, Class.TRANSMUTER, Class.INVOKER, Class.OUTCAST],
  },

  [Race.WILD_ELF]: {
    name: Race.WILD_ELF,
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
    allowedAlignments: [Alignment.GOOD, Alignment.NEUTRAL],
    availableClasses: [Class.FIGHTER, Class.KNIGHT, Class.RANGER, Class.CLERIC, Class.DRUID, Class.THIEF, Class.ASSASSIN, Class.TRANSMUTER, Class.INVOKER, Class.OUTCAST],
  },

  [Race.DARK_ELF]: {
    name: Race.DARK_ELF,
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
    allowedAlignments: [Alignment.EVIL],
    availableClasses: [Class.FIGHTER, Class.KNIGHT, Class.RANGER, Class.CLERIC, Class.DRUID, Class.THIEF, Class.ASSASSIN, Class.TRANSMUTER, Class.INVOKER, Class.NECROMANCER, Class.OUTCAST],
  },

  [Race.KENDER]: {
    name: Race.KENDER,
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
    allowedAlignments: [Alignment.GOOD],
    availableClasses: [Class.FIGHTER, Class.KNIGHT, Class.RANGER, Class.CLERIC, Class.DRUID, Class.THIEF, Class.ASSASSIN, Class.TRANSMUTER, Class.INVOKER, Class.OUTCAST],
  },

  [Race.HALF_KENDER]: {
    name: Race.HALF_KENDER,
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
    allowedAlignments: [Alignment.GOOD, Alignment.NEUTRAL],
    availableClasses: [Class.FIGHTER, Class.KNIGHT, Class.RANGER, Class.CLERIC, Class.DRUID, Class.THIEF, Class.ASSASSIN, Class.TRANSMUTER, Class.INVOKER, Class.OUTCAST],
  },

  [Race.GNOME]: {
    name: Race.GNOME,
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
    allowedAlignments: [Alignment.NEUTRAL],
    availableClasses: [Class.FIGHTER, Class.KNIGHT, Class.RANGER, Class.CLERIC, Class.DRUID, Class.THIEF, Class.ASSASSIN, Class.TRANSMUTER, Class.INVOKER, Class.OUTCAST],
  },

  [Race.MINOTAUR]: {
    name: Race.MINOTAUR,
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
    allowedAlignments: [Alignment.GOOD, Alignment.NEUTRAL, Alignment.EVIL],
    availableClasses: [Class.FIGHTER, Class.KNIGHT, Class.RANGER, Class.CLERIC, Class.DRUID, Class.THIEF, Class.ASSASSIN, Class.TRANSMUTER, Class.INVOKER, Class.NECROMANCER, Class.OUTCAST],
  },

  [Race.DRACONIAN]: {
    name: Race.DRACONIAN,
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
    allowedAlignments: [Alignment.EVIL],
    availableClasses: [Class.FIGHTER, Class.KNIGHT, Class.RANGER, Class.CLERIC, Class.DRUID, Class.THIEF, Class.ASSASSIN, Class.TRANSMUTER, Class.INVOKER, Class.NECROMANCER, Class.OUTCAST],
  },
};

// Helper function to get race by name
export function getRace(name: Race | string): RaceData | undefined {
  return races[name as Race];
}

// Helper function to get all races
export function getAllRaces(): RaceData[] {
  return Object.values(races);
}

// Helper function to get races by alignment
export function getRacesByAlignment(alignment: Alignment): RaceData[] {
  return Object.values(races).filter(race => 
    race.allowedAlignments.includes(alignment)
  );
}

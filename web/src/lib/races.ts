import { RaceData, CharacterStats } from './types';
import { Race, Alignment, Class } from './enums';

export const races: Record<Race, RaceData> = {
  [Race.HUMAN]: {
    name: Race.HUMAN,
    title: 'Human',
    slug: 'human',
    description: 'The most common race of the world.',
    features: ['Has +3 to maximum of primary characteristic'],
    xpPenalty: 0,
    allowedAlignments: [Alignment.GOOD, Alignment.NEUTRAL, Alignment.EVIL],
    maxStats: {
      strength: 20,
      intelligence: 20,
      wisdom: 20,
      dexterity: 20,
      constitution: 20,
    },
    availableClasses: [
      Class.FIGHTER,
      Class.KNIGHT,
      Class.RANGER,
      Class.CLERIC,
      Class.DRUID,
      Class.THIEF,
      Class.ASSASSIN,
      Class.TRANSMUTER,
      Class.INVOKER,
      Class.NECROMANCER,
      Class.OUTCAST,
    ],
    reference: [],
  },

  [Race.HALF_ELF]: {
    name: Race.HALF_ELF,
    title: 'Half-Elf',
    slug: 'half-elf',
    description: 'Offspring of humans and elves.',
    features: ['Has +2 to maximum of primary characteristic'],
    xpPenalty: 5,
    allowedAlignments: [Alignment.GOOD, Alignment.NEUTRAL, Alignment.EVIL],
    maxStats: {
      strength: 19,
      intelligence: 21,
      wisdom: 21,
      dexterity: 21,
      constitution: 19,
    },
    availableClasses: [
      Class.FIGHTER,
      Class.KNIGHT,
      Class.RANGER,
      Class.CLERIC,
      Class.DRUID,
      Class.THIEF,
      Class.ASSASSIN,
      Class.TRANSMUTER,
      Class.INVOKER,
    ],
    reference: [],
  },

  [Race.DWARF]: {
    name: Race.DWARF,
    title: 'Dwarf',
    slug: 'dwarf',
    description: 'Short & stout fellows, make good warriors.',
    features: [],
    xpPenalty: 10,
    allowedAlignments: [Alignment.GOOD, Alignment.NEUTRAL],
    maxStats: {
      strength: 22,
      intelligence: 19,
      wisdom: 20,
      dexterity: 18,
      constitution: 25,
    },
    availableClasses: [
      Class.FIGHTER,
      Class.KNIGHT,
      Class.CLERIC,
      Class.THIEF,
      Class.ASSASSIN,
    ],
    reference: [],
  },

  [Race.ELF]: {
    name: Race.ELF,
    title: 'Elf',
    slug: 'elf',
    description: 'Not very strong, but exceedingly smart.',
    features: [],
    xpPenalty: 20,
    allowedAlignments: [Alignment.GOOD],
    maxStats: {
      strength: 17,
      intelligence: 24,
      wisdom: 25,
      dexterity: 23,
      constitution: 16,
    },
    availableClasses: [
      Class.FIGHTER,
      Class.KNIGHT,
      Class.RANGER,
      Class.CLERIC,
      Class.DRUID,
      Class.THIEF,
      Class.ASSASSIN,
      Class.TRANSMUTER,
      Class.INVOKER,
    ],
    reference: [
      { label: 'forest blending', url: '/help/forest-blending-awareness' },
    ],
  },

  [Race.WILD_ELF]: {
    name: Race.WILD_ELF,
    title: 'Wild-Elf',
    slug: 'wild-elf',
    description: 'Cross breed between Dark and normal Elves.',
    features: [],
    xpPenalty: 20,
    allowedAlignments: [Alignment.GOOD, Alignment.NEUTRAL],
    maxStats: {
      strength: 18,
      intelligence: 23,
      wisdom: 23,
      dexterity: 24,
      constitution: 17,
    },
    availableClasses: [
      Class.FIGHTER,
      Class.RANGER,
      Class.CLERIC,
      Class.DRUID,
      Class.THIEF,
      Class.TRANSMUTER,
      Class.INVOKER,
    ],
    reference: [
      { label: 'forest blending', url: '/help/forest-blending-awareness' },
    ],
  },

  [Race.DARK_ELF]: {
    name: Race.DARK_ELF,
    title: 'Dark-Elf',
    slug: 'dark-elf',
    description: 'Frail, make excellent clerics and mages.',
    features: [],
    xpPenalty: 20,
    allowedAlignments: [Alignment.EVIL],
    maxStats: {
      strength: 17,
      intelligence: 24,
      wisdom: 22,
      dexterity: 23,
      constitution: 18,
    },
    availableClasses: [
      Class.FIGHTER,
      Class.CLERIC,
      Class.DRUID,
      Class.THIEF,
      Class.ASSASSIN,
      Class.TRANSMUTER,
      Class.INVOKER,
      Class.NECROMANCER,
      Class.OUTCAST,
    ],
    reference: [],
  },

  [Race.KENDER]: {
    name: Race.KENDER,
    title: 'Kender',
    slug: 'kender',
    description: 'Small, nimble kleptomaniacs.',
    features: [],
    xpPenalty: 10,
    allowedAlignments: [Alignment.GOOD],
    maxStats: {
      strength: 18,
      intelligence: 20,
      wisdom: 18,
      dexterity: 25,
      constitution: 18,
    },
    availableClasses: [Class.FIGHTER, Class.RANGER, Class.THIEF],
    reference: [],
  },

  [Race.HALF_KENDER]: {
    name: Race.HALF_KENDER,
    title: 'Half-Kender',
    slug: 'half-kender',
    description: 'Offspring of humans and kenders.',
    features: ['Has +1 to maximum of primary characteristic'],
    xpPenalty: 10,
    allowedAlignments: [Alignment.GOOD, Alignment.NEUTRAL],
    maxStats: {
      strength: 19,
      intelligence: 20,
      wisdom: 19,
      dexterity: 23,
      constitution: 19,
    },
    availableClasses: [
      Class.FIGHTER,
      Class.KNIGHT,
      Class.RANGER,
      Class.CLERIC,
      Class.DRUID,
      Class.THIEF,
      Class.ASSASSIN,
      Class.TRANSMUTER,
      Class.INVOKER,
    ],
    reference: [],
  },

  [Race.GNOME]: {
    name: Race.GNOME,
    title: 'Gnome',
    slug: 'gnome',
    description: 'Short and smart, inventors by nature.',
    features: [],
    xpPenalty: 10,
    allowedAlignments: [Alignment.NEUTRAL],
    maxStats: {
      strength: 18,
      intelligence: 25,
      wisdom: 23,
      dexterity: 18,
      constitution: 20,
    },
    availableClasses: [
      Class.FIGHTER,
      Class.CLERIC,
      Class.DRUID,
      Class.THIEF,
      Class.TRANSMUTER,
      Class.INVOKER,
    ],
    reference: [],
  },

  [Race.MINOTAUR]: {
    name: Race.MINOTAUR,
    title: 'Minotaur',
    slug: 'minotaur',
    description: 'Large, powerful race.',
    features: [],
    xpPenalty: 25,
    allowedAlignments: [Alignment.GOOD, Alignment.NEUTRAL, Alignment.EVIL],
    maxStats: {
      strength: 25,
      intelligence: 15,
      wisdom: 17,
      dexterity: 17,
      constitution: 24,
    },
    availableClasses: [
      Class.FIGHTER,
      Class.RANGER,
      Class.CLERIC,
      Class.DRUID,
      Class.OUTCAST,
    ],
    reference: [],
  },

  [Race.AURAK]: {
    name: Race.AURAK,
    title: 'Aurak',
    slug: 'aurak',
    description: 'Draconian subrace. Wingless, proficient in magic.',
    features: [],
    xpPenalty: 20,
    allowedAlignments: [Alignment.EVIL],
    maxStats: {
      strength: 18,
      intelligence: 23,
      wisdom: 20,
      dexterity: 17,
      constitution: 20,
    },
    availableClasses: [
      Class.FIGHTER,
      Class.CLERIC,
      Class.TRANSMUTER,
      Class.INVOKER,
      Class.NECROMANCER,
      Class.OUTCAST,
    ],
    reference: [],
  },

  [Race.BAAZ]: {
    name: Race.BAAZ,
    title: 'Baaz',
    slug: 'baaz',
    description: 'Draconian subrace. Slender but agile, decent thieves.',
    features: [],
    xpPenalty: 20,
    allowedAlignments: [Alignment.EVIL],
    maxStats: {
      strength: 20,
      intelligence: 18,
      wisdom: 18,
      dexterity: 23,
      constitution: 21,
    },
    availableClasses: [
      Class.FIGHTER,
      Class.THIEF,
      Class.ASSASSIN,
      Class.OUTCAST,
    ],
    reference: [],
  },

  [Race.BOZAK]: {
    name: Race.BOZAK,
    title: 'Bozak',
    slug: 'bozak',
    description: 'Draconian subrace. Strong and unnaturally wise.',
    features: [],
    xpPenalty: 20,
    allowedAlignments: [Alignment.EVIL],
    maxStats: {
      strength: 22,
      intelligence: 20,
      wisdom: 22,
      dexterity: 18,
      constitution: 22,
    },
    availableClasses: [
      Class.FIGHTER,
      Class.CLERIC,
      Class.TRANSMUTER,
      Class.INVOKER,
      Class.NECROMANCER,
      Class.OUTCAST,
    ],
    reference: [],
  },

  [Race.KAPAK]: {
    name: Race.KAPAK,
    title: 'Kapak',
    slug: 'kapak',
    description: 'Draconian subrace. All-rounders, capable of spitting acid.',
    features: [],
    xpPenalty: 20,
    allowedAlignments: [Alignment.EVIL],
    maxStats: {
      strength: 21,
      intelligence: 20,
      wisdom: 20,
      dexterity: 21,
      constitution: 20,
    },
    availableClasses: [Class.FIGHTER, Class.CLERIC, Class.OUTCAST],
    reference: [],
  },

  [Race.SIVAK]: {
    name: Race.SIVAK,
    title: 'Sivak',
    slug: 'sivak',
    description:
      'Draconian subrace. Strongest, able to fly in the sky, larger than others.',
    features: [],
    xpPenalty: 20,
    allowedAlignments: [Alignment.EVIL],
    maxStats: {
      strength: 23,
      intelligence: 19,
      wisdom: 18,
      dexterity: 21,
      constitution: 22,
    },
    availableClasses: [Class.FIGHTER, Class.OUTCAST],
    reference: [],
  },
};

// Helper function to get race by name
export function getRace(name: Race | string): RaceData | undefined {
  return races[name as Race];
}

// Helper function to get race by slug
export function getRaceBySlug(slug: string): RaceData | undefined {
  return Object.values(races).find(race => race.slug === slug);
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

// Helper functions for race-class compatibility
export function isValidRaceClassCombo(race: Race, className: Class): boolean {
  const raceData = races[race];
  if (!raceData) return false;

  return raceData.availableClasses.includes(className);
}

export function getCompatibleClassesForRace(race: Race): Class[] {
  const raceData = races[race];
  if (!raceData) return [];

  return raceData.availableClasses;
}

export function getCompatibleRacesForClass(className: Class): Race[] {
  return Object.keys(races).filter(race =>
    isValidRaceClassCombo(race as Race, className)
  ) as Race[];
}

export function getRaceStats(race: Race): CharacterStats | null {
  const raceData = races[race];
  if (!raceData) return null;

  return raceData.maxStats;
}

export function getAllValidRaceClassCombos(): Array<{
  race: Race;
  class: Class;
  maxStats: CharacterStats;
}> {
  const combos: Array<{ race: Race; class: Class; maxStats: CharacterStats }> =
    [];

  Object.entries(races).forEach(([race, raceData]) => {
    raceData.availableClasses.forEach(className => {
      combos.push({
        race: race as Race,
        class: className,
        maxStats: raceData.maxStats,
      });
    });
  });

  return combos;
}

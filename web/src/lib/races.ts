import { RaceData, CharacterStats } from './types';
import { Race, Alignment, Class } from './enums';

export const races: Record<Race, RaceData> = {
  [Race.HUMAN]: {
    name: Race.HUMAN,
    description: 'The most common race of the world, may be of any alignment.',
    features: ['Has +3 to maximum of primary characteristic'],
    xpPenalty: 0,
    allowedAlignments: [Alignment.GOOD, Alignment.NEUTRAL, Alignment.EVIL],
    maxStats: { strength: 20, intelligence: 20, wisdom: 20, dexterity: 20, constitution: 20 },
    availableClasses: [Class.FIGHTER, Class.KNIGHT, Class.RANGER, Class.CLERIC, Class.DRUID, Class.THIEF, Class.ASSASSIN, Class.TRANSMUTER, Class.INVOKER, Class.NECROMANCER, Class.OUTCAST]
  },

  [Race.HALF_ELF]: {
    name: Race.HALF_ELF,
    description: 'Offspring of humans and elves, may be of any alignment.',
    features: ['Has +2 to maximum of primary characteristic'],
    xpPenalty: 5,
    allowedAlignments: [Alignment.GOOD, Alignment.NEUTRAL, Alignment.EVIL],
    maxStats: { strength: 19, intelligence: 21, wisdom: 21, dexterity: 21, constitution: 19 },
    availableClasses: [Class.FIGHTER, Class.KNIGHT, Class.RANGER, Class.CLERIC, Class.DRUID, Class.THIEF, Class.ASSASSIN, Class.TRANSMUTER, Class.INVOKER]
  },

  [Race.DWARF]: {
    name: Race.DWARF,
    description: 'Short & stout fellows, make good warriors. Neutral or good.',
    features: [],
    xpPenalty: 10,
    allowedAlignments: [Alignment.GOOD, Alignment.NEUTRAL],
    maxStats: { strength: 22, intelligence: 19, wisdom: 20, dexterity: 18, constitution: 25 },
    availableClasses: [Class.FIGHTER, Class.KNIGHT, Class.CLERIC, Class.THIEF, Class.ASSASSIN]
  },

  [Race.ELF]: {
    name: Race.ELF,
    description: 'Not very strong, but exceedingly smart. Always good.',
    features: [],
    xpPenalty: 20,
    allowedAlignments: [Alignment.GOOD],
    maxStats: { strength: 17, intelligence: 24, wisdom: 25, dexterity: 23, constitution: 16 },
    availableClasses: [Class.FIGHTER, Class.KNIGHT, Class.RANGER, Class.CLERIC, Class.DRUID, Class.THIEF, Class.ASSASSIN, Class.TRANSMUTER, Class.INVOKER]
  },

  [Race.WILD_ELF]: {
    name: Race.WILD_ELF,
    description: 'Cross breed between Dark and normal Elves. Neutral or good.',
    features: [],
    xpPenalty: 20,
    allowedAlignments: [Alignment.GOOD, Alignment.NEUTRAL],
    maxStats: { strength: 18, intelligence: 23, wisdom: 23, dexterity: 24, constitution: 17 },
    availableClasses: [Class.FIGHTER, Class.RANGER, Class.CLERIC, Class.DRUID, Class.THIEF, Class.TRANSMUTER, Class.INVOKER]
  },

  [Race.DARK_ELF]: {
    name: Race.DARK_ELF,
    description: 'Frail, make excellent clerics and mages. Always evil.',
    features: [],
    xpPenalty: 20,
    allowedAlignments: [Alignment.EVIL],
    maxStats: { strength: 17, intelligence: 24, wisdom: 22, dexterity: 23, constitution: 18 },
    availableClasses: [Class.FIGHTER, Class.CLERIC, Class.DRUID, Class.THIEF, Class.ASSASSIN, Class.TRANSMUTER, Class.INVOKER, Class.NECROMANCER, Class.OUTCAST]
  },

  [Race.KENDER]: {
    name: Race.KENDER,
    description: 'Small, nimble kleptomaniacs. Always good.',
    features: [],
    xpPenalty: 10,
    allowedAlignments: [Alignment.GOOD],
    maxStats: { strength: 18, intelligence: 20, wisdom: 18, dexterity: 25, constitution: 18 },
    availableClasses: [Class.FIGHTER, Class.RANGER, Class.THIEF]
  },

  [Race.HALF_KENDER]: {
    name: Race.HALF_KENDER,
    description: 'Offspring of humans and kenders. Neutral or good.',
    features: ['Has +1 to maximum of primary characteristic'],
    xpPenalty: 10,
    allowedAlignments: [Alignment.GOOD, Alignment.NEUTRAL],
    maxStats: { strength: 19, intelligence: 20, wisdom: 19, dexterity: 23, constitution: 19 },
    availableClasses: [Class.FIGHTER, Class.KNIGHT, Class.RANGER, Class.CLERIC, Class.DRUID, Class.THIEF, Class.ASSASSIN, Class.TRANSMUTER, Class.INVOKER]
  },

  [Race.GNOME]: {
    name: Race.GNOME,
    description: 'Short and smart, inventors by nature. Always neutral. ',
    features: [],
    xpPenalty: 10,
    allowedAlignments: [Alignment.NEUTRAL],
    maxStats: { strength: 18, intelligence: 25, wisdom: 23, dexterity: 18, constitution: 20 },
    availableClasses: [Class.FIGHTER, Class.CLERIC, Class.DRUID, Class.THIEF, Class.TRANSMUTER, Class.INVOKER]
  },

  [Race.MINOTAUR]: {
    name: Race.MINOTAUR,
    description: 'Large, powerful race, may be of any alignment.',
    features: [],
    xpPenalty: 25,
    allowedAlignments: [Alignment.GOOD, Alignment.NEUTRAL, Alignment.EVIL],
    maxStats: { strength: 25, intelligence: 15, wisdom: 17, dexterity: 17, constitution: 24 },
    availableClasses: [Class.FIGHTER, Class.RANGER, Class.CLERIC, Class.DRUID, Class.OUTCAST]
  },

  [Race.AURAK]: {
    name: Race.AURAK,
    description: 'Draconian subrace. Wingless, proficient in magic.',
    features: [],
    xpPenalty: 20,
    allowedAlignments: [Alignment.EVIL],
    maxStats: { strength: 18, intelligence: 23, wisdom: 20, dexterity: 17, constitution: 20 },
    availableClasses: [Class.FIGHTER, Class.CLERIC, Class.TRANSMUTER, Class.INVOKER, Class.NECROMANCER, Class.OUTCAST]
  },

  [Race.BAAZ]: {
    name: Race.BAAZ,
    description: 'Draconian subrace. Slender but agile, decent thieves.',
    features: [],
    xpPenalty: 20,
    allowedAlignments: [Alignment.EVIL],
    maxStats: { strength: 20, intelligence: 18, wisdom: 18, dexterity: 23, constitution: 21 },
    availableClasses: [Class.FIGHTER, Class.THIEF, Class.ASSASSIN, Class.OUTCAST]
  },

  [Race.BOZAK]: {
    name: Race.BOZAK,
    description: 'Draconian subrace. Strong and unnaturally wise.',
    features: [],
    xpPenalty: 20,
    allowedAlignments: [Alignment.EVIL],
    maxStats: { strength: 22, intelligence: 20, wisdom: 22, dexterity: 18, constitution: 22 },
    availableClasses: [Class.FIGHTER, Class.CLERIC, Class.TRANSMUTER, Class.INVOKER, Class.NECROMANCER, Class.OUTCAST]
  },

  [Race.KAPAK]: {
    name: Race.KAPAK,
    description: 'Draconian subrace. All-rounders, capable of spitting acid.',
    features: [],
    xpPenalty: 20,
    allowedAlignments: [Alignment.EVIL],
    maxStats: { strength: 21, intelligence: 20, wisdom: 20, dexterity: 21, constitution: 20 },
    availableClasses: [Class.FIGHTER, Class.CLERIC, Class.OUTCAST]
  },

  [Race.SIVAK]: {
    name: Race.SIVAK,
    description: 'Draconian subrace. Strongest, able to fly in the sky, larger than others.',
    features: [],
    xpPenalty: 20,
    allowedAlignments: [Alignment.EVIL],
    maxStats: { strength: 23, intelligence: 19, wisdom: 18, dexterity: 21, constitution: 22 },
    availableClasses: [Class.FIGHTER, Class.OUTCAST]
  }
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

export function getAllValidRaceClassCombos(): Array<{ race: Race; class: Class; maxStats: CharacterStats }> {
  const combos: Array<{ race: Race; class: Class; maxStats: CharacterStats }> = [];
  
  Object.entries(races).forEach(([race, raceData]) => {
    raceData.availableClasses.forEach(className => {
      combos.push({
        race: race as Race,
        class: className,
        maxStats: raceData.maxStats
      });
    });
  });
  
  return combos;
}
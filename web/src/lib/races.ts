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
    description: 'Short, stocky race, may be of any alignment.',
    features: [],
    xpPenalty: 10,
    allowedAlignments: [Alignment.GOOD, Alignment.NEUTRAL, Alignment.EVIL],
    maxStats: { strength: 0, intelligence: 0, wisdom: 0, dexterity: 0, constitution: 0 },
    availableClasses: [Class.FIGHTER, Class.KNIGHT, Class.RANGER, Class.CLERIC, Class.DRUID, Class.THIEF, Class.ASSASSIN, Class.TRANSMUTER, Class.INVOKER, Class.OUTCAST]
  },

  [Race.ELF]: {
    name: Race.ELF,
    description: 'Tall, graceful race, may be of any alignment.',
    features: [],
    xpPenalty: 15,
    allowedAlignments: [Alignment.GOOD, Alignment.NEUTRAL, Alignment.EVIL],
    maxStats: { strength: 0, intelligence: 0, wisdom: 0, dexterity: 0, constitution: 0 },
    availableClasses: [Class.FIGHTER, Class.KNIGHT, Class.RANGER, Class.CLERIC, Class.DRUID, Class.THIEF, Class.ASSASSIN, Class.TRANSMUTER, Class.INVOKER, Class.OUTCAST]
  },

  [Race.WILD_ELF]: {
    name: Race.WILD_ELF,
    description: 'Elves who live in the wild, may be of any alignment.',
    features: [],
    xpPenalty: 20,
    allowedAlignments: [Alignment.GOOD, Alignment.NEUTRAL, Alignment.EVIL],
    maxStats: { strength: 0, intelligence: 0, wisdom: 0, dexterity: 0, constitution: 0 },
    availableClasses: [Class.FIGHTER, Class.KNIGHT, Class.RANGER, Class.CLERIC, Class.DRUID, Class.THIEF, Class.ASSASSIN, Class.TRANSMUTER, Class.INVOKER, Class.OUTCAST]
  },

  [Race.DARK_ELF]: {
    name: Race.DARK_ELF,
    description: 'Elves who live in darkness, may be of any alignment.',
    features: [],
    xpPenalty: 25,
    allowedAlignments: [Alignment.GOOD, Alignment.NEUTRAL, Alignment.EVIL],
    maxStats: { strength: 17, intelligence: 24, wisdom: 22, dexterity: 23, constitution: 18 },
    availableClasses: [Class.FIGHTER, Class.CLERIC, Class.DRUID, Class.THIEF, Class.ASSASSIN, Class.TRANSMUTER, Class.INVOKER, Class.NECROMANCER, Class.OUTCAST]
  },

  [Race.KENDER]: {
    name: Race.KENDER,
    description: 'Small, curious race, may be of any alignment.',
    features: [],
    xpPenalty: 15,
    allowedAlignments: [Alignment.GOOD, Alignment.NEUTRAL, Alignment.EVIL],
    maxStats: { strength: 18, intelligence: 20, wisdom: 18, dexterity: 25, constitution: 18 },
    availableClasses: [Class.FIGHTER, Class.KNIGHT, Class.RANGER, Class.CLERIC, Class.DRUID, Class.THIEF]
  },

  [Race.HALF_KENDER]: {
    name: Race.HALF_KENDER,
    description: 'Offspring of humans and kender, may be of any alignment.',
    features: [],
    xpPenalty: 20,
    allowedAlignments: [Alignment.GOOD, Alignment.NEUTRAL, Alignment.EVIL],
    maxStats: { strength: 0, intelligence: 0, wisdom: 0, dexterity: 0, constitution: 0 },
    availableClasses: [Class.FIGHTER, Class.KNIGHT, Class.RANGER, Class.CLERIC, Class.DRUID, Class.THIEF, Class.ASSASSIN, Class.TRANSMUTER, Class.INVOKER, Class.OUTCAST]
  },

  [Race.GNOME]: {
    name: Race.GNOME,
    description: 'Small, intelligent race, may be of any alignment.',
    features: [],
    xpPenalty: 15,
    allowedAlignments: [Alignment.GOOD, Alignment.NEUTRAL, Alignment.EVIL],
    maxStats: { strength: 0, intelligence: 0, wisdom: 0, dexterity: 0, constitution: 0 },
    availableClasses: [Class.FIGHTER, Class.KNIGHT, Class.RANGER, Class.CLERIC, Class.DRUID, Class.THIEF, Class.ASSASSIN, Class.TRANSMUTER, Class.INVOKER, Class.OUTCAST]
  },

  [Race.MINOTAUR]: {
    name: Race.MINOTAUR,
    description: 'Large, powerful race, may be of any alignment.',
    features: [],
    xpPenalty: 20,
    allowedAlignments: [Alignment.GOOD, Alignment.NEUTRAL, Alignment.EVIL],
    maxStats: { strength: 0, intelligence: 0, wisdom: 0, dexterity: 0, constitution: 0 },
    availableClasses: [Class.FIGHTER, Class.KNIGHT, Class.RANGER, Class.CLERIC, Class.DRUID, Class.THIEF, Class.ASSASSIN, Class.TRANSMUTER, Class.INVOKER, Class.NECROMANCER, Class.OUTCAST]
  },

  [Race.DRACONIAN]: {
    name: Race.DRACONIAN,
    description: 'Dragon-like race, may be of any alignment.',
    features: [],
    xpPenalty: 25,
    allowedAlignments: [Alignment.GOOD, Alignment.NEUTRAL, Alignment.EVIL],
    maxStats: { strength: 0, intelligence: 0, wisdom: 0, dexterity: 0, constitution: 0 },
    availableClasses: [Class.FIGHTER, Class.KNIGHT, Class.RANGER, Class.CLERIC, Class.DRUID, Class.THIEF, Class.ASSASSIN, Class.TRANSMUTER, Class.INVOKER, Class.NECROMANCER, Class.OUTCAST]
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
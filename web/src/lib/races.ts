import { RaceData, CharacterStats } from './types';
import { Race, Alignment, Class } from './enums';

export interface RaceClassCombo {
  maxStats: CharacterStats;
}

export const raceClassStats: Record<Race, Record<Class, RaceClassCombo>> = {
  [Race.HUMAN]: {
    [Class.FIGHTER]: {
      maxStats: { strength: 0, intelligence: 0, wisdom: 0, dexterity: 0, constitution: 0 }
    },
    [Class.KNIGHT]: {
      maxStats: { strength: 0, intelligence: 0, wisdom: 0, dexterity: 0, constitution: 0 }
    },
    [Class.RANGER]: {
      maxStats: { strength: 0, intelligence: 0, wisdom: 0, dexterity: 0, constitution: 0 }
    },
    [Class.CLERIC]: {
      maxStats: { strength: 0, intelligence: 0, wisdom: 0, dexterity: 0, constitution: 0 }
    },
    [Class.DRUID]: {
      maxStats: { strength: 0, intelligence: 0, wisdom: 0, dexterity: 0, constitution: 0 }
    },
    [Class.THIEF]: {
      maxStats: { strength: 0, intelligence: 0, wisdom: 0, dexterity: 0, constitution: 0 }
    },
    [Class.ASSASSIN]: {
      maxStats: { strength: 0, intelligence: 0, wisdom: 0, dexterity: 0, constitution: 0 }
    },
    [Class.TRANSMUTER]: {
      maxStats: { strength: 0, intelligence: 0, wisdom: 0, dexterity: 0, constitution: 0 }
    },
    [Class.INVOKER]: {
      maxStats: { strength: 0, intelligence: 0, wisdom: 0, dexterity: 0, constitution: 0 }
    },
    [Class.NECROMANCER]: {
      maxStats: { strength: 0, intelligence: 0, wisdom: 0, dexterity: 0, constitution: 0 }
    },
    [Class.OUTCAST]: {
      maxStats: { strength: 0, intelligence: 0, wisdom: 0, dexterity: 0, constitution: 0 }
    }
  },

  [Race.HALF_ELF]: {
    [Class.FIGHTER]: {
      maxStats: { strength: 0, intelligence: 0, wisdom: 0, dexterity: 0, constitution: 0 }
    },
    [Class.KNIGHT]: {
      maxStats: { strength: 0, intelligence: 0, wisdom: 0, dexterity: 0, constitution: 0 }
    },
    [Class.RANGER]: {
      maxStats: { strength: 0, intelligence: 0, wisdom: 0, dexterity: 0, constitution: 0 }
    },
    [Class.CLERIC]: {
      maxStats: { strength: 0, intelligence: 0, wisdom: 0, dexterity: 0, constitution: 0 }
    },
    [Class.DRUID]: {
      maxStats: { strength: 0, intelligence: 0, wisdom: 0, dexterity: 0, constitution: 0 }
    },
    [Class.THIEF]: {
      maxStats: { strength: 0, intelligence: 0, wisdom: 0, dexterity: 0, constitution: 0 }
    },
    [Class.ASSASSIN]: {
      maxStats: { strength: 0, intelligence: 0, wisdom: 0, dexterity: 0, constitution: 0 }
    },
    [Class.TRANSMUTER]: {
      maxStats: { strength: 0, intelligence: 0, wisdom: 0, dexterity: 0, constitution: 0 }
    },
    [Class.INVOKER]: {
      maxStats: { strength: 0, intelligence: 0, wisdom: 0, dexterity: 0, constitution: 0 }
    },
    [Class.NECROMANCER]: {
      maxStats: { strength: 0, intelligence: 0, wisdom: 0, dexterity: 0, constitution: 0 }
    },
    [Class.OUTCAST]: {
      maxStats: { strength: 0, intelligence: 0, wisdom: 0, dexterity: 0, constitution: 0 }
    }
  },

  [Race.DWARF]: {
    [Class.FIGHTER]: {
      maxStats: { strength: 0, intelligence: 0, wisdom: 0, dexterity: 0, constitution: 0 }
    },
    [Class.KNIGHT]: {
      maxStats: { strength: 0, intelligence: 0, wisdom: 0, dexterity: 0, constitution: 0 }
    },
    [Class.RANGER]: {
      maxStats: { strength: 0, intelligence: 0, wisdom: 0, dexterity: 0, constitution: 0 }
    },
    [Class.CLERIC]: {
      maxStats: { strength: 0, intelligence: 0, wisdom: 0, dexterity: 0, constitution: 0 }
    },
    [Class.DRUID]: {
      maxStats: { strength: 0, intelligence: 0, wisdom: 0, dexterity: 0, constitution: 0 }
    },
    [Class.THIEF]: {
      maxStats: { strength: 0, intelligence: 0, wisdom: 0, dexterity: 0, constitution: 0 }
    },
    [Class.ASSASSIN]: {
      maxStats: { strength: 0, intelligence: 0, wisdom: 0, dexterity: 0, constitution: 0 }
    },
    [Class.TRANSMUTER]: {
      maxStats: { strength: 0, intelligence: 0, wisdom: 0, dexterity: 0, constitution: 0 }
    },
    [Class.INVOKER]: {
      maxStats: { strength: 0, intelligence: 0, wisdom: 0, dexterity: 0, constitution: 0 }
    },
    [Class.NECROMANCER]: {
      maxStats: { strength: 0, intelligence: 0, wisdom: 0, dexterity: 0, constitution: 0 }
    },
    [Class.OUTCAST]: {
      maxStats: { strength: 0, intelligence: 0, wisdom: 0, dexterity: 0, constitution: 0 }
    }
  },

  [Race.ELF]: {
    [Class.FIGHTER]: {
      maxStats: { strength: 0, intelligence: 0, wisdom: 0, dexterity: 0, constitution: 0 }
    },
    [Class.KNIGHT]: {
      maxStats: { strength: 0, intelligence: 0, wisdom: 0, dexterity: 0, constitution: 0 }
    },
    [Class.RANGER]: {
      maxStats: { strength: 0, intelligence: 0, wisdom: 0, dexterity: 0, constitution: 0 }
    },
    [Class.CLERIC]: {
      maxStats: { strength: 0, intelligence: 0, wisdom: 0, dexterity: 0, constitution: 0 }
    },
    [Class.DRUID]: {
      maxStats: { strength: 0, intelligence: 0, wisdom: 0, dexterity: 0, constitution: 0 }
    },
    [Class.THIEF]: {
      maxStats: { strength: 0, intelligence: 0, wisdom: 0, dexterity: 0, constitution: 0 }
    },
    [Class.ASSASSIN]: {
      maxStats: { strength: 0, intelligence: 0, wisdom: 0, dexterity: 0, constitution: 0 }
    },
    [Class.TRANSMUTER]: {
      maxStats: { strength: 0, intelligence: 0, wisdom: 0, dexterity: 0, constitution: 0 }
    },
    [Class.INVOKER]: {
      maxStats: { strength: 0, intelligence: 0, wisdom: 0, dexterity: 0, constitution: 0 }
    },
    [Class.NECROMANCER]: {
      maxStats: { strength: 0, intelligence: 0, wisdom: 0, dexterity: 0, constitution: 0 }
    },
    [Class.OUTCAST]: {
      maxStats: { strength: 0, intelligence: 0, wisdom: 0, dexterity: 0, constitution: 0 }
    }
  },

  [Race.WILD_ELF]: {
    [Class.FIGHTER]: {
      maxStats: { strength: 0, intelligence: 0, wisdom: 0, dexterity: 0, constitution: 0 }
    },
    [Class.KNIGHT]: {
      maxStats: { strength: 0, intelligence: 0, wisdom: 0, dexterity: 0, constitution: 0 }
    },
    [Class.RANGER]: {
      maxStats: { strength: 0, intelligence: 0, wisdom: 0, dexterity: 0, constitution: 0 }
    },
    [Class.CLERIC]: {
      maxStats: { strength: 0, intelligence: 0, wisdom: 0, dexterity: 0, constitution: 0 }
    },
    [Class.DRUID]: {
      maxStats: { strength: 0, intelligence: 0, wisdom: 0, dexterity: 0, constitution: 0 }
    },
    [Class.THIEF]: {
      maxStats: { strength: 0, intelligence: 0, wisdom: 0, dexterity: 0, constitution: 0 }
    },
    [Class.ASSASSIN]: {
      maxStats: { strength: 0, intelligence: 0, wisdom: 0, dexterity: 0, constitution: 0 }
    },
    [Class.TRANSMUTER]: {
      maxStats: { strength: 0, intelligence: 0, wisdom: 0, dexterity: 0, constitution: 0 }
    },
    [Class.INVOKER]: {
      maxStats: { strength: 0, intelligence: 0, wisdom: 0, dexterity: 0, constitution: 0 }
    },
    [Class.NECROMANCER]: {
      maxStats: { strength: 0, intelligence: 0, wisdom: 0, dexterity: 0, constitution: 0 }
    },
    [Class.OUTCAST]: {
      maxStats: { strength: 0, intelligence: 0, wisdom: 0, dexterity: 0, constitution: 0 }
    }
  },

  [Race.DARK_ELF]: {
    [Class.FIGHTER]: {
      maxStats: { strength: 0, intelligence: 0, wisdom: 0, dexterity: 0, constitution: 0 }
    },
    [Class.KNIGHT]: {
      maxStats: { strength: 0, intelligence: 0, wisdom: 0, dexterity: 0, constitution: 0 }
    },
    [Class.RANGER]: {
      maxStats: { strength: 0, intelligence: 0, wisdom: 0, dexterity: 0, constitution: 0 }
    },
    [Class.CLERIC]: {
      maxStats: { strength: 0, intelligence: 0, wisdom: 0, dexterity: 0, constitution: 0 }
    },
    [Class.DRUID]: {
      maxStats: { strength: 0, intelligence: 0, wisdom: 0, dexterity: 0, constitution: 0 }
    },
    [Class.THIEF]: {
      maxStats: { strength: 0, intelligence: 0, wisdom: 0, dexterity: 0, constitution: 0 }
    },
    [Class.ASSASSIN]: {
      maxStats: { strength: 0, intelligence: 0, wisdom: 0, dexterity: 0, constitution: 0 }
    },
    [Class.TRANSMUTER]: {
      maxStats: { strength: 0, intelligence: 0, wisdom: 0, dexterity: 0, constitution: 0 }
    },
    [Class.INVOKER]: {
      maxStats: { strength: 0, intelligence: 0, wisdom: 0, dexterity: 0, constitution: 0 }
    },
    [Class.NECROMANCER]: {
      maxStats: { strength: 0, intelligence: 0, wisdom: 0, dexterity: 0, constitution: 0 }
    },
    [Class.OUTCAST]: {
      maxStats: { strength: 0, intelligence: 0, wisdom: 0, dexterity: 0, constitution: 0 }
    }
  },

  [Race.KENDER]: {
    [Class.FIGHTER]: {
      maxStats: { strength: 0, intelligence: 0, wisdom: 0, dexterity: 0, constitution: 0 }
    },
    [Class.KNIGHT]: {
      maxStats: { strength: 0, intelligence: 0, wisdom: 0, dexterity: 0, constitution: 0 }
    },
    [Class.RANGER]: {
      maxStats: { strength: 0, intelligence: 0, wisdom: 0, dexterity: 0, constitution: 0 }
    },
    [Class.CLERIC]: {
      maxStats: { strength: 0, intelligence: 0, wisdom: 0, dexterity: 0, constitution: 0 }
    },
    [Class.DRUID]: {
      maxStats: { strength: 0, intelligence: 0, wisdom: 0, dexterity: 0, constitution: 0 }
    },
    [Class.THIEF]: {
      maxStats: { strength: 0, intelligence: 0, wisdom: 0, dexterity: 0, constitution: 0 }
    },
    [Class.ASSASSIN]: {
      maxStats: { strength: 0, intelligence: 0, wisdom: 0, dexterity: 0, constitution: 0 }
    },
    [Class.TRANSMUTER]: {
      maxStats: { strength: 0, intelligence: 0, wisdom: 0, dexterity: 0, constitution: 0 }
    },
    [Class.INVOKER]: {
      maxStats: { strength: 0, intelligence: 0, wisdom: 0, dexterity: 0, constitution: 0 }
    },
    [Class.NECROMANCER]: {
      maxStats: { strength: 0, intelligence: 0, wisdom: 0, dexterity: 0, constitution: 0 }
    },
    [Class.OUTCAST]: {
      maxStats: { strength: 0, intelligence: 0, wisdom: 0, dexterity: 0, constitution: 0 }
    }
  },

  [Race.HALF_KENDER]: {
    [Class.FIGHTER]: {
      maxStats: { strength: 0, intelligence: 0, wisdom: 0, dexterity: 0, constitution: 0 }
    },
    [Class.KNIGHT]: {
      maxStats: { strength: 0, intelligence: 0, wisdom: 0, dexterity: 0, constitution: 0 }
    },
    [Class.RANGER]: {
      maxStats: { strength: 0, intelligence: 0, wisdom: 0, dexterity: 0, constitution: 0 }
    },
    [Class.CLERIC]: {
      maxStats: { strength: 0, intelligence: 0, wisdom: 0, dexterity: 0, constitution: 0 }
    },
    [Class.DRUID]: {
      maxStats: { strength: 0, intelligence: 0, wisdom: 0, dexterity: 0, constitution: 0 }
    },
    [Class.THIEF]: {
      maxStats: { strength: 0, intelligence: 0, wisdom: 0, dexterity: 0, constitution: 0 }
    },
    [Class.ASSASSIN]: {
      maxStats: { strength: 0, intelligence: 0, wisdom: 0, dexterity: 0, constitution: 0 }
    },
    [Class.TRANSMUTER]: {
      maxStats: { strength: 0, intelligence: 0, wisdom: 0, dexterity: 0, constitution: 0 }
    },
    [Class.INVOKER]: {
      maxStats: { strength: 0, intelligence: 0, wisdom: 0, dexterity: 0, constitution: 0 }
    },
    [Class.NECROMANCER]: {
      maxStats: { strength: 0, intelligence: 0, wisdom: 0, dexterity: 0, constitution: 0 }
    },
    [Class.OUTCAST]: {
      maxStats: { strength: 0, intelligence: 0, wisdom: 0, dexterity: 0, constitution: 0 }
    }
  },

  [Race.GNOME]: {
    [Class.FIGHTER]: {
      maxStats: { strength: 0, intelligence: 0, wisdom: 0, dexterity: 0, constitution: 0 }
    },
    [Class.KNIGHT]: {
      maxStats: { strength: 0, intelligence: 0, wisdom: 0, dexterity: 0, constitution: 0 }
    },
    [Class.RANGER]: {
      maxStats: { strength: 0, intelligence: 0, wisdom: 0, dexterity: 0, constitution: 0 }
    },
    [Class.CLERIC]: {
      maxStats: { strength: 0, intelligence: 0, wisdom: 0, dexterity: 0, constitution: 0 }
    },
    [Class.DRUID]: {
      maxStats: { strength: 0, intelligence: 0, wisdom: 0, dexterity: 0, constitution: 0 }
    },
    [Class.THIEF]: {
      maxStats: { strength: 0, intelligence: 0, wisdom: 0, dexterity: 0, constitution: 0 }
    },
    [Class.ASSASSIN]: {
      maxStats: { strength: 0, intelligence: 0, wisdom: 0, dexterity: 0, constitution: 0 }
    },
    [Class.TRANSMUTER]: {
      maxStats: { strength: 0, intelligence: 0, wisdom: 0, dexterity: 0, constitution: 0 }
    },
    [Class.INVOKER]: {
      maxStats: { strength: 0, intelligence: 0, wisdom: 0, dexterity: 0, constitution: 0 }
    },
    [Class.NECROMANCER]: {
      maxStats: { strength: 0, intelligence: 0, wisdom: 0, dexterity: 0, constitution: 0 }
    },
    [Class.OUTCAST]: {
      maxStats: { strength: 0, intelligence: 0, wisdom: 0, dexterity: 0, constitution: 0 }
    }
  },

  [Race.MINOTAUR]: {
    [Class.FIGHTER]: {
      maxStats: { strength: 0, intelligence: 0, wisdom: 0, dexterity: 0, constitution: 0 }
    },
    [Class.KNIGHT]: {
      maxStats: { strength: 0, intelligence: 0, wisdom: 0, dexterity: 0, constitution: 0 }
    },
    [Class.RANGER]: {
      maxStats: { strength: 0, intelligence: 0, wisdom: 0, dexterity: 0, constitution: 0 }
    },
    [Class.CLERIC]: {
      maxStats: { strength: 0, intelligence: 0, wisdom: 0, dexterity: 0, constitution: 0 }
    },
    [Class.DRUID]: {
      maxStats: { strength: 0, intelligence: 0, wisdom: 0, dexterity: 0, constitution: 0 }
    },
    [Class.THIEF]: {
      maxStats: { strength: 0, intelligence: 0, wisdom: 0, dexterity: 0, constitution: 0 }
    },
    [Class.ASSASSIN]: {
      maxStats: { strength: 0, intelligence: 0, wisdom: 0, dexterity: 0, constitution: 0 }
    },
    [Class.TRANSMUTER]: {
      maxStats: { strength: 0, intelligence: 0, wisdom: 0, dexterity: 0, constitution: 0 }
    },
    [Class.INVOKER]: {
      maxStats: { strength: 0, intelligence: 0, wisdom: 0, dexterity: 0, constitution: 0 }
    },
    [Class.NECROMANCER]: {
      maxStats: { strength: 0, intelligence: 0, wisdom: 0, dexterity: 0, constitution: 0 }
    },
    [Class.OUTCAST]: {
      maxStats: { strength: 0, intelligence: 0, wisdom: 0, dexterity: 0, constitution: 0 }
    }
  },

  [Race.DRACONIAN]: {
    [Class.FIGHTER]: {
      maxStats: { strength: 0, intelligence: 0, wisdom: 0, dexterity: 0, constitution: 0 }
    },
    [Class.KNIGHT]: {
      maxStats: { strength: 0, intelligence: 0, wisdom: 0, dexterity: 0, constitution: 0 }
    },
    [Class.RANGER]: {
      maxStats: { strength: 0, intelligence: 0, wisdom: 0, dexterity: 0, constitution: 0 }
    },
    [Class.CLERIC]: {
      maxStats: { strength: 0, intelligence: 0, wisdom: 0, dexterity: 0, constitution: 0 }
    },
    [Class.DRUID]: {
      maxStats: { strength: 0, intelligence: 0, wisdom: 0, dexterity: 0, constitution: 0 }
    },
    [Class.THIEF]: {
      maxStats: { strength: 0, intelligence: 0, wisdom: 0, dexterity: 0, constitution: 0 }
    },
    [Class.ASSASSIN]: {
      maxStats: { strength: 0, intelligence: 0, wisdom: 0, dexterity: 0, constitution: 0 }
    },
    [Class.TRANSMUTER]: {
      maxStats: { strength: 0, intelligence: 0, wisdom: 0, dexterity: 0, constitution: 0 }
    },
    [Class.INVOKER]: {
      maxStats: { strength: 0, intelligence: 0, wisdom: 0, dexterity: 0, constitution: 0 }
    },
    [Class.NECROMANCER]: {
      maxStats: { strength: 0, intelligence: 0, wisdom: 0, dexterity: 0, constitution: 0 }
    },
    [Class.OUTCAST]: {
      maxStats: { strength: 0, intelligence: 0, wisdom: 0, dexterity: 0, constitution: 0 }
    }
  }
};

export const races: Record<Race, RaceData> = {
  [Race.HUMAN]: {
    name: Race.HUMAN,
    description: 'The most common race of the world, may be of any alignment.',
    features: ['Has +3 to maximum of primary characteristic'],
    xpPenalty: 0,
    allowedAlignments: [Alignment.GOOD, Alignment.NEUTRAL, Alignment.EVIL],
  },

  [Race.HALF_ELF]: {
    name: Race.HALF_ELF,
    description: 'Offspring of humans and elves, may be of any alignment.',
    features: [],
    xpPenalty: 5,
    allowedAlignments: [Alignment.GOOD, Alignment.NEUTRAL, Alignment.EVIL],
  },

  [Race.DWARF]: {
    name: Race.DWARF,
    description: 'Short & stout fellows, make good warriors. Neutral or good.',
    features: [],
    xpPenalty: 10,
    allowedAlignments: [Alignment.GOOD, Alignment.NEUTRAL],
  },

  [Race.ELF]: {
    name: Race.ELF,
    description: 'Not very strong, but exceedingly smart. Always good.',
    features: [],
    xpPenalty: 20,
    allowedAlignments: [Alignment.GOOD],
  },

  [Race.WILD_ELF]: {
    name: Race.WILD_ELF,
    description: 'Cross breed between Dark and normal Elves. Neutral or good.',
    features: [],
    xpPenalty: 20,
    allowedAlignments: [Alignment.GOOD, Alignment.NEUTRAL],
  },

  [Race.DARK_ELF]: {
    name: Race.DARK_ELF,
    description: 'Frail, make excellent clerics and mages. Always evil.',
    features: [],
    xpPenalty: 20,
    allowedAlignments: [Alignment.EVIL],
  },

  [Race.KENDER]: {
    name: Race.KENDER,
    description: 'Small, nimble kleptomaniacs. Always good.',
    features: [],
    xpPenalty: 10,
    allowedAlignments: [Alignment.GOOD],
  },

  [Race.HALF_KENDER]: {
    name: Race.HALF_KENDER,
    description: 'Offspring of humans and kenders. Neutral or good.',
    features: [],
    xpPenalty: 10,
    allowedAlignments: [Alignment.GOOD, Alignment.NEUTRAL],
  },

  [Race.GNOME]: {
    name: Race.GNOME,
    description: 'Short and smart, inventors by nature. Always neutral.',
    features: [],
    xpPenalty: 10,
    allowedAlignments: [Alignment.NEUTRAL],
  },

  [Race.MINOTAUR]: {
    name: Race.MINOTAUR,
    description: 'Big, strong, slow. Excellent warriors. Any alignment.',
    features: [],
    xpPenalty: 25,
    allowedAlignments: [Alignment.GOOD, Alignment.NEUTRAL, Alignment.EVIL],
  },

  [Race.DRACONIAN]: {
    name: Race.DRACONIAN,
    description: 'Dragon offspring corrupted by dark magic. Always evil.',
    features: [],
    xpPenalty: 20,
    allowedAlignments: [Alignment.EVIL],
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

// Helper functions for race-class compatibility
export function getRaceClassStats(race: Race, className: Class): CharacterStats | null {
  const raceStats = raceClassStats[race];
  if (!raceStats) return null;
  
  const classCombo = raceStats[className];
  return classCombo?.maxStats ?? null;
}

export function isValidRaceClassCombo(race: Race, className: Class): boolean {
  const raceStats = raceClassStats[race];
  if (!raceStats) return false;
  
  return className in raceStats;
}

export function getCompatibleClassesForRace(race: Race): Class[] {
  const raceStats = raceClassStats[race];
  if (!raceStats) return [];
  
  return Object.keys(raceStats) as Class[];
}

export function getCompatibleRacesForClass(className: Class): Race[] {
  return Object.keys(raceClassStats).filter(race => 
    isValidRaceClassCombo(race as Race, className)
  ) as Race[];
}

export function getAllValidRaceClassCombos(): Array<{ race: Race; class: Class; maxStats: CharacterStats }> {
  const combos: Array<{ race: Race; class: Class; maxStats: CharacterStats }> = [];
  
  Object.entries(raceClassStats).forEach(([race, classStats]) => {
    Object.entries(classStats || {}).forEach(([className, combo]) => {
      if (combo) {
        combos.push({
          race: race as Race,
          class: className as Class,
          maxStats: combo.maxStats
        });
      }
    });
  });
  
  return combos;
}

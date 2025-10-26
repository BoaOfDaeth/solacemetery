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
    resistances: [],
  },

  [Race.HALF_ELF]: {
    name: Race.HALF_ELF,
    title: 'Half-Elf',
    slug: 'half-elf',
    description: 'Offspring of humans and elves.',
    features: [
      'Has +2 to maximum of primary characteristic',
      'Can sneak and move quietly',
      'Can see in the darkness',
    ],
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
    resistances: [
      {
        damtype: 'negative energy',
        value: -10,
      },
      {
        damtype: 'holy attacks',
        value: 7,
      },
    ],
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
    resistances: [],
  },

  [Race.ELF]: {
    name: Race.ELF,
    title: 'Elf',
    slug: 'elf',
    description: 'Not very strong, but exceedingly smart.',
    features: [
      'Can sneak and move quietly',
      'Can see in the darkness',
      'Skilled in swordsmanship if class allows',
      'Natural ability to blend in with the forests and detect others who are so blended',
      'Moves easier in forests',
    ],
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
      { label: 'sword dancing', url: '/help/sword-dancing' },
    ],
    resistances: [
      {
        damtype: 'negative energy',
        value: -20,
      },
      {
        damtype: 'holy attacks',
        value: 15,
      },
    ],
  },

  [Race.WILD_ELF]: {
    name: Race.WILD_ELF,
    title: 'Wild-Elf',
    slug: 'wild-elf',
    description: 'Cross breed between Dark and normal Elves.',
    features: [
      'Can sneak and move quietly',
      'Can see in the darkness',
      'Skilled in swordsmanship if class allows',
      'Natural ability to blend in with the forests and detect others who are so blended',
      'Moves easier in forests',
    ],
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
      { label: 'sword dancing', url: '/help/sword-dancing' },
    ],
    resistances: [
      {
        damtype: 'negative energy',
        value: -15,
      },
      {
        damtype: 'holy attacks',
        value: 10,
      },
    ],
  },

  [Race.DARK_ELF]: {
    name: Race.DARK_ELF,
    title: 'Dark-Elf',
    slug: 'dark-elf',
    description: 'Frail, make excellent clerics and mages.',
    features: [
      'Can sneak and move quietly',
      'Can see in the darkness',
      'Skilled in swordsmanship, if class allows',
      'Necromancers who are dark-elves automatically have an innate mastery of the negative channel skill',
      'Moves easier in forests',
    ],
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
    reference: [
      { label: 'negative channel', url: '/help/negative-channel' },
      { label: 'sword dancing', url: '/help/sword-dancing' },
    ],
    resistances: [
      {
        damtype: 'negative energy',
        value: 15,
      },
      {
        damtype: 'holy attacks',
        value: -20,
      },
    ],
  },

  [Race.KENDER]: {
    name: Race.KENDER,
    title: 'Kender',
    slug: 'kender',
    description: 'Small, nimble kleptomaniacs.',
    features: [
      'Can carve hoopaks from the wood',
      'Have special skills when using hoopak',
      'Learn stealing at expert level, if thieves',
      'Learn dodging at decent level, if class allows',
      'Expert level of staff',
      'Can taunt others into a fight',
      'Not allowed to join any clan',
      'Not very good at climbing mountains',
    ],
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
    reference: [
      { label: 'carve hoopak', url: '/help/carve-hoopak' },
      { label: 'taunt', url: '/help/taunt' },
      { label: 'thrust', url: '/help/thrust' },
      { label: 'whirl', url: '/help/whirl' },
    ],
    resistances: [
      {
        damtype: 'acidic attacks',
        value: 15,
      },
      {
        damtype: 'poison',
        value: -15,
      },
      {
        damtype: 'diseases',
        value: -15,
      },
    ],
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
    reference: [
      { label: 'half-kender', url: '/help/half-kender-half-kenders' },
    ],
    resistances: [
      {
        damtype: 'acidic attacks',
        value: 7,
      },
      {
        damtype: 'poison',
        value: -7,
      },
      {
        damtype: 'diseases',
        value: -7,
      },
    ],
  },

  [Race.GNOME]: {
    name: Race.GNOME,
    title: 'Gnome',
    slug: 'gnome',
    description: 'Short and smart, inventors by nature.',
    features: [
      'Can use staves and wands at expert level',
      'Not very good at climbing mountains',
    ],
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
    resistances: [
      {
        damtype: 'bashing',
        value: -20,
      },
    ],
  },

  [Race.MINOTAUR]: {
    name: Race.MINOTAUR,
    title: 'Minotaur',
    slug: 'minotaur',
    description: 'Large, powerful race.',
    features: [
      'Receive deathblow skill, if fighters',
      'Learn enhanced damage, bash and several other skills at expert level, if class allows',
    ],
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
    reference: [{ label: 'deathblow', url: '/help/deathblow' }],
    resistances: [
      {
        damtype: 'bashing',
        value: 20,
      },
      {
        damtype: 'piercing',
        value: 15,
      },
      {
        damtype: 'slashing',
        value: 21,
      },
      {
        damtype: 'fire',
        value: -25,
      },
      {
        damtype: 'cold',
        value: 20,
      },
      {
        damtype: 'acidic attacks',
        value: 10,
      },
    ],
  },

  [Race.AURAK]: {
    name: Race.AURAK,
    title: 'Aurak',
    slug: 'aurak',
    description: 'Draconian subrace. Wingless, proficient in magic.',
    features: [
      'Has natural ability to regenerate health',
      'Expert level of enhanced damage, if class allows',
      'Reduced movement cost and lag on mountains',
    ],
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
    reference: [
      { label: 'regeneration', url: '/help/imbue-regeneration-regeneration' },
    ],
    resistances: [
      {
        damtype: 'bashing',
        value: 10,
      },
      {
        damtype: 'piercing',
        value: 10,
      },
      {
        damtype: 'slashing',
        value: 10,
      },
      {
        damtype: 'poison',
        value: 20,
      },
      {
        damtype: 'holy attacks',
        value: -20,
      },
      {
        damtype: 'diseases',
        value: 10,
      },
    ],
  },

  [Race.BAAZ]: {
    name: Race.BAAZ,
    title: 'Baaz',
    slug: 'baaz',
    description: 'Draconian subrace. Slender but agile, decent thieves.',
    features: [
      'Has natural ability to regenerate health',
      'Expert level of enhanced damage, if class allows',
      'Can use their wings to evade attempts at tripping, crushing, and other bashing attacks',
      'Somehow have a lower movement lag everywhere',
    ],
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
    resistances: [
      {
        damtype: 'bashing',
        value: 10,
      },
      {
        damtype: 'piercing',
        value: 10,
      },
      {
        damtype: 'slashing',
        value: 10,
      },
      {
        damtype: 'poison',
        value: 20,
      },
      {
        damtype: 'holy attacks',
        value: -20,
      },
      {
        damtype: 'diseases',
        value: 10,
      },
    ],
  },

  [Race.BOZAK]: {
    name: Race.BOZAK,
    title: 'Bozak',
    slug: 'bozak',
    description: 'Draconian subrace. Strong and unnaturally wise.',
    features: [
      'Has natural ability to regenerate health',
      'Expert level of enhanced damage, if class allows',
      'Can use their wings to evade attempts at tripping, crushing, and other bashing attacks',
      'Reduced movement cost and lag on mountains',
    ],
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
    resistances: [
      {
        damtype: 'bashing',
        value: 10,
      },
      {
        damtype: 'piercing',
        value: 10,
      },
      {
        damtype: 'slashing',
        value: 10,
      },
      {
        damtype: 'poison',
        value: 20,
      },
      {
        damtype: 'holy attacks',
        value: -20,
      },
      {
        damtype: 'diseases',
        value: 10,
      },
    ],
  },

  [Race.KAPAK]: {
    name: Race.KAPAK,
    title: 'Kapak',
    slug: 'kapak',
    description: 'Draconian subrace. All-rounders, capable of spitting acid.',
    features: [
      'Has natural ability to regenerate health',
      'Expert level of enhanced damage, if class allows',
      'Can use their wings to evade attempts at tripping, crushing, and other bashing attacks',
      'Can spit acid at others',
      'Reduced movement cost and lag on mountains',
    ],
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
    reference: [
      { label: 'acidic spit', url: '/help/acidic-spit' },
    ],
    resistances: [
      {
        damtype: 'bashing',
        value: 10,
      },
      {
        damtype: 'piercing',
        value: 10,
      },
      {
        damtype: 'slashing',
        value: 10,
      },
      {
        damtype: 'poison',
        value: 20,
      },
      {
        damtype: 'holy attacks',
        value: -20,
      },
      {
        damtype: 'diseases',
        value: 10,
      },
    ],
  },

  [Race.SIVAK]: {
    name: Race.SIVAK,
    title: 'Sivak',
    slug: 'sivak',
    description:
      'Draconian subrace. Strongest, able to fly in the sky, larger than others.',
      features: [
        'Has natural ability to regenerate health',
        'Expert level of enhanced damage, if class allows',
        'Can use their wings to evade attempts at tripping, crushing, and other bashing attacks',
        'Has wings large enough to fly across the sky',
        'Reduced movement cost and lag on mountains',
      ],
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
    resistances: [],
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

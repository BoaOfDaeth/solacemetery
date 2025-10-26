import { ClassData } from './types';
import { Class, Alignment } from './enums';

export const classes: Record<Class, ClassData> = {
  [Class.FIGHTER]: {
    name: Class.FIGHTER,
    description: 'Best all around fighters, little magic ability.',
    features: [],
    xpPenalty: 0,
    allowedAlignments: [Alignment.GOOD, Alignment.NEUTRAL, Alignment.EVIL],
  },

  [Class.KNIGHT]: {
    name: Class.KNIGHT,
    description: 'Seekers of full knighthood - refer to \'knight\' help.',
    features: [],
    xpPenalty: 20,
    allowedAlignments: [Alignment.GOOD, Alignment.NEUTRAL, Alignment.EVIL],
  },

  [Class.RANGER]: {
    name: Class.RANGER,
    description: 'Forest warriors, learned in woodlore and survival.',
    features: [],
    xpPenalty: 10,
    allowedAlignments: [Alignment.GOOD, Alignment.NEUTRAL, Alignment.EVIL],
  },

  [Class.CLERIC]: {
    name: Class.CLERIC,
    description: 'Followers of the Gods - refer to \'cleric\' help.',
    features: [],
    xpPenalty: 0,
    allowedAlignments: [Alignment.GOOD, Alignment.NEUTRAL, Alignment.EVIL],
  },

  [Class.DRUID]: {
    name: Class.DRUID,
    description: 'Disciples of natural magic and control.',
    features: [],
    xpPenalty: 0,
    allowedAlignments: [Alignment.GOOD, Alignment.NEUTRAL, Alignment.EVIL],
  },

  [Class.THIEF]: {
    name: Class.THIEF,
    description: 'The skilled stealer of other people\'s belongings.',
    features: [],
    xpPenalty: 0,
    allowedAlignments: [Alignment.GOOD, Alignment.NEUTRAL, Alignment.EVIL],
  },

  [Class.ASSASSIN]: {
    name: Class.ASSASSIN,
    description: 'Specialists in stealth and unarmed killing.',
    features: [],
    xpPenalty: 15,
    allowedAlignments: [Alignment.GOOD, Alignment.NEUTRAL, Alignment.EVIL],
  },

  [Class.TRANSMUTER]: {
    name: Class.TRANSMUTER,
    description: 'Specialist mages who are masters of alteration magic.',
    features: [],
    xpPenalty: 0,
    allowedAlignments: [Alignment.GOOD, Alignment.NEUTRAL, Alignment.EVIL],
  },

  [Class.INVOKER]: {
    name: Class.INVOKER,
    description: 'Specialist mages who are masters of energy manipulation.',
    features: [],
    xpPenalty: 0,
    allowedAlignments: [Alignment.GOOD, Alignment.NEUTRAL, Alignment.EVIL],
  },

  [Class.NECROMANCER]: {
    name: Class.NECROMANCER,
    description: 'Specialist mages who practice the black magics, always evil.',
    features: [],
    xpPenalty: 0,
    allowedAlignments: [Alignment.EVIL],
  },

  [Class.OUTCAST]: {
    name: Class.OUTCAST,
    description: 'Knight outcasts who turn on good and follow the black magics.',
    features: [],
    xpPenalty: 15,
    allowedAlignments: [Alignment.EVIL],
  },
};

// Helper function to get class by name
export function getClass(name: Class | string): ClassData | undefined {
  return classes[name as Class];
}

// Helper function to get all classes
export function getAllClasses(): ClassData[] {
  return Object.values(classes);
}

// Helper function to get classes by alignment
export function getClassesByAlignment(alignment: Alignment): ClassData[] {
  return Object.values(classes).filter(cls => 
    cls.allowedAlignments.includes(alignment)
  );
}

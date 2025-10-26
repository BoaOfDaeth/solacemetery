import { ClassData } from './types';
import { Class, Alignment } from './enums';

export const classes: Record<Class, ClassData> = {
  [Class.FIGHTER]: {
    name: Class.FIGHTER,
    description: 'Best all around fighters, little magic ability.',
    features: [],
    xpPenalty: 0,
    allowedAlignments: [Alignment.GOOD, Alignment.NEUTRAL, Alignment.EVIL],
    reference: [
      { label: 'specialization', url: '/help/specialization-specialize' },
    ],
  },

  [Class.KNIGHT]: {
    name: Class.KNIGHT,
    description: "Seekers of full knighthood - refer to 'knight' help.",
    features: [],
    xpPenalty: 20,
    allowedAlignments: [Alignment.GOOD],
    reference: [],
  },

  [Class.RANGER]: {
    name: Class.RANGER,
    description: 'Forest warriors, learned in woodlore and survival.',
    features: [],
    xpPenalty: 10,
    allowedAlignments: [Alignment.GOOD, Alignment.NEUTRAL],
    reference: [
      { label: 'specialization', url: '/help/specialization-specialize' },
    ],
  },
  [Class.CLERIC]: {
    name: Class.CLERIC,
    description: "Followers of the Gods - refer to 'cleric' help.",
    features: [],
    xpPenalty: 0,
    allowedAlignments: [Alignment.GOOD, Alignment.NEUTRAL, Alignment.EVIL],
    reference: [{ label: 'worship', url: '/help/worship' }],
  },

  [Class.DRUID]: {
    name: Class.DRUID,
    description: 'Disciples of natural magic and control.',
    features: [],
    xpPenalty: 0,
    allowedAlignments: [Alignment.GOOD, Alignment.NEUTRAL],
    reference: [{ label: 'kinship', url: '/help/animal-kinship-kinship' }],
  },

  [Class.THIEF]: {
    name: Class.THIEF,
    description: "The skilled stealer of other people's belongings.",
    features: [],
    xpPenalty: 0,
    allowedAlignments: [Alignment.GOOD, Alignment.NEUTRAL, Alignment.EVIL],
    reference: [],
  },

  [Class.ASSASSIN]: {
    name: Class.ASSASSIN,
    description: 'Specialists in stealth and unarmed killing.',
    features: [],
    xpPenalty: 15,
    allowedAlignments: [Alignment.GOOD, Alignment.NEUTRAL, Alignment.EVIL],
    reference: [{ label: 'wayfollow', url: '/help/wayfollow-waypath' }],
  },

  [Class.TRANSMUTER]: {
    name: Class.TRANSMUTER,
    description: 'Specialist mages who are masters of alteration magic.',
    features: [],
    xpPenalty: 0,
    allowedAlignments: [Alignment.GOOD, Alignment.NEUTRAL, Alignment.EVIL],
    reference: [
      { label: 'magicmajor', url: '/help/magicmajor' },
      { label: 'forms', url: '/help/forms' },
    ],
  },

  [Class.INVOKER]: {
    name: Class.INVOKER,
    description: 'Specialist mages who are masters of energy manipulation.',
    features: [],
    xpPenalty: 0,
    allowedAlignments: [Alignment.GOOD, Alignment.NEUTRAL, Alignment.EVIL],
    reference: [],
  },

  [Class.NECROMANCER]: {
    name: Class.NECROMANCER,
    description: 'Specialist mages who practice the black magics, always evil.',
    features: [],
    xpPenalty: 0,
    allowedAlignments: [Alignment.EVIL],
    reference: [],
  },

  [Class.OUTCAST]: {
    name: Class.OUTCAST,
    description:
      'Knight outcasts who turn on good and follow the black magics.',
    features: [],
    xpPenalty: 15,
    allowedAlignments: [Alignment.EVIL],
    reference: [],
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

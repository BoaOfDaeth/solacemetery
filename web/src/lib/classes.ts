import { ClassData } from './types';
import { Class, Alignment } from './enums';

export const classes: Record<Class, ClassData> = {
  [Class.FIGHTER]: {
    name: Class.FIGHTER,
    title: 'Fighter',
    slug: 'fighter',
    description: 'Best all around fighters, little magic ability.',
    features: [],
    xpPenalty: 0,
    allowedAlignments: [Alignment.GOOD, Alignment.NEUTRAL, Alignment.EVIL],
    reference: [
      { label: 'specialization', url: '/help/specialization-specialize' },
    ],
    weapons: [
      { name: 'axe', level: 1 },
      { name: 'dagger', level: 1 },
      { name: 'flail', level: 1 },
      { name: 'mace', level: 1 },
      { name: 'polearm', level: 1 },
      { name: 'spear', level: 1 },
      { name: 'sword', level: 1 },
      { name: 'whip', level: 1 },
      { name: 'staff', level: 1 },
      { name: 'bow', level: 1 },
      { name: 'crossbow', level: 1 },
    ],
    basicSkills: {
      title: 'Fighter Skills',
      skills: [
        { name: 'shield block', level: 1 },
        { name: 'enhanced damage', level: 1 },
        { name: 'rescue', level: 1 },
        { name: 'parry', level: 1 },
        { name: 'recall', level: 1 },
        { name: 'dirt kicking', level: 2 },
        { name: 'hand to hand', level: 3 },
        { name: 'kick', level: 3 },
        { name: 'second attack', level: 4 },
        { name: 'fast healing', level: 5 },
        { name: 'trip', level: 6 },
        { name: 'feint', level: 7 },
        { name: 'bandage', level: 8 },
        { name: 'warcry', level: 9 },
        { name: 'disarm', level: 9 },
        { name: 'dual wield', level: 10 },
        { name: 'dodge', level: 10 },
        { name: 'riding', level: 10 },
        { name: 'bash', level: 11 },
        { name: 'third attack', level: 11 },
        { name: 'berserk', level: 12 },
        { name: 'haggle', level: 12 },
        { name: 'meditation', level: 12 },
        { name: 'shield cleave', level: 13 },
        { name: 'stance', level: 13 },
        { name: 'lunge', level: 14 },
        { name: 'trophy', level: 14 },
        { name: 'crush', level: 15 },
        { name: 'lore', level: 16 },
        { name: 'offhand disarm', level: 16 },
        { name: 'mounted fighting', level: 16 },
        { name: 'recovery', level: 17 },
        { name: 'toughen', level: 20 },
        { name: 'warrior spirit', level: 21 },
        { name: 'fourth attack', level: 23 },
        { name: 'adrenalin rush', level: 25 },
      ],
    },
  },

  [Class.KNIGHT]: {
    name: Class.KNIGHT,
    title: 'Knight',
    slug: 'knight',
    description: "Seekers of full knighthood.",
    features: [],
    xpPenalty: 20,
    allowedAlignments: [Alignment.GOOD],
    reference: [],
  },

  [Class.RANGER]: {
    name: Class.RANGER,
    title: 'Ranger',
    slug: 'ranger',
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
    title: 'Cleric',
    slug: 'cleric',
    description: "Followers of the Gods.",
    features: [],
    xpPenalty: 0,
    allowedAlignments: [Alignment.GOOD, Alignment.NEUTRAL, Alignment.EVIL],
    reference: [{ label: 'worship', url: '/help/worship' }],
  },

  [Class.DRUID]: {
    name: Class.DRUID,
    title: 'Druid',
    slug: 'druid',
    description: 'Disciples of natural magic and control.',
    features: [],
    xpPenalty: 0,
    allowedAlignments: [Alignment.GOOD, Alignment.NEUTRAL],
    reference: [{ label: 'kinship', url: '/help/animal-kinship-kinship' }],
  },

  [Class.THIEF]: {
    name: Class.THIEF,
    title: 'Thief',
    slug: 'thief',
    description: "The skilled stealer of other people's belongings.",
    features: [],
    xpPenalty: 0,
    allowedAlignments: [Alignment.GOOD, Alignment.NEUTRAL, Alignment.EVIL],
    reference: [],
  },

  [Class.ASSASSIN]: {
    name: Class.ASSASSIN,
    title: 'Assassin',
    slug: 'assassin',
    description: 'Specialists in stealth and unarmed killing.',
    features: [],
    xpPenalty: 15,
    allowedAlignments: [Alignment.GOOD, Alignment.EVIL],
    reference: [{ label: 'wayfollow', url: '/help/wayfollow-waypath' }],
  },

  [Class.TRANSMUTER]: {
    name: Class.TRANSMUTER,
    title: 'Transmuter',
    slug: 'transmuter',
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
    title: 'Invoker',
    slug: 'invoker',
    description: 'Specialist mages who are masters of energy manipulation.',
    features: [],
    xpPenalty: 0,
    allowedAlignments: [Alignment.GOOD, Alignment.NEUTRAL, Alignment.EVIL],
    reference: [],
  },

  [Class.NECROMANCER]: {
    name: Class.NECROMANCER,
    title: 'Necromancer',
    slug: 'necromancer',
    description: 'Specialist mages who practice the black magics.',
    features: [],
    xpPenalty: 0,
    allowedAlignments: [Alignment.EVIL],
    reference: [],
  },

  [Class.OUTCAST]: {
    name: Class.OUTCAST,
    title: 'Outcast',
    slug: 'outcast',
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

// Helper function to get class by slug
export function getClassBySlug(slug: string): ClassData | undefined {
  return Object.values(classes).find(cls => cls.slug === slug);
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

import { ClassData } from './types';
import { Class, Alignment, FighterSpecialization } from './enums';

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
    basicSkills: [
      { name: 'shield block', level: 1, url: '/help/shield-block' },
      { name: 'enhanced damage', level: 1, url: '/help/enhanced-damage' },
      { name: 'rescue', level: 1, url: '/help/rescue' },
      { name: 'parry', level: 1, url: '/help/parry' },
      { name: 'recall', level: 1, url: '/help/recall-' },
      { name: 'dirt kicking', level: 2, url: '/help/dirt-dirt-kicking' },
      { name: 'hand to hand', level: 3, url: '/help/hand-to-hand' },
      { name: 'kick', level: 3, url: '/help/kick' },
      { name: 'second attack', level: 4, url: '/help/second-attack' },
      { name: 'fast healing', level: 5, url: '/help/fast-healing' },
      { name: 'trip', level: 6, url: '/help/trip' },
      { name: 'feint', level: 7, url: '/help/feint' },
      { name: 'bandage', level: 8, url: '/help/bandage' },
      { name: 'warcry', level: 9, url: '/help/warcry' },
      { name: 'disarm', level: 9, url: '/help/disarm' },
      { name: 'dual wield', level: 10, url: '/help/dual-dual-wield' },
      { name: 'dodge', level: 10, url: '/help/dodge' },
      { name: 'riding', level: 10, url: '/help/mount-ride-dismount-riding' },
      { name: 'bash', level: 11, url: '/help/bash' },
      { name: 'third attack', level: 11, url: '/help/third-attack-fourth-attack' },
      { name: 'berserk', level: 12, url: '/help/berserk' },
      { name: 'haggle', level: 12, url: '/help/haggle-haggling' },
      { name: 'meditation', level: 12, url: '/help/meditation' },
      { name: 'shield cleave', level: 13, url: '/help/shield-cleave' },
      { name: 'stance', level: 13, url: '/help/stance-stances-relax' },
      { name: 'lunge', level: 14, url: '/help/lunge' },
      { name: 'trophy', level: 14, url: '/help/trophy' },
      { name: 'crush', level: 15, url: '/help/crush' },
      { name: 'lore', level: 16, url: '/help/lore' },
      { name: 'offhand disarm', level: 16, url: '/help/offhand-disarm' },
      { name: 'mounted fighting', level: 16, url: '/help/mounted-fighting' },
      { name: 'recovery', level: 17, url: '/help/recovery' },
      { name: 'toughen', level: 20, url: '/help/toughen' },
      { name: 'warrior spirit', level: 21, url: '/help/warrior-spirit' },
      { name: 'fourth attack', level: 23, url: '/help/third-attack-fourth-attack' },
      { name: 'adrenalin rush', level: 25, url: '/help/adrenalin-rush' },
    ],
    specChoices: 3,
    specAllowed: [
      FighterSpecialization.SWORD,
      FighterSpecialization.DAGGER,
      FighterSpecialization.WHIP_FLAIL,
      FighterSpecialization.MACE,
      FighterSpecialization.AXE,
      FighterSpecialization.STAFF,
      FighterSpecialization.SPEAR,
      FighterSpecialization.HAND_TO_HAND,
      FighterSpecialization.RANGED,
      FighterSpecialization.SHIELD,
    ],
    specs: [
      {
        id: FighterSpecialization.SWORD,
        skills: [
          { name: 'flurry', level: 29, url: '/help/flurry' },
          { name: 'flourentine', level: 18, url: '/help/flourentine' },
          { name: 'riposte', level: 21, url: '/help/riposte' },
          { name: 'cross slice', level: 22, url: '/help/cross-slice-crossslice' },
        ],
      },
      {
        id: FighterSpecialization.DAGGER,
        skills: [
          { name: 'undercut', level: 19, url: '/help/undercut' },
          { name: 'bleed', level: 14, url: '/help/bleed' },
          { name: 'restrike', level: 24, url: '/help/restrike' },
        ],
      },
      {
        id: FighterSpecialization.WHIP_FLAIL,
        skills: [
          { name: 'flog', level: 16, url: '/help/flog-flogging' },
          { name: 'strip weapon', level: 16, url: '/help/strip-weapon' },
          { name: 'choke', level: 21, url: '/help/choke' },
          { name: 'lash', level: 11, url: '/help/lash' },
          { name: 'pull', level: 19, url: '/help/pull' },
          { name: 'eyejab', level: 13, url: '/help/eyejab' },
        ],
      },
      {
        id: FighterSpecialization.MACE,
        skills: [
          { name: 'boneshatter', level: 17, url: '/help/boneshatter' },
          { name: 'backhand', level: 15, url: '/help/backhand' },
          { name: 'drumming maces', level: 26, url: '/help/drumming-maces-drum' },
        ],
      },
      {
        id: FighterSpecialization.AXE,
        skills: [
          { name: 'pincer', level: 21, url: '/help/pincer' },
          { name: 'cleave', level: 26, url: '/help/cleave' },
          { name: 'chop', level: 14, url: '/help/chop' },
          { name: 'concussion strike', level: 23, url: '/help/concussion-strike-concussion' },
          { name: 'wrist chop', level: 26, url: '/help/wrist-chop-wristchop' },
          { name: 'meatgrinder', level: 28, url: '/help/meatgrinder' },
        ],
      },
      {
        id: FighterSpecialization.STAFF,
        skills: [
          { name: 'overhead', level: 20, url: '/help/overhead' },
          { name: 'pugil', level: 10, url: '/help/pugil' },
          { name: 'leg sweep', level: 16, url: '/help/leg-sweep-legsweep' },
          { name: 'stand off', level: 15, url: '/help/stand-off' },
        ],
      },
      {
        id: FighterSpecialization.SPEAR,
        skills: [
          { name: 'charge set', level: 22, url: '/help/charge-set' },
          { name: 'impale', level: 26, url: '/help/impale' },
          { name: 'jab', level: 16, url: '/help/jab' },
          { name: 'stand off', level: 15, url: '/help/stand-off' },
          { name: 'harpoon', level: 31, url: '/help/harpoon' },
        ],
      },
      {
        id: FighterSpecialization.HAND_TO_HAND,
        skills: [
          { name: 'iron strike', level: 11 },
          { name: 'throw', level: 16 },
          { name: 'leaping strike', level: 20 },
          { name: 'ground control', level: 18 },
          { name: 'hand block', level: 12 },
          { name: 'grapple', level: 10 },
        ],
      },
      {
        id: FighterSpecialization.RANGED,
        skills: [
          { name: 'accuracy', level: 11, url: '/help/accuracy' },
          { name: 'quick shot', level: 15, url: '/help/quick-shot-quickshot' },
          { name: 'aimed shot', level: 19, url: '/help/aimed-shot' },
          { name: 'volley', level: 26, url: '/help/volley' },
        ],
      },
      {
        id: FighterSpecialization.SHIELD,
        skills: [
          { name: 'shield mastery', level: 24 },
          { name: 'shield bash', level: 21 },
          { name: 'porcupine stance', level: 16 },
        ],
      },
    ],
  },

  [Class.KNIGHT]: {
    name: Class.KNIGHT,
    title: 'Knight',
    slug: 'knight',
    description: 'Seekers of full knighthood.',
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
    description: 'Followers of the Gods.',
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

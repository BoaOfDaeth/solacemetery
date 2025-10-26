import { ClassData } from './types';
import { Class, Alignment, Race } from './enums';

export const classes: Record<Class, ClassData> = {
  [Class.FIGHTER]: {
    name: Class.FIGHTER,
    description: 'Best all around fighters with little magic ability. Fighters are masters of combat, specializing in weapons and armor.',
    features: 'Superior weapon proficiency, enhanced combat abilities, multiple attacks, weapon specialization, armor mastery',
    xpPenalty: 0,
    allowedAlignments: [Alignment.GOOD, Alignment.NEUTRAL, Alignment.EVIL],
    compatibleRaces: [Race.HUMAN, Race.HALF_ELF, Race.DWARF, Race.ELF, Race.WILD_ELF, Race.DARK_ELF, Race.KENDER, Race.HALF_KENDER, Race.GNOME, Race.MINOTAUR, Race.DRACONIAN],
  },

  [Class.KNIGHT]: {
    name: Class.KNIGHT,
    description: 'Seekers of full knighthood who follow a strict code of honor. Knights are noble warriors dedicated to justice and righteousness.',
    features: 'Code of honor, enhanced combat abilities, leadership skills, mount proficiency, noble status, special knight abilities',
    xpPenalty: 20,
    allowedAlignments: [Alignment.GOOD, Alignment.NEUTRAL, Alignment.EVIL],
    compatibleRaces: [Race.HUMAN, Race.HALF_ELF, Race.DWARF, Race.ELF, Race.WILD_ELF, Race.DARK_ELF, Race.KENDER, Race.HALF_KENDER, Race.GNOME, Race.MINOTAUR, Race.DRACONIAN],
  },

  [Class.RANGER]: {
    name: Class.RANGER,
    description: 'Forest warriors learned in woodlore and survival. Rangers are skilled trackers and protectors of nature.',
    features: 'Forest lore, tracking abilities, animal companions, survival skills, dual-wielding, nature magic',
    xpPenalty: 10,
    allowedAlignments: [Alignment.GOOD, Alignment.NEUTRAL, Alignment.EVIL],
    compatibleRaces: [Race.HUMAN, Race.HALF_ELF, Race.DWARF, Race.ELF, Race.WILD_ELF, Race.DARK_ELF, Race.KENDER, Race.HALF_KENDER, Race.GNOME, Race.MINOTAUR, Race.DRACONIAN],
  },

  [Class.CLERIC]: {
    name: Class.CLERIC,
    description: 'Followers of the Gods who channel divine power to heal, protect, and smite evil. Clerics are devoted servants of their deities.',
    features: 'Divine magic, healing abilities, turn undead, divine protection, religious knowledge, holy weapons',
    xpPenalty: 0,
    allowedAlignments: [Alignment.GOOD, Alignment.NEUTRAL, Alignment.EVIL],
    compatibleRaces: [Race.HUMAN, Race.HALF_ELF, Race.DWARF, Race.ELF, Race.WILD_ELF, Race.DARK_ELF, Race.KENDER, Race.HALF_KENDER, Race.GNOME, Race.MINOTAUR, Race.DRACONIAN],
  },

  [Class.DRUID]: {
    name: Class.DRUID,
    description: 'Disciples of natural magic and control. Druids are guardians of nature who wield the power of the elements.',
    features: 'Nature magic, animal transformation, elemental control, plant communication, weather influence, natural healing',
    xpPenalty: 0,
    allowedAlignments: [Alignment.GOOD, Alignment.NEUTRAL, Alignment.EVIL],
    compatibleRaces: [Race.HUMAN, Race.HALF_ELF, Race.DWARF, Race.ELF, Race.WILD_ELF, Race.DARK_ELF, Race.KENDER, Race.HALF_KENDER, Race.GNOME, Race.MINOTAUR, Race.DRACONIAN],
  },

  [Class.THIEF]: {
    name: Class.THIEF,
    description: 'The skilled stealer of other people\'s belongings. Thieves are masters of stealth, lockpicking, and acquiring wealth.',
    features: 'Stealth abilities, lockpicking, pickpocketing, backstab attacks, trap detection, climbing skills',
    xpPenalty: 0,
    allowedAlignments: [Alignment.GOOD, Alignment.NEUTRAL, Alignment.EVIL],
    compatibleRaces: [Race.HUMAN, Race.HALF_ELF, Race.DWARF, Race.ELF, Race.WILD_ELF, Race.DARK_ELF, Race.KENDER, Race.HALF_KENDER, Race.GNOME, Race.MINOTAUR, Race.DRACONIAN],
  },

  [Class.ASSASSIN]: {
    name: Class.ASSASSIN,
    description: 'Specialists in stealth and unarmed killing. Assassins are deadly killers who strike from the shadows.',
    features: 'Advanced stealth, assassination techniques, poison use, unarmed combat mastery, death attacks, shadow magic',
    xpPenalty: 15,
    allowedAlignments: [Alignment.GOOD, Alignment.NEUTRAL, Alignment.EVIL],
    compatibleRaces: [Race.HUMAN, Race.HALF_ELF, Race.DWARF, Race.ELF, Race.WILD_ELF, Race.DARK_ELF, Race.KENDER, Race.HALF_KENDER, Race.GNOME, Race.MINOTAUR, Race.DRACONIAN],
  },

  [Class.TRANSMUTER]: {
    name: Class.TRANSMUTER,
    description: 'Specialist mages who are masters of alteration magic. Transmuters can change the form and nature of objects and creatures.',
    features: 'Transmutation magic, polymorph abilities, object alteration, form changing, magical transformation, alchemy',
    xpPenalty: 0,
    allowedAlignments: [Alignment.GOOD, Alignment.NEUTRAL, Alignment.EVIL],
    compatibleRaces: [Race.HUMAN, Race.HALF_ELF, Race.DWARF, Race.ELF, Race.WILD_ELF, Race.DARK_ELF, Race.KENDER, Race.HALF_KENDER, Race.GNOME, Race.MINOTAUR, Race.DRACONIAN],
  },

  [Class.INVOKER]: {
    name: Class.INVOKER,
    description: 'Specialist mages who are masters of energy manipulation. Invokers channel raw magical energy to devastating effect.',
    features: 'Energy manipulation, elemental magic mastery, spell enhancement, magical energy control, destructive magic, energy resistance',
    xpPenalty: 0,
    allowedAlignments: [Alignment.GOOD, Alignment.NEUTRAL, Alignment.EVIL],
    compatibleRaces: [Race.HUMAN, Race.HALF_ELF, Race.DWARF, Race.ELF, Race.WILD_ELF, Race.DARK_ELF, Race.KENDER, Race.HALF_KENDER, Race.GNOME, Race.MINOTAUR, Race.DRACONIAN],
  },

  [Class.NECROMANCER]: {
    name: Class.NECROMANCER,
    description: 'Specialist mages who practice the black magics, always evil. Necromancers command the power of death and undeath.',
    features: 'Necromancy magic, undead control, death magic, soul manipulation, dark rituals, life drain abilities',
    xpPenalty: 0,
    allowedAlignments: [Alignment.EVIL],
    compatibleRaces: [Race.HUMAN, Race.HALF_ELF, Race.DARK_ELF, Race.MINOTAUR, Race.DRACONIAN],
  },

  [Class.OUTCAST]: {
    name: Class.OUTCAST,
    description: 'Knight outcasts who turn on good and follow the black magics. Outcasts are fallen knights who embrace darkness.',
    features: 'Fallen knight abilities, dark magic access, corrupted combat skills, unholy powers, dark mount, evil aura',
    xpPenalty: 15,
    allowedAlignments: [Alignment.EVIL],
    compatibleRaces: [Race.HUMAN, Race.HALF_ELF, Race.DARK_ELF, Race.MINOTAUR, Race.DRACONIAN],
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

// Helper function to get classes compatible with a race
export function getClassesForRace(raceName: Race): ClassData[] {
  return Object.values(classes).filter(cls => 
    cls.compatibleRaces.includes(raceName)
  );
}

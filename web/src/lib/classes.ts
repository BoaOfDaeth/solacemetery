import { Class } from './types';

export const classes: Record<string, Class> = {
  Fighter: {
    name: 'Fighter',
    description: 'Best all around fighters with little magic ability. Fighters are masters of combat, specializing in weapons and armor.',
    features: 'Superior weapon proficiency, enhanced combat abilities, multiple attacks, weapon specialization, armor mastery',
    xpPenalty: 0,
    allowedAlignments: ['Good', 'Neutral', 'Evil'],
    compatibleRaces: ['Human', 'Half-Elf', 'Dwarf', 'Elf', 'Wild-Elf', 'Dark-Elf', 'Kender', 'Half-Kender', 'Gnome', 'Minotaur', 'Draconian'],
  },

  Knight: {
    name: 'Knight',
    description: 'Seekers of full knighthood who follow a strict code of honor. Knights are noble warriors dedicated to justice and righteousness.',
    features: 'Code of honor, enhanced combat abilities, leadership skills, mount proficiency, noble status, special knight abilities',
    xpPenalty: 20,
    allowedAlignments: ['Good', 'Neutral', 'Evil'],
    compatibleRaces: ['Human', 'Half-Elf', 'Dwarf', 'Elf', 'Wild-Elf', 'Dark-Elf', 'Kender', 'Half-Kender', 'Gnome', 'Minotaur', 'Draconian'],
  },

  Ranger: {
    name: 'Ranger',
    description: 'Forest warriors learned in woodlore and survival. Rangers are skilled trackers and protectors of nature.',
    features: 'Forest lore, tracking abilities, animal companions, survival skills, dual-wielding, nature magic',
    xpPenalty: 10,
    allowedAlignments: ['Good', 'Neutral', 'Evil'],
    compatibleRaces: ['Human', 'Half-Elf', 'Dwarf', 'Elf', 'Wild-Elf', 'Dark-Elf', 'Kender', 'Half-Kender', 'Gnome', 'Minotaur', 'Draconian'],
  },

  Cleric: {
    name: 'Cleric',
    description: 'Followers of the Gods who channel divine power to heal, protect, and smite evil. Clerics are devoted servants of their deities.',
    features: 'Divine magic, healing abilities, turn undead, divine protection, religious knowledge, holy weapons',
    xpPenalty: 0,
    allowedAlignments: ['Good', 'Neutral', 'Evil'],
    compatibleRaces: ['Human', 'Half-Elf', 'Dwarf', 'Elf', 'Wild-Elf', 'Dark-Elf', 'Kender', 'Half-Kender', 'Gnome', 'Minotaur', 'Draconian'],
  },

  Druid: {
    name: 'Druid',
    description: 'Disciples of natural magic and control. Druids are guardians of nature who wield the power of the elements.',
    features: 'Nature magic, animal transformation, elemental control, plant communication, weather influence, natural healing',
    xpPenalty: 0,
    allowedAlignments: ['Good', 'Neutral', 'Evil'],
    compatibleRaces: ['Human', 'Half-Elf', 'Dwarf', 'Elf', 'Wild-Elf', 'Dark-Elf', 'Kender', 'Half-Kender', 'Gnome', 'Minotaur', 'Draconian'],
  },

  Thief: {
    name: 'Thief',
    description: 'The skilled stealer of other people\'s belongings. Thieves are masters of stealth, lockpicking, and acquiring wealth.',
    features: 'Stealth abilities, lockpicking, pickpocketing, backstab attacks, trap detection, climbing skills',
    xpPenalty: 0,
    allowedAlignments: ['Good', 'Neutral', 'Evil'],
    compatibleRaces: ['Human', 'Half-Elf', 'Dwarf', 'Elf', 'Wild-Elf', 'Dark-Elf', 'Kender', 'Half-Kender', 'Gnome', 'Minotaur', 'Draconian'],
  },

  Assassin: {
    name: 'Assassin',
    description: 'Specialists in stealth and unarmed killing. Assassins are deadly killers who strike from the shadows.',
    features: 'Advanced stealth, assassination techniques, poison use, unarmed combat mastery, death attacks, shadow magic',
    xpPenalty: 15,
    allowedAlignments: ['Good', 'Neutral', 'Evil'],
    compatibleRaces: ['Human', 'Half-Elf', 'Dwarf', 'Elf', 'Wild-Elf', 'Dark-Elf', 'Kender', 'Half-Kender', 'Gnome', 'Minotaur', 'Draconian'],
  },

  Transmuter: {
    name: 'Transmuter',
    description: 'Specialist mages who are masters of alteration magic. Transmuters can change the form and nature of objects and creatures.',
    features: 'Transmutation magic, polymorph abilities, object alteration, form changing, magical transformation, alchemy',
    xpPenalty: 0,
    allowedAlignments: ['Good', 'Neutral', 'Evil'],
    compatibleRaces: ['Human', 'Half-Elf', 'Dwarf', 'Elf', 'Wild-Elf', 'Dark-Elf', 'Kender', 'Half-Kender', 'Gnome', 'Minotaur', 'Draconian'],
  },

  Invoker: {
    name: 'Invoker',
    description: 'Specialist mages who are masters of energy manipulation. Invokers channel raw magical energy to devastating effect.',
    features: 'Energy manipulation, elemental magic mastery, spell enhancement, magical energy control, destructive magic, energy resistance',
    xpPenalty: 0,
    allowedAlignments: ['Good', 'Neutral', 'Evil'],
    compatibleRaces: ['Human', 'Half-Elf', 'Dwarf', 'Elf', 'Wild-Elf', 'Dark-Elf', 'Kender', 'Half-Kender', 'Gnome', 'Minotaur', 'Draconian'],
  },

  Necromancer: {
    name: 'Necromancer',
    description: 'Specialist mages who practice the black magics, always evil. Necromancers command the power of death and undeath.',
    features: 'Necromancy magic, undead control, death magic, soul manipulation, dark rituals, life drain abilities',
    xpPenalty: 0,
    allowedAlignments: ['Evil'],
    compatibleRaces: ['Human', 'Half-Elf', 'Dark-Elf', 'Minotaur', 'Draconian'],
  },

  Outcast: {
    name: 'Outcast',
    description: 'Knight outcasts who turn on good and follow the black magics. Outcasts are fallen knights who embrace darkness.',
    features: 'Fallen knight abilities, dark magic access, corrupted combat skills, unholy powers, dark mount, evil aura',
    xpPenalty: 15,
    allowedAlignments: ['Evil'],
    compatibleRaces: ['Human', 'Half-Elf', 'Dark-Elf', 'Minotaur', 'Draconian'],
  },
};

// Helper function to get class by name
export function getClass(name: string): Class | undefined {
  return classes[name];
}

// Helper function to get all classes
export function getAllClasses(): Class[] {
  return Object.values(classes);
}

// Helper function to get classes by alignment
export function getClassesByAlignment(alignment: string): Class[] {
  return Object.values(classes).filter(cls => 
    cls.allowedAlignments.includes(alignment as any)
  );
}

// Helper function to get classes compatible with a race
export function getClassesForRace(raceName: string): Class[] {
  return Object.values(classes).filter(cls => 
    cls.compatibleRaces.includes(raceName)
  );
}

import { Alignment, Race, Class, Specs, Stat } from './enums';

// Character stats interface
export interface CharacterStats {
  strength: number;
  intelligence: number;
  wisdom: number;
  dexterity: number;
  constitution: number;
}

// Resistance interface
export interface Resistance {
  damtype: string;
  value: number;
}

// Race interface
export interface RaceData {
  name: Race;
  title: string; // Display title for frontend
  slug: string; // URL slug identifier
  description: string;
  features: string[];
  xpPenalty: number; // Percentage penalty (0-25)
  allowedAlignments: Alignment[];
  maxStats: CharacterStats;
  availableClasses: Class[];
  reference: ReferenceLink[];
  resistances: Resistance[];
  bonusStat?: number; // Optional bonus stat points that add to class primary stat
}

// Reference link interface
export interface ReferenceLink {
  label: string;
  url: string;
}

// Skill interface
export interface Skill {
  name: string;
  level: number;
  url?: string; // URL to corresponding help article (optional, can be filled manually)
}

// Spec interface for skills
export interface Spec {
  id: Specs;
  skills: Skill[];
}

// Spec interface for spells
export interface SpecSpell {
  id: Specs;
  spells: Skill[];
}

// Class interface
export interface ClassData {
  name: Class;
  title: string; // Display title for frontend
  slug: string; // URL slug identifier
  description: string;
  features: string[];
  xpPenalty: number; // Percentage penalty (0-25)
  allowedAlignments: Alignment[];
  reference: ReferenceLink[];
  primaryStat: Stat; // Primary stat for this class (bonus from race is added to this)
  weapons?: Skill[]; // Weapon skills (level 1)
  consumables?: Skill[]; // Consumable item skills (level 1)
  basicSkills?: Skill[]; // Optional basic skills for the class
  basicSpells?: Skill[]; // Optional basic spells for the class
  specSkills?: Spec[]; // Skills for each specialization
  specSpells?: SpecSpell[]; // Spells for each specialization
  specChoices?: number; // Number of specializations that can be selected
  specAllowed?: Specs[]; // Available specializations for selection
  magicMajorChoices?: Array<{ spec: Specs; desc: string[] }>; // Available magic major choices with descriptions
  wayfollowChoices?: Array<{ spec: Specs; desc: string[]; allowedAlignments: Alignment[] }>; // Available wayfollow choices with descriptions and allowed alignments (for assassins)
  kinshipChoices?: Array<{ spec: Specs; desc: string[] }>; // Available kinship choices with descriptions (for druids)
  worshipChoices?: Array<{ spec: Specs; desc: string[]; allowedAlignments: Alignment[]; excludedBasicSkills?: string[] }>; // Available worship/god choices with descriptions, allowed alignments, and basic skills to exclude (for clerics)
}

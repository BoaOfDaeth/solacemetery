import { Alignment, Race, Class, FighterSpecialization } from './enums';

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

// Spec interface
export interface Spec {
  id: FighterSpecialization;
  skills: Skill[];
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
  weapons?: Skill[]; // Weapon skills (level 1)
  consumables?: Skill[]; // Consumable item skills (level 1)
  basicSkills?: Skill[]; // Optional basic skills for the class
  specs?: Spec[];
  specChoices?: number; // Number of specializations that can be selected
  specAllowed?: FighterSpecialization[]; // Available specializations for selection
}

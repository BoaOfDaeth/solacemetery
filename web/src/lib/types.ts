import { Alignment, Race, Class } from './enums';

// Character stats interface
export interface CharacterStats {
  strength: number;
  intelligence: number;
  wisdom: number;
  dexterity: number;
  constitution: number;
}

// Race interface
export interface RaceData {
  name: Race;
  description: string;
  features: string[];
  xpPenalty: number; // Percentage penalty (0-25)
  allowedAlignments: Alignment[];
  maxStats: CharacterStats;
  availableClasses: Class[];
}

// Reference link interface
export interface ReferenceLink {
  label: string;
  url: string;
}

// Class interface
export interface ClassData {
  name: Class;
  description: string;
  features: string[];
  xpPenalty: number; // Percentage penalty (0-25)
  allowedAlignments: Alignment[];
  reference: ReferenceLink[];
}

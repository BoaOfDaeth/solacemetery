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
}

// Class interface
export interface ClassData {
  name: Class;
  description: string;
  features: string[];
  xpPenalty: number; // Percentage penalty (0-25)
  allowedAlignments: Alignment[];
}

// Race/Class combination validation
export interface RaceClassCombo {
  race: Race;
  class: Class;
  totalXpPenalty: number;
  isValid: boolean;
}

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
  features: string;
  maxStats: CharacterStats;
  xpPenalty: number; // Percentage penalty (0-25)
  allowedAlignments: Alignment[];
  availableClasses: Class[];
}

// Class interface
export interface ClassData {
  name: Class;
  description: string;
  features: string;
  xpPenalty: number; // Percentage penalty (0-25)
  allowedAlignments: Alignment[];
  compatibleRaces: Race[];
}

// Race/Class combination validation
export interface RaceClassCombo {
  race: Race;
  class: Class;
  totalXpPenalty: number;
  isValid: boolean;
}

// Character stats interface
export interface CharacterStats {
  strength: number;
  intelligence: number;
  wisdom: number;
  dexterity: number;
  constitution: number;
}

// Alignment type
export type Alignment = 'Good' | 'Neutral' | 'Evil';

// Race interface
export interface Race {
  name: string;
  description: string;
  features: string;
  maxStats: CharacterStats;
  xpPenalty: number; // Percentage penalty (0-25)
  allowedAlignments: Alignment[];
  availableClasses: string[];
}

// Class interface
export interface Class {
  name: string;
  description: string;
  features: string;
  xpPenalty: number; // Percentage penalty (0-25)
  allowedAlignments: Alignment[];
  compatibleRaces: string[];
}

// Race/Class combination validation
export interface RaceClassCombo {
  race: string;
  class: string;
  totalXpPenalty: number;
  isValid: boolean;
}

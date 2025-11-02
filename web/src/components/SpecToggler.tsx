'use client';

import React, { useState } from 'react';
import { FighterSpecialization } from '@/lib/enums';

interface SpecTogglerProps {
  availableSpecs: FighterSpecialization[];
  maxSelections?: number;
  onChange?: (selectedSpecs: FighterSpecialization[]) => void;
  className?: string;
}

export default function SpecToggler({
  availableSpecs,
  maxSelections = 3,
  onChange,
  className = '',
}: SpecTogglerProps) {
  const [selectedSpecs, setSelectedSpecs] = useState<FighterSpecialization[]>([]);

  const toggleSpec = (spec: FighterSpecialization) => {
    setSelectedSpecs((prev) => {
      const isSelected = prev.includes(spec);
      let newSelection: FighterSpecialization[];

      if (isSelected) {
        // Deselect
        newSelection = prev.filter((s) => s !== spec);
      } else {
        // Select, but check max limit
        if (prev.length >= maxSelections) {
          // Don't allow more selections
          return prev;
        }
        newSelection = [...prev, spec];
      }

      // Call onChange callback if provided
      if (onChange) {
        onChange(newSelection);
      }

      return newSelection;
    });
  };

  const canSelectMore = selectedSpecs.length < maxSelections;

  return (
    <div className={`bg-card border border-border rounded-xl shadow-sm p-4 sm:p-6 ${className}`}>
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-foreground mb-2">
          Specializations
        </h3>
        <p className="text-sm text-muted-foreground">
          Select up to {maxSelections} specializations
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {availableSpecs.map((spec) => {
          const isSelected = selectedSpecs.includes(spec);
          const isDisabled = !isSelected && !canSelectMore;

          return (
            <button
              key={spec}
              type="button"
              onClick={() => toggleSpec(spec)}
              disabled={isDisabled}
              className={`
                px-4 py-3 rounded-lg border-2 text-left transition-all duration-200
                ${
                  isSelected
                    ? 'border-primary bg-primary/10 text-primary font-medium'
                    : 'border-border bg-background text-foreground hover:border-primary/50'
                }
                ${
                  isDisabled
                    ? 'opacity-50 cursor-not-allowed'
                    : 'cursor-pointer hover:bg-muted/50'
                }
              `}
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">
                  {spec}
                </span>
                {isSelected && (
                  <svg
                    className="w-5 h-5 text-primary"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}


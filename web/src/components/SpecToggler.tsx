import React from 'react';
import Link from 'next/link';
import { Specs } from '@/lib/enums';

interface SpecTogglerProps {
  availableSpecs: Specs[];
  maxSelections?: number;
  selectedSpecs: Specs[];
  currentPath: string;
  className?: string;
}

export default function SpecToggler({
  availableSpecs,
  maxSelections = 3,
  selectedSpecs,
  currentPath,
  className = '',
}: SpecTogglerProps) {
  const canSelectMore = selectedSpecs.length < maxSelections;

  const createSpecUrl = (spec: Specs): string => {
    const isSelected = selectedSpecs.includes(spec);
    const newSpecs = isSelected
      ? selectedSpecs.filter((s) => s !== spec)
      : [...selectedSpecs, spec];

    // Only update if we're not exceeding max or if deselecting
    if (!isSelected && newSpecs.length > maxSelections) {
      return '#'; // Disabled - return current URL
    }

    // Build URL with spec params
    const params = new URLSearchParams();
    newSpecs.forEach((s) => {
      params.append('spec', s);
    });

    const query = params.toString();
    return query ? `${currentPath}?${query}` : currentPath;
  };

  return (
    <div className={`bg-card border border-border rounded-xl shadow-sm p-4 sm:p-6 ${className}`}>
      <div className="mb-4 text-center">
        <h3 className="text-lg font-semibold text-foreground mb-2">
          Specializations
        </h3>
        <p className="text-sm text-muted-foreground">
          Select up to {maxSelections} specializations
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {availableSpecs.map((spec) => {
          const isSelected = selectedSpecs.includes(spec);
          const isDisabled = !isSelected && !canSelectMore;

          const specUrl = createSpecUrl(spec);

          return (
            <Link
              key={spec}
              href={specUrl}
              scroll={false}
              className={`
                px-4 py-3 rounded-lg border-2 text-left transition-all duration-200 block select-none
                ${
                  isSelected
                    ? 'border-primary bg-primary/10 text-primary font-medium'
                    : 'border-border bg-background text-foreground hover:border-primary/50'
                }
                ${
                  isDisabled
                    ? 'opacity-50 cursor-not-allowed pointer-events-none'
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
            </Link>
          );
        })}
      </div>
    </div>
  );
}


import React from 'react';
import Link from 'next/link';
import { Specs } from '@/lib/enums';

interface MagicMajor {
  spec: Specs;
  desc: string[];
}

interface SpecsTogglerProps {
  availableMajors: MagicMajor[];
  selectedMajor?: Specs | null;
  currentPath: string;
  className?: string;
}

export default function MagicMajorToggler({
  availableMajors,
  selectedMajor,
  currentPath,
  className = '',
}: SpecsTogglerProps) {
  const createMajorUrl = (major: Specs): string => {
    const params = new URLSearchParams();
    
    // If clicking the same major, deselect it (don't add magicmajor param)
    if (selectedMajor !== major) {
      // Otherwise select this major
      params.append('magicmajor', major);
    }
    
    const query = params.toString();
    return query ? `${currentPath}?${query}` : currentPath;
  };

  return (
    <div className={`bg-card border border-border rounded-xl shadow-sm p-4 sm:p-6 ${className}`}>
      <div className="mb-4 text-center">
        <h3 className="text-lg font-semibold text-foreground mb-2">
          Major Magic
        </h3>
      </div>

      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          {availableMajors.map((major) => {
            const isSelected = selectedMajor === major.spec;
            const majorUrl = createMajorUrl(major.spec);

            return (
              <Link
                key={major.spec}
                href={majorUrl}
                scroll={false}
                className={`
                  px-4 py-3 rounded-lg border-2 text-left transition-all duration-200 block select-none
                  ${
                    isSelected
                      ? 'border-primary bg-primary/10 text-primary font-medium'
                      : 'border-border bg-background text-foreground hover:border-primary/50'
                  }
                  cursor-pointer hover:bg-muted/50
                `}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">
                    {major.spec}
                  </span>
                  {isSelected && (
                    <svg
                      className="w-5 h-5 text-primary flex-shrink-0"
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
        {(() => {
          const selectedMajorData = selectedMajor ? availableMajors.find((m) => m.spec === selectedMajor) : null;
          return selectedMajorData && selectedMajorData.desc.length > 0 ? (
            <div className="mt-3 pt-3 border-t border-border">
              <ul className="space-y-1.5">
                {selectedMajorData.desc.map((item, index) => (
                <li key={index} className="text-xs text-muted-foreground flex items-start">
                  <span className="mr-1.5">•</span>
                  <span>{item}</span>
                </li>
              ))}
              </ul>
            </div>
          ) : null;
        })()}
      </div>
    </div>
  );
}


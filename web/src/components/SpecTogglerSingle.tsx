import React from 'react';
import Link from 'next/link';
import { Specs } from '@/lib/enums';

interface SpecOption {
  spec: Specs;
  desc: string[];
}

interface SpecTogglerSingleProps {
  availableSpecs: SpecOption[];
  selectedSpec?: Specs | null;
  currentPath: string;
  queryParam?: string; // Query parameter name (e.g., 'magicmajor', 'spec', etc.)
  title?: string; // Optional title for the component
  className?: string;
}

export default function SpecTogglerSingle({
  availableSpecs,
  selectedSpec,
  currentPath,
  queryParam = 'spec',
  title,
  className = '',
}: SpecTogglerSingleProps) {
  const createSpecUrl = (spec: Specs): string => {
    const params = new URLSearchParams();
    
    // If clicking the same spec, deselect it (don't add query param)
    if (selectedSpec !== spec) {
      // Otherwise select this spec
      params.append(queryParam, spec);
    }
    
    const query = params.toString();
    return query ? `${currentPath}?${query}` : currentPath;
  };

  return (
    <div className={`bg-card border border-border rounded-xl shadow-sm p-4 sm:p-6 ${className}`}>
      {title && (
        <div className="mb-4 text-center">
          <h3 className="text-lg font-semibold text-foreground mb-2">
            {title}
          </h3>
        </div>
      )}

      <div className="space-y-3">
        <div className="grid grid-cols-1 gap-3">
          {availableSpecs.map((specOption) => {
            const isSelected = selectedSpec === specOption.spec;
            const specUrl = createSpecUrl(specOption.spec);

            return (
              <Link
                key={specOption.spec}
                href={specUrl}
                scroll={false}
                prefetch={true}
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
                    {specOption.spec}
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
          const selectedSpecData = selectedSpec ? availableSpecs.find((s) => s.spec === selectedSpec) : null;
          return selectedSpecData && selectedSpecData.desc.length > 0 ? (
            <div className="mt-3 pt-3 border-t border-border">
              <ul className="space-y-1.5">
                {selectedSpecData.desc.map((item, index) => (
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


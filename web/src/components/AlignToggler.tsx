import React from 'react';
import Link from 'next/link';
import { Alignment, getAllAlignments } from '@/lib/enums';

interface AlignTogglerProps {
  availableAlignments: Alignment[];
  selectedAlignment?: Alignment | null;
  currentPath: string;
  preserveParams?: Record<string, string | string[]>; // Other query params to preserve
  className?: string;
}

export default function AlignToggler({
  availableAlignments,
  selectedAlignment,
  currentPath,
  preserveParams,
  className = '',
}: AlignTogglerProps) {
  const allAlignments = getAllAlignments();
  const isSingleAlignment = availableAlignments.length === 1;
  const singleAlignment = isSingleAlignment ? availableAlignments[0] : null;
  // If only one alignment is available, force it to be selected
  const effectiveSelectedAlignment = isSingleAlignment ? singleAlignment : selectedAlignment;
  
  const createAlignmentUrl = (alignment: Alignment): string => {
    const params = new URLSearchParams();
    
    // Preserve other query parameters
    if (preserveParams) {
      Object.entries(preserveParams).forEach(([key, value]) => {
        // Skip our own query param
        if (key === 'alignment') return;
        
        if (Array.isArray(value)) {
          value.forEach(v => params.append(key, v));
        } else {
          params.append(key, value);
        }
      });
    }
    
    const isAvailable = availableAlignments.includes(alignment);
    const isSingleAvailable = isSingleAlignment && alignment === singleAlignment;
    
    // If unavailable, return current path (no query params)
    if (!isAvailable) {
      const query = params.toString();
      return query ? `${currentPath}?${query}` : currentPath;
    }
    
    // If single available alignment, return current path with preserved params only (don't add alignment param)
    if (isSingleAvailable) {
      const query = params.toString();
      return query ? `${currentPath}?${query}` : currentPath;
    }
    
    // For other available alignments, toggle behavior
    if (selectedAlignment !== alignment) {
      // Select this alignment
      params.append('alignment', alignment);
    }
    // If clicking the same alignment, deselect it (don't add query param)
    
    const query = params.toString();
    return query ? `${currentPath}?${query}` : currentPath;
  };

  return (
    <div className={`bg-card border border-border rounded-xl shadow-sm p-4 sm:p-6 ${className}`}>
      <div className="mb-4 text-center">
        <h3 className="text-lg font-semibold text-foreground mb-2">
          Allowed Alignments
        </h3>
      </div>

      <div className="space-y-3">
        <div className="grid grid-cols-3 gap-3">
          {allAlignments.map((alignment) => {
            const isAvailable = availableAlignments.includes(alignment);
            const isSelected = effectiveSelectedAlignment === alignment;
            const isSingleAvailable = isSingleAlignment && alignment === singleAlignment;
            const alignmentUrl = createAlignmentUrl(alignment);

            // For unavailable or single available alignments, use a div instead of Link to prevent navigation
            const Component = (!isAvailable || isSingleAvailable) ? 'div' : Link;
            const href = (!isAvailable || isSingleAvailable) ? undefined : alignmentUrl;

            return (
              <Component
                key={alignment}
                {...(Component === Link ? { href, scroll: false } : {})}
                className={`
                  px-4 py-3 rounded-lg border-2 text-left transition-all duration-200 block select-none
                  ${
                    !isAvailable
                      ? 'border-border/50 bg-muted/30 text-muted-foreground/50 cursor-not-allowed opacity-60 pointer-events-none'
                      : isSingleAvailable
                      ? 'border-primary bg-primary/10 text-primary font-medium cursor-default'
                      : isSelected
                      ? 'border-primary bg-primary/10 text-primary font-medium cursor-pointer hover:bg-primary/15'
                      : 'border-border bg-background text-foreground hover:border-primary/50 cursor-pointer hover:bg-muted/50'
                  }
                `}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">
                    {alignment}
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
              </Component>
            );
          })}
        </div>
      </div>
    </div>
  );
}


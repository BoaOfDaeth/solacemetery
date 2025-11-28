'use client';

import { useState } from 'react';
import ItemCard from '@/components/ItemCard';

interface ExpandableItemCardProps {
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
  rawItem: {
    _id: string;
    raw: string;
    createdAt: string;
    updatedAt: string;
    parsedId?: string;
  };
  cardStyle?: React.CSSProperties;
  defaultExpanded?: boolean;
  showExpandButton?: boolean;
  userIsAdmin?: boolean;
  itemHidden?: boolean;
  isPending?: boolean; // Item not yet visible to regular users (API post with 12h delay)
  postedBy?: string[];
}

export default function ExpandableItemCard({
  title,
  subtitle,
  children,
  rawItem,
  cardStyle,
  defaultExpanded = false,
  showExpandButton = true,
  userIsAdmin = false,
  itemHidden = false,
  isPending = false,
  postedBy,
}: ExpandableItemCardProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  // Inline styles only for truly dynamic colors (computed at runtime from item level)
  // Tailwind can't generate classes for runtime values, so we need inline styles here
  const inlineStyles: React.CSSProperties = {
    ...(cardStyle?.borderColor && { borderColor: cardStyle.borderColor }),
    ...(cardStyle?.boxShadow && { boxShadow: cardStyle.boxShadow }),
    ...(itemHidden
      ? { backgroundColor: '#e5e7eb' } // bg-gray-200
      : cardStyle?.backgroundColor && {
          backgroundColor: cardStyle.backgroundColor,
        }),
  };

  // Border style: dotted for pending items, solid otherwise
  const borderStyleClass = isPending
    ? 'border-dotted border-2'
    : 'border-solid border';

  return (
    <div>
      <div
        className={`rounded-lg px-3 pb-3 pt-2 md:p-4 ${borderStyleClass} ${
          !itemHidden && !cardStyle?.backgroundColor ? 'bg-white' : ''
        } ${!cardStyle?.boxShadow ? 'shadow-lg' : ''}`}
        style={Object.keys(inlineStyles).length > 0 ? inlineStyles : undefined}
      >
        {showExpandButton ? (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-full text-left flex justify-between items-center cursor-pointer"
            title={isExpanded ? 'Hide Raw Data' : 'Show Raw Data'}
          >
            <div className="flex-1">
              <h1 className="text-lg md:text-xl font-bold text-gray-800 select-text">
                {title}
              </h1>
              {subtitle && (
                <p className="text-sm md:text-base text-gray-600 mt-1 select-text">
                  {subtitle}
                </p>
              )}
              {children}
            </div>
            <div className="ml-4 p-2">
              <svg
                className={`w-4 h-4 transition-transform duration-200 ${
                  isExpanded ? 'rotate-180' : 'rotate-0'
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </button>
        ) : (
          <div className="flex justify-between items-center">
            <div className="flex-1">
              <h1 className="text-lg md:text-xl font-bold text-gray-800 select-text">
                {title}
              </h1>
              {subtitle && (
                <p className="text-sm md:text-base text-gray-600 mt-1 select-text">
                  {subtitle}
                </p>
              )}
              {userIsAdmin && postedBy && postedBy.length > 0 && (
                <p className="text-xs text-gray-500 mt-1">
                  Posted by: {postedBy.join(', ')}
                </p>
              )}
              {children}
            </div>
          </div>
        )}
        <div
          className={`mt-1 transition-all duration-300 ease-in-out overflow-hidden ${
            isExpanded ? 'opacity-100 max-h-screen' : 'opacity-0 max-h-0'
          }`}
        >
          <ItemCard
            item={rawItem}
            userIsAdmin={userIsAdmin}
            itemHidden={itemHidden}
          />
        </div>
      </div>
    </div>
  );
}

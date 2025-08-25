import Link from 'next/link';

interface PlayerData {
  name: string;
  level?: number;
  race?: string;
  class?: string;
  linkType?: 'character' | 'mob';
  truncate?: boolean;
  maxLength?: number;
}

/**
 * FormatPlayer component for consistent player/mob display
 * Handles URL encoding and displays level, race, and class information
 */
export function FormatPlayer({
  name,
  level,
  race,
  class: playerClass,
  linkType = 'character',
  truncate = false,
  maxLength = 20
}: PlayerData) {
  const linkHref = linkType === 'character' 
    ? `/character/${encodeURIComponent(name)}`
    : `/mob/${encodeURIComponent(name)}`;

  // Truncate name if needed
  const displayName = truncate && name.length > maxLength 
    ? `${name.substring(0, maxLength)}...` 
    : name;

  return (
    <div className="flex flex-col min-w-0">
      <div className="flex items-center min-w-0">
        <Link
          href={linkHref}
          className="text-blue-600 hover:text-blue-800 hover:underline truncate"
          title={name} // Show full name on hover
        >
          {displayName}
        </Link>
        {level && (
          <span className="text-gray-500 ml-1 flex-shrink-0">
            ({level})
          </span>
        )}
      </div>
      {race && playerClass && (
        <div className="text-xs text-gray-500 mt-0.5 truncate">
          {race} {playerClass}
        </div>
      )}
    </div>
  );
}

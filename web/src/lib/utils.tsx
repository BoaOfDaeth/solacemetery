import Link from 'next/link';

interface PlayerData {
  name: string;
  level?: number;
  race?: string;
  class?: string;
  linkType?: 'character' | 'mob';
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
  linkType = 'character'
}: PlayerData) {
  const linkHref = linkType === 'character' 
    ? `/character/${encodeURIComponent(name)}`
    : `/mob/${encodeURIComponent(name)}`;

  return (
    <>
      <Link
        href={linkHref}
        className="text-blue-600 hover:text-blue-800 hover:underline"
      >
        {name}
      </Link>
      {level && (
        <span className="text-gray-500 ml-1">
          ({level})
        </span>
      )}
      {race && playerClass && (
        <span className="text-gray-500 ml-1">
          {race} {playerClass}
        </span>
      )}
    </>
  );
}

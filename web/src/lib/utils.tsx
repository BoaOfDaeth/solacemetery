import Link from 'next/link';

// Constants
export const DATA_FRESHNESS_THRESHOLD_MINUTES = 30;

/**
 * Get the cutoff time for data freshness filtering
 * Returns a time string that is 30 minutes ago from current server time
 */
export function getDataCutoffTime(): string {
  const now = new Date();
  const cutoffTime = new Date(now.getTime() - (DATA_FRESHNESS_THRESHOLD_MINUTES * 60 * 1000));
  
  return cutoffTime.toLocaleString('en-US', {
    weekday: 'short',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    year: 'numeric',
    hour12: false
  }).replace(/,/g, '');
}

/**
 * Get the cutoff time as a Date object for proper comparison
 * Database and server run on the same host, so no timezone adjustment needed
 */
export function getDataCutoffDate(): Date {
  const now = new Date();
  return new Date(now.getTime() - (DATA_FRESHNESS_THRESHOLD_MINUTES * 60 * 1000));
}

/**
 * SQL time filtering clause for database queries
 * Returns the WHERE clause condition for filtering records by time cutoff
 */
export function getTimeFilterClause(): string {
  return 'time IS NULL OR UNIX_TIMESTAMP(STR_TO_DATE(time, \'%a %b %d %H:%i:%s %Y\')) <= UNIX_TIMESTAMP(?)';
}

/**
 * SQL time filtering clause for database queries with additional conditions
 * Returns the WHERE clause condition for filtering records by time cutoff with AND
 */
export function getTimeFilterClauseWithAnd(): string {
  return `AND (${getTimeFilterClause()})`;
}

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
          className="text-primary hover:text-primary/80 hover:underline font-medium truncate"
          title={name} // Show full name on hover
        >
          {displayName}
        </Link>
        {level && (
          <span className="text-muted-foreground ml-1 flex-shrink-0 font-medium">
            ({level})
          </span>
        )}
      </div>
      {race && playerClass && (
        <div className="text-xs text-muted-foreground mt-0.5 truncate font-medium">
          {race} {playerClass}
        </div>
      )}
    </div>
  );
}

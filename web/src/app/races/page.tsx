import { getAllRaces } from '@/lib/races';
import { Icon } from '@iconify/react';
import StatsCard from '@/components/StatsCard';
import ModernTable from '@/components/ModernTable';
import Link from 'next/link';

export default async function RacesPage() {
  const races = getAllRaces();

  // Prepare races data for table
  const racesData = races.map(race => ({
    name: race.name,
    description: race.description,
    xpPenalty: race.xpPenalty === 0 ? 'No penalty' : `${race.xpPenalty}% penalty`,
    alignments: race.allowedAlignments.join(', '),
    availableClasses: race.availableClasses.length,
  }));

  // Calculate some stats
  const totalRaces = races.length;
  const racesWithNoPenalty = races.filter(race => race.xpPenalty === 0).length;
  const racesWithAnyAlignment = races.filter(race => race.allowedAlignments.length === 3).length;

  return (
    <div className="bg-background">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6">
        {/* Statistics Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
          <StatsCard
            title="Total Races"
            value={totalRaces}
            icon={
              <Icon icon="game-icons:race-car" className="w-6 h-6 text-primary" />
            }
          />
          <StatsCard
            title="No XP Penalty"
            value={racesWithNoPenalty}
            icon={
              <Icon icon="game-icons:fast-arrow" className="w-6 h-6 text-primary" />
            }
          />
          <StatsCard
            title="Any Alignment"
            value={racesWithAnyAlignment}
            icon={
              <Icon icon="game-icons:balance-scale" className="w-6 h-6 text-primary" />
            }
          />
        </div>

        {/* Races Table */}
        <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
          <ModernTable
            title="Available Races"
            description="All races available in Solace MUD with their characteristics and restrictions"
            columns={[
              { key: 'name', label: 'Race' },
              { key: 'description', label: 'Description' },
              { key: 'xpPenalty', label: 'XP Penalty' },
              { key: 'alignments', label: 'Alignments' },
              { key: 'availableClasses', label: 'Available Classes' },
            ]}
            data={racesData}
            renderCell={(key, value, row) => {
              if (key === 'name') {
                return (
                  <div className="font-medium text-foreground">
                    <Link 
                      href={`/race/${row.name.toLowerCase().replace(/\s+/g, '-')}`}
                      className="text-primary hover:text-primary/80 hover:underline"
                    >
                      {value}
                    </Link>
                  </div>
                );
              }
              if (key === 'description') {
                return (
                  <div className="max-w-md">
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {value}
                    </p>
                  </div>
                );
              }
              if (key === 'xpPenalty') {
                return (
                  <div className="text-right">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      value === 'No penalty' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    } select-none`}>
                      {value}
                    </span>
                  </div>
                );
              }
              if (key === 'alignments') {
                return (
                  <div className="flex flex-wrap gap-1">
                    {row.alignments.split(', ').map((alignment: string) => (
                      <span
                        key={alignment}
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          alignment === 'Good' ? 'text-green-600 bg-green-50' : 
                          alignment === 'Neutral' ? 'text-yellow-600 bg-yellow-50' : 
                          'text-red-600 bg-red-50'
                        }`}
                      >
                        {alignment}
                      </span>
                    ))}
                  </div>
                );
              }
              if (key === 'availableClasses') {
                return (
                  <div className="text-right">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary select-none">
                      {value}
                    </span>
                  </div>
                );
              }
              return value;
            }}
            className="border-0 shadow-none"
          />
        </div>
      </div>
    </div>
  );
}

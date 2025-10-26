import { getAllRaces } from '@/lib/races';
import ModernTable from '@/components/ModernTable';
import Link from 'next/link';

export default async function RacesPage() {
  const races = getAllRaces();

  // Prepare races data for table
  const racesData = races.map(race => ({
    name: race.name,
    title: race.title,
    slug: race.slug,
    description: race.description,
    xpPenalty: race.xpPenalty === 0 ? 'No penalty' : `${race.xpPenalty}%`,
    alignments: race.allowedAlignments.join(', '),
    availableClasses: race.availableClasses.length,
  }));

  return (
    <div className="bg-background">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6">
        <ModernTable
          title="Available races"
          columns={[
            { key: 'name', label: 'Race' },
            { key: 'description', label: 'Description', hideOnMobile: true },
            { key: 'xpPenalty', label: 'XP' },
            { key: 'alignments', label: 'Alignments' },
            { key: 'availableClasses', label: 'Classes' },
          ]}
          data={racesData}
          renderCell={(key, value, row) => {
            if (key === 'name') {
              return (
                <Link
                  href={`/race/${row.slug}`}
                  className="text-primary hover:text-primary/80 hover:underline font-medium"
                >
                  {value}
                </Link>
              );
            }
            if (key === 'description') {
              return (
                <span className="text-sm text-muted-foreground line-clamp-2 max-w-md block">
                  {value}
                </span>
              );
            }
            return value;
          }}
        />
      </div>
    </div>
  );
}

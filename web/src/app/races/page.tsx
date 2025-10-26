import { getAllRaces } from '@/lib/races';
import Link from 'next/link';

export default async function RacesPage() {
  const races = getAllRaces();

  // Prepare races data for table
  const racesData = races.map(race => ({
    name: race.name,
    description: race.description,
    xpPenalty: race.xpPenalty === 0 ? 'No penalty' : `${race.xpPenalty}%`,
    alignments: race.allowedAlignments.join(', '),
    availableClasses: race.availableClasses.length,
  }));

  return (
    <div className="bg-background">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6">
        {/* Races Table */}
        <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-border">
            <h1 className="text-xl font-semibold text-foreground">Available races</h1>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-border">
              <thead className="bg-muted/50">
                <tr>
                  <th className="px-3 sm:px-6 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Race</th>
                  <th className="px-3 sm:px-6 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Description</th>
                  <th className="px-3 sm:px-6 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">XP Penalty</th>
                  <th className="px-3 sm:px-6 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Alignments</th>
                  <th className="px-3 sm:px-6 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Available Classes</th>
                </tr>
              </thead>
              <tbody className="bg-card divide-y divide-border">
                {racesData.map((row, index) => (
                  <tr key={index} className="hover:bg-accent/50 transition-colors duration-150">
                    <td className="px-3 sm:px-6 py-3 text-sm font-medium">
                      <div className="font-medium text-foreground">
                        <Link 
                          href={`/race/${row.name.toLowerCase().replace(/\s+/g, '-')}`}
                          className="text-primary hover:text-primary/80 hover:underline"
                        >
                          {row.name}
                        </Link>
                      </div>
                    </td>
                    <td className="px-3 sm:px-6 py-3 text-sm font-medium">
                      <div className="max-w-md">
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {row.description}
                        </p>
                      </div>
                    </td>
                    <td className="px-3 sm:px-6 py-3 text-sm font-medium text-right">
                      {row.xpPenalty}
                    </td>
                    <td className="px-3 sm:px-6 py-3 text-sm font-medium">
                      {row.alignments}
                    </td>
                    <td className="px-3 sm:px-6 py-3 text-sm font-medium">
                      <div className="text-right">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary select-none">
                          {row.availableClasses}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

import { getAllClasses } from '@/lib/classes';
import { getCompatibleRacesForClass } from '@/lib/races';
import ModernTable from '@/components/ModernTable';
import Link from 'next/link';

export default async function ClassesPage() {
  const classes = getAllClasses();

  // Prepare classes data for table
  const classesData = classes.map(cls => ({
    name: cls.name,
    title: cls.title,
    slug: cls.slug,
    description: cls.description,
    xpPenalty: cls.xpPenalty === 0 ? 'No penalty' : `${cls.xpPenalty}%`,
    alignments: cls.allowedAlignments.join(', '),
    compatibleRaces: getCompatibleRacesForClass(cls.name).length,
  }));

  return (
    <div className="bg-background">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6">
        <ModernTable
          title="Available classes"
          columns={[
            { key: 'name', label: 'Class' },
            { key: 'description', label: 'Description', hideOnMobile: true },
            { key: 'xpPenalty', label: 'XP' },
            { key: 'alignments', label: 'Alignments' },
            { key: 'compatibleRaces', label: 'Races' },
          ]}
          data={classesData}
          renderCell={(key, value, row) => {
            if (key === 'name') {
              return (
                <Link
                  href={`/class/${row.slug}`}
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
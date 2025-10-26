import { notFound } from 'next/navigation';
import { getClass, getAllClasses } from '@/lib/classes';
import { getRace } from '@/lib/races';
import { Icon } from '@iconify/react';
import StatsCard from '@/components/StatsCard';
import ModernTable from '@/components/ModernTable';
import Link from 'next/link';

interface ClassPageProps {
  params: Promise<{ name: string }>;
}

export async function generateStaticParams() {
  const classes = getAllClasses();
  return classes.map((cls) => ({
    name: cls.name.toLowerCase().replace(/\s+/g, '-'),
  }));
}

export default async function ClassPage({ params }: ClassPageProps) {
  const { name } = await params;
  const className = name.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  
  const cls = getClass(className);
  if (!cls) {
    notFound();
  }

  const compatibleRaces = cls.compatibleRaces.map(raceName => getRace(raceName)).filter(Boolean);

  // Prepare compatible races data for table
  const racesData = compatibleRaces.map(race => ({
    name: race.name,
    description: race.description,
    xpPenalty: race.xpPenalty === 0 ? 'No penalty' : `${race.xpPenalty}% penalty`,
    alignments: race.allowedAlignments.join(', '),
  }));

  return (
    <div className="bg-background">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6">
        {/* Class Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-foreground mb-2">{cls.name}</h1>
          <p className="text-muted-foreground">Class Information</p>
        </div>

        {/* Class Statistics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatsCard
            title="XP Penalty"
            value={cls.xpPenalty === 0 ? 'None' : `${cls.xpPenalty}%`}
            icon={
              <Icon icon="game-icons:fast-arrow" className="w-6 h-6 text-primary" />
            }
          />
          <StatsCard
            title="Compatible Races"
            value={cls.compatibleRaces.length}
            icon={
              <Icon icon="game-icons:race-car" className="w-6 h-6 text-primary" />
            }
          />
          <StatsCard
            title="Allowed Alignments"
            value={cls.allowedAlignments.length}
            icon={
              <Icon icon="game-icons:balance-scale" className="w-6 h-6 text-primary" />
            }
          />
          <StatsCard
            title="Class Type"
            value={cls.name.includes('mage') || cls.name.includes('cleric') || cls.name.includes('druid') ? 'Magic' : 'Combat'}
            icon={
              <Icon icon={cls.name.includes('mage') || cls.name.includes('cleric') || cls.name.includes('druid') ? 'game-icons:magic-swirl' : 'game-icons:swordman'} className="w-6 h-6 text-primary" />
            }
          />
        </div>

        {/* Class Description */}
        <div className="bg-card border border-border rounded-xl shadow-sm p-6 mb-6">
          <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center">
            <Icon icon="game-icons:scroll-quill" className="w-5 h-5 mr-2 text-primary" />
            Description
          </h2>
          <p className="text-muted-foreground leading-relaxed">{cls.description}</p>
        </div>

        {/* Class Features */}
        <div className="bg-card border border-border rounded-xl shadow-sm p-6 mb-6">
          <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center">
            <Icon icon="game-icons:magic-swirl" className="w-5 h-5 mr-2 text-primary" />
            Special Features
          </h2>
          <p className="text-muted-foreground leading-relaxed">{cls.features}</p>
        </div>

        {/* Class Information Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="bg-card border border-border rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibold text-foreground mb-3 flex items-center">
              <Icon icon="game-icons:balance-scale" className="w-5 h-5 mr-2 text-primary" />
              Allowed Alignments
            </h3>
            <div className="flex flex-wrap gap-2">
              {cls.allowedAlignments.map((alignment) => (
                <span
                  key={alignment}
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    alignment === 'Good' ? 'text-green-600 bg-green-50' : 
                    alignment === 'Neutral' ? 'text-yellow-600 bg-yellow-50' : 
                    'text-red-600 bg-red-50'
                  }`}
                >
                  {alignment}
                </span>
              ))}
            </div>
          </div>
          
          <div className="bg-card border border-border rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibold text-foreground mb-3 flex items-center">
              <Icon icon="game-icons:fast-arrow" className="w-5 h-5 mr-2 text-primary" />
              Experience Penalty
            </h3>
            <p className="text-muted-foreground text-lg">
              {cls.xpPenalty === 0 ? 'No penalty' : `${cls.xpPenalty}% penalty`}
            </p>
          </div>
        </div>

        {/* Compatible Races */}
        <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
          <ModernTable
            title="Compatible Races"
            description="Races that can choose this class"
            columns={[
              { key: 'name', label: 'Race' },
              { key: 'description', label: 'Description' },
              { key: 'xpPenalty', label: 'XP Penalty' },
              { key: 'alignments', label: 'Alignments' },
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
              return value;
            }}
            className="border-0 shadow-none"
          />
        </div>
      </div>
    </div>
  );
}
import { notFound } from 'next/navigation';
import { getRace, getAllRaces, getCompatibleClassesForRace } from '@/lib/races';
import { getClass } from '@/lib/classes';
import { Icon } from '@iconify/react';
import StatsCard from '@/components/StatsCard';
import ModernTable from '@/components/ModernTable';
import Link from 'next/link';

interface RacePageProps {
  params: Promise<{ name: string }>;
}

export async function generateStaticParams() {
  const races = getAllRaces();
  return races.map((race) => ({
    name: race.name.toLowerCase().replace(/\s+/g, '-'),
  }));
}

export default async function RacePage({ params }: RacePageProps) {
  const { name } = await params;
  const raceName = name.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  
  const race = getRace(raceName);
  if (!race) {
    notFound();
  }

  const availableClasses = race.availableClasses.map(className => getClass(className)).filter(Boolean);

  // Prepare stats data for table
  const statsData = [
    { stat: 'Strength', value: race.maxStats.strength, max: 25 },
    { stat: 'Intelligence', value: race.maxStats.intelligence, max: 25 },
    { stat: 'Wisdom', value: race.maxStats.wisdom, max: 25 },
    { stat: 'Dexterity', value: race.maxStats.dexterity, max: 25 },
    { stat: 'Constitution', value: race.maxStats.constitution, max: 25 },
  ];

  // Prepare available classes data for table
  const classesData = availableClasses.map(cls => ({
    name: cls.name,
    description: cls.description,
    xpPenalty: cls.xpPenalty === 0 ? 'No penalty' : `${cls.xpPenalty}% penalty`,
    alignments: cls.allowedAlignments.join(', '),
  }));

  return (
    <div className="bg-background">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6">
        {/* Race Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-foreground mb-2">{race.name}</h1>
          <p className="text-muted-foreground">Race Information</p>
        </div>

        {/* Race Statistics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatsCard
            title="XP Penalty"
            value={race.xpPenalty === 0 ? 'None' : `${race.xpPenalty}%`}
            icon={
              <Icon icon="game-icons:fast-arrow" className="w-6 h-6 text-primary" />
            }
          />
          <StatsCard
            title="Available Classes"
            value={race.availableClasses.length}
            icon={
              <Icon icon="game-icons:swordman" className="w-6 h-6 text-primary" />
            }
          />
          <StatsCard
            title="Allowed Alignments"
            value={race.allowedAlignments.length}
            icon={
              <Icon icon="game-icons:balance-scale" className="w-6 h-6 text-primary" />
            }
          />
          <StatsCard
            title="Max Stats"
            value="25"
            icon={
              <Icon icon="game-icons:muscle-up" className="w-6 h-6 text-primary" />
            }
          />
        </div>

        {/* Race Description */}
        <div className="bg-card border border-border rounded-xl shadow-sm p-6 mb-6">
          <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center">
            <Icon icon="game-icons:scroll-quill" className="w-5 h-5 mr-2 text-primary" />
            Description
          </h2>
          <p className="text-muted-foreground leading-relaxed">{race.description}</p>
        </div>

        {/* Race Features */}
        {race.features.length > 0 && (
          <div className="bg-card border border-border rounded-xl shadow-sm p-6 mb-6">
            <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center">
              <Icon icon="game-icons:magic-swirl" className="w-5 h-5 mr-2 text-primary" />
              Special Features
            </h2>
            <ul className="text-muted-foreground leading-relaxed">
              {race.features.map((feature, index) => (
                <li key={index} className="mb-1">• {feature}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Race Statistics */}
        <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden mb-6">
          <ModernTable
            title="Maximum Statistics"
            description="Maximum stat values this race can achieve"
            columns={[
              { key: 'stat', label: 'Statistic' },
              { key: 'value', label: 'Maximum Value' },
              { key: 'max', label: 'Cap' },
            ]}
            data={statsData}
            renderCell={(key, value, row) => {
              if (key === 'value') {
                const isMax = value === 25;
                return (
                  <div className="text-right">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      isMax ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                    } select-none`}>
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

        {/* Race Information Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="bg-card border border-border rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibold text-foreground mb-3 flex items-center">
              <Icon icon="game-icons:balance-scale" className="w-5 h-5 mr-2 text-primary" />
              Allowed Alignments
            </h3>
            <div className="flex flex-wrap gap-2">
              {race.allowedAlignments.map((alignment) => (
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
              {race.xpPenalty === 0 ? 'No penalty' : `${race.xpPenalty}% penalty`}
            </p>
          </div>
        </div>

        {/* Available Classes */}
        <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
          <ModernTable
            title="Available Classes"
            description="Classes that this race can choose"
            columns={[
              { key: 'name', label: 'Class' },
              { key: 'description', label: 'Description' },
              { key: 'xpPenalty', label: 'XP Penalty' },
              { key: 'alignments', label: 'Alignments' },
            ]}
            data={classesData}
            renderCell={(key, value, row) => {
              if (key === 'name') {
                return (
                  <div className="font-medium text-foreground">
                    <Link 
                      href={`/class/${row.name.toLowerCase().replace(/\s+/g, '-')}`}
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

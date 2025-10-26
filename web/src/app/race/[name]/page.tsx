import { notFound } from 'next/navigation';
import { getRaceBySlug, getAllRaces } from '@/lib/races';
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
    slug: race.slug,
  }));
}

export default async function RacePage({ params }: RacePageProps) {
  const { name } = await params;
  
  const race = getRaceBySlug(name);
  if (!race) {
    notFound();
  }

  const availableClasses = race.availableClasses.map(className => getClass(className)).filter(Boolean);

  // Prepare available classes data for table
  const classesData = availableClasses.map(cls => ({
    name: cls!.name,
    title: cls!.title,
    slug: cls!.slug,
    description: cls!.description,
    xpPenalty: cls!.xpPenalty === 0 ? 'No penalty' : `${cls!.xpPenalty}%`,
    alignments: cls!.allowedAlignments.join(', '),
  }));

  return (
    <div className="bg-background">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 lg:mb-2">
        {/* Race Header */}
        <div className="mb-4 text-center">
          <h1 className="text-3xl font-bold text-foreground mb-2">{race.title}</h1>
          <p className="text-muted-foreground">{race.description}</p>
        </div>

        {/* Race Statistics */}
        <div className="mb-2 lg:mb-4">
          {/* Mobile: Icons only in one row */}
          <div className="flex justify-center gap-4 sm:hidden">
            <div className="flex flex-col items-center">
              <Icon icon="game-icons:muscle-up" className="w-6 h-6 text-primary mb-1" />
              <span className="text-sm font-medium text-foreground">{race.maxStats.strength}</span>
            </div>
            <div className="flex flex-col items-center">
              <Icon icon="game-icons:brain" className="w-6 h-6 text-primary mb-1" />
              <span className="text-sm font-medium text-foreground">{race.maxStats.intelligence}</span>
            </div>
            <div className="flex flex-col items-center">
              <Icon icon="game-icons:wisdom" className="w-6 h-6 text-primary mb-1" />
              <span className="text-sm font-medium text-foreground">{race.maxStats.wisdom}</span>
            </div>
            <div className="flex flex-col items-center">
              <Icon icon="game-icons:running-shoe" className="w-6 h-6 text-primary mb-1" />
              <span className="text-sm font-medium text-foreground">{race.maxStats.dexterity}</span>
            </div>
            <div className="flex flex-col items-center">
              <Icon icon="game-icons:heart-shield" className="w-6 h-6 text-primary mb-1" />
              <span className="text-sm font-medium text-foreground">{race.maxStats.constitution}</span>
            </div>
          </div>

          {/* Desktop: Full StatsCard grid */}
          <div className="hidden sm:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2 sm:gap-4">
            <StatsCard
              title="Strength"
              value={race.maxStats.strength}
              icon={<Icon icon="game-icons:muscle-up" className="w-6 h-6 text-primary" />}
            />
            <StatsCard
              title="Intelligence"
              value={race.maxStats.intelligence}
              icon={<Icon icon="game-icons:brain" className="w-6 h-6 text-primary" />}
            />
            <StatsCard
              title="Wisdom"
              value={race.maxStats.wisdom}
              icon={<Icon icon="game-icons:wisdom" className="w-6 h-6 text-primary" />}
            />
            <StatsCard
              title="Dexterity"
              value={race.maxStats.dexterity}
              icon={<Icon icon="game-icons:running-shoe" className="w-6 h-6 text-primary" />}
            />
            <StatsCard
              title="Constitution"
              value={race.maxStats.constitution}
              icon={<Icon icon="game-icons:heart-shield" className="w-6 h-6 text-primary" />}
            />
          </div>
        </div>

        {/* Race Features */}
        {race.features.length > 0 && (
          <div className="bg-card border border-border rounded-xl shadow-sm p-4 sm:p-6 mb-2 lg:mb-4">
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

        {/* Race Information */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 lg:gap-4 mb-2 lg:mb-4">
          <div className="bg-card border border-border rounded-xl shadow-sm p-4 sm:p-6">
            <h3 className="text-lg font-semibold text-foreground mb-3 flex items-center">
              <Icon icon="game-icons:balance-scale" className="w-5 h-5 mr-2 text-primary" />
              Allowed Alignments
            </h3>
            <div className="flex flex-wrap gap-2">
              {race.allowedAlignments.map((alignment) => (
                <span
                  key={alignment}
                  className="px-3 py-1 rounded-full text-sm font-medium bg-primary/10 text-primary"
                >
                  {alignment}
                </span>
              ))}
            </div>
          </div>
          
          <div className="bg-card border border-border rounded-xl shadow-sm p-4 sm:p-6 ">
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
        <ModernTable
          title="Available Classes"
          columns={[
            { key: 'name', label: 'Class' },
            { key: 'description', label: 'Description', hideOnMobile: true },
            { key: 'xpPenalty', label: 'XP' },
            { key: 'alignments', label: 'Alignments' },
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

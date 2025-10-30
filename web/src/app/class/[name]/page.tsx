import { notFound } from 'next/navigation';
import { getClassBySlug, getAllClasses } from '@/lib/classes';
import { getCompatibleRacesForClass, getRace } from '@/lib/races';
import { Icon } from '@iconify/react';
import ModernTable from '@/components/ModernTable';
import Link from 'next/link';
import type { Metadata } from 'next';

interface ClassPageProps {
  params: Promise<{ name: string }>;
}

export async function generateStaticParams() {
  const classes = getAllClasses();
  return classes.map((cls) => ({
    name: cls.slug,
  }));
}

export default async function ClassPage({ params }: ClassPageProps) {
  const { name } = await params;
  
  const cls = getClassBySlug(name);
  if (!cls) {
    notFound();
  }

  const compatibleRaceNames = getCompatibleRacesForClass(cls.name);
  const compatibleRaces = compatibleRaceNames.map(raceName => getRace(raceName)).filter(Boolean);

  // Prepare compatible races data for table
  const racesData = compatibleRaces.map(race => ({
    name: race!.name,
    title: race!.title,
    slug: race!.slug,
    description: race!.description,
    xpPenalty: race!.xpPenalty === 0 ? 'No penalty' : `${race!.xpPenalty}%`,
    alignments: race!.allowedAlignments.join(', '),
  }));

  return (
    <div className="bg-background">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 lg:mb-2">
        {/* Class Header */}
        <div className="mb-4 text-center">
          <h1 className="text-3xl font-bold text-foreground mb-2">{cls.title}</h1>
          <p className="text-muted-foreground">{cls.description}</p>
          {cls.reference.length > 0 && (
            <div>
              <span className="text-sm text-muted-foreground">See also: </span>
              {cls.reference.map((ref, index) => (
                <span key={index}>
                  <Link
                    href={ref.url}
                    className="text-sm text-primary hover:text-primary/80 hover:underline"
                  >
                    {ref.label}
                  </Link>
                  {index < cls.reference.length - 1 && (
                    <span className="text-sm text-muted-foreground">, </span>
                  )}
                </span>
              ))}
            </div>
          )}
        </div>


        {/* Class Features */}
        {cls.features.length > 0 && (
          <div className="bg-card border border-border rounded-xl shadow-sm p-4 sm:p-6 mb-2 lg:mb-4">
            <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center">
              <Icon icon="game-icons:magic-swirl" className="w-5 h-5 mr-2 text-primary" />
              Special Features
            </h2>
            <ul className="text-muted-foreground leading-relaxed">
              {cls.features.map((feature, index) => (
                <li key={index} className="mb-1">• {feature}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Class Information */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 lg:gap-4 mb-2 lg:mb-4">
          <div className="bg-card border border-border rounded-xl shadow-sm p-4 sm:p-6">
            <h3 className="text-lg font-semibold text-foreground mb-3 flex items-center">
              <Icon icon="game-icons:balance-scale" className="w-5 h-5 mr-2 text-primary" />
              Allowed Alignments
            </h3>
            <div className="flex flex-wrap gap-2">
              {cls.allowedAlignments.map((alignment) => (
                <span
                  key={alignment}
                  className="px-3 py-1 rounded-full text-sm font-medium bg-primary/10 text-primary"
                >
                  {alignment}
                </span>
              ))}
            </div>
          </div>
          
          <div className="bg-card border border-border rounded-xl shadow-sm p-4 sm:p-6">
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
        <ModernTable
          title="Compatible Races"
          columns={[
            { key: 'name', label: 'Race' },
            { key: 'description', label: 'Description', hideOnMobile: true },
            { key: 'xpPenalty', label: 'XP' },
            { key: 'alignments', label: 'Alignments' },
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

export async function generateMetadata({ params }: ClassPageProps): Promise<Metadata> {
  const { name } = await params;
  const cls = getClassBySlug(name);
  if (!cls) {
    return { title: 'Class Not Found' };
  }
  const canonical = `/class/${cls.slug}`;
  const title = `${cls.title} · Class`;
  const description = cls.description;
  return {
    title,
    description,
    alternates: { canonical },
    openGraph: { title, description, url: canonical },
    twitter: { title, description, card: 'summary' },
  };
}
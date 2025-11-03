import { notFound } from 'next/navigation';
import { getClassBySlug, getAllClasses } from '@/lib/classes';
import { getCompatibleRacesForClass, getRace } from '@/lib/races';
import { Specs, Alignment } from '@/lib/enums';
import AlignToggler from '@/components/AlignToggler';
import { Icon } from '@iconify/react';
import ModernTable from '@/components/ModernTable';
import ClassSkillsDisplay from '@/components/ClassSkillsDisplay';
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

interface ClassPageSearchParams {
  spec?: string | string[];
  magicmajor?: string;
  wayfollow?: string;
  alignment?: string;
}

export default async function ClassPage({ 
  params,
  searchParams 
}: ClassPageProps & {
  searchParams: Promise<ClassPageSearchParams>;
}) {
  const { name } = await params;
  const search = await searchParams;
  
  const cls = getClassBySlug(name);
  if (!cls) {
    notFound();
  }

  // Parse selected specs from URL params and validate them
  const specParam = search.spec;
  const rawSpecs = Array.isArray(specParam)
    ? (specParam as string[])
    : specParam
    ? [specParam]
    : [];
  
  // Validate specs against valid Specs values
  const validSpecValues = Object.values(Specs);
  const selectedSpecs = rawSpecs
    .filter((spec): spec is Specs => 
      validSpecValues.includes(spec as Specs)
    )
    .slice(0, cls.specChoices || 3); // Limit to max allowed selections

  // Parse selected magic major from URL params and validate it
  const magicMajorParam = search.magicmajor;
  const selectedMagicMajor = magicMajorParam && validSpecValues.includes(magicMajorParam as Specs)
    ? (magicMajorParam as Specs)
    : null;

  // Parse selected wayfollow from URL params and validate it
  const wayfollowParam = search.wayfollow;
  const selectedWayfollow = wayfollowParam && validSpecValues.includes(wayfollowParam as Specs)
    ? (wayfollowParam as Specs)
    : null;

  // Parse selected alignment from URL params and validate it
  const alignmentParam = search.alignment;
  const validAlignmentValues = Object.values(Alignment);
  const selectedAlignment = alignmentParam && validAlignmentValues.includes(alignmentParam as Alignment)
    ? (alignmentParam as Alignment)
    : null;

  const compatibleRaceNames = getCompatibleRacesForClass(cls.name);
  let compatibleRaces = compatibleRaceNames.map(raceName => getRace(raceName)).filter(Boolean);

  // Filter races by selected alignment if one is selected
  if (selectedAlignment) {
    compatibleRaces = compatibleRaces.filter(race => 
      race?.allowedAlignments.includes(selectedAlignment)
    );
  }

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

        {/* Weapons, Consumables, Specializations, Basic Skills and Spells */}
        <ClassSkillsDisplay
          weapons={cls.weapons}
          consumables={cls.consumables}
          basicSkills={cls.basicSkills}
          basicSpells={cls.basicSpells}
          specSkills={cls.specSkills}
          specSpells={cls.specSpells}
          specChoices={cls.specChoices}
          specAllowed={cls.specAllowed}
          selectedSpecs={selectedSpecs}
          magicMajorChoices={cls.magicMajorChoices}
          selectedMagicMajor={selectedMagicMajor}
          wayfollowChoices={cls.wayfollowChoices}
          selectedWayfollow={selectedWayfollow}
          currentPath={`/class/${cls.slug}`}
        />

        {/* Class Features */}
        {cls.features.length > 0 && (
          <div className="bg-card border border-border rounded-xl shadow-sm p-4 sm:p-6 mb-2 lg:mb-4 mt-2 lg:mt-4">
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 lg:gap-4 mb-2 lg:mb-4 mt-2 lg:mt-4">
          <AlignToggler
            availableAlignments={cls.allowedAlignments}
            selectedAlignment={selectedAlignment}
            preserveParams={{
              ...(search.spec ? { spec: search.spec } : {}),
              ...(search.magicmajor ? { magicmajor: search.magicmajor } : {}),
              ...(search.wayfollow ? { wayfollow: search.wayfollow } : {}),
            }}
            currentPath={`/class/${cls.slug}`}
          />
          
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
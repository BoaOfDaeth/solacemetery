import React from 'react';
import SpecToggler from './SpecToggler';
import SpecTogglerSingle from './SpecTogglerSingle';
// import SkillTable from './SkillTable';
import SkillChart from './SkillChart';
import { Skill, Spec, SpecSpell } from '@/lib/types';
import { Specs, Alignment } from '@/lib/enums';

interface ClassSkillsDisplayProps {
  weapons?: Skill[];
  consumables?: Skill[];
  basicSkills?: Skill[];
  basicSpells?: Skill[];
  specSkills?: Spec[];
  specSpells?: SpecSpell[];
  specChoices?: number;
  specAllowed?: Specs[];
  selectedSpecs: Specs[];
  magicMajorChoices?: Array<{ spec: Specs; desc: string[] }>;
  selectedMagicMajor?: Specs | null;
  wayfollowChoices?: Array<{ spec: Specs; desc: string[]; allowedAlignments: Alignment[] }>;
  selectedWayfollow?: Specs | null;
  currentPath: string;
}

export default function ClassSkillsDisplay({
  weapons = [],
  consumables = [],
  basicSkills = [],
  basicSpells = [],
  specSkills = [],
  specSpells = [],
  specChoices,
  specAllowed,
  selectedSpecs,
  magicMajorChoices,
  selectedMagicMajor,
  wayfollowChoices,
  selectedWayfollow,
  currentPath,
}: ClassSkillsDisplayProps) {
  // Get skills from selected specializations (fighter specs)
  const selectedSpecSkills = selectedSpecs.flatMap((specId) => {
    const spec = specSkills.find((s) => s.id === specId);
    return spec?.skills || [];
  });

  // Get skills from selected magic major
  const selectedMagicMajorSkills = selectedMagicMajor
    ? (specSkills.find((s) => s.id === selectedMagicMajor)?.skills || [])
    : [];

  // Get skills from selected wayfollow
  const selectedWayfollowSkills = selectedWayfollow
    ? (specSkills.find((s) => s.id === selectedWayfollow)?.skills || [])
    : [];

  // Get spells from selected specializations (fighter specs)
  const selectedSpecSpells = selectedSpecs.flatMap((specId) => {
    const spec = specSpells.find((s) => s.id === specId);
    return spec?.spells || [];
  });

  // Get spells from selected magic major
  const selectedMagicMajorSpells = selectedMagicMajor
    ? (specSpells.find((s) => s.id === selectedMagicMajor)?.spells || [])
    : [];

  // Get spells from selected wayfollow
  const selectedWayfollowSpells = selectedWayfollow
    ? (specSpells.find((s) => s.id === selectedWayfollow)?.spells || [])
    : [];

  // Merge basic skills with selected spec skills, magic major skills, and wayfollow skills, marking spec skills with a flag
  const allSkills: (Skill & { isSpec?: boolean })[] = [
    ...basicSkills.map((skill) => ({ ...skill, isSpec: false })),
    ...selectedSpecSkills.map((skill) => ({ ...skill, isSpec: true })),
    ...selectedMagicMajorSkills.map((skill) => ({ ...skill, isSpec: true })),
    ...selectedWayfollowSkills.map((skill) => ({ ...skill, isSpec: true })),
  ];

  // Merge basic spells with selected spec spells, magic major spells, and wayfollow spells, marking spec spells with a flag
  const allSpells: (Skill & { isSpec?: boolean })[] = [
    ...basicSpells.map((spell) => ({ ...spell, isSpec: false })),
    ...selectedSpecSpells.map((spell) => ({ ...spell, isSpec: true })),
    ...selectedMagicMajorSpells.map((spell) => ({ ...spell, isSpec: true })),
    ...selectedWayfollowSpells.map((spell) => ({ ...spell, isSpec: true })),
  ];

  return (
    <>
      {/* Weapons, Consumables, Specializations, Skills and Spells - side by side on desktop */}
      {(weapons.length > 0 || consumables.length > 0 || (magicMajorChoices && magicMajorChoices.length > 0) || (wayfollowChoices && wayfollowChoices.length > 0) || (specChoices && specChoices > 0 && specAllowed && specAllowed.length > 0) || allSkills.length > 0 || allSpells.length > 0) ? (
        <div className="mt-2 lg:mt-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Left Column: Weapons, Consumables, Specializations */}
            <div className="lg:col-span-1 flex flex-col gap-4">
              {/* Weapons */}
              {weapons.length > 0 && (
                <SkillChart title="Weapons" skills={weapons} />
              )}
              
              {/* Consumables */}
              {consumables.length > 0 && (
                <SkillChart title="Consumables" skills={consumables} />
              )}
              
              {/* Single spec selection (e.g., Magic Major) */}
              {magicMajorChoices && magicMajorChoices.length > 0 && (
                <SpecTogglerSingle
                  availableSpecs={magicMajorChoices}
                  selectedSpec={selectedMagicMajor}
                  queryParam="magicmajor"
                  title="Major Magic"
                  currentPath={currentPath}
                />
              )}
              
              {/* Single spec selection (e.g., Wayfollow) */}
              {wayfollowChoices && wayfollowChoices.length > 0 && (
                <SpecTogglerSingle
                  availableSpecs={wayfollowChoices}
                  selectedSpec={selectedWayfollow}
                  queryParam="wayfollow"
                  title="Wayfollow"
                  currentPath={currentPath}
                />
              )}
              
              {/* Specializations - vertical */}
              {specChoices && specChoices > 0 && specAllowed && specAllowed.length > 0 && (
                <SpecToggler
                  availableSpecs={specAllowed}
                  maxSelections={specChoices}
                  selectedSpecs={selectedSpecs}
                  currentPath={currentPath}
                />
              )}
            </div>
            
            {/* Right Column: Skills and Spells Charts */}
            <div className="lg:col-span-2 flex flex-col gap-4">
              {allSkills.length > 0 && (
                <SkillChart title="Skills" skills={allSkills} />
              )}
              {allSpells.length > 0 && (
                <SkillChart title="Spells" skills={allSpells} />
              )}
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}


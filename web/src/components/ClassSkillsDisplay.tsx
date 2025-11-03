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
  kinshipChoices?: Array<{ spec: Specs; desc: string[] }>;
  selectedKinship?: Specs | null;
  worshipChoices?: Array<{ spec: Specs; desc: string[]; allowedAlignments: Alignment[] }>;
  selectedWorship?: Specs | null;
  alignToggler?: React.ReactNode; // AlignToggler component to display
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
  kinshipChoices,
  selectedKinship,
  worshipChoices,
  selectedWorship,
  alignToggler,
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

  // Get skills from selected kinship
  const selectedKinshipSkills = selectedKinship
    ? (specSkills.find((s) => s.id === selectedKinship)?.skills || [])
    : [];

  // Get skills from selected worship
  const selectedWorshipSkills = selectedWorship
    ? (specSkills.find((s) => s.id === selectedWorship)?.skills || [])
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

  // Get spells from selected kinship
  const selectedKinshipSpells = selectedKinship
    ? (specSpells.find((s) => s.id === selectedKinship)?.spells || [])
    : [];

  // Get spells from selected worship
  const selectedWorshipSpells = selectedWorship
    ? (specSpells.find((s) => s.id === selectedWorship)?.spells || [])
    : [];

  // Get excluded basic skills from selected worship (if any)
  const excludedBasicSkills = selectedWorship && worshipChoices
    ? worshipChoices.find((w) => w.spec === selectedWorship)?.excludedBasicSkills || []
    : [];

  // Filter basic skills to exclude any specified by the selected worship
  const filteredBasicSkills = basicSkills.filter(
    (skill) => !excludedBasicSkills.includes(skill.name.toLowerCase())
  );

  // Merge basic skills with selected spec skills, magic major skills, wayfollow skills, kinship skills, and worship skills, marking spec skills with a flag
  const allSkills: (Skill & { isSpec?: boolean })[] = [
    ...filteredBasicSkills.map((skill) => ({ ...skill, isSpec: false })),
    ...selectedSpecSkills.map((skill) => ({ ...skill, isSpec: true })),
    ...selectedMagicMajorSkills.map((skill) => ({ ...skill, isSpec: true })),
    ...selectedWayfollowSkills.map((skill) => ({ ...skill, isSpec: true })),
    ...selectedKinshipSkills.map((skill) => ({ ...skill, isSpec: true })),
    ...selectedWorshipSkills.map((skill) => ({ ...skill, isSpec: true })),
  ];

  // Merge basic spells with selected spec spells, magic major spells, wayfollow spells, kinship spells, and worship spells, marking spec spells with a flag
  const allSpells: (Skill & { isSpec?: boolean })[] = [
    ...basicSpells.map((spell) => ({ ...spell, isSpec: false })),
    ...selectedSpecSpells.map((spell) => ({ ...spell, isSpec: true })),
    ...selectedMagicMajorSpells.map((spell) => ({ ...spell, isSpec: true })),
    ...selectedWayfollowSpells.map((spell) => ({ ...spell, isSpec: true })),
    ...selectedKinshipSpells.map((spell) => ({ ...spell, isSpec: true })),
    ...selectedWorshipSpells.map((spell) => ({ ...spell, isSpec: true })),
  ];

  return (
    <>
      {/* Weapons, Consumables, Specializations, Skills and Spells - side by side on desktop */}
      {(weapons.length > 0 || consumables.length > 0 || (magicMajorChoices && magicMajorChoices.length > 0) || (wayfollowChoices && wayfollowChoices.length > 0) || (kinshipChoices && kinshipChoices.length > 0) || (worshipChoices && worshipChoices.length > 0) || (specChoices && specChoices > 0 && specAllowed && specAllowed.length > 0) || allSkills.length > 0 || allSpells.length > 0 || alignToggler) ? (
        <div className="mt-2 lg:mt-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Left Column: Weapons, Consumables, Specializations, Alignments */}
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
              
              {/* Single spec selection (e.g., Kinship) */}
              {kinshipChoices && kinshipChoices.length > 0 && (
                <SpecTogglerSingle
                  availableSpecs={kinshipChoices}
                  selectedSpec={selectedKinship}
                  queryParam="kinship"
                  title="Kinship"
                  currentPath={currentPath}
                />
              )}
              
              {/* Single spec selection (e.g., Worship) */}
              {worshipChoices && worshipChoices.length > 0 && (
                <SpecTogglerSingle
                  availableSpecs={worshipChoices}
                  selectedSpec={selectedWorship}
                  queryParam="worship"
                  title="Worship"
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
              
              {/* Alignment Toggler */}
              {alignToggler}
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


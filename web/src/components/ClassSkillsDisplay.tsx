import React from 'react';
import SpecToggler from './SpecToggler';
// import SkillTable from './SkillTable';
import SkillChart from './SkillChart';
import { Skill, Spec } from '@/lib/types';
import { FighterSpecialization } from '@/lib/enums';

interface ClassSkillsDisplayProps {
  weapons?: Skill[];
  consumables?: Skill[];
  basicSkills?: Skill[];
  specs?: Spec[];
  specChoices?: number;
  specAllowed?: FighterSpecialization[];
  selectedSpecs: FighterSpecialization[];
  currentPath: string;
}

export default function ClassSkillsDisplay({
  weapons = [],
  consumables = [],
  basicSkills = [],
  specs = [],
  specChoices,
  specAllowed,
  selectedSpecs,
  currentPath,
}: ClassSkillsDisplayProps) {
  // Get skills from selected specializations
  const selectedSpecSkills = selectedSpecs.flatMap((specId) => {
    const spec = specs.find((s) => s.id === specId);
    return spec?.skills || [];
  });

  // Merge basic skills with selected spec skills, marking spec skills with a flag
  const allSkills: (Skill & { isSpec?: boolean })[] = [
    ...basicSkills.map((skill) => ({ ...skill, isSpec: false })),
    ...selectedSpecSkills.map((skill) => ({ ...skill, isSpec: true })),
  ];

  return (
    <>
      {/* Weapons, Consumables, Specializations and Skills - side by side on desktop */}
      {(weapons.length > 0 || consumables.length > 0 || (specChoices && specChoices > 0 && specAllowed && specAllowed.length > 0) || allSkills.length > 0) ? (
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
            
            {/* Right Column: Skills Chart */}
            {allSkills.length > 0 && (
              <div className="lg:col-span-2">
                <SkillChart title="Skills" skills={allSkills} />
              </div>
            )}
          </div>
        </div>
      ) : null}
    </>
  );
}


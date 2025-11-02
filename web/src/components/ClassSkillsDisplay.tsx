import React from 'react';
import SpecToggler from './SpecToggler';
import SkillTable from './SkillTable';
import { Skill, Spec } from '@/lib/types';
import { FighterSpecialization } from '@/lib/enums';

interface ClassSkillsDisplayProps {
  basicSkills?: Skill[];
  specs?: Spec[];
  specChoices?: number;
  specAllowed?: FighterSpecialization[];
  selectedSpecs: FighterSpecialization[];
  currentPath: string;
}

export default function ClassSkillsDisplay({
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
      {/* Specializations */}
      {specChoices && specChoices > 0 && specAllowed && specAllowed.length > 0 && (
        <div className="mt-2 lg:mt-4">
          <SpecToggler
            availableSpecs={specAllowed}
            maxSelections={specChoices}
            selectedSpecs={selectedSpecs}
            currentPath={currentPath}
          />
        </div>
      )}

      {/* Basic Skills */}
      {allSkills.length > 0 && (
        <div className="mt-2 lg:mt-4">
          <SkillTable title="Skills" skills={allSkills} />
        </div>
      )}
    </>
  );
}


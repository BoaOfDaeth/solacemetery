import React from 'react';
import Link from 'next/link';
import { Skill } from '@/lib/types';

interface SkillChartProps {
  title: string;
  skills: (Skill & { isSpec?: boolean })[];
  className?: string;
}

export default function SkillChart({
  title,
  skills,
  className = '',
}: SkillChartProps) {
  // Group skills by level
  const skillsByLevel = skills.reduce(
    (acc, skill) => {
      if (!acc[skill.level]) {
        acc[skill.level] = [];
      }
      acc[skill.level].push(skill);
      return acc;
    },
    {} as Record<number, (Skill & { isSpec?: boolean })[]>
  );

  const levels = Object.keys(skillsByLevel)
    .map(Number)
    .sort((a, b) => a - b);

  return (
    <div
      className={`bg-card border border-border rounded-xl shadow-sm overflow-hidden ${className}`}
    >
      {/* Header */}
      <div className="px-4 sm:px-6 py-3 border-b border-border bg-muted/30">
        <h3 className="text-lg font-semibold text-foreground break-words text-center">
          {title}
        </h3>
      </div>

      {/* Skills Chart */}
      <div className="px-4 sm:px-6 py-4">
        {levels.map((level) => (
          <div key={level} className="mb-2 last:mb-0">
            <div className="flex flex-wrap items-center justify-center gap-1.5">
              {skillsByLevel[level].map((skill) => {
                const isSpec = skill.isSpec === true;
                const borderClasses = isSpec
                  ? 'border-yellow-500 hover:border-yellow-500/80'
                  : skill.url
                  ? 'border border-border hover:border-primary/50'
                  : 'border border-border';
                const bgClasses = isSpec ? 'bg-yellow-500/10' : '';
                const textClasses = skill.url
                  ? 'text-primary hover:text-primary/80 hover:underline'
                  : 'text-foreground';

                const skillElement = skill.url ? (
                  <Link
                    key={skill.name}
                    href={skill.url}
                    className={`px-1.5 py-0.5 rounded text-sm transition-colors border ${borderClasses} ${bgClasses} ${textClasses}`}
                    title={`Level ${level}`}
                  >
                    {skill.name}
                  </Link>
                ) : (
                  <span
                    key={skill.name}
                    className={`px-1.5 py-0.5 rounded text-sm border ${borderClasses} ${bgClasses} ${textClasses}`}
                    title={`Level ${level}`}
                  >
                    {skill.name}
                  </span>
                );

                return skillElement;
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Empty state */}
      {skills.length === 0 && (
        <div className="px-4 sm:px-6 py-8 text-center">
          <div className="text-muted-foreground">
            <svg
              className="mx-auto h-10 w-10 mb-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <p className="text-sm">No skills available</p>
          </div>
        </div>
      )}
    </div>
  );
}


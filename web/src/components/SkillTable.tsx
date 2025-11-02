import React from 'react';
import Link from 'next/link';
import { Skill } from '@/lib/types';

interface SkillTableProps {
  title: string;
  skills: (Skill & { isSpec?: boolean })[];
  className?: string;
}

export default function SkillTable({
  title,
  skills,
  className = '',
}: SkillTableProps) {
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
        <h3 className="text-lg font-semibold text-foreground break-words">
          {title}
        </h3>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-border">
          <thead className="bg-muted/50">
            <tr>
              <th className="px-3 sm:px-6 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Level
              </th>
              <th className="px-3 sm:px-6 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Skills
              </th>
            </tr>
          </thead>
          <tbody className="bg-card divide-y divide-border">
            {levels.map((level) => (
              <tr
                key={level}
                className="hover:bg-accent/50 transition-colors duration-150"
              >
                <td className="px-3 sm:px-6 py-3 text-sm font-medium text-foreground">
                  {level}
                </td>
                <td className="px-3 sm:px-6 py-3">
                  <div className="flex flex-wrap gap-2">
                    {skillsByLevel[level].map((skill) => {
                      const isSpec = skill.isSpec === true;
                      const yellowClasses = isSpec
                        ? 'border-yellow-500/50 bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 hover:border-yellow-500/80'
                        : '';
                      const defaultClasses = skill.url
                        ? 'border border-border rounded text-primary hover:text-primary/80 hover:underline hover:border-primary/50'
                        : 'border border-border rounded text-foreground';

                      return skill.url ? (
                        <Link
                          key={skill.name}
                          href={skill.url}
                          className={`px-2 py-1 rounded font-medium text-sm transition-colors ${defaultClasses} ${yellowClasses}`}
                        >
                          {skill.name}
                        </Link>
                      ) : (
                        <span
                          key={skill.name}
                          className={`px-2 py-1 rounded font-medium text-sm ${defaultClasses} ${yellowClasses}`}
                        >
                          {skill.name}
                        </span>
                      );
                    })}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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


import React from 'react';
import Link from 'next/link';

interface StatsCardProps {
  title: string;
  value: number | string;
  description?: string;
  icon?: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
  href?: string;
}

export default function StatsCard({ 
  title, 
  value, 
  description, 
  icon, 
  trend,
  className = "",
  href
}: StatsCardProps) {
  const cardContent = (
    <div className="flex items-center justify-between h-full">
      <div className="flex-1">
        <p className="text-sm font-medium text-muted-foreground mb-1">{title}</p>
        <div className="flex items-baseline space-x-2">
          <p className="text-2xl sm:text-3xl font-bold text-foreground">{value}</p>
          {trend && (
            <span className={`text-xs font-medium ${
              trend.isPositive ? 'text-green-600' : 'text-red-600'
            }`}>
              {trend.isPositive ? '+' : ''}{trend.value}%
            </span>
          )}
        </div>
        {description && (
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
        )}
      </div>
      {icon && (
        <div className="flex-shrink-0 ml-4 flex items-center">
          <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
            {icon}
          </div>
        </div>
      )}
    </div>
  );

  if (href) {
    return (
      <Link 
        href={href}
        className={`bg-card border border-border rounded-xl p-4 shadow-sm hover:shadow-md hover:border-primary/50 transition-all duration-200 cursor-pointer block ${className}`}
      >
        {cardContent}
      </Link>
    );
  }

  return (
    <div className={`bg-card border border-border rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-200 ${className}`}>
      {cardContent}
    </div>
  );
}

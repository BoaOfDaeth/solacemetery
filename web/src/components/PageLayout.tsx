import { ReactNode } from 'react';

interface PageLayoutProps {
  children: ReactNode;
  className?: string;
  containerClassName?: string;
}

export default function PageLayout({ 
  children, 
  className = "min-h-screen bg-background",
  containerClassName = "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
}: PageLayoutProps) {
  return (
    <div className={className}>
      <div className={containerClassName}>
        <div className="space-y-6">
          {children}
        </div>
      </div>
    </div>
  );
}

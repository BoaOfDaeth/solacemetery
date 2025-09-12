import { ReactNode } from 'react';

interface PageLayoutProps {
  children: ReactNode;
  className?: string;
  containerClassName?: string;
}

export default function PageLayout({ 
  children, 
  className = "min-h-screen bg-gray-100",
  containerClassName = "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
}: PageLayoutProps) {
  return (
    <div className={className}>
      <div className={containerClassName}>
        {children}
      </div>
    </div>
  );
}

import { ReactNode } from 'react';
import PageHeader from './PageHeader';
import PageLayout from './PageLayout';

interface TablePageLayoutProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  className?: string;
}

export default function TablePageLayout({ 
  title, 
  subtitle, 
  children,
  className = "pb-8"
}: TablePageLayoutProps) {
  return (
    <PageLayout className="min-h-screen bg-gray-100">
      <PageHeader title={title} subtitle={subtitle} />
      
      <div className={className}>
        <div className="bg-white shadow overflow-hidden">
          {children}
        </div>
      </div>
    </PageLayout>
  );
}

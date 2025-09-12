import { ReactNode } from 'react';
import PageHeader from './PageHeader';
import PageLayout from './PageLayout';

interface TablePageLayoutProps {
  title: string;
  subtitle?: string;
  description?: string;
  children: ReactNode;
  className?: string;
}

export default function TablePageLayout({ 
  title, 
  subtitle, 
  description,
  children,
  className = "pb-8"
}: TablePageLayoutProps) {
  return (
    <PageLayout className="min-h-screen bg-background">
      <PageHeader title={title} subtitle={subtitle} description={description} />
      
      <div className={className}>
        <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
          {children}
        </div>
      </div>
    </PageLayout>
  );
}

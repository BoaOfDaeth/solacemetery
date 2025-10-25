import Link from 'next/link';
import { getHelpData, getCategoryInfo } from '@/lib/help';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export default function HelpPage() {
  const helpData = getHelpData();

  return (
    <div className="bg-background">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6">


        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {helpData.categories.map((category) => {
            const categoryInfo = getCategoryInfo(category);
            if (!categoryInfo) return null;
            
            return (
              <Link
                key={category}
                href={`/help/category/${category}`}
                className="block bg-card border border-border rounded-lg p-6 hover:bg-muted/50 transition-colors"
              >
                <h2 className="text-2xl font-bold text-foreground mb-2 capitalize">
                  {category}
                </h2>
                <p className="text-muted-foreground">
                  {categoryInfo.articleCount} article{categoryInfo.articleCount !== 1 ? 's' : ''}
                </p>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export const metadata = {
  title: 'Help Categories - Solace MUD',
  description: 'Browse help categories to find articles for Solace MUD',
};

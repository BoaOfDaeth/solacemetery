import Link from 'next/link';
import { getHelpData } from '@/lib/help';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export default function HelpPage() {
  const helpData = getHelpData();

  return (
    <div className="bg-background">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Help Articles
          </h1>
          <p className="text-muted-foreground text-lg">
            Browse all available help articles organized by category.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-card border border-border rounded-lg p-6">
            <h3 className="text-2xl font-bold text-foreground">{helpData.totalArticles}</h3>
            <p className="text-muted-foreground">Total Articles</p>
          </div>
          <div className="bg-card border border-border rounded-lg p-6">
            <h3 className="text-2xl font-bold text-foreground">{helpData.categories.length}</h3>
            <p className="text-muted-foreground">Categories</p>
          </div>
          <div className="bg-card border border-border rounded-lg p-6">
            <h3 className="text-2xl font-bold text-foreground">
              {new Date(helpData.lastUpdated).toLocaleDateString()}
            </h3>
            <p className="text-muted-foreground">Last Updated</p>
          </div>
        </div>

        {/* Articles by Category */}
        <div className="space-y-8">
          {helpData.categories.map((category) => {
            const categoryArticles = Array.from(helpData.articlesMap.values()).filter(
              article => article.category === category
            );
            
            return (
              <div key={category} className="bg-card border border-border rounded-lg p-6">
                <h2 className="text-2xl font-bold text-foreground mb-4 capitalize">
                  {category}
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {categoryArticles.map((article) => (
                    <Link
                      key={article.id}
                      href={`/help/${article.id}`}
                      className="block p-4 bg-muted/50 hover:bg-muted border border-border rounded-lg transition-colors"
                    >
                      <h3 className="font-semibold text-foreground mb-2">
                        {article.title}
                      </h3>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span className="px-2 py-1 bg-primary/10 text-primary rounded text-xs">
                          Level {article.level}
                        </span>
                        {article.syntax && (
                          <span className="text-xs">Has Syntax</span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                        {article.content.substring(0, 100)}...
                      </p>
                    </Link>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export const metadata = {
  title: 'Help Articles - Solace MUD',
  description: 'Browse all available help articles for Solace MUD',
};

import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getArticlesByCategory, getCategoryInfo } from '@/lib/help';

interface CategoryPageProps {
  params: Promise<{ category: string }>;
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category } = await params;
  
  // Get category info and articles
  const categoryInfo = getCategoryInfo(category);
  const articles = getArticlesByCategory(category);
  
  if (!categoryInfo || articles.length === 0) {
    notFound();
  }

  return (
    <div className="bg-background">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2 capitalize">
            {category}
          </h1>
          <p className="text-muted-foreground text-lg">
            {articles.length} article{articles.length !== 1 ? 's' : ''} in this category
          </p>
        </div>

        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {articles.map((article) => (
            <Link
              key={article.id}
              href={`/help/${article.id}`}
              className="block bg-card border border-border rounded-lg p-6 hover:bg-muted/50 transition-colors"
            >
              <h3 className="text-xl font-semibold text-foreground mb-3">
                {article.title}
              </h3>
              
              <p className="text-muted-foreground text-sm line-clamp-7">
                {article.content.substring(0, 150)}...
              </p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export async function generateMetadata({ params }: CategoryPageProps) {
  const { category } = await params;
  const categoryInfo = getCategoryInfo(category);
  
  if (!categoryInfo) {
    return {
      title: 'Category Not Found',
    };
  }

  return {
    title: `${category} Articles - Help`,
    description: `Browse ${categoryInfo.articleCount} help articles in the ${category} category for Solace MUD`,
  };
}

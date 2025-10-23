import { notFound } from 'next/navigation';
import { getArticleById } from '@/lib/help';

interface HelpArticlePageProps {
  params: Promise<{ id: string }>;
}

export default async function HelpArticlePage({ params }: HelpArticlePageProps) {
  const { id } = await params;
  
  // Get the article by ID
  const article = getArticleById(id);
  
  if (!article) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
              {article.category}
            </span>
            <span className="px-3 py-1 bg-muted text-muted-foreground rounded-full text-sm">
              Level {article.level}
            </span>
          </div>
          
          <h1 className="text-4xl font-bold text-foreground mb-4">
            {article.title}
          </h1>
          
          {article.syntax && (
            <div className="bg-muted/50 border border-border rounded-lg p-4 mb-6">
              <h3 className="text-sm font-medium text-muted-foreground mb-2">Syntax:</h3>
              <code className="text-sm font-mono bg-background px-2 py-1 rounded border">
                {article.syntax}
              </code>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="prose prose-lg max-w-none">
          <div className="whitespace-pre-wrap text-foreground leading-relaxed">
            {article.content}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 pt-8 border-t border-border">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div>
              <span className="font-medium">Category:</span> {article.category}
            </div>
            <div>
              <span className="font-medium">Level:</span> {article.level}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


export async function generateMetadata({ params }: HelpArticlePageProps) {
  const { id } = await params;
  const article = getArticleById(id);
  
  if (!article) {
    return {
      title: 'Article Not Found',
    };
  }

  return {
    title: `${article.title} - Help`,
    description: article.content.substring(0, 160) + '...',
  };
}

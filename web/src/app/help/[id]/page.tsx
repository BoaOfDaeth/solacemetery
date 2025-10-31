import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getArticleById } from '@/lib/help';
import type { Metadata } from 'next';

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
    <div className="bg-background">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 py-2">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            {article.title}
          </h1>
          
          <div className="mb-4">
            <Link 
              href={`/help/category/${article.category}`}
              className="inline-block px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium hover:bg-primary/20 transition-colors"
            >
              {article.category}
            </Link>
          </div>
          
          {article.syntax && (
            <div className="lg:mb-4 mb-2">
              <h3 className="text-sm font-medium text-muted-foreground mb-2">Syntax:</h3>
              <div className="bg-muted/30 text-sm font-mono bg-background px-2 py-1 rounded-lg border">
                {article.syntax.split('\n').map((line, index) => (
                  <div key={index} className={line.trim() ? '' : 'h-1'}>
                    {line.trim() || '\u00A0'}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="prose prose-lg max-w-none ">
          <div className="whitespace-pre-wrap text-foreground leading-relaxed font-mono text-sm bg-muted/30 p-4 rounded-lg border">
            {article.content}
          </div>
        </div>
      </div>
    </div>
  );
}


export async function generateMetadata({ params }: HelpArticlePageProps): Promise<Metadata> {
  const { id } = await params;
  const article = getArticleById(id);
  
  if (!article) {
    return {
      title: 'Article Not Found',
    };
  }

  return {
    title: `${article.title} - Help`,
    description: `${article.content.substring(0, 160)}...`,
    alternates: { canonical: `/help/${id}` },
    openGraph: {
      title: `${article.title} - Help`,
      description: `${article.content.substring(0, 160)}...`,
      url: `/help/${id}`,
    },
    twitter: {
      title: `${article.title} - Help`,
      description: `${article.content.substring(0, 160)}...`,
      card: 'summary',
    },
  };
}

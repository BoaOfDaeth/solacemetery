import { NextRequest, NextResponse } from 'next/server';
import { getHelpData, searchHelpArticles } from '@/lib/help';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get('q');

    // If query parameter 'q' is provided, search
    if (q) {
      const articles = searchHelpArticles(q);
      return NextResponse.json({
        articles,
        query: q,
        totalResults: articles.length,
        timestamp: new Date().toISOString(),
        status: 'success'
      });
    }

    // Otherwise return all help data
    const helpData = getHelpData();
    return NextResponse.json({
      articles: Array.from(helpData.articlesMap.values()),
      categories: helpData.categories,
      totalArticles: helpData.totalArticles,
      lastUpdated: helpData.lastUpdated,
      timestamp: new Date().toISOString(),
      status: 'success'
    });

  } catch (error) {
    console.error('Error in parse-help endpoint:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}

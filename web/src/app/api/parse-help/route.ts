import { NextRequest, NextResponse } from 'next/server';
import { 
  getHelpData, 
  searchHelpArticles, 
  getArticlesByCategory, 
  getArticlesByLevel,
  getArticleById,
  getCacheStats 
} from '@/lib/help';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action') || 'all';
    const query = searchParams.get('query') || '';
    const level = searchParams.get('level');
    const category = searchParams.get('category');
    const id = searchParams.get('id');

    let response: any = {};

    switch (action) {
      case 'search':
        if (!query) {
          return NextResponse.json(
            { error: 'Query parameter is required for search' },
            { status: 400 }
          );
        }
        const levelFilter = level ? parseInt(level) : undefined;
        response = {
          articles: searchHelpArticles(query, levelFilter),
          query,
          level: levelFilter,
          totalResults: searchHelpArticles(query, levelFilter).length
        };
        break;

      case 'category':
        if (!category) {
          return NextResponse.json(
            { error: 'Category parameter is required' },
            { status: 400 }
          );
        }
        response = {
          articles: getArticlesByCategory(category),
          category,
          totalResults: getArticlesByCategory(category).length
        };
        break;

      case 'level':
        if (!level) {
          return NextResponse.json(
            { error: 'Level parameter is required' },
            { status: 400 }
          );
        }
        const levelNum = parseInt(level);
        response = {
          articles: getArticlesByLevel(levelNum),
          level: levelNum,
          totalResults: getArticlesByLevel(levelNum).length
        };
        break;

      case 'article':
        if (!id) {
          return NextResponse.json(
            { error: 'ID parameter is required for article lookup' },
            { status: 400 }
          );
        }
        const article = getArticleById(id);
        if (!article) {
          return NextResponse.json(
            { error: 'Article not found' },
            { status: 404 }
          );
        }
        response = { article };
        break;

      case 'stats':
        response = {
          cache: getCacheStats(),
          helpData: getHelpData()
        };
        break;

      case 'all':
      default:
        response = getHelpData();
        break;
    }

    return NextResponse.json({
      ...response,
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

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, query, level, category, id } = body;

    let response: any = {};

    switch (action) {
      case 'search':
        if (!query) {
          return NextResponse.json(
            { error: 'Query is required for search' },
            { status: 400 }
          );
        }
        response = {
          articles: searchHelpArticles(query, level),
          query,
          level,
          totalResults: searchHelpArticles(query, level).length
        };
        break;

      case 'category':
        if (!category) {
          return NextResponse.json(
            { error: 'Category is required' },
            { status: 400 }
          );
        }
        response = {
          articles: getArticlesByCategory(category),
          category,
          totalResults: getArticlesByCategory(category).length
        };
        break;

      case 'level':
        if (level === undefined) {
          return NextResponse.json(
            { error: 'Level is required' },
            { status: 400 }
          );
        }
        response = {
          articles: getArticlesByLevel(level),
          level,
          totalResults: getArticlesByLevel(level).length
        };
        break;

      case 'article':
        if (!id) {
          return NextResponse.json(
            { error: 'ID is required for article lookup' },
            { status: 400 }
          );
        }
        const article = getArticleById(id);
        if (!article) {
          return NextResponse.json(
            { error: 'Article not found' },
            { status: 404 }
          );
        }
        response = { article };
        break;

      default:
        response = getHelpData();
        break;
    }

    return NextResponse.json({
      ...response,
      timestamp: new Date().toISOString(),
      status: 'success'
    });

  } catch (error) {
    console.error('Error in parse-help POST endpoint:', error);
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

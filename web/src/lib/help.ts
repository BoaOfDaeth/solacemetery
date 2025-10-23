import fs from 'fs';
import path from 'path';

// Help article structure
export interface HelpArticle {
  id: string;
  level: number;
  content: string;
  category: string;
  syntax?: string;
  title: string;
}

// Parsed help data structure
export interface HelpData {
  articles: HelpArticle[];
  categories: string[];
  totalArticles: number;
  lastUpdated: Date;
}

// Cache structure
interface HelpCache {
  data: HelpData | null;
  lastFetch: Date;
  isExpired: boolean;
}

// Global cache instance
let helpCache: HelpCache = {
  data: null,
  lastFetch: new Date(0),
  isExpired: true
};

// Cache duration: 1 minute
const CACHE_DURATION_MS = 60 * 1000;

/**
 * Parse a single help file and extract articles
 */
function parseHelpFile(filePath: string, category: string): HelpArticle[] {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    const articles: HelpArticle[] = [];
    
    // Split by ~ delimiter to separate articles
    const sections = content.split('~');
    
    for (let i = 0; i < sections.length - 1; i += 2) {
      const header = sections[i].trim();
      const body = sections[i + 1]?.trim();
      
      if (!header || !body) continue;
      
      // Parse header line (format: "level 'KEYWORD1 KEYWORD2'~")
      const headerMatch = header.match(/^(-?\d+)\s+(.+)$/);
      if (!headerMatch) continue;
      
      const level = parseInt(headerMatch[1]);
      const keywordLine = headerMatch[2].trim();
      
      // Extract title (remove quotes but keep as single string)
      const title = keywordLine
        .replace(/^['"]|['"]$/g, '') // Remove surrounding quotes
        .trim() || 'Untitled';
      
      // Extract syntax if present (look for "Syntax:" in content)
      const syntaxMatch = body.match(/Syntax:\s*(.+?)(?:\n|$)/i);
      const syntax = syntaxMatch ? syntaxMatch[1].trim() : undefined;
      
      // Clean content (remove syntax line if present)
      let cleanContent = body;
      if (syntaxMatch) {
        cleanContent = body.replace(/Syntax:\s*.+?(?:\n|$)/i, '').trim();
      }
      
      // Create article
      const article: HelpArticle = {
        id: `${category}_${title.replace(/\s+/g, '_')}_${level}`,
        level,
        content: cleanContent,
        category,
        syntax,
        title
      };
      
      articles.push(article);
    }
    
    return articles;
  } catch (error) {
    console.error(`Error parsing help file ${filePath}:`, error);
    return [];
  }
}

/**
 * Parse all help files and return structured data
 */
function parseAllHelpFiles(): HelpData {
  const helpDir = path.join(process.cwd(), '..', 'help');
  const articles: HelpArticle[] = [];
  const categories: string[] = [];
  
  try {
    const files = fs.readdirSync(helpDir);
    
    for (const file of files) {
      if (!file.endsWith('.are')) continue;
      
      const category = file.replace('.are', '').replace('helps_', '');
      const filePath = path.join(helpDir, file);
      
      console.log(`Parsing help file: ${file} (category: ${category})`);
      const fileArticles = parseHelpFile(filePath, category);
      
      articles.push(...fileArticles);
      categories.push(category);
    }
    
    // Sort categories alphabetically
    categories.sort();
    
    return {
      articles,
      categories,
      totalArticles: articles.length,
      lastUpdated: new Date()
    };
  } catch (error) {
    console.error('Error reading help directory:', error);
    return {
      articles: [],
      categories: [],
      totalArticles: 0,
      lastUpdated: new Date()
    };
  }
}

/**
 * Check if cache is expired
 */
function isCacheExpired(): boolean {
  const now = new Date();
  const timeDiff = now.getTime() - helpCache.lastFetch.getTime();
  return timeDiff > CACHE_DURATION_MS;
}

/**
 * Get help data with caching
 */
export function getHelpData(): HelpData {
  // Check if cache is valid
  if (helpCache.data && !isCacheExpired()) {
    return helpCache.data;
  }
  
  // Parse fresh data
  console.log('Parsing help files (cache expired or empty)');
  const data = parseAllHelpFiles();
  
  // Update cache
  helpCache = {
    data,
    lastFetch: new Date(),
    isExpired: false
  };
  
  return data;
}

/**
 * Search help articles by keyword
 */
export function searchHelpArticles(query: string, level?: number): HelpArticle[] {
  const data = getHelpData();
  const searchTerm = query.toLowerCase();
  
  return data.articles.filter(article => {
    // Filter by level if specified
    if (level !== undefined && article.level !== level) {
      return false;
    }
    
    // Search in title and content
    const titleMatch = article.title.toLowerCase().includes(searchTerm);
    const contentMatch = article.content.toLowerCase().includes(searchTerm);
    
    return titleMatch || contentMatch;
  });
}

/**
 * Get articles by category
 */
export function getArticlesByCategory(category: string): HelpArticle[] {
  const data = getHelpData();
  return data.articles.filter(article => article.category === category);
}

/**
 * Get articles by level
 */
export function getArticlesByLevel(level: number): HelpArticle[] {
  const data = getHelpData();
  return data.articles.filter(article => article.level === level);
}

/**
 * Get article by ID
 */
export function getArticleById(id: string): HelpArticle | undefined {
  const data = getHelpData();
  return data.articles.find(article => article.id === id);
}

/**
 * Get cache statistics
 */
export function getCacheStats() {
  return {
    hasData: !!helpCache.data,
    lastFetch: helpCache.lastFetch,
    isExpired: isCacheExpired(),
    cacheAge: Date.now() - helpCache.lastFetch.getTime(),
    totalArticles: helpCache.data?.totalArticles || 0
  };
}

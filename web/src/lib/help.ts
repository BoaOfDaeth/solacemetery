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
  isRefreshing: boolean;
}

// Global cache instance
let helpCache: HelpCache = {
  data: null,
  lastFetch: new Date(0),
  isRefreshing: false
};

// Cache duration: 1 minute
const CACHE_DURATION_MS = 60 * 1000;

// Hardcoded filtering constants
const RESTRICTED_CATEGORIES = ['unused', 'abyss', 'other'];
const MIN_LEVEL = 0;
const MAX_LEVEL = 36;

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
      
      // Create kebab-case slug from first 5 words of title
      const titleWords = title.split(/\s+/).slice(0, 5);
      const slug = titleWords
        .join('-')
        .replace(/[^a-zA-Z0-9-]/g, '') // Keep only alphanumeric and hyphens
        .toLowerCase();
      
      // Create article
      const article: HelpArticle = {
        id: slug,
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
      
      // Skip if category is in restricted list
      if (RESTRICTED_CATEGORIES.includes(category)) {
        console.log(`Skipping category: ${category} (restricted)`);
        continue;
      }
      
      const filePath = path.join(helpDir, file);
      
      console.log(`Parsing help file: ${file} (category: ${category})`);
      const fileArticles = parseHelpFile(filePath, category);
      
      // Filter articles by level range
      const filteredArticles = fileArticles.filter(article => {
        if (article.level < MIN_LEVEL) {
          return false;
        }
        if (article.level > MAX_LEVEL) {
          return false;
        }
        return true;
      });
      
      articles.push(...filteredArticles);
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
 * Background refresh function
 */
async function refreshCacheInBackground(): Promise<void> {
  if (helpCache.isRefreshing) {
    return; // Already refreshing
  }
  
  helpCache.isRefreshing = true;
  
  try {
    console.log('Background refresh: Parsing help files');
    const data = parseAllHelpFiles();
    
    // Update cache with new data
    helpCache = {
      data,
      lastFetch: new Date(),
      isRefreshing: false
    };
    
    console.log('Background refresh: Cache updated successfully');
  } catch (error) {
    console.error('Background refresh failed:', error);
    helpCache.isRefreshing = false;
  }
}

/**
 * Get help data with stale-while-revalidate caching
 */
export function getHelpData(): HelpData {
  // If no data exists, parse immediately
  if (!helpCache.data) {
    console.log('No cache data: Parsing help files immediately');
    const data = parseAllHelpFiles();
    
    helpCache = {
      data,
      lastFetch: new Date(),
      isRefreshing: false
    };
    
    return data;
  }
  
  // If cache is still valid, return it
  if (!isCacheExpired()) {
    return helpCache.data;
  }
  
  // Cache is expired - return stale data and refresh in background
  console.log('Cache expired: Returning stale data and refreshing in background');
  
  // Start background refresh (don't await)
  refreshCacheInBackground().catch(error => {
    console.error('Background refresh error:', error);
  });
  
  // Return stale data immediately
  return helpCache.data;
}

/**
 * Search help articles by keyword (title only)
 */
export function searchHelpArticles(query: string): HelpArticle[] {
  const data = getHelpData();
  const searchTerm = query.toLowerCase();
  
  return data.articles.filter(article => {
    // Search only in title
    return article.title.toLowerCase().includes(searchTerm);
  });
}


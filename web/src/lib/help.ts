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
  articlesMap: Map<string, HelpArticle>;
  categories: string[];
  totalArticles: number;
  lastUpdated: Date;
}

// Cache structure
interface HelpCache {
  data: HelpData | null;
  isInitialized: boolean;
}

// Global cache instance
const helpCache: HelpCache = {
  data: null,
  isInitialized: false
};

// Environment-based filtering constants
const isProduction = process.env.NODE_ENV === 'production';

const RESTRICTED_CATEGORIES = isProduction ? ['unused', 'abyss', 'other'] : [];
const MIN_LEVEL = isProduction ? 0 : -Infinity;
const MAX_LEVEL = isProduction ? 36 : Infinity;

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
      
      // Extract title (keep as-is, don't remove quotes)
      const title = keywordLine.trim() || 'Untitled';
      
      // Extract syntax if present (look for "Syntax:" in content)
      const syntaxMatch = body.match(/Syntax:\s*(.+?)(?:\n|$)/i);
      const syntax = syntaxMatch ? syntaxMatch[1].trim() : undefined;
      
      // Clean content (remove syntax line if present)
      let cleanContent = body;
      if (syntaxMatch) {
        cleanContent = body.replace(/Syntax:\s*.+?(?:\n|$)/i, '').trim();
      }
      
      // Skip articles with no content
      if (!cleanContent || cleanContent.trim().length === 0) {
        console.warn(`Skipping article with no content: ${title}`);
        continue;
      }
      
      // Skip articles with title less than 2 characters
      if (!title || title.trim().length < 2) {
        console.warn(`Skipping article with title too short: "${title}"`);
        continue;
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
  const helpDir = path.join(process.cwd(), '..', 'solace-helpdev');
  const articlesMap = new Map<string, HelpArticle>();
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
      
      // Filter articles by level range and add to map
      let categoryHasArticles = false;
      
      for (const article of fileArticles) {
        if (article.level < MIN_LEVEL || article.level > MAX_LEVEL) {
          continue;
        }
        
        // Skip articles with no content
        if (!article.content || article.content.trim().length === 0) {
          console.warn(`Skipping article with no content: ${article.id}`);
          continue;
        }
        
        // Skip articles with title less than 2 characters
        if (!article.title || article.title.trim().length < 2) {
          console.warn(`Skipping article with title too short: "${article.title}"`);
          continue;
        }
        
        // Check for ID uniqueness
        if (articlesMap.has(article.id)) {
          console.warn(`Duplicate ID found: ${article.id}. Skipping duplicate.`);
          continue;
        }
        
        articlesMap.set(article.id, article);
        categoryHasArticles = true;
      }
      
      // Only add category if it has valid articles
      if (categoryHasArticles) {
        categories.push(category);
      } else {
        console.warn(`Skipping empty category: ${category}`);
      }
    }
    
    // Sort categories alphabetically
    categories.sort();
    
    return {
      articlesMap,
      categories,
      totalArticles: articlesMap.size,
      lastUpdated: new Date()
    };
  } catch (error) {
    console.error('Error reading help directory:', error);
    return {
      articlesMap: new Map(),
      categories: [],
      totalArticles: 0,
      lastUpdated: new Date()
    };
  }
}

/**
 * Get help data (parse once, cache forever)
 */
export function getHelpData(): HelpData {
  // Parse once on first request, then cache forever
  if (!helpCache.isInitialized) {
    console.log('Initializing help data cache...');
    helpCache.data = parseAllHelpFiles();
    helpCache.isInitialized = true;
    console.log(`Help data cache initialized with ${helpCache.data.totalArticles} articles`);
  }
  
  return helpCache.data!;
}

/**
 * Search help articles by keyword (title only)
 */
export function searchHelpArticles(query: string): HelpArticle[] {
  const data = getHelpData();
  const searchTerm = query.toLowerCase();
  
  return Array.from(data.articlesMap.values()).filter(article => {
    // Search only in title
    return article.title.toLowerCase().includes(searchTerm);
  });
}

/**
 * Get article by ID
 */
export function getArticleById(id: string): HelpArticle | undefined {
  const data = getHelpData();
  return data.articlesMap.get(id);
}


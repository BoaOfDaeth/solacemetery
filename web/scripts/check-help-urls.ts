/**
 * Crawler script to check all help URLs in the codebase for 404 errors.
 * 
 * This script:
 * 1. Extracts all help URLs from classes.ts and races.ts
 * 2. Parses help files to build a map of valid help article IDs
 * 3. Checks each URL against the help system to verify the article exists
 * 4. Reports invalid URLs (404s)
 * 
 * Usage: npx tsx scripts/check-help-urls.ts
 */

import fs from 'fs';
import path from 'path';

// Replicate help parsing logic from help.ts
function parseHelpFiles(): Map<string, string> {
  const projectRoot = process.cwd();
  const helpDir = path.join(projectRoot, 'solace-helpdev');
  const articlesMap = new Map<string, string>();
  
  // Environment-based filtering constants
  const RESTRICTED_CATEGORIES = process.env.NODE_ENV === 'production' 
    ? ['unused', 'immortal', 'rom', 'system'] 
    : [];
  
  try {
    const files = fs.readdirSync(helpDir);
    
    for (const file of files) {
      if (!file.endsWith('.are')) continue;
      
      const category = file.replace('.are', '').replace('helps_', '');
      
      // Skip if category is in restricted list
      if (RESTRICTED_CATEGORIES.includes(category)) {
        continue;
      }
      
      const filePath = path.join(helpDir, file);
      const content = fs.readFileSync(filePath, 'utf-8');
      
      // Split by ~ delimiter
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
        const title = keywordLine.trim().toLowerCase() || 'untitled';
        
        // Skip articles with title less than 2 characters
        if (!title || title.trim().length < 2) {
          continue;
        }
        
        // Extract syntax if present
        const syntaxMatch = body.match(/Syntax:\s*([\s\S]+?)(?:\n\s*\n|\n==|\n[A-Z][A-Z\s]+[A-Z]|$)/i);
        const syntax = syntaxMatch ? syntaxMatch[1].trim() : undefined;
        
        // Clean content (remove syntax section if present)
        let cleanContent = body;
        if (syntaxMatch) {
          cleanContent = body.replace(/Syntax:\s*[\s\S]+?(?:\n\s*\n|\n==|\n[A-Z][A-Z\s]+[A-Z]|$)/i, '').trim();
        }
        
        // Skip articles with no content
        if (!cleanContent || cleanContent.trim().length === 0) {
          continue;
        }
        
        // Create kebab-case slug from first 5 words of title (same logic as help.ts)
        const titleWords = title.split(/\s+/).slice(0, 5);
        const slug = titleWords
          .join('-')
          .replace(/[^a-zA-Z0-9-]/g, '') // Keep only alphanumeric and hyphens
          .toLowerCase();
        
        // Only add if slug is valid and doesn't already exist
        if (slug && slug.length >= 2 && !articlesMap.has(slug)) {
          articlesMap.set(slug, title);
        }
      }
    }
  } catch (error) {
    console.error('Error reading help directory:', error);
  }
  
  return articlesMap;
}

// Parse help ID from URL (e.g., '/help/shield-block' -> 'shield-block')
function getHelpIdFromUrl(url: string): string | null {
  if (!url.startsWith('/help/')) {
    return null;
  }
  const id = url.substring(6);
  return id || null;
}

async function main() {
  console.log('🔍 Checking help URLs in the codebase...\n');
  
  // Load help data
  console.log('📚 Loading help data...');
  const articlesMap = parseHelpFiles();
  console.log(`   Found ${articlesMap.size} valid help articles\n`);
  
  // Get project root
  const projectRoot = process.cwd();
  const libPath = path.join(projectRoot, 'src/lib');
  
  // Read classes.ts
  console.log('📖 Reading classes.ts...');
  const classesPath = path.join(libPath, 'classes.ts');
  const classesContent = fs.readFileSync(classesPath, 'utf-8');
  
  // Extract URLs using regex
  const urlPattern = /url:\s*['"]([^'"]+)['"]/g;
  const allUrls = new Map<string, Array<{ source: string; line: number }>>();
  
  const lines = classesContent.split('\n');
  lines.forEach((line, index) => {
    const matches = [...line.matchAll(urlPattern)];
    for (const match of matches) {
      const url = match[1];
      if (url.startsWith('/help/')) {
        if (!allUrls.has(url)) {
          allUrls.set(url, []);
        }
        // Try to extract skill/spell name from the line
        const nameMatch = line.match(/name:\s*['"]([^'"]+)['"]/);
        const source = nameMatch ? nameMatch[1] : `line ${index + 1}`;
        allUrls.get(url)!.push({ source, line: index + 1 });
      }
    }
  });
  
  // Also check races.ts if it exists
  const racesPath = path.join(libPath, 'races.ts');
  if (fs.existsSync(racesPath)) {
    console.log('📖 Reading races.ts...');
    const racesContent = fs.readFileSync(racesPath, 'utf-8');
    const racesLines = racesContent.split('\n');
    racesLines.forEach((line, index) => {
      const matches = [...line.matchAll(urlPattern)];
      for (const match of matches) {
        const url = match[1];
        if (url.startsWith('/help/')) {
          if (!allUrls.has(url)) {
            allUrls.set(url, []);
          }
          const nameMatch = line.match(/name:\s*['"]([^'"]+)['"]/);
          const source = nameMatch ? `race: ${nameMatch[1]}` : `races.ts:line ${index + 1}`;
          allUrls.get(url)!.push({ source, line: index + 1 });
        }
      }
    });
  }
  
  console.log(`   Found ${allUrls.size} unique help URLs\n`);
  
  // Check each URL
  console.log('✅ Checking URLs...\n');
  const invalidUrls: Array<{ url: string; helpId: string; sources: Array<{ source: string; line: number }> }> = [];
  
  for (const [url, sources] of allUrls.entries()) {
    const helpId = getHelpIdFromUrl(url);
    if (!helpId) {
      console.warn(`⚠️  Invalid URL format: ${url}`);
      continue;
    }
    
    // Check if the article exists
    if (!articlesMap.has(helpId)) {
      invalidUrls.push({
        url,
        helpId,
        sources,
      });
    }
  }
  
  // Report results
  console.log('\n' + '='.repeat(60));
  console.log('📊 RESULTS');
  console.log('='.repeat(60));
  console.log(`Total URLs checked: ${allUrls.size}`);
  console.log(`Valid URLs: ${allUrls.size - invalidUrls.length}`);
  console.log(`Invalid URLs (404): ${invalidUrls.length}`);
  console.log('');
  
  if (invalidUrls.length === 0) {
    console.log('✅ All help URLs are valid!');
  } else {
    console.log('❌ Invalid URLs found:');
    console.log('');
    
    // Group by help ID for cleaner output
    invalidUrls.forEach(({ url, helpId, sources }) => {
      console.log(`❌ ${url}`);
      console.log(`   Help ID: ${helpId}`);
      console.log(`   Used in:`);
      sources.forEach(({ source, line }) => {
        console.log(`     - ${source} (line ${line})`);
      });
      console.log('');
    });
    
    // Generate a summary list
    console.log('\n' + '='.repeat(60));
    console.log('📝 SUMMARY - All Invalid URLs:');
    console.log('='.repeat(60));
    invalidUrls.forEach(({ url, helpId }) => {
      console.log(`  ${url} (ID: ${helpId})`);
    });
  }
  
  // Exit with error code if invalid URLs found
  if (invalidUrls.length > 0) {
    process.exit(1);
  }
}

main().catch((error) => {
  console.error('❌ Error:', error);
  process.exit(1);
});

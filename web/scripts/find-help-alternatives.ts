/**
 * Script to find valid help article IDs for invalid URLs.
 * Searches for similar/alternate names in the help system.
 * 
 * Usage: npx tsx scripts/find-help-alternatives.ts
 */

import fs from 'fs';
import path from 'path';

// Replicate help parsing logic from help.ts
function parseHelpFiles(): Map<string, { title: string; id: string }> {
  const projectRoot = process.cwd();
  const helpDir = path.join(projectRoot, 'solace-helpdev');
  const articlesMap = new Map<string, { title: string; id: string }>();
  
  const RESTRICTED_CATEGORIES = process.env.NODE_ENV === 'production' 
    ? ['unused', 'immortal', 'rom', 'system'] 
    : [];
  
  try {
    const files = fs.readdirSync(helpDir);
    
    for (const file of files) {
      if (!file.endsWith('.are')) continue;
      
      const category = file.replace('.are', '').replace('helps_', '');
      
      if (RESTRICTED_CATEGORIES.includes(category)) {
        continue;
      }
      
      const filePath = path.join(helpDir, file);
      const content = fs.readFileSync(filePath, 'utf-8');
      const sections = content.split('~');
      
      for (let i = 0; i < sections.length - 1; i += 2) {
        const header = sections[i].trim();
        const body = sections[i + 1]?.trim();
        
        if (!header || !body) continue;
        
        const headerMatch = header.match(/^(-?\d+)\s+(.+)$/);
        if (!headerMatch) continue;
        
        const keywordLine = headerMatch[2].trim();
        const title = keywordLine.trim().toLowerCase() || 'untitled';
        
        if (!title || title.trim().length < 2) {
          continue;
        }
        
        // Create kebab-case slug from first 5 words of title
        const titleWords = title.split(/\s+/).slice(0, 5);
        const slug = titleWords
          .join('-')
          .replace(/[^a-zA-Z0-9-]/g, '')
          .toLowerCase();
        
        if (slug && slug.length >= 2 && !articlesMap.has(slug)) {
          articlesMap.set(slug, { title, id: slug });
        }
      }
    }
  } catch (error) {
    console.error('Error reading help directory:', error);
  }
  
  return articlesMap;
}

// Invalid URLs from the check script
const invalidUrls = [
  'cure-light',
  'cure-serious',
  'create-water',
  'cure-critical',
  'create-spring',
  'sanctify-object',
  'haggle',
  'cure-disease',
  'cure-poison',
  'flowing-block',
  'resist-lightning',
  'imbue-regeneration',
  'heal',
  'resist-fire',
  'resist-cold',
  'cure-mortal-wounds',
  'summon-plant-seed',
  'summon-water-elemental',
  'resist-negative',
  'summon-air-elemental',
  'summon-thorn-elemental',
  'summon-plague',
  'demonfire-fires-of-vengeance',
  'summon-fire-elemental',
  'resist-acid',
  'resist-poison',
  'curse-of-sloth',
  'backstab',
  'hide',
  'pick-lock',
  'set-spiked-trap-set-poison-trap-set-flaming-trap-trap-trap-disarm',
  'sense-spell',
  'dual-backstab',
  'vanish',
  'poison-dust',
  'blindness-dust',
  'assassinate',
  'invisibility',
  'detect-invisibility',
  'blood-of-winter-ice',
  'blood-of-summer-fire',
  'magic-missile',
  'lightning-bolt',
  'fireball',
  'decay-corpse',
  'acid-blast',
  'animate-skeleton',
  'animate-dead',
  'cone-of-acid',
  'iron-golem',
  'shadowfire',
  'power-word-kill',
  'plague',
];

function findMatchingHelpIds(invalidId: string, articlesMap: Map<string, { title: string; id: string }>): string[] {
  const results: string[] = [];
  
  // Strategy 1: Exact match (shouldn't happen, but check)
  if (articlesMap.has(invalidId)) {
    return [invalidId];
  }
  
  // Strategy 2: Find by keywords - extract main words from invalid ID
  const invalidWords = invalidId.split('-').filter(w => w.length > 2);
  
  // Strategy 3: Search for articles with similar keywords in title or ID
  for (const [id, article] of articlesMap.entries()) {
    const titleWords = article.title.split(/\s+/).filter(w => w.length > 2);
    const idWords = id.split('-').filter(w => w.length > 2);
    
    // Check if all important words from invalid ID are in the article
    let matchCount = 0;
    for (const word of invalidWords) {
      if (titleWords.some(tw => tw.includes(word) || word.includes(tw)) ||
          idWords.some(iw => iw.includes(word) || word.includes(iw))) {
        matchCount++;
      }
    }
    
    // If most words match, consider it a potential match
    if (matchCount >= Math.max(1, invalidWords.length - 1)) {
      results.push(id);
    }
  }
  
  return results;
}

function main() {
  console.log('🔍 Finding alternative help article IDs...\n');
  
  const articlesMap = parseHelpFiles();
  console.log(`📚 Loaded ${articlesMap.size} help articles\n`);
  
  console.log('='.repeat(80));
  console.log('POTENTIAL MATCHES FOR INVALID URLs:');
  console.log('='.repeat(80));
  console.log('');
  
  const matches: Array<{ invalid: string; valid: string[] }> = [];
  
  for (const invalidId of invalidUrls) {
    const potentialMatches = findMatchingHelpIds(invalidId, articlesMap);
    
    if (potentialMatches.length > 0) {
      matches.push({ invalid: invalidId, valid: potentialMatches });
      console.log(`❌ ${invalidId}`);
      console.log(`   → Potential matches: ${potentialMatches.slice(0, 5).join(', ')}${potentialMatches.length > 5 ? ` (and ${potentialMatches.length - 5} more)` : ''}`);
      
      // Show titles for top matches
      const topMatches = potentialMatches.slice(0, 3);
      for (const matchId of topMatches) {
        const article = articlesMap.get(matchId);
        if (article) {
          console.log(`      • ${matchId} - "${article.title}"`);
        }
      }
      console.log('');
    }
  }
  
  // Also search for exact keyword matches
  console.log('\n' + '='.repeat(80));
  console.log('KEYWORD-BASED SEARCH:');
  console.log('='.repeat(80));
  console.log('');
  
  for (const invalidId of invalidUrls) {
    const keywords = invalidId.split('-').filter(w => w.length > 2);
    
    if (keywords.length === 0) continue;
    
    // Search for articles that contain these keywords
    const keywordMatches: string[] = [];
    for (const [id, article] of articlesMap.entries()) {
      const searchText = `${id} ${article.title}`.toLowerCase();
      if (keywords.every(kw => searchText.includes(kw))) {
        keywordMatches.push(id);
      }
    }
    
    if (keywordMatches.length > 0) {
      console.log(`🔍 ${invalidId} (keywords: ${keywords.join(', ')})`);
      console.log(`   → Found: ${keywordMatches.slice(0, 3).join(', ')}${keywordMatches.length > 3 ? ` (and ${keywordMatches.length - 3} more)` : ''}`);
      console.log('');
    }
  }
}

main();


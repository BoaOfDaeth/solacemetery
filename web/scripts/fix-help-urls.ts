/**
 * Script to find and fix invalid help URLs by searching for valid alternatives.
 * 
 * Usage: npx tsx scripts/fix-help-urls.ts
 */

import { getHelpData, searchHelpArticles } from '../src/lib/help.js';

// Mapping of invalid URLs to their valid alternatives based on the help system
// Format: [invalidId, validId, searchTerm]
const urlMappings: Array<[string, string, string]> = [
  // Cure spells - found in helps_common.are as "CURE LIGHT CURE SERIOUS CURE CRITICAL HEAL"
  ['cure-light', 'cure-light-cure-serious-cure', 'cure light'],
  ['cure-serious', 'cure-light-cure-serious-cure', 'cure serious'],
  ['cure-critical', 'cure-light-cure-serious-cure', 'cure critical'],
  ['create-water', 'create-water-create-spring', 'create water'],
  ['create-spring', 'create-water-create-spring', 'create spring'],
  ['cure-disease', 'cure-poison-cure-disease', 'cure disease'],
  ['cure-poison', 'cure-poison-cure-disease', 'cure poison'],
  ['cure-mortal-wounds', 'cure-mortal-wounds', 'cure mortal wounds'],
  
  // Skills
  ['haggle', 'haggle-haggling', 'haggle'],
  ['flowing-block', 'flowing-block-flowing-block', 'flowing block'],
  ['backstab', 'backstab', 'backstab'], // May need to check if exists
  ['hide', 'hide', 'hide'], // May need to check
  ['pick-lock', 'open-close-lock-unlock-pick', 'pick lock'],
  ['sense-spell', 'sense-spell', 'sense spell'],
  ['dual-backstab', 'dual-backstab', 'dual backstab'],
  ['vanish', 'vanish', 'vanish'],
  ['poison-dust', 'blindness-dust-poison-dust-dust', 'poison dust'],
  ['blindness-dust', 'blindness-dust-poison-dust-dust', 'blindness dust'],
  ['assassinate', 'assassinate', 'assassinate'],
  
  // Resist spells - may be under "resist" 
  ['resist-lightning', 'resist', 'resist lightning'],
  ['resist-fire', 'resist', 'resist fire'],
  ['resist-cold', 'resist', 'resist cold'],
  ['resist-acid', 'resist', 'resist acid'],
  ['resist-poison', 'resist', 'resist poison'],
  ['resist-negative', 'resist', 'resist negative'],
  
  // Healing
  ['heal', 'cure-light-cure-serious-cure', 'heal'], // or 'utter-heal' or 'healing-mastery'
  ['imbue-regeneration', 'imbue-regeneration-regeneration', 'imbue regeneration'],
  
  // Summon spells
  ['summon-plant-seed', 'plant-seed', 'plant seed'],
  ['summon-water-elemental', 'summon-earth-elemental-summon-air', 'summon water elemental'],
  ['summon-air-elemental', 'summon-earth-elemental-summon-air', 'summon air elemental'],
  ['summon-thorn-elemental', 'summon-earth-elemental-summon-air', 'summon thorn elemental'],
  ['summon-fire-elemental', 'conjure-fire-elemental', 'summon fire elemental'],
  ['summon-plague', 'summon', 'summon plague'],
  
  // Spells
  ['demonfire-fires-of-vengeance', 'fires-of-vengeance', 'fires of vengeance'],
  ['curse-of-sloth', 'curse-of-sloth-sloth', 'curse of sloth'],
  ['sanctify-object', 'sanctify-object-sanctifyobject', 'sanctify object'],
  ['invisibility', 'invisibility', 'invisibility'],
  ['detect-invisibility', 'detect-invisibility', 'detect invis'],
  ['magic-missile', 'magic-missile', 'magic missile'],
  ['lightning-bolt', 'lightning-bolt', 'lightning bolt'],
  ['fireball', 'fireball', 'fireball'],
  ['decay-corpse', 'decay-corpse', 'decay corpse'],
  ['acid-blast', 'acid-blast', 'acid blast'],
  ['animate-skeleton', 'animate-skeleton', 'animate skeleton'],
  ['animate-dead', 'animate-dead', 'animate dead'],
  ['cone-of-acid', 'cone-of-acid', 'cone of acid'],
  ['iron-golem', 'iron-golem', 'iron golem'],
  ['shadowfire', 'shadowfire', 'shadowfire'],
  ['power-word-kill', 'power-word-kill', 'power word kill'],
  ['plague', 'plague', 'plague'],
  
  // Complex ones that need checking
  ['blood-of-winter-ice', 'blood-of-summer-fire-blood', 'blood of winter ice'],
  ['blood-of-summer-fire', 'blood-of-summer-fire-blood', 'blood of summer fire'],
  ['set-spiked-trap-set-poison-trap-set-flaming-trap-trap-trap-disarm', 'trap-disarm', 'set trap'],
];

function verifyMapping(invalidId: string, validId: string, articlesMap: Map<string, any>): boolean {
  if (articlesMap.has(validId)) {
    return true;
  }
  
  // Try searching for alternatives
  const searchResults = Array.from(articlesMap.keys()).filter(id => {
    // Check if valid ID is contained in another ID or vice versa
    return id.includes(validId) || validId.includes(id);
  });
  
  if (searchResults.length > 0) {
    console.log(`  ⚠️  ${validId} not found, but found: ${searchResults.slice(0, 3).join(', ')}`);
    return false;
  }
  
  return false;
}

function main() {
  console.log('🔍 Verifying help URL mappings...\n');
  
  const helpData = getHelpData();
  const articlesMap = helpData.articlesMap;
  
  console.log(`📚 Loaded ${articlesMap.size} help articles\n`);
  console.log('='.repeat(80));
  console.log('VERIFYING MAPPINGS:');
  console.log('='.repeat(80));
  console.log('');
  
  const verifiedMappings: Array<[string, string]> = [];
  const failedMappings: Array<[string, string]> = [];
  
  for (const [invalidId, validId, searchTerm] of urlMappings) {
    if (verifyMapping(invalidId, validId, articlesMap)) {
      verifiedMappings.push([invalidId, validId]);
      console.log(`✅ ${invalidId} → ${validId}`);
    } else {
      // Try searching
      const results = searchHelpArticles(searchTerm);
      if (results.length > 0) {
        const bestMatch = results[0].id;
        verifiedMappings.push([invalidId, bestMatch]);
        console.log(`✅ ${invalidId} → ${bestMatch} (found via search)`);
      } else {
        failedMappings.push([invalidId, validId]);
        console.log(`❌ ${invalidId} → ${validId} (not found)`);
      }
    }
  }
  
  console.log('\n' + '='.repeat(80));
  console.log('SUMMARY:');
  console.log('='.repeat(80));
  console.log(`✅ Verified: ${verifiedMappings.length}`);
  console.log(`❌ Failed: ${failedMappings.length}`);
  console.log('');
  
  if (verifiedMappings.length > 0) {
    console.log('='.repeat(80));
    console.log('READY TO APPLY:');
    console.log('='.repeat(80));
    console.log('');
    console.log('const urlReplacements = {');
    for (const [invalidId, validId] of verifiedMappings) {
      console.log(`  '${invalidId}': '${validId}',`);
    }
    console.log('};');
  }
  
  if (failedMappings.length > 0) {
    console.log('\n' + '='.repeat(80));
    console.log('FAILED MAPPINGS:');
    console.log('='.repeat(80));
    for (const [invalidId, validId] of failedMappings) {
      console.log(`  ${invalidId} → ${validId}`);
    }
  }
}

main();


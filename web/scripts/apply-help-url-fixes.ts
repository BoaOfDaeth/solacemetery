/**
 * Script to apply URL fixes to classes.ts
 * Replaces invalid help URLs with their valid alternatives.
 * 
 * Usage: npx tsx scripts/apply-help-url-fixes.ts
 */

import fs from 'fs';
import path from 'path';

// Verified URL replacements from the fix-help-urls script
const urlReplacements: Record<string, string> = {
  'cure-light': 'cure-light-cure-serious-cure',
  'cure-serious': 'cure-light-cure-serious-cure',
  'cure-critical': 'cure-light-cure-serious-cure',
  'create-water': 'create-water-create-spring',
  'create-spring': 'create-water-create-spring',
  'cure-disease': 'cure-poison-cure-disease',
  'cure-poison': 'cure-poison-cure-disease',
  'haggle': 'haggle-haggling',
  'flowing-block': 'flowing-block-flowing-block',
  'backstab': 'backstab-dual-backstab',
  'hide': 'hide-sneak',
  'pick-lock': 'open-close-lock-unlock-pick',
  'sense-spell': 'sense-spell-sensespell',
  'dual-backstab': 'backstab-dual-backstab',
  'vanish': 'vanishing-shadows',
  'poison-dust': 'blindness-dust-poison-dust-dust',
  'blindness-dust': 'blindness-dust-poison-dust-dust',
  'assassinate': 'assassinate-aprepare',
  'resist-lightning': 'resist',
  'resist-fire': 'resist',
  'resist-cold': 'resist',
  'resist-acid': 'resist',
  'resist-poison': 'resist',
  'resist-negative': 'resist',
  'heal': 'cure-light-cure-serious-cure',
  'imbue-regeneration': 'imbue-regeneration-regeneration',
  'summon-plant-seed': 'plant-seed',
  'summon-water-elemental': 'summon-earth-elemental-summon-air',
  'summon-air-elemental': 'summon-earth-elemental-summon-air',
  'summon-thorn-elemental': 'summon-earth-elemental-summon-air',
  'summon-fire-elemental': 'conjure-fire-elemental',
  'summon-plague': 'summon',
  'demonfire-fires-of-vengeance': 'fires-of-vengeance',
  'curse-of-sloth': 'curse-of-sloth-sloth',
  'sanctify-object': 'sanctify-object-sanctifyobject',
  'invisibility': 'improved-invisibility',
  'detect-invisibility': 'detect-invis',
  'magic-missile': 'fireball-lightning-bolt-magic-missile',
  'lightning-bolt': 'fireball-lightning-bolt-magic-missile',
  'fireball': 'fireball-lightning-bolt-magic-missile',
  'cone-of-acid': 'cone-of-acid-shadowfire',
  'shadowfire': 'cone-of-acid-shadowfire',
  'power-word-kill': 'power-word-kill-pwk',
  'blood-of-winter-ice': 'blood-of-summer-fire-blood',
  'blood-of-summer-fire': 'blood-of-summer-fire-blood',
};

function main() {
  const projectRoot = process.cwd();
  const classesPath = path.join(projectRoot, 'src/lib/classes.ts');
  
  console.log('📝 Reading classes.ts...');
  let content = fs.readFileSync(classesPath, 'utf-8');
  
  console.log('🔧 Applying URL replacements...\n');
  
  let replacementCount = 0;
  const replacements: Array<{ from: string; to: string; count: number }> = [];
  
  // Replace each invalid URL with its valid alternative
  for (const [invalidId, validId] of Object.entries(urlReplacements)) {
    const invalidUrl = `/help/${invalidId}`;
    const validUrl = `/help/${validId}`;
    
    // Count occurrences
    const matches = content.match(new RegExp(invalidUrl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'));
    const count = matches ? matches.length : 0;
    
    if (count > 0) {
      // Replace all occurrences
      content = content.replace(new RegExp(invalidUrl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), validUrl);
      replacementCount += count;
      replacements.push({ from: invalidId, to: validId, count });
      console.log(`✅ Replaced ${count}x: ${invalidId} → ${validId}`);
    }
  }
  
  console.log('\n' + '='.repeat(80));
  console.log(`Total replacements: ${replacementCount}`);
  console.log('='.repeat(80));
  
  if (replacementCount > 0) {
    // Write the updated file
    console.log('\n💾 Writing updated classes.ts...');
    fs.writeFileSync(classesPath, content, 'utf-8');
    console.log('✅ File updated successfully!');
    
    console.log('\n📋 Replacement summary:');
    replacements.forEach(({ from, to, count }) => {
      console.log(`  ${from} → ${to} (${count}x)`);
    });
  } else {
    console.log('\n⚠️  No replacements needed.');
  }
}

main();


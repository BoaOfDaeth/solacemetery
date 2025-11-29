const DAMAGE_TYPE_KEYWORDS: Record<string, string[]> = {
  slash: [
    'a slice',
    'a slash',
    'a whip',
    'a claw',
    'a grip',
    'a cleave',
    'a chop',
    'a shearing blade',
    'a shuriken',
    'a spinning razor',
    'shredding',
  ],
  pierce: [
    'a stab',
    'a bite',
    'a pierce',
    'a scratch',
    'a peck',
    'a sting',
    'a chomp',
    'a thrust',
  ],
  bash: [
    'a blast',
    'a pound',
    'a crush',
    'suction',
    'beating',
    'a charge',
    'a slap',
    'a punch',
    'a smash',
    'a thwack',
  ],
  acid: [
    'digestion',
    'slime',
    'an acidic bite',
    'boiling acid',
    'an acidic claw',
    'an acidic blade',
  ],
  energy: [
    'wrath',
    'magic',
    'a blast of light',
    'force of nature',
    'deadly fury',
  ],
  holy: ['divine power', 'apocalyptic power', 'unholy force', 'zealous rage'],
  poison: ['a poisonous bite'],
  fire: ['a flaming bite', 'flame', 'a flaming claw', 'a flaming blade'],
  cold: [
    'a freezing bite',
    'chill',
    'a chilling grasp',
    'a freezing claw',
    'a freezing blade',
  ],
  lightning: [
    'a shocking bite',
    'shock',
    'a shocking claw',
    'a shocking blade',
    'a blast of lightning',
  ],
  negative: [
    'life draining energy',
    'a deathly touch',
    'negative power',
    'soulless cold',
    'defilement',
    'ruinous force',
    'a blast of darkness',
  ],
  mental: ['the pain of the damned', 'vehemence', 'a creeping dread'],
  disease: ['decay', 'blight'],
  drowning: ['drowning', 'a ripping undertow'],
  sound: ['a piercing shriek', 'a resonant blast', 'a sonic boom'],
  air: ['a rending gale', 'a cutting squall'],
  earth: ['a grasp of earth', 'a quaking slam'],
};

export const DAMAGE_TYPE_BY_KEYWORD: Record<string, string> = Object.entries(
  DAMAGE_TYPE_KEYWORDS
).reduce(
  (acc, [damageType, keywords]) => {
    keywords.forEach(keyword => {
      acc[keyword] = damageType;
    });
    return acc;
  },
  {} as Record<string, string>
);

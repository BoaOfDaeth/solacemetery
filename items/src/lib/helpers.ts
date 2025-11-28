const getLevelColor = (level: number) => {
  if (level <= 10) return '191 191 191'; // gray
  if (level <= 20) return '57 122 250'; // blue
  if (level <= 30) return '207 207 45'; // yellow
  if (level <= 40) return '207 161 45'; // orange
  return '167 45 207'; // purple
};

const getShadowPattern = (rgb: string) => {
  return `0 10px 15px -3px rgb(${rgb} / 0.5), 0 4px 6px -2px rgb(${rgb} / 0.05)`;
};

const getBorderPattern = (rgb: string) => {
  return `rgb(${rgb})`;
};

export const getShadowColor = (level: number) => {
  return getShadowPattern(getLevelColor(level));
};

export const getBorderColor = (level: number) => {
  return getBorderPattern(getLevelColor(level));
};

export const getBackgroundLevelColor = (level: number) => {
  if (level <= 10) return '';
  if (level <= 20) return '';
  if (level <= 30) return '';
  if (level <= 40) return `rgb(${getLevelColor(level)} / 0.2)`;
  return `rgb(${getLevelColor(level)} / 0.2)`;
};

// Filter mapping for additional query filters (alphabetically sorted)
export const FILTER_MAPPING = {
  arms: {
    field: 'slot',
    value: 'arms',
    label: 'arms',
  },
  axe: {
    field: 'type',
    value: 'is an axe',
    label: 'axe',
  },
  body: {
    field: 'slot',
    value: 'body',
    label: 'body',
  },
  boots: {
    field: 'slot',
    value: 'feet',
    label: 'feet',
  },
  container: {
    field: 'type',
    value: 'is a container',
    label: 'container',
  },
  dagger: {
    field: 'type',
    value: 'is a dagger',
    label: 'dagger',
  },
  finger: {
    field: 'slot',
    value: 'finger',
    label: 'finger',
  },
  flail: {
    field: 'type',
    value: 'is a flail',
    label: 'flail',
  },
  food: {
    field: 'type',
    value: 'is food',
    label: 'food',
  },
  head: {
    field: 'slot',
    value: 'head',
    label: 'head',
  },
  hands: {
    field: 'slot',
    value: 'hands',
    label: 'hands',
  },
  legs: {
    field: 'slot',
    value: 'legs',
    label: 'legs',
  },
  mace: {
    field: 'type',
    value: 'is a mace',
    label: 'mace',
  },
  neck: {
    field: 'slot',
    value: 'neck',
    label: 'neck',
  },
  pill: {
    field: 'type',
    value: 'is a pill',
    label: 'pill',
  },
  polearm: {
    field: 'type',
    value: 'is a polearm',
    label: 'polearm',
  },
  potion: {
    field: 'type',
    value: 'is a potion',
    label: 'potion',
  },
  scroll: {
    field: 'type',
    value: 'is a magical scroll',
    label: 'scroll',
  },
  shield: {
    field: 'slot',
    value: 'shield',
    label: 'shield',
  },
  spear: {
    field: 'type',
    value: 'is a spear',
    label: 'spear',
  },
  staff: {
    field: 'type',
    value: 'is a staff',
    label: 'staff',
  },
  staves: {
    field: 'type',
    value: 'is a magical staff',
    label: 'stave',
  },
  sword: {
    field: 'type',
    value: 'is a sword',
    label: 'sword',
  },
  torso: {
    field: 'slot',
    value: 'torso',
    label: 'torso',
  },
  waist: {
    field: 'slot',
    value: 'waist',
    label: 'waist',
  },
  wand: {
    field: 'type',
    value: 'is a magical wand',
    label: 'wand',
  },
  whip: {
    field: 'type',
    value: 'is a whip',
    label: 'whip',
  },
  wrist: {
    field: 'slot',
    value: 'wrist',
    label: 'wrist',
  },
} as const;

export type FilterKey = keyof typeof FILTER_MAPPING;

export const getFilterQuery = (filterKey: FilterKey) => {
  const filter = FILTER_MAPPING[filterKey];
  if (!filter) return {};

  return {
    [filter.field]: filter.value,
  };
};

/**
 * Adds visibility filter for non-admin users
 * Items with visibleAfter are only shown if visibleAfter is in the past
 * Admins see all items regardless of visibleAfter
 */
export function addVisibilityFilter(
  filter: Record<string, unknown>,
  userIsAdmin: boolean
): Record<string, unknown> {
  if (userIsAdmin) {
    // Admins see everything
    return filter;
  }

  // Non-admins only see items where visibleAfter is in the past or doesn't exist
  const existingAnd = Array.isArray(filter.$and) ? filter.$and : [];

  return {
    ...filter,
    $and: [
      ...existingAnd,
      {
        $or: [
          { visibleAfter: { $exists: false } }, // Legacy items (always visible)
          { visibleAfter: { $lte: new Date() } }, // visibleAfter is in the past
        ],
      },
    ],
  };
}

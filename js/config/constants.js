// ================================
// ZENLESS ZONE ZERO - GAME DATA CONSTANTS
// ================================

// Disc Sets (Drive Discs in ZZZ)
export const DISC_SETS = {
  // 4-piece sets
  WOODPECKER_ELECTRO: {
    id: 'woodpecker_electro',
    name: 'Woodpecker Electro',
    slots: [1, 2, 3, 4, 5, 6],
    bonuses: {
      2: 'CRIT Rate +8%',
      4: 'Upon hitting an enemy with a Basic Attack, Dash Attack, or Dodge Counter, DMG from Basic Attacks and Dash Attacks increases by 9% for 6s.'
    }
  },
  FANGED_METAL: {
    id: 'fanged_metal',
    name: 'Fanged Metal',
    slots: [1, 2, 3, 4, 5, 6],
    bonuses: {
      2: 'Physical DMG +10%',
      4: 'Launching a Chain Attack or Ultimate increases Physical DMG by 35% for 12s.'
    }
  },
  PUFFER_ELECTRO: {
    id: 'puffer_electro',
    name: 'Puffer Electro',
    slots: [1, 2, 3, 4, 5, 6],
    bonuses: {
      2: 'PEN Ratio +8%',
      4: 'When the equipper deals Electric DMG, their ATK increases by 10% for 8s. Repeated triggers reset duration. Max 3 stacks.'
    }
  },
  SHOCKSTAR_DISCO: {
    id: 'shockstar_disco',
    name: 'Shockstar Disco',
    slots: [1, 2, 3, 4, 5, 6],
    bonuses: {
      2: 'Impact +6%',
      4: 'When launching a Chain Attack or Ultimate, DMG dealt increases by 15% for 12s.'
    }
  },
  SWING_JAZZ: {
    id: 'swing_jazz',
    name: 'Swing Jazz',
    slots: [1, 2, 3, 4, 5, 6],
    bonuses: {
      2: 'Energy Regen +20%',
      4: 'Upon launching a Chain Attack or Ultimate, all squad members ATK increases by 15% for 12s.'
    }
  },
  THUNDER_METAL: {
    id: 'thunder_metal',
    name: 'Thunder Metal',
    slots: [1, 2, 3, 4, 5, 6],
    bonuses: {
      2: 'Electric DMG +10%',
      4: 'When the equipper hits an enemy with a Basic Attack, Dash Attack, or Dodge Counter, DMG dealt by the next Chain Attack or Ultimate within 12s increases by 30%.'
    }
  },
  HORMONE_PUNK: {
    id: 'hormone_punk',
    name: 'Hormone Punk',
    slots: [1, 2, 3, 4, 5, 6],
    bonuses: {
      2: 'ATK +10%',
      4: 'When off-field, Energy Regen increases by 0.6/s. Max 3 stacks, resets when taking the field.'
    }
  },
  INFERNO_METAL: {
    id: 'inferno_metal',
    name: 'Inferno Metal',
    slots: [1, 2, 3, 4, 5, 6],
    bonuses: {
      2: 'Fire DMG +10%',
      4: 'Upon launching an EX Special Attack, the target receives 20% more Fire DMG from the equipper for 8s.'
    }
  },
  POLAR_METAL: {
    id: 'polar_metal',
    name: 'Polar Metal',
    slots: [1, 2, 3, 4, 5, 6],
    bonuses: {
      2: 'Ice DMG +10%',
      4: 'When launching a Dodge Counter or Quick Assist, the equipper\'s ATK increases by 30% for 12s.'
    }
  },
  CHAOS_JAZZ: {
    id: 'chaos_jazz',
    name: 'Chaos Jazz',
    slots: [1, 2, 3, 4, 5, 6],
    bonuses: {
      2: 'Anomaly Proficiency +30',
      4: 'When launching a Chain Attack or Ultimate, the equipper\'s Anomaly Proficiency increases by 60 for 12s.'
    }
  },
  FREEDOM_BLUES: {
    id: 'freedom_blues',
    name: 'Freedom Blues',
    slots: [1, 2, 3, 4, 5, 6],
    bonuses: {
      2: 'Anomaly Proficiency +30',
      4: 'When launching a Chain Attack or Ultimate, all squad members Anomaly Proficiency increases by 30 for 12s.'
    }
  },
  
  // 2-piece support sets
  SOUL_ROCK: {
    id: 'soul_rock',
    name: 'Soul Rock',
    slots: [5, 6],
    bonuses: {
      2: 'DEF +16%'
    }
  },
  PROTO_PUNK: {
    id: 'proto_punk',
    name: 'Proto Punk',
    slots: [5, 6],
    bonuses: {
      2: 'Pierce +16 | When HP is above 80%, ATK increases by 12%'
    }
  }
};

// Main Stats Available by Slot
export const MAIN_STATS_BY_SLOT = {
  1: ['HP'], // Slot 1 is always flat HP
  2: ['ATK'], // Slot 2 is always flat ATK
  3: ['DEF'], // Slot 3 is always flat DEF
  4: [ // Slot 4 can vary
    'HP%',
    'ATK%',
    'DEF%',
    'CRIT Rate',
    'CRIT DMG',
    'Anomaly Proficiency'
  ],
  5: [ // Slot 5 can vary
    'HP%',
    'ATK%',
    'DEF%',
    'Physical DMG',
    'Fire DMG',
    'Ice DMG',
    'Electric DMG',
    'Ether DMG',
    'PEN Ratio'
  ],
  6: [ // Slot 6 can vary
    'HP%',
    'ATK%',
    'DEF%',
    'Anomaly Mastery',
    'Energy Regen',
    'Impact'
  ]
};

// All Possible Sub-stats
export const SUB_STATS = [
  'HP',
  'ATK',
  'DEF',
  'HP%',
  'ATK%',
  'DEF%',
  'CRIT Rate',
  'CRIT DMG',
  'Anomaly Proficiency',
  'PEN'
];

// Stat Display Names and Formatting
export const STAT_DISPLAY = {
  'HP': { name: 'HP', format: (val) => `+${val}` },
  'ATK': { name: 'ATK', format: (val) => `+${val}` },
  'DEF': { name: 'DEF', format: (val) => `+${val}` },
  'HP%': { name: 'HP%', format: (val) => `+${val}%` },
  'ATK%': { name: 'ATK%', format: (val) => `+${val}%` },
  'DEF%': { name: 'DEF%', format: (val) => `+${val}%` },
  'CRIT Rate': { name: 'CRIT Rate', format: (val) => `+${val}%` },
  'CRIT DMG': { name: 'CRIT DMG', format: (val) => `+${val}%` },
  'Anomaly Proficiency': { name: 'Anomaly Proficiency', format: (val) => `+${val}` },
  'PEN': { name: 'PEN', format: (val) => `+${val}` },
  'PEN Ratio': { name: 'PEN Ratio', format: (val) => `+${val}%` },
  'Physical DMG': { name: 'Physical DMG', format: (val) => `+${val}%` },
  'Fire DMG': { name: 'Fire DMG', format: (val) => `+${val}%` },
  'Ice DMG': { name: 'Ice DMG', format: (val) => `+${val}%` },
  'Electric DMG': { name: 'Electric DMG', format: (val) => `+${val}%` },
  'Ether DMG': { name: 'Ether DMG', format: (val) => `+${val}%` },
  'Anomaly Mastery': { name: 'Anomaly Mastery', format: (val) => `+${val}` },
  'Energy Regen': { name: 'Energy Regen', format: (val) => `+${val}%` },
  'Impact': { name: 'Impact', format: (val) => `+${val}%` }
};

// Color coding for disc sets (for UI)
export const SET_COLORS = {
  'woodpecker_electro': '#FFD700',
  'fanged_metal': '#C0C0C0',
  'puffer_electro': '#FFD700',
  'shockstar_disco': '#FF1493',
  'swing_jazz': '#9370DB',
  'thunder_metal': '#FFD700',
  'hormone_punk': '#FF69B4',
  'inferno_metal': '#FF4500',
  'polar_metal': '#00CED1',
  'chaos_jazz': '#8A2BE2',
  'freedom_blues': '#4169E1',
  'soul_rock': '#708090',
  'proto_punk': '#DC143C'
};

// Rarity levels (for future expansion)
export const RARITY = {
  S: 'S-Rank',
  A: 'A-Rank',
  B: 'B-Rank'
};

// Validation Rules
export const VALIDATION_RULES = {
  DISC: {
    SUB_STAT_COUNT: 4, // Every disc has exactly 4 sub-stats
    MIN_ROLLS_PER_STAT: 0,
    MAX_ROLLS_PER_STAT: 5,
    TOTAL_ROLLS_MIN: 4, // Starting rolls
    TOTAL_ROLLS_MAX: 9 // Max enhanced rolls (4 base + 5 upgrades)
  },
  CHARACTER: {
    NAME_MIN_LENGTH: 1,
    NAME_MAX_LENGTH: 50,
    SUB_STAT_PRIORITY_COUNT: 4, // Must prioritize exactly 4 sub-stats
    DISC_SLOTS: 6 // Characters have 6 disc slots
  }
};

// Score Grade Thresholds
export const SCORE_GRADES = {
  S: { min: 6.5, color: '#FFD700', label: 'S - Exceptional' },
  A: { min: 5.0, color: '#9D4EDD', label: 'A - Excellent' },
  B: { min: 3.5, color: '#00D9FF', label: 'B - Good' },
  C: { min: 2.0, color: '#7B7B8F', label: 'C - Acceptable' },
  D: { min: 0, color: '#FF006E', label: 'D - Poor' }
};

// Scoring Weights
export const SCORING_WEIGHTS = {
  HIGH_PRIORITY: 1.0,  // Stats in positions 1-2 of priority list
  LOW_PRIORITY: 0.5,   // Stats in positions 3-4 of priority list
  MAIN_STAT_BONUS: 1.0 // Bonus if main stat matches a priority sub-stat
};

// Helper function to get all 4-piece sets
export function get4PieceSets() {
  return Object.values(DISC_SETS).filter(set => set.bonuses[4]);
}

// Helper function to get all 2-piece sets
export function get2PieceSets() {
  return Object.values(DISC_SETS).filter(set => !set.bonuses[4]);
}

// Helper function to get disc set by ID
export function getDiscSetById(id) {
  return Object.values(DISC_SETS).find(set => set.id === id);
}

// Helper function to validate if a stat can be main stat for a slot
export function isValidMainStatForSlot(slot, stat) {
  return MAIN_STATS_BY_SLOT[slot]?.includes(stat) || false;
}

// Helper function to check if main stat can appear as sub-stat
export function canStatBeSubStat(stat) {
  return SUB_STATS.includes(stat);
}

// Helper function to get color for a set
export function getSetColor(setId) {
  return SET_COLORS[setId] || '#7B7B8F';
}

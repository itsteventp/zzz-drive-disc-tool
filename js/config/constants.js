// ================================
// ZENLESS ZONE ZERO - GAME DATA CONSTANTS
// ================================

// Disc Sets (Drive Discs in ZZZ — through v2.3)
export const DISC_SETS = {
  ASTRAL_VOICE: {
    id: 'astral_voice',
    name: 'Astral Voice',
    slots: [1, 2, 3, 4, 5, 6],
    bonuses: {
      2: 'ATK +10%',
      4: 'Whenever any squad member enters the field using a Quick Assist, all squad members gain 1 stack of Astral (max 3) for 15 s. Each stack increases the DMG of the entering character by 8%.'
    }
  },
  BRANCH_AND_BLADE_SONG: {
    id: 'branch_blade_song',
    name: 'Branch & Blade Song',
    slots: [1, 2, 3, 4, 5, 6],
    bonuses: {
      2: 'CRIT DMG +16%',
      4: 'When Anomaly Mastery ≥ 115, CRIT DMG +30%. When any squad member applies Freeze or triggers Shatter, CRIT Rate +12% for 15 s.'
    }
  },
  CHAOS_JAZZ: {
    id: 'chaos_jazz',
    name: 'Chaos Jazz',
    slots: [1, 2, 3, 4, 5, 6],
    bonuses: {
      2: 'Anomaly Proficiency +30',
      4: 'Fire DMG +15%, Electric DMG +15%. While off-field, EX/Assist Attack DMG +20%. When switching in, that buff lasts 5s (cooldown 7.5s).'
    }
  },
  CHAOTIC_METAL: {
    id: 'chaotic_metal',
    name: 'Chaotic Metal',
    slots: [1, 2, 3, 4, 5, 6],
    bonuses: {
      2: 'Ether DMG +10%',
      4: 'CRIT DMG +20%. When any team member triggers Corruption’s extra DMG, +5.5% CRIT DMG for 8s (stack up to 6, refreshes).'
    }
  },
  DAWNS_BLOOM: {
    id: 'dawns_bloom',
    name: "Dawn's Bloom",
    slots: [1, 2, 3, 4, 5, 6],
    bonuses: {
      2: 'Basic Attack DMG +15%',
      4: 'Basic Attack DMG +20%. If used by an Attack-type character, using EX Special or Ultimate gives another +20% Basic Attack DMG for 25s.'
    }
  },
  FANGED_METAL: {
    id: 'fanged_metal',
    name: 'Fanged Metal',
    slots: [1, 2, 3, 4, 5, 6],
    bonuses: {
      2: 'Physical DMG +10%',
      4: 'When a squad member inflicts Assault, equipper deals +35% damage to that target for 12s.'
    }
  },
  FREEDOM_BLUES: {
    id: 'freedom_blues',
    name: 'Freedom Blues',
    slots: [1, 2, 3, 4, 5, 6],
    bonuses: {
      2: 'Anomaly Proficiency +30',
      4: 'When an EX Special Attack hits, reduce target’s Anomaly Buildup RES (to your attribute) by 20% for 8s. (Does not stack with same-attribute sets)'
    }
  },
  HORMONE_PUNK: {
    id: 'hormone_punk',
    name: 'Hormone Punk',
    slots: [1, 2, 3, 4, 5, 6],
    bonuses: {
      2: 'ATK +10%',
      4: 'Upon entering combat or switching in, ATK +25% for 10s. (Cooldown: 20s)'
    }
  },
  INFERNO_METAL: {
    id: 'inferno_metal',
    name: 'Inferno Metal',
    slots: [1, 2, 3, 4, 5, 6],
    bonuses: {
      2: 'Fire DMG +10%',
      4: 'Upon hitting a Burning enemy, CRIT Rate +28% for 8s.'
    }
  },
  KING_OF_THE_SUMMIT: {
    id: 'king_of_the_summit',
    name: 'King of the Summit',
    slots: [1, 2, 3, 4, 5, 6],
    bonuses: {
      2: 'Daze +6%',
      4: 'If the user is a Stun character and uses EX Special or Chain Attack, all squad CRIT DMG +15%. If user’s CRIT Rate ≥ 50%, +15% more CRIT DMG for 15s.'
    }
  },
  MOONLIGHT_LULLABY: {
    id: 'moonlight_lullaby',
    name: 'Moonlight Lullaby',
    slots: [1, 2, 3, 4, 5, 6],
    bonuses: {
      2: 'Energy Regen +20%',
      4: 'If the user is Support and uses EX Special or Ultimate, all squad DMG +18% for 25s.'
    }
  },
  PHAETHONS_MELODY: {
    id: 'phaethons_melody',
    name: "Phaethon's Melody",
    slots: [1, 2, 3, 4, 5, 6],
    bonuses: {
      2: 'Anomaly Mastery +8%',
      4: 'When any squad member uses EX Special, the equipper’s Anomaly Proficiency +45 for 8s. If that user is not the equipper, Ether DMG +25%.'
    }
  },
  POLAR_METAL: {
    id: 'polar_metal',
    name: 'Polar Metal',
    slots: [1, 2, 3, 4, 5, 6],
    bonuses: {
      2: 'Ice DMG +10%',
      4: 'Basic Attack & Dash Attack DMG +20%. When any squad member inflicts Freeze or Shatter, +20% more for 12s.'
    }
  },
  PROTO_PUNK: {
    id: 'proto_punk',
    name: 'Proto Punk',
    slots: [1, 2, 3, 4, 5, 6],
    bonuses: {
      2: 'Increases Shield effect by 15%.',
      4: 'When any squad member triggers a Defensive Assist or Evasive Assist, all squad members deal 15% increased DMG, lasting 10s. Passive effects of the same name do not stack.'
    }
  },
  PUFFER_ELECTRO: {
    id: 'puffer_electro',
    name: 'Puffer Electro',
    slots: [1, 2, 3, 4, 5, 6],
    bonuses: {
      2: 'PEN Ratio +8%',
      4: 'Ultimate DMG +20%. Launching an Ultimate also increases ATK +15% for 12s.'
    }
  },
  SHADOW_HARMONY: {
    id: 'shadow_harmony',
    name: 'Shadow Harmony',
    slots: [1, 2, 3, 4, 5, 6],
    bonuses: {
      2: 'Aftershock & Dash Attack DMG +15%',
      4: 'Upon hitting with Aftershock or Dash Attack (matching your attribute), gain a stack (max 3) that gives ATK +4% and CRIT Rate +4% for 15s.'
    }
  },
  SHOCKSTAR_DISCO: {
    id: 'shockstar_disco',
    name: 'Shockstar Disco',
    slots: [1, 2, 3, 4, 5, 6],
    bonuses: {
      2: 'Impact +6%',
      4: 'Basic Attack, Dash Attack, and Dodge Counter inflict 20% more Daze on main target.'
    }
  },
  SOUL_ROCK: {
    id: 'soul_rock',
    name: 'Soul Rock',
    slots: [1, 2, 3, 4, 5, 6],
    bonuses: {
      2: 'DEF +16%',
      4: 'When you lose HP from being hit, take 40% less damage for 2.5s (once per 15s cooldown).'
    }
  },
  SWING_JAZZ: {
    id: 'swing_jazz',
    name: 'Swing Jazz',
    slots: [1, 2, 3, 4, 5, 6],
    bonuses: {
      2: 'Energy Regen +20%',
      4: 'Launching a Chain Attack or Ultimate increases all squad members’ DMG by 15% for 12s.'
    }
  },
  THUNDER_METAL: {
    id: 'thunder_metal',
    name: 'Thunder Metal',
    slots: [1, 2, 3, 4, 5, 6],
    bonuses: {
      2: 'Electric DMG +10%',
      4: 'While an enemy is Shocked, ATK +28%.'
    }
  },
  WOODPECKER_ELECTRO: {
    id: 'woodpecker_electro',
    name: 'Woodpecker Electro',
    slots: [1, 2, 3, 4, 5, 6],
    bonuses: {
      2: 'CRIT Rate +8%',
      4: 'Critical hit with Basic / Dodge Counter / EX Special increases ATK by 9% for 6s.'
    }
  },
  YUNKUI_TALES: {
    id: 'yunkui_tales',
    name: 'Yunkui Tales',
    slots: [1, 2, 3, 4, 5, 6],
    bonuses: {
      2: 'HP +10%',
      4: 'Using EX Special, Chain Attack or Ultimate gives CRIT Rate +4% (stack up to 3) for 15s; at 3 stacks, Sheer DMG +10%.'
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
  return Object.values(DISC_SETS).filter(set => set.bonuses[4]);
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

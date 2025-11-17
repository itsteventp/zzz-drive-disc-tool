// ================================
// DISC.JS - Disc Model
// ================================

import { DISC_SETS, MAIN_STATS_BY_SLOT, SUB_STATS } from '../config/constants.js';

// Generate unique ID
function generateId() {
  return 'disc_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

// ================================
// FACTORY FUNCTION
// ================================

export function createDisc({
  id = generateId(),
  setId = null,           // ID of the disc set
  slot = 1,               // Slot number (1-6)
  mainStat = 'HP',        // Main stat name
  subStats = [],          // Array of [statName, rollCount] pairs
  equippedBy = null,      // Character ID or null
  createdAt = new Date().toISOString()
} = {}) {
  return {
    id,
    setId,
    slot,
    mainStat,
    subStats,
    equippedBy,
    createdAt,
    updatedAt: new Date().toISOString()
  };
}

// ================================
// DISC OPERATIONS
// ================================

// Get disc set name
export function getDiscSetName(disc) {
  const setKey = Object.keys(DISC_SETS).find(key => DISC_SETS[key].id === disc.setId);
  return setKey ? DISC_SETS[setKey].name : 'Unknown Set';
}

// Get disc set object
export function getDiscSet(disc) {
  const setKey = Object.keys(DISC_SETS).find(key => DISC_SETS[key].id === disc.setId);
  return setKey ? DISC_SETS[setKey] : null;
}

// Check if disc is equipped
export function isEquipped(disc) {
  return disc.equippedBy !== null;
}

// Equip disc to character
export function equipToCharacter(disc, characterId) {
  return {
    ...disc,
    equippedBy: characterId,
    updatedAt: new Date().toISOString()
  };
}

// Unequip disc
export function unequipDisc(disc) {
  return {
    ...disc,
    equippedBy: null,
    updatedAt: new Date().toISOString()
  };
}

// Get total roll count
export function getTotalRolls(disc) {
  return disc.subStats.reduce((sum, [stat, rolls]) => sum + rolls, 0);
}

// Get roll count for a specific stat
export function getRollsForStat(disc, statName) {
  const subStat = disc.subStats.find(([stat, rolls]) => stat === statName);
  return subStat ? subStat[1] : 0;
}

// Check if disc has a specific sub-stat
export function hasSubStat(disc, statName) {
  return disc.subStats.some(([stat, rolls]) => stat === statName);
}

// ================================
// SUB-STAT OPERATIONS
// ================================

// Update sub-stat rolls
export function updateSubStatRolls(disc, statName, newRollCount) {
  const updated = { ...disc };
  updated.subStats = disc.subStats.map(([stat, rolls]) => 
    stat === statName ? [stat, newRollCount] : [stat, rolls]
  );
  updated.updatedAt = new Date().toISOString();
  return updated;
}

// Add sub-stat
export function addSubStat(disc, statName, rollCount = 1) {
  if (disc.subStats.length >= 4) {
    throw new Error('Disc already has 4 sub-stats');
  }
  
  if (hasSubStat(disc, statName)) {
    throw new Error('Disc already has this sub-stat');
  }
  
  const updated = { ...disc };
  updated.subStats = [...disc.subStats, [statName, rollCount]];
  updated.updatedAt = new Date().toISOString();
  return updated;
}

// Remove sub-stat
export function removeSubStat(disc, statName) {
  const updated = { ...disc };
  updated.subStats = disc.subStats.filter(([stat, rolls]) => stat !== statName);
  updated.updatedAt = new Date().toISOString();
  return updated;
}

// ================================
// VALIDATION
// ================================

export function validateDisc(disc) {
  const errors = [];
  
  // Set validation
  if (!disc.setId) {
    errors.push('Disc set is required');
  } else {
    const setExists = Object.values(DISC_SETS).some(set => set.id === disc.setId);
    if (!setExists) {
      errors.push('Invalid disc set');
    }
  }
  
  // Slot validation
  if (disc.slot < 1 || disc.slot > 6) {
    errors.push('Slot must be between 1 and 6');
  }
  
  // Main stat validation
  if (!disc.mainStat) {
    errors.push('Main stat is required');
  } else {
    const validMainStats = MAIN_STATS_BY_SLOT[disc.slot];
    if (validMainStats && !validMainStats.includes(disc.mainStat)) {
      errors.push(`Invalid main stat for slot ${disc.slot}`);
    }
  }
  
  // Sub-stats validation
  if (!Array.isArray(disc.subStats)) {
    errors.push('Sub-stats must be an array');
  } else {
    // Must have exactly 4 sub-stats
    if (disc.subStats.length !== 4) {
      errors.push('Disc must have exactly 4 sub-stats');
    }
    
    // Check each sub-stat
    disc.subStats.forEach(([stat, rolls], index) => {
      // Check if stat exists
      if (!SUB_STATS.includes(stat)) {
        errors.push(`Invalid sub-stat at position ${index + 1}: ${stat}`);
      }
      
      // Main stat cannot be a sub-stat
      if (stat === disc.mainStat) {
        errors.push(`Main stat (${disc.mainStat}) cannot be a sub-stat`);
      }
      
      // Check roll count
      if (typeof rolls !== 'number' || rolls < 0 || rolls > 5) {
        errors.push(`Invalid roll count for ${stat}: must be between 0 and 5`);
      }
    });
    
    // Check for duplicate sub-stats
    const statNames = disc.subStats.map(([stat, rolls]) => stat);
    const unique = new Set(statNames);
    if (unique.size !== statNames.length) {
      errors.push('Duplicate sub-stats are not allowed');
    }
    
    // Total rolls validation
    const totalRolls = getTotalRolls(disc);
    if (totalRolls < 4 || totalRolls > 9) {
      errors.push('Total rolls must be between 4 and 9');
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

// ================================
// FILTERING HELPERS
// ================================

// Filter discs by set
export function filterBySet(discs, setId) {
  return discs.filter(disc => disc.setId === setId);
}

// Filter discs by slot
export function filterBySlot(discs, slot) {
  return discs.filter(disc => disc.slot === slot);
}

// Filter discs by equipped status
export function filterByEquippedStatus(discs, isEquipped) {
  return discs.filter(disc => (disc.equippedBy !== null) === isEquipped);
}

// Filter discs by main stat
export function filterByMainStat(discs, mainStat) {
  return discs.filter(disc => disc.mainStat === mainStat);
}

// Complex filter
export function filterDiscs(discs, filters = {}) {
  let filtered = [...discs];
  
  if (filters.setId) {
    filtered = filterBySet(filtered, filters.setId);
  }
  
  if (filters.slot) {
    filtered = filterBySlot(filtered, filters.slot);
  }
  
  if (filters.isEquipped !== undefined) {
    filtered = filterByEquippedStatus(filtered, filters.isEquipped);
  }
  
  if (filters.mainStat) {
    filtered = filterByMainStat(filtered, filters.mainStat);
  }
  
  if (filters.characterId) {
    filtered = filtered.filter(disc => disc.equippedBy === filters.characterId);
  }
  
  return filtered;
}

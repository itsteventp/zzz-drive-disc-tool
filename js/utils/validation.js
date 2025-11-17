// ================================
// VALIDATION.JS - Validation Utilities
// ================================

import { SUB_STATS, MAIN_STATS_BY_SLOT } from '../config/constants.js';

// ================================
// GENERAL VALIDATION
// ================================

export function isValidId(id) {
  return typeof id === 'string' && id.length > 0;
}

export function isValidName(name, minLength = 1, maxLength = 50) {
  return typeof name === 'string' && 
         name.trim().length >= minLength && 
         name.length <= maxLength;
}

// ================================
// STAT VALIDATION
// ================================

export function isValidSubStat(statName) {
  return SUB_STATS.includes(statName);
}

export function isValidMainStatForSlot(slot, statName) {
  const validStats = MAIN_STATS_BY_SLOT[slot];
  return validStats && validStats.includes(statName);
}

export function canStatBeSubStat(statName, mainStat) {
  // Sub-stat cannot be the same as main stat
  if (statName === mainStat) {
    return false;
  }
  
  // Must be in the sub-stats list
  return isValidSubStat(statName);
}

// ================================
// ROLL VALIDATION
// ================================

export function isValidRollCount(count) {
  return typeof count === 'number' && count >= 0 && count <= 5;
}

export function isValidTotalRolls(total) {
  return typeof total === 'number' && total >= 4 && total <= 9;
}

// ================================
// ARRAY VALIDATION
// ================================

export function hasNoDuplicates(array) {
  return new Set(array).size === array.length;
}

export function isValidSubStatArray(subStats, mainStat) {
  // Must be array
  if (!Array.isArray(subStats)) {
    return { valid: false, error: 'Sub-stats must be an array' };
  }
  
  // Must have exactly 4
  if (subStats.length !== 4) {
    return { valid: false, error: 'Must have exactly 4 sub-stats' };
  }
  
  // Check each sub-stat
  const statNames = [];
  let totalRolls = 0;
  
  for (const [stat, rolls] of subStats) {
    // Valid stat name
    if (!isValidSubStat(stat)) {
      return { valid: false, error: `Invalid sub-stat: ${stat}` };
    }
    
    // Cannot be main stat
    if (stat === mainStat) {
      return { valid: false, error: `Main stat (${mainStat}) cannot be a sub-stat` };
    }
    
    // Valid roll count
    if (!isValidRollCount(rolls)) {
      return { valid: false, error: `Invalid roll count for ${stat}: ${rolls}` };
    }
    
    statNames.push(stat);
    totalRolls += rolls;
  }
  
  // No duplicates
  if (!hasNoDuplicates(statNames)) {
    return { valid: false, error: 'Duplicate sub-stats found' };
  }
  
  // Valid total rolls
  if (!isValidTotalRolls(totalRolls)) {
    return { valid: false, error: `Invalid total rolls: ${totalRolls} (must be 4-9)` };
  }
  
  return { valid: true };
}

// ================================
// EQUIPMENT VALIDATION
// ================================

export function isValidEquippedDiscsArray(equippedDiscs) {
  if (!Array.isArray(equippedDiscs)) {
    return false;
  }
  
  if (equippedDiscs.length !== 6) {
    return false;
  }
  
  // Each element must be null or a string (disc ID)
  return equippedDiscs.every(id => id === null || typeof id === 'string');
}

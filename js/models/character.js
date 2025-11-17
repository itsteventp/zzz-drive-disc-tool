// ================================
// CHARACTER.JS - Character Model
// ================================

import { DISC_SETS, get4PieceSets, get2PieceSets } from '../config/constants.js';

// Generate unique ID
function generateId() {
  return 'char_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

// ================================
// FACTORY FUNCTION
// ================================

export function createCharacter({
  id = generateId(),
  name = 'New Character',
  preferredSet4p = null,  // ID of preferred 4-piece set
  preferredSet2p = null,  // ID of preferred 2-piece set
  mainStatPreferences = {
    slot4: [],  // Array of preferred main stats for slot 4
    slot5: [],  // Array of preferred main stats for slot 5
    slot6: []   // Array of preferred main stats for slot 6
  },
  subStatPriority = [],  // Array of 4 sub-stats in priority order
  equippedDiscs = [null, null, null, null, null, null],  // Array of 6 disc IDs
  createdAt = new Date().toISOString()
} = {}) {
  return {
    id,
    name,
    preferredSet4p,
    preferredSet2p,
    mainStatPreferences,
    subStatPriority,
    equippedDiscs,
    createdAt,
    updatedAt: new Date().toISOString()
  };
}

// ================================
// CHARACTER OPERATIONS
// ================================

// Get equipped disc count
export function getEquippedDiscCount(character) {
  return character.equippedDiscs.filter(discId => discId !== null).length;
}

// Get empty slot indices
export function getEmptySlots(character) {
  return character.equippedDiscs
    .map((discId, index) => discId === null ? index : null)
    .filter(index => index !== null);
}

// Check if a slot is empty
export function isSlotEmpty(character, slotIndex) {
  return character.equippedDiscs[slotIndex] === null;
}

// Get disc ID in a specific slot
export function getDiscInSlot(character, slotIndex) {
  return character.equippedDiscs[slotIndex];
}

// Equip disc to a slot
export function equipDiscToSlot(character, slotIndex, discId) {
  const updated = { ...character };
  updated.equippedDiscs = [...character.equippedDiscs];
  updated.equippedDiscs[slotIndex] = discId;
  updated.updatedAt = new Date().toISOString();
  return updated;
}

// Unequip disc from a slot
export function unequipDiscFromSlot(character, slotIndex) {
  const updated = { ...character };
  updated.equippedDiscs = [...character.equippedDiscs];
  updated.equippedDiscs[slotIndex] = null;
  updated.updatedAt = new Date().toISOString();
  return updated;
}

// Remove a specific disc by ID (when disc is deleted)
export function removeDiscById(character, discId) {
  const updated = { ...character };
  updated.equippedDiscs = character.equippedDiscs.map(id => 
    id === discId ? null : id
  );
  updated.updatedAt = new Date().toISOString();
  return updated;
}

// ================================
// SET BONUS CALCULATIONS
// ================================

// Count equipped discs by set
export function getSetCounts(character, allDiscs) {
  const setCounts = {};
  
  character.equippedDiscs.forEach(discId => {
    if (discId) {
      const disc = allDiscs.find(d => d.id === discId);
      if (disc) {
        setCounts[disc.setId] = (setCounts[disc.setId] || 0) + 1;
      }
    }
  });
  
  return setCounts;
}

// Get active set bonuses
export function getActiveSetBonuses(character, allDiscs) {
  const setCounts = getSetCounts(character, allDiscs);
  const activeBonuses = [];
  
    Object.entries(setCounts).forEach(([setId, count]) => {
    const set = DISC_SETS[Object.keys(DISC_SETS).find(key => DISC_SETS[key].id === setId)];
    if (!set) return;
    
    // Check for 4-piece bonus
    if (set.bonuses[4] && count >= 4) {
      activeBonuses.push({
        setName: set.name,
        pieceCount: 4,
        bonus: set.bonuses[4]
      });
    }
    
    // Check for 2-piece bonus
    if (set.bonuses[2] && count >= 2) {
      activeBonuses.push({
        setName: set.name,
        pieceCount: 2,
        bonus: set.bonuses[2]
      });
    }
  });
  
  return activeBonuses;
}

// Check if character has preferred set bonuses active
export function hasPreferredSetBonus(character, allDiscs) {
  const activeBonuses = getActiveSetBonuses(character, allDiscs);
  
  // Check 4-piece
  if (character.preferredSet4p) {
    const has4p = activeBonuses.some(b => 
      b.pieceCount === 4 && 
      DISC_SETS[Object.keys(DISC_SETS).find(key => DISC_SETS[key].id === character.preferredSet4p)]?.name === b.setName
    );
    if (has4p) return true;
  }
  
  // Check 2-piece
  if (character.preferredSet2p) {
    const has2p = activeBonuses.some(b => 
      b.pieceCount === 2 && 
      DISC_SETS[Object.keys(DISC_SETS).find(key => DISC_SETS[key].id === character.preferredSet2p)]?.name === b.setName
    );
    if (has2p) return true;
  }
  
  return false;
}

// ================================
// VALIDATION
// ================================

export function validateCharacter(character) {
  const errors = [];
  
  // Name validation
  if (!character.name || character.name.trim().length === 0) {
    errors.push('Character name is required');
  }
  
  if (character.name.length > 50) {
    errors.push('Character name must be 50 characters or less');
  }
  
  // Sub-stat priority validation
  if (!Array.isArray(character.subStatPriority)) {
    errors.push('Sub-stat priority must be an array');
  } else if (character.subStatPriority.length !== 4) {
    errors.push('Must prioritize exactly 4 sub-stats');
  } else {
    // Check for duplicates
    const unique = new Set(character.subStatPriority);
    if (unique.size !== 4) {
      errors.push('Sub-stat priorities must be unique');
    }
  }
  
  // Main stat preferences validation
  if (!character.mainStatPreferences) {
    errors.push('Main stat preferences are required');
  } else {
    if (!Array.isArray(character.mainStatPreferences.slot4)) {
      errors.push('Slot 4 main stat preferences must be an array');
    }
    if (!Array.isArray(character.mainStatPreferences.slot5)) {
      errors.push('Slot 5 main stat preferences must be an array');
    }
    if (!Array.isArray(character.mainStatPreferences.slot6)) {
      errors.push('Slot 6 main stat preferences must be an array');
    }
  }
  
  // Equipped discs validation
  if (!Array.isArray(character.equippedDiscs)) {
    errors.push('Equipped discs must be an array');
  } else if (character.equippedDiscs.length !== 6) {
    errors.push('Must have exactly 6 disc slots');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

// ================================
// HELPER FUNCTIONS
// ================================

// Get display name for preferred sets
export function getPreferredSetsDisplay(character) {
  const sets = [];
  
  if (character.preferredSet4p) {
    const set = DISC_SETS[Object.keys(DISC_SETS).find(key => DISC_SETS[key].id === character.preferredSet4p)];
    if (set) sets.push(set.name + ' (4pc)');
  }
  
  if (character.preferredSet2p) {
    const set = DISC_SETS[Object.keys(DISC_SETS).find(key => DISC_SETS[key].id === character.preferredSet2p)];
    if (set) sets.push(set.name + ' (2pc)');
  }
  
  return sets.length > 0 ? sets.join(' + ') : 'No preference set';
}

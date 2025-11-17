// ================================
// STORAGE.JS - LocalStorage Wrapper
// ================================

const STORAGE_KEYS = {
  CHARACTERS: 'zzz_characters',
  DISCS: 'zzz_discs',
  VERSION: 'zzz_data_version'
};

const CURRENT_VERSION = '1.0.0';

// ================================
// INITIALIZATION
// ================================

export function initStorage() {
  // Check if this is first run
  const version = localStorage.getItem(STORAGE_KEYS.VERSION);
  
  if (!version) {
    console.log('📦 First time initialization - setting up storage');
    localStorage.setItem(STORAGE_KEYS.VERSION, CURRENT_VERSION);
    localStorage.setItem(STORAGE_KEYS.CHARACTERS, JSON.stringify([]));
    localStorage.setItem(STORAGE_KEYS.DISCS, JSON.stringify([]));
  } else {
    console.log('📦 Storage version:', version);
  }
}

// ================================
// CHARACTER OPERATIONS
// ================================

export function getAllCharacters() {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.CHARACTERS);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error loading characters:', error);
    return [];
  }
}

export function getCharacterById(id) {
  const characters = getAllCharacters();
  return characters.find(char => char.id === id) || null;
}

export function saveCharacter(character) {
  const characters = getAllCharacters();
  const index = characters.findIndex(char => char.id === character.id);
  
  if (index >= 0) {
    // Update existing
    characters[index] = character;
  } else {
    // Add new
    characters.push(character);
  }
  
  localStorage.setItem(STORAGE_KEYS.CHARACTERS, JSON.stringify(characters));
  console.log('💾 Character saved:', character.name);
  return character;
}

export function deleteCharacter(id) {
  const characters = getAllCharacters();
  const filtered = characters.filter(char => char.id !== id);
  
  localStorage.setItem(STORAGE_KEYS.CHARACTERS, JSON.stringify(filtered));
  console.log('🗑️ Character deleted:', id);
  
  // Also unequip all discs that were equipped by this character
  const discs = getAllDiscs();
  const updatedDiscs = discs.map(disc => {
    if (disc.equippedBy === id) {
      return { ...disc, equippedBy: null };
    }
    return disc;
  });
  localStorage.setItem(STORAGE_KEYS.DISCS, JSON.stringify(updatedDiscs));
}

// ================================
// DISC OPERATIONS
// ================================

export function getAllDiscs() {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.DISCS);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error loading discs:', error);
    return [];
  }
}

export function getDiscById(id) {
  const discs = getAllDiscs();
  return discs.find(disc => disc.id === id) || null;
}

export function getDiscsByCharacter(characterId) {
  const discs = getAllDiscs();
  return discs.filter(disc => disc.equippedBy === characterId);
}

export function getUnequippedDiscs() {
  const discs = getAllDiscs();
  return discs.filter(disc => !disc.equippedBy);
}

export function saveDisc(disc) {
  const discs = getAllDiscs();
  const index = discs.findIndex(d => d.id === disc.id);
  
  if (index >= 0) {
    // Update existing
    discs[index] = disc;
  } else {
    // Add new
    discs.push(disc);
  }
  
  localStorage.setItem(STORAGE_KEYS.DISCS, JSON.stringify(discs));
  console.log('💾 Disc saved:', disc.id);
  return disc;
}

export function deleteDisc(id) {
  const disc = getDiscById(id);
  
  // If disc is equipped, remove it from character
  if (disc && disc.equippedBy) {
    const character = getCharacterById(disc.equippedBy);
    if (character) {
      // Find which slot had this disc
      const slotIndex = character.equippedDiscs.findIndex(discId => discId === id);
      if (slotIndex >= 0) {
        character.equippedDiscs[slotIndex] = null;
        saveCharacter(character);
      }
    }
  }
  
  const discs = getAllDiscs();
  const filtered = discs.filter(d => d.id !== id);
  
  localStorage.setItem(STORAGE_KEYS.DISCS, JSON.stringify(filtered));
  console.log('🗑️ Disc deleted:', id);
}

// ================================
// BULK OPERATIONS
// ================================

export function saveAllCharacters(characters) {
  localStorage.setItem(STORAGE_KEYS.CHARACTERS, JSON.stringify(characters));
  console.log('💾 Saved', characters.length, 'characters');
}

export function saveAllDiscs(discs) {
  localStorage.setItem(STORAGE_KEYS.DISCS, JSON.stringify(discs));
  console.log('💾 Saved', discs.length, 'discs');
}

// ================================
// EXPORT / IMPORT
// ================================

export function exportData() {
  const data = {
    version: CURRENT_VERSION,
    exportDate: new Date().toISOString(),
    characters: getAllCharacters(),
    discs: getAllDiscs()
  };
  
  const json = JSON.stringify(data, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = `zzz-backup-${Date.now()}.json`;
  link.click();
  
  URL.revokeObjectURL(url);
  console.log('📤 Data exported');
  
  return data;
}

export function importData(jsonString) {
  try {
    const data = JSON.parse(jsonString);
    
    // Validate structure
    if (!data.characters || !data.discs) {
      throw new Error('Invalid data format: missing characters or discs');
    }
    
    if (!Array.isArray(data.characters) || !Array.isArray(data.discs)) {
      throw new Error('Invalid data format: characters and discs must be arrays');
    }
    
    // Save imported data
    saveAllCharacters(data.characters);
    saveAllDiscs(data.discs);
    
    console.log('📥 Data imported:', data.characters.length, 'characters,', data.discs.length, 'discs');
    
    return {
      success: true,
      characterCount: data.characters.length,
      discCount: data.discs.length
    };
  } catch (error) {
    console.error('Import error:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

// ================================
// CLEAR DATA (for testing)
// ================================

export function clearAllData() {
  if (confirm('⚠️ This will delete ALL characters and discs. Are you sure?')) {
    localStorage.removeItem(STORAGE_KEYS.CHARACTERS);
    localStorage.removeItem(STORAGE_KEYS.DISCS);
    initStorage();
    console.log('🗑️ All data cleared');
    return true;
  }
  return false;
}

// ================================
// STATISTICS
// ================================

export function getStorageStats() {
  return {
    characterCount: getAllCharacters().length,
    discCount: getAllDiscs().length,
    equippedDiscCount: getAllDiscs().filter(d => d.equippedBy).length,
    unequippedDiscCount: getUnequippedDiscs().length
  };
}

// ================================
// DATA INDEX - Fast Lookups
// ================================

class DataIndex {
  constructor() {
    this.discsBySlot = new Map();
    this.discsBySet = new Map();
    this.discsById = new Map();
    this.charactersById = new Map();
    this.discsByCharacter = new Map();
  }

  /**
   * Index all discs for fast filtering
   */
  indexDiscs(discs) {
    this.discsBySlot.clear();
    this.discsBySet.clear();
    this.discsById.clear();
    this.discsByCharacter.clear();

    discs.forEach(disc => {
      // By ID
      this.discsById.set(disc.id, disc);

      // By slot
      if (!this.discsBySlot.has(disc.slot)) {
        this.discsBySlot.set(disc.slot, []);
      }
      this.discsBySlot.get(disc.slot).push(disc);

      // By set
      if (!this.discsBySet.has(disc.setId)) {
        this.discsBySet.set(disc.setId, []);
      }
      this.discsBySet.get(disc.setId).push(disc);

      // By equipped character
      if (disc.equippedBy) {
        if (!this.discsByCharacter.has(disc.equippedBy)) {
          this.discsByCharacter.set(disc.equippedBy, []);
        }
        this.discsByCharacter.get(disc.equippedBy).push(disc);
      }
    });
  }

  /**
   * Index all characters for fast lookups
   */
  indexCharacters(characters) {
    this.charactersById.clear();
    characters.forEach(char => {
      this.charactersById.set(char.id, char);
    });
  }

  /**
   * Get discs by slot (fast lookup)
   */
  getDiscsBySlot(slot) {
    return this.discsBySlot.get(slot) || [];
  }

  /**
   * Get discs by set (fast lookup)
   */
  getDiscsBySet(setId) {
    return this.discsBySet.get(setId) || [];
  }

  /**
   * Get disc by ID (fast lookup)
   */
  getDiscById(id) {
    return this.discsById.get(id) || null;
  }

  /**
   * Get character by ID (fast lookup)
   */
  getCharacterById(id) {
    return this.charactersById.get(id) || null;
  }

  /**
   * Get all discs equipped by character
   */
  getDiscsByCharacterId(characterId) {
    return this.discsByCharacter.get(characterId) || [];
  }

  /**
   * Check if disc is equipped
   */
  isDiscEquipped(discId) {
    const disc = this.getDiscById(discId);
    return disc ? disc.equippedBy !== null : false;
  }

  /**
   * Get index statistics
   */
  getStats() {
    return {
      totalDiscs: this.discsById.size,
      totalCharacters: this.charactersById.size,
      slotsIndexed: this.discsBySlot.size,
      setsIndexed: this.discsBySet.size,
      charactersWithDiscs: this.discsByCharacter.size
    };
  }
}

// Singleton instance
export const dataIndex = new DataIndex();

// Export for debugging
if (typeof window !== 'undefined') {
  window.__dataIndex = dataIndex;
}

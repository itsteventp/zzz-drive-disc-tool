// ================================
// SCORE CACHE SYSTEM
// ================================

class ScoreCache {
  constructor() {
    this.cache = new Map();
    this.hits = 0;
    this.misses = 0;
  }

  /**
   * Generate cache key from character and disc IDs
   */
  getKey(characterId, discId) {
    return `${characterId}:${discId}`;
  }

  /**
   * Get cached score
   */
  get(characterId, discId) {
    const key = this.getKey(characterId, discId);
    if (this.cache.has(key)) {
      this.hits++;
      return this.cache.get(key);
    }
    this.misses++;
    return null;
  }

  /**
   * Store score in cache
   */
  set(characterId, discId, score) {
    const key = this.getKey(characterId, discId);
    this.cache.set(key, score);
  }

  /**
   * Invalidate all scores for a character
   */
  invalidateCharacter(characterId) {
    for (const key of this.cache.keys()) {
      if (key.startsWith(`${characterId}:`)) {
        this.cache.delete(key);
      }
    }
  }

  /**
   * Invalidate all scores for a disc
   */
  invalidateDisc(discId) {
    for (const key of this.cache.keys()) {
      if (key.endsWith(`:${discId}`)) {
        this.cache.delete(key);
      }
    }
  }

  /**
   * Clear entire cache
   */
  clear() {
    this.cache.clear();
    this.hits = 0;
    this.misses = 0;
  }

  /**
   * Get cache statistics
   */
  getStats() {
    const total = this.hits + this.misses;
    const hitRate = total > 0 ? (this.hits / total * 100).toFixed(2) : 0;
    return {
      hits: this.hits,
      misses: this.misses,
      total,
      hitRate: `${hitRate}%`,
      size: this.cache.size,
      estimatedMemoryKB: Math.round(this.cache.size * 0.1) // Rough estimate
    };
  }
}

// Singleton instance
export const scoreCache = new ScoreCache();

// Export for debugging
if (typeof window !== 'undefined') {
  window.__scoreCache = scoreCache;
}

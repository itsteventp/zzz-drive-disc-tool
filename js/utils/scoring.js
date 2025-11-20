// ================================
// SCORING.JS - Disc Scoring Algorithm
// ================================

import { SCORING_WEIGHTS, SCORE_GRADES } from '../config/constants.js';
import { scoreCache } from './scoreCache.js';
import { perfMonitor } from './performanceMonitor.js';

// ================================
// CORE SCORING ALGORITHM
// ================================

/**
 * Calculate how well a disc matches a character's preferences
 * @param {Object} disc - The disc to score
 * @param {Object} character - The character with preferences
 * @returns {number} - Score (typically 0-8 range)
 */
export function calculateDiscScore(disc, character) {
  if (!disc || !character || !character.subStatPriority) {
    return 0;
  }
  
  // Check cache first
  const cached = scoreCache.get(character.id, disc.id);
  if (cached !== null) {
    return cached;
  }
  
  // Measure performance in dev mode
  perfMonitor.start(`score-${disc.id}`);
  
  let score = 0;
  const priority = character.subStatPriority;
  
  // Score each sub-stat based on priority
  disc.subStats.forEach(([statName, rollCount]) => {
    const priorityIndex = priority.indexOf(statName);
    
    if (priorityIndex !== -1) {
      const isHighPriority = priorityIndex <= 1;
      const weight = isHighPriority ? SCORING_WEIGHTS.HIGH_PRIORITY : SCORING_WEIGHTS.LOW_PRIORITY;
      score += rollCount * weight;
    }
  });
  
  // Bonus if main stat matches any priority sub-stat
  if (priority.includes(disc.mainStat)) {
    const priorityIndex = priority.indexOf(disc.mainStat);
    const isHighPriority = priorityIndex <= 1;
    const weight = isHighPriority ? SCORING_WEIGHTS.HIGH_PRIORITY : SCORING_WEIGHTS.LOW_PRIORITY;
    score += SCORING_WEIGHTS.MAIN_STAT_BONUS * weight;
  }
  
  perfMonitor.end(`score-${disc.id}`);
  
  // Store in cache
  scoreCache.set(character.id, disc.id, score);
  
  return score;
}

// ================================
// GRADE CALCULATION
// ================================

/**
 * Convert a numeric score to a letter grade
 * @param {number} score - The numeric score
 * @returns {Object} - Grade object with letter, color, and label
 */
export function getGradeForScore(score) {
  // Find the highest grade the score qualifies for
  const grades = Object.entries(SCORE_GRADES).sort((a, b) => b[1].min - a[1].min);
  
  for (const [letter, gradeInfo] of grades) {
    if (score >= gradeInfo.min) {
      return {
        letter,
        ...gradeInfo
      };
    }
  }
  
  // Default to lowest grade
  return {
    letter: 'D',
    ...SCORE_GRADES.D
  };
}

// ================================
// BATCH SCORING
// ================================

/**
 * Score multiple discs against a character
 * @param {Array} discs - Array of discs to score
 * @param {Object} character - The character
 * @returns {Array} - Array of {disc, score, grade} objects
 */
export function scoreDiscs(discs, character) {
  return discs.map(disc => {
    const score = calculateDiscScore(disc, character);
    const grade = getGradeForScore(score);
    return { disc, score, grade };
  });
}

/**
 * Score and sort discs by score (descending)
 * @param {Array} discs - Array of discs
 * @param {Object} character - The character
 * @returns {Array} - Sorted array of {disc, score, grade} objects
 */
export function scoreAndSortDiscs(discs, character) {
  const scored = scoreDiscs(discs, character);
  return scored.sort((a, b) => b.score - a.score);
}

// ================================
// CHARACTER BUILD SCORING
// ================================

/**
 * Calculate average score of all equipped discs
 * @param {Object} character - The character
 * @param {Array} allDiscs - All available discs
 * @returns {Object} - Build score info
 */
export function calculateBuildScore(character, allDiscs) {
  const equippedDiscIds = character.equippedDiscs.filter(id => id !== null);
  
  if (equippedDiscIds.length === 0) {
    return {
      averageScore: 0,
      totalScore: 0,
      discCount: 0,
      grade: getGradeForScore(0),
      slotScores: []
    };
  }
  
  const slotScores = character.equippedDiscs.map((discId, slotIndex) => {
    if (!discId) {
      return { slot: slotIndex + 1, score: 0, disc: null };
    }
    
    const disc = allDiscs.find(d => d.id === discId);
    if (!disc) {
      return { slot: slotIndex + 1, score: 0, disc: null };
    }
    
    const score = calculateDiscScore(disc, character);
    return { slot: slotIndex + 1, score, disc };
  });
  
  const totalScore = slotScores.reduce((sum, s) => sum + s.score, 0);
  const averageScore = totalScore / equippedDiscIds.length;
  const grade = getGradeForScore(averageScore);
  
  return {
    averageScore: Math.round(averageScore * 100) / 100, // Round to 2 decimals
    totalScore: Math.round(totalScore * 100) / 100,
    discCount: equippedDiscIds.length,
    grade,
    slotScores
  };
}

// ================================
// FILTERING BY SCORE
// ================================

/**
 * Filter discs that meet a minimum score threshold
 * @param {Array} discs - Array of discs
 * @param {Object} character - The character
 * @param {number} minScore - Minimum score threshold
 * @returns {Array} - Filtered discs
 */
export function filterByMinScore(discs, character, minScore) {
  return discs.filter(disc => calculateDiscScore(disc, character) >= minScore);
}

/**
 * Get top N scoring discs
 * @param {Array} discs - Array of discs
 * @param {Object} character - The character
 * @param {number} count - Number of top discs to return
 * @returns {Array} - Top scoring discs
 */
export function getTopScoringDiscs(discs, character, count = 10) {
  const scored = scoreAndSortDiscs(discs, character);
  return scored.slice(0, count);
}

// ================================
// SCORE BREAKDOWN
// ================================

/**
 * Get detailed breakdown of how a disc was scored
 * @param {Object} disc - The disc
 * @param {Object} character - The character
 * @returns {Object} - Detailed score breakdown
 */
export function getScoreBreakdown(disc, character) {
  const breakdown = {
    totalScore: 0,
    subStatContributions: [],
    mainStatBonus: 0,
    details: []
  };
  
  const priority = character.subStatPriority;
  
  // Calculate sub-stat contributions
  disc.subStats.forEach(([statName, rollCount]) => {
    const priorityIndex = priority.indexOf(statName);
    
    if (priorityIndex !== -1) {
      const isHighPriority = priorityIndex <= 1;
      const weight = isHighPriority ? SCORING_WEIGHTS.HIGH_PRIORITY : SCORING_WEIGHTS.LOW_PRIORITY;
      const contribution = rollCount * weight;
      
      breakdown.subStatContributions.push({
        stat: statName,
        rolls: rollCount,
        priority: isHighPriority ? 'High' : 'Low',
        weight,
        contribution
      });
      
      breakdown.totalScore += contribution;
    } else {
      breakdown.subStatContributions.push({
        stat: statName,
        rolls: rollCount,
        priority: 'None',
        weight: 0,
        contribution: 0
      });
    }
  });
  
  // Calculate main stat bonus
  if (priority.includes(disc.mainStat)) {
    const priorityIndex = priority.indexOf(disc.mainStat);
    const isHighPriority = priorityIndex <= 1;
    const weight = isHighPriority ? SCORING_WEIGHTS.HIGH_PRIORITY : SCORING_WEIGHTS.LOW_PRIORITY;
    breakdown.mainStatBonus = SCORING_WEIGHTS.MAIN_STAT_BONUS * weight;
    breakdown.totalScore += breakdown.mainStatBonus;
  }
  
  return breakdown;
}

export function invalidateScoresForCharacter(characterId) {
  scoreCache.invalidateCharacter(characterId);
}

export function invalidateScoresForDisc(discId) {
  scoreCache.invalidateDisc(discId);
}

export function clearScoreCache() {
  scoreCache.clear();
}
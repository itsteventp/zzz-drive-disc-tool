// ================================
// TEST PAGE - For verifying scoring
// ================================

import { getAllCharacters, getAllDiscs } from '../storage/storage.js';
import { calculateDiscScore, getGradeForScore, calculateBuildScore, getScoreBreakdown } from '../utils/scoring.js';
import { getDiscSetName } from '../models/disc.js';

export function renderTestPage(container, params) {
  const characters = getAllCharacters();
  const discs = getAllDiscs();
  
  if (characters.length === 0 || discs.length === 0) {
    container.innerHTML = `
      <div style="text-align: center; padding: 3rem;">
        <h2 style="color: var(--color-warning);">⚠️ No test data</h2>
        <p style="color: var(--color-text-secondary); margin-top: 1rem;">
          Go to <a href="#/" style="color: var(--color-accent-cyan);">Characters page</a> 
          and click "Load Test Data" first.
        </p>
      </div>
    `;
    return;
  }
  
  // Score all discs for the first character
  const testCharacter = characters[0];
  const scoredDiscs = discs.map(disc => ({
    disc,
    score: calculateDiscScore(disc, testCharacter),
    grade: getGradeForScore(calculateDiscScore(disc, testCharacter))
  })).sort((a, b) => b.score - a.score);
  
  container.innerHTML = `
    <div>
      <header style="margin-bottom: 2rem;">
        <a href="#/" style="color: var(--color-accent-cyan); text-decoration: none; display: inline-block; margin-bottom: 1rem;">
          ← Back to Characters
        </a>
        <h1 style="color: var(--color-accent-cyan); margin-bottom: 0.5rem;">
          🧪 Scoring Algorithm Test
        </h1>
        <p style="color: var(--color-text-secondary);">
          Testing disc scores for: <strong>${testCharacter.name}</strong>
        </p>
      </header>
      
      <!-- Character Info -->
      <div style="background: var(--color-bg-secondary); padding: var(--space-lg); border-radius: var(--radius-lg); margin-bottom: var(--space-lg);">
        <h3 style="color: var(--color-accent-purple); margin-bottom: var(--space-md);">Character Preferences</h3>
        <div style="display: grid; gap: var(--space-md);">
          <div>
            <strong style="color: var(--color-text-primary);">Sub-stat Priority:</strong>
            <div style="color: var(--color-text-secondary); margin-top: var(--space-xs);">
              ${testCharacter.subStatPriority.map((stat, i) => `
                <span style="margin-right: var(--space-md);">
                  ${i + 1}. ${stat} ${i <= 1 ? '(High Priority)' : '(Low Priority)'}
                </span>
              `).join('')}
            </div>
          </div>
        </div>
      </div>
      
      <!-- Scored Discs -->
      <div>
        <h3 style="color: var(--color-accent-cyan); margin-bottom: var(--space-md);">
          All Discs Scored (${scoredDiscs.length} total)
        </h3>
        <div style="display: grid; gap: var(--space-md);">
          ${scoredDiscs.map(({ disc, score, grade }) => {
            const breakdown = getScoreBreakdown(disc, testCharacter);
            return `
              <div style="
                background: var(--color-bg-secondary);
                padding: var(--space-lg);
                border-radius: var(--radius-md);
                border-left: 4px solid ${grade.color};
              ">
                <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: var(--space-md);">
                  <div>
                    <div style="color: var(--color-text-primary); font-weight: 600; margin-bottom: var(--space-xs);">
                      ${getDiscSetName(disc)} - Slot ${disc.slot}
                    </div>
                    <div style="color: var(--color-text-secondary); font-size: 0.9rem;">
                      Main: ${disc.mainStat}
                    </div>
                  </div>
                  <div style="text-align: right;">
                    <div style="
                      background: ${grade.color};
                      color: white;
                      padding: var(--space-xs) var(--space-md);
                      border-radius: var(--radius-sm);
                      font-weight: 700;
                      font-size: 1.2rem;
                      margin-bottom: var(--space-xs);
                    ">
                      ${grade.letter}
                    </div>
                    <div style="color: var(--color-text-secondary); font-size: 0.85rem;">
                      Score: ${score.toFixed(2)}
                    </div>
                  </div>
                </div>
                
                <!-- Sub-stats -->
                <div style="margin-bottom: var(--space-md);">
                  <strong style="color: var(--color-text-secondary); font-size: 0.85rem;">Sub-stats:</strong>
                  <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: var(--space-xs); margin-top: var(--space-xs);">
                    ${disc.subStats.map(([stat, rolls]) => {
                      const contrib = breakdown.subStatContributions.find(c => c.stat === stat);
                      return `
                        <div style="
                          color: ${contrib && contrib.contribution > 0 ? 'var(--color-accent-cyan)' : 'var(--color-text-muted)'};
                          font-size: 0.9rem;
                        ">
                          ${stat}: ${rolls} ${contrib && contrib.contribution > 0 ? `(+${contrib.contribution.toFixed(1)})` : ''}
                        </div>
                      `;
                    }).join('')}
                  </div>
                </div>
                
                ${breakdown.mainStatBonus > 0 ? `
                  <div style="color: var(--color-success); font-size: 0.9rem;">
                    ✨ Main stat bonus: +${breakdown.mainStatBonus.toFixed(1)}
                  </div>
                ` : ''}
              </div>
            `;
          }).join('')}
        </div>
      </div>
    </div>
  `;
}

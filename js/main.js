// ================================
// MAIN.JS - App Entry Point
// ================================

// Import constants to test
import * as Constants from './config/constants.js';

// Initialize app
function init() {
  console.log('🚀 ZZZ Drive Optimizer Initializing...');
  
  // Test: Log all disc sets
  console.log('📀 Disc Sets:', Constants.DISC_SETS);
  console.log('📊 Total 4-piece sets:', Constants.get4PieceSets().length);
  console.log('📊 Total 2-piece sets:', Constants.get2PieceSets().length);
  
  // Test: Check slot 4 main stats
  console.log('🎯 Slot 4 main stats:', Constants.MAIN_STATS_BY_SLOT[4]);
  
  // Test: Validation rules
  console.log('✅ Validation rules:', Constants.VALIDATION_RULES);
  
  // Replace loading text with success message
  const app = document.getElementById('app');
  app.innerHTML = `
    <div style="text-align: center; padding: 3rem;">
      <h2 style="color: var(--color-accent-cyan); margin-bottom: 1rem;">
        ✅ Phase 1.2 Complete!
      </h2>
      <p style="color: var(--color-text-secondary); margin-bottom: 2rem;">
        Game data constants loaded successfully. Check console for details.
      </p>
      <div style="background: var(--color-bg-secondary); padding: 2rem; border-radius: var(--radius-lg); max-width: 600px; margin: 0 auto;">
        <h3 style="color: var(--color-accent-purple); margin-bottom: 1rem;">Loaded Data:</h3>
        <ul style="text-align: left; color: var(--color-text-primary);">
          <li>✅ ${Constants.get4PieceSets().length} Four-piece disc sets</li>
          <li>✅ ${Constants.get2PieceSets().length} Two-piece disc sets</li>
          <li>✅ ${Constants.SUB_STATS.length} Sub-stats defined</li>
          <li>✅ Scoring algorithm weights configured</li>
          <li>✅ Validation rules established</li>
        </ul>
      </div>
    </div>
  `;
}

// Run when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

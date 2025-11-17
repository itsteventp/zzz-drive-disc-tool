// ================================
// CHARACTERS PAGE
// ================================

import { getAllCharacters } from '../storage/storage.js';
import { loadTestData } from '../utils/testData.js';

export function renderCharactersPage(container, params) {
  const characters = getAllCharacters();
  
  container.innerHTML = `
    <div>
      <header style="margin-bottom: 2rem; display: flex; justify-content: space-between; align-items: center;">
        <div>
          <h1 style="color: var(--color-accent-cyan); margin-bottom: 0.5rem;">
            Characters
          </h1>
          <p style="color: var(--color-text-secondary);">
            ${characters.length} character${characters.length !== 1 ? 's' : ''} total
          </p>
        </div>
        
        <button id="load-test-data-btn" style="
          background: var(--color-accent-purple);
          color: white;
          border: none;
          padding: var(--space-md) var(--space-lg);
          border-radius: var(--radius-md);
          font-weight: 600;
          cursor: pointer;
          transition: all var(--transition-fast);
        ">
          Load Test Data
        </button>
      </header>
      
      <div style="background: var(--color-bg-secondary); padding: 3rem; border-radius: var(--radius-lg); text-align: center;">
        ${characters.length === 0 ? `
          <p style="color: var(--color-text-secondary); font-size: 1.2rem; margin-bottom: 1rem;">
            📭 No characters yet
          </p>
          <p style="color: var(--color-text-muted);">
            Click "Load Test Data" to add sample characters and discs
          </p>
        ` : `
          <p style="color: var(--color-text-secondary); font-size: 1.2rem;">
            🎭 Character list UI coming in Phase 3!
          </p>
          <p style="color: var(--color-text-muted); margin-top: 1rem;">
            Currently showing ${characters.length} characters in storage
          </p>
        `}
      </div>
    </div>
  `;
  
  // Add event listener for test data button
  const loadButton = document.getElementById('load-test-data-btn');
  if (loadButton) {
    loadButton.addEventListener('click', () => {
      loadTestData();
      // Re-render the page to show updated count
      renderCharactersPage(container, params);
    });
  }
}

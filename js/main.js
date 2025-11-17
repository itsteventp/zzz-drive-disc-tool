// ================================
// MAIN.JS - App Entry Point & Router
// ================================

import * as Constants from './config/constants.js';
import { initStorage, getStorageStats } from './storage/storage.js';
import { renderCharactersPage } from './pages/charactersPage.js';
import { renderCharacterDetail } from './pages/characterDetail.js';
import { renderDiscsPage } from './pages/discsPage.js';
import { renderTestPage } from './pages/testPage.js';

// ================================
// ROUTER
// ================================

const routes = {
  '/': renderCharactersPage,
  '/discs': renderDiscsPage,
  '/character/:id': renderCharacterDetail,
  '/test': renderTestPage
};

// Parse hash and extract route + params
function parseHash() {
  const hash = window.location.hash.slice(1) || '/'; // Remove # and default to /
  
  // Check for exact match first
  if (routes[hash]) {
    return { handler: routes[hash], params: {} };
  }
  
  // Check for parameterized routes (e.g., /character/:id)
  for (const [pattern, handler] of Object.entries(routes)) {
    if (pattern.includes(':')) {
      const regex = new RegExp('^' + pattern.replace(/:[^/]+/g, '([^/]+)') + '$');
      const match = hash.match(regex);
      
      if (match) {
        // Extract parameter names and values
        const paramNames = pattern.match(/:[^/]+/g).map(p => p.slice(1));
        const params = {};
        paramNames.forEach((name, index) => {
          params[name] = match[index + 1];
        });
        
        return { handler, params };
      }
    }
  }
  
  // 404 - Route not found
  return { handler: render404, params: {} };
}

// Render the current route
function renderRoute() {
  const { handler, params } = parseHash();
  const app = document.getElementById('app');
  
  // Update active nav link
  updateActiveNavLink();
  
  // Render page
  try {
    app.innerHTML = ''; // Clear current content
    handler(app, params); // Call route handler
  } catch (error) {
    console.error('Error rendering route:', error);
    app.innerHTML = `
      <div style="text-align: center; padding: 3rem; color: var(--color-error);">
        <h2>⚠️ Error Loading Page</h2>
        <p>${error.message}</p>
      </div>
    `;
  }
}

// Update active class on nav links
function updateActiveNavLink() {
  const hash = window.location.hash.slice(1) || '/';
  const links = document.querySelectorAll('.nav-link');
  
  links.forEach(link => {
    const href = link.getAttribute('href').slice(1); // Remove #
    
    if (href === hash || (href === '/' && hash === '/')) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}

// 404 Page
function render404(container) {
  container.innerHTML = `
    <div style="text-align: center; padding: 3rem;">
      <h2 style="color: var(--color-error); margin-bottom: 1rem;">
        404 - Page Not Found
      </h2>
      <p style="color: var(--color-text-secondary); margin-bottom: 2rem;">
        The page you're looking for doesn't exist.
      </p>
      <a href="#/" style="color: var(--color-accent-cyan); text-decoration: none; font-weight: 600;">
        ← Back to Characters
      </a>
    </div>
  `;
}

// ================================
// NAVIGATION HELPER
// ================================

// Export for use in other modules
export function navigate(path) {
  window.location.hash = path;
}

// ================================
// INITIALIZATION
// ================================

function init() {
  console.log('🚀 ZZZ Drive Optimizer Starting...');
  
  // Initialize storage
  initStorage();
  const stats = getStorageStats();
  console.log('📊 Storage stats:', stats);
  
  console.log('📀 Loaded', Constants.get4PieceSets().length, '4-piece sets');
  console.log('📀 Loaded', Constants.get2PieceSets().length, '2-piece sets');
  
  // Initial route render
  renderRoute();
  
  // Listen for hash changes (back/forward buttons, manual navigation)
  window.addEventListener('hashchange', renderRoute);
  
  console.log('✅ Router initialized');
}

// Run when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

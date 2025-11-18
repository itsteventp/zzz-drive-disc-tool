// ================================
// CHARACTERS PAGE
// ================================

import { getAllCharacters, deleteCharacter, getStorageStats } from '../storage/storage.js';
import { showToast, confirmDialog, createEmptyState } from '../utils/ui.js';
import { getEquippedDiscCount, getPreferredSetsDisplay } from '../models/character.js';
import { navigate } from '../main.js';

let searchQuery = '';
let filterSet = 'all';

// ================================
// RENDER CHARACTER CARD
// ================================

function renderCharacterCard(character) {
  const equippedCount = getEquippedDiscCount(character);
  const setsDisplay = getPreferredSetsDisplay(character);
  
  const card = document.createElement('div');
  card.className = 'card character-card';
  card.setAttribute('role', 'article');
  card.setAttribute('aria-label', `${character.name} - ${equippedCount} of 6 discs equipped`);
  card.setAttribute('tabindex', '0');
  card.style.cssText = `
    cursor: pointer;
    border-left-color: ${equippedCount === 6 ? 'var(--color-success)' : 'var(--color-accent-cyan)'};
  `;
  
  card.innerHTML = `
    <div class="card-header">
      <div style="flex: 1;">
        <h3 class="card-title">${character.name}</h3>
        <div class="card-subtitle">${setsDisplay}</div>
      </div>
      <div class="card-actions" style="z-index: 10;">
        <button 
          class="btn-edit-char" 
          data-id="${character.id}"
          aria-label="Edit ${character.name}"
          style="
            background: var(--color-accent-purple);
            border: none;
            padding: var(--space-sm) var(--space-md);
            border-radius: var(--radius-sm);
            color: white;
            cursor: pointer;
            font-weight: 600;
            transition: all var(--transition-fast);
          "
          title="Edit character"
        >✏️ Edit</button>
        <button 
          class="btn-delete-char" 
          data-id="${character.id}"
          aria-label="Delete ${character.name}"
          style="
            background: var(--color-error);
            border: none;
            padding: var(--space-sm) var(--space-md);
            border-radius: var(--radius-sm);
            color: white;
            cursor: pointer;
            font-weight: 600;
            transition: all var(--transition-fast);
          "
          title="Delete character"
        >🗑️</button>
      </div>
    </div>
    
    <div style="margin-top: var(--space-md);">
      <div style="
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: var(--space-md);
        background: var(--color-bg-tertiary);
        border-radius: var(--radius-md);
      ">
        <span style="color: var(--color-text-secondary);">Equipment:</span>
        <span style="
          color: ${equippedCount === 6 ? 'var(--color-success)' : 'var(--color-text-primary)'};
          font-weight: 700;
          font-size: 1.1rem;
        " aria-label="${equippedCount} of 6 equipped">${equippedCount}/6</span>
      </div>
      
      <div style="margin-top: var(--space-sm); color: var(--color-text-muted); font-size: 0.85rem;">
        Priority: ${character.subStatPriority.slice(0, 2).join(', ')}
      </div>
    </div>
  `;
  
  // Click and keyboard navigation
  const navigateToDetail = (e) => {
    // Don't navigate if clicking action buttons
    if (e.target.closest('.btn-edit-char') || e.target.closest('.btn-delete-char')) {
      return;
    }
    navigate(`/character/${character.id}`);
  };
  
  card.addEventListener('click', navigateToDetail);
  
  // Keyboard support
  card.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      navigateToDetail(e);
    }
  });
  
  return card;
}

// ================================
// RENDER CHARACTER GRID
// ================================

function renderCharacterGrid(characters) {
  if (characters.length === 0) {
    return createEmptyState({
      icon: '🎭',
      title: 'No Characters Found',
      message: searchQuery || filterSet !== 'all' 
        ? 'No characters match your filters. Try adjusting your search.' 
        : 'Start by adding your first character!',
      actionText: searchQuery || filterSet !== 'all' ? null : '+ Add Character',
      onAction: () => openCharacterForm()
    });
  }
  
  const grid = document.createElement('div');
  grid.style.cssText = `
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
    gap: var(--space-lg);
  `;
  
  characters.forEach(char => {
    grid.appendChild(renderCharacterCard(char));
  });
  
  return grid;
}

// ================================
// FILTERING
// ================================

function filterCharacters(characters) {
  let filtered = [...characters];
  
  // Search by name
  if (searchQuery) {
    filtered = filtered.filter(char => 
      char.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }
  
  // Filter by set (if needed in future)
  // Currently we're keeping it simple
  
  return filtered;
}

// ================================
// CHARACTER FORM
// ================================

function openCharacterForm(character = null) {
  // Import and open the form
  import('../components/characterForm.js').then(module => {
    module.openCharacterForm(character);
  });
}


// ================================
// DELETE CHARACTER
// ================================

async function handleDeleteCharacter(characterId) {
  const character = getAllCharacters().find(c => c.id === characterId);
  if (!character) return;
  
  const confirmed = await confirmDialog({
    title: 'Delete Character',
    message: `Are you sure you want to delete <strong>${character.name}</strong>? This will unequip all their discs but won't delete the discs themselves.`,
    confirmText: 'Delete',
    cancelText: 'Cancel',
    danger: true
  });
  
  if (confirmed) {
    deleteCharacter(characterId);
    showToast(`${character.name} deleted successfully`, 'success');
    renderCharactersPage(document.getElementById('app'));
  }
}

// ================================
// MAIN RENDER FUNCTION
// ================================

export function renderCharactersPage(container, params) {
  const characters = getAllCharacters();
  const filtered = filterCharacters(characters);
  const stats = getStorageStats();
  
  container.innerHTML = '';
  
  // Create page container
  const page = document.createElement('div');
  
  // Header
  const header = document.createElement('header');
  header.style.cssText = `
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: var(--space-xl);
    flex-wrap: wrap;
    gap: var(--space-md);
  `;
  
  header.innerHTML = `
    <div>
      <h1 style="color: var(--color-accent-cyan); margin-bottom: var(--space-xs);">
        Characters
      </h1>
      <p style="color: var(--color-text-secondary);">
        ${characters.length} character${characters.length !== 1 ? 's' : ''} • 
        ${stats.equippedDiscCount} disc${stats.equippedDiscCount !== 1 ? 's' : ''} equipped
      </p>
    </div>
    
    <div style="display: flex; gap: var(--space-md); align-items: center;">
      <button id="add-character-btn" class="btn-primary">
        + Add Character
      </button>
    </div>
  `;
  
  // Search and filters
  const searchBar = document.createElement('div');
  searchBar.style.cssText = `
    background: var(--color-bg-secondary);
    padding: var(--space-lg);
    border-radius: var(--radius-lg);
    margin-bottom: var(--space-xl);
  `;
  
  searchBar.innerHTML = `
    <div style="display: flex; gap: var(--space-md); align-items: center; flex-wrap: wrap;">
      <div style="flex: 1; min-width: 250px;">
        <input 
          type="text" 
          id="search-input" 
          class="form-input" 
          placeholder="🔍 Search characters..."
          value="${searchQuery}"
          style="margin: 0;"
        >
      </div>
      ${filtered.length !== characters.length ? `
        <button id="clear-filters-btn" class="btn-secondary btn-small">
          Clear Filters
        </button>
      ` : ''}
    </div>
  `;
  
  page.appendChild(header);
  page.appendChild(searchBar);
  page.appendChild(renderCharacterGrid(filtered));
  
  container.appendChild(page);
  
  // ================================
  // EVENT LISTENERS
  // ================================
  
  // Add character button
  const addBtn = document.getElementById('add-character-btn');
  if (addBtn) {
    addBtn.addEventListener('click', () => openCharacterForm());
  }
  
  // Search input
  const searchInput = document.getElementById('search-input');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value;
      renderCharactersPage(container);
    });
  }
  
  // Clear filters button
  const clearBtn = document.getElementById('clear-filters-btn');
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      searchQuery = '';
      renderCharactersPage(container);
    });
  }
  
  // Edit character buttons
  document.querySelectorAll('.btn-edit-char').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const characterId = btn.dataset.id;
      const character = characters.find(c => c.id === characterId);
      openCharacterForm(character);
    });
  });
  
  // Delete character buttons
  document.querySelectorAll('.btn-delete-char').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      handleDeleteCharacter(btn.dataset.id);
    });
  });
}

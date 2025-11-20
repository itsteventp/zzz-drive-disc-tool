// ================================
// CHARACTERS PAGE
// ================================

import { getAllCharacters, deleteCharacter, getStorageStats, exportData, importData } from '../storage/storage.js';
import { showToast, confirmDialog, createEmptyState } from '../utils/ui.js';
import { getEquippedDiscCount, getPreferredSetsDisplay } from '../models/character.js';
import { navigate } from '../main.js';
import { debounce } from '../utils/debounce.js';
import { sortItems, createSortDropdown } from '../utils/sorting.js';
import { perfMonitor } from '../utils/performanceMonitor.js';

// ================================
// STATE
// ================================

let searchQuery = '';
let filterSet = 'all';
let currentSort = 'nameAsc';

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
    if (e.target.closest('.btn-edit-char') || e.target.closest('.btn-delete-char')) {
      return;
    }
    navigate(`/character/${character.id}`);
  };
  
  card.addEventListener('click', navigateToDetail);
  
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
  
  if (searchQuery) {
    filtered = filtered.filter(char => 
      char.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }
  
  return filtered;
}

// ================================
// SEARCH AND FILTERS UI
// ================================

function createSearchAndFilters(characters, filtered) {
  const searchBar = document.createElement('div');
  searchBar.style.cssText = `
    background: var(--color-bg-secondary);
    padding: var(--space-lg);
    border-radius: var(--radius-lg);
    margin-bottom: var(--space-xl);
  `;
  
  const hasActiveFilters = searchQuery || currentSort !== 'nameAsc';
  
  searchBar.innerHTML = `
    <div style="display: grid; grid-template-columns: 1fr auto auto; gap: var(--space-md); align-items: end;">
      <div class="form-group" style="margin: 0;">
        <label class="form-label" style="font-size: 0.9rem;">Search</label>
        <input 
          type="text" 
          id="search-input" 
          class="form-input" 
          placeholder="🔍 Search characters..."
          value="${searchQuery}"
          style="margin: 0;"
        >
      </div>
      
      <div class="form-group" style="margin: 0;">
        <label class="form-label" style="font-size: 0.9rem;">Sort by</label>
        ${createSortDropdown(currentSort, 'characters')}
      </div>
      
      ${hasActiveFilters ? `
        <button id="clear-filters-btn" class="btn-secondary" style="height: fit-content;">
          Clear All
        </button>
      ` : ''}
    </div>
    
    ${filtered.length !== characters.length ? `
      <div style="margin-top: var(--space-md); color: var(--color-text-secondary); font-size: 0.9rem;">
        Showing <strong style="color: var(--color-accent-cyan);">${filtered.length}</strong> of ${characters.length} character${characters.length !== 1 ? 's' : ''}
      </div>
    ` : ''}
  `;
  
  return searchBar;
}

// ================================
// CHARACTER FORM
// ================================

function openCharacterForm(character = null) {
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
// EXPORT/IMPORT HANDLERS
// ================================

function handleExportData() {
  try {
    exportData();
    showToast('Data exported successfully!', 'success');
  } catch (error) {
    showToast('Export failed: ' + error.message, 'error');
  }
}

function handleImportData(e) {
  const file = e.target.files[0];
  if (!file) return;
  
  const loadingToast = showToast('Importing data...', 'info', 0);
  
  const reader = new FileReader();
  reader.onload = (event) => {
    try {
      const jsonString = event.target.result;
      const result = importData(jsonString);
      
      loadingToast.remove();
      
      if (result.success) {
        showToast(
          `Import successful! ${result.characterCount} characters, ${result.discCount} discs`,
          'success',
          4000
        );
        setTimeout(() => window.location.reload(), 1500);
      } else {
        showToast(`Import failed: ${result.error}`, 'error', 5000);
      }
    } catch (error) {
      loadingToast.remove();
      showToast(`Import failed: ${error.message}`, 'error', 5000);
    }
  };
  
  reader.onerror = () => {
    loadingToast.remove();
    showToast('Failed to read file', 'error');
  };
  
  reader.readAsText(file);
  e.target.value = '';
}

// ================================
// MAIN RENDER FUNCTION
// ================================

export function renderCharactersPage(container, params) {
  perfMonitor.start('renderCharactersPage');
  
  const characters = getAllCharacters();
  let filtered = filterCharacters(characters);
  filtered = sortItems(filtered, currentSort, 'characters');
  
  const stats = getStorageStats();
  
  container.innerHTML = '';
  
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
    
    <div style="display: flex; gap: var(--space-md); align-items: center; flex-wrap: wrap; justify-content: flex-end;">
      <button id="export-data-btn" class="btn-secondary" title="Export all data">
        📥 Export
      </button>
      <label for="import-file-input" class="btn-secondary" style="cursor: pointer; margin: 0; display: inline-block;" title="Import data from file">
        📤 Import
      </label>
      <input type="file" id="import-file-input" accept=".json" style="display: none;">
      <button id="add-character-btn" class="btn-primary">
        + Add Character
      </button>
    </div>
  `;
  
  page.appendChild(header);
  page.appendChild(createSearchAndFilters(characters, filtered));
  page.appendChild(renderCharacterGrid(filtered));
  
  container.appendChild(page);
  
  perfMonitor.end('renderCharactersPage');
  
  // ================================
  // EVENT LISTENERS
  // ================================
  
  const addBtn = document.getElementById('add-character-btn');
  if (addBtn) {
    addBtn.addEventListener('click', () => openCharacterForm());
  }
  
  const searchInput = document.getElementById('search-input');
  if (searchInput) {
    const debouncedSearch = debounce((value) => {
      searchQuery = value;
      renderCharactersPage(container);
    }, 300);
    
    searchInput.addEventListener('input', (e) => {
      debouncedSearch(e.target.value);
    });
  }
  
  const sortSelect = document.getElementById('sort-select');
  if (sortSelect) {
    sortSelect.addEventListener('change', (e) => {
      currentSort = e.target.value;
      renderCharactersPage(container);
    });
  }
  
  const clearBtn = document.getElementById('clear-filters-btn');
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      searchQuery = '';
      currentSort = 'nameAsc';
      renderCharactersPage(container);
    });
  }
  
  const exportBtn = document.getElementById('export-data-btn');
  if (exportBtn) {
    exportBtn.addEventListener('click', handleExportData);
  }
  
  const importInput = document.getElementById('import-file-input');
  if (importInput) {
    importInput.addEventListener('change', handleImportData);
  }
  
  document.querySelectorAll('.btn-edit-char').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const characterId = btn.dataset.id;
      const character = characters.find(c => c.id === characterId);
      openCharacterForm(character);
    });
  });
  
  document.querySelectorAll('.btn-delete-char').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      handleDeleteCharacter(btn.dataset.id);
    });
  });
}

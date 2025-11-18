// ================================
// DISC INVENTORY PAGE
// ================================

import { getAllDiscs, deleteDisc, getCharacterById } from '../storage/storage.js';
import { getDiscSetName, filterDiscs } from '../models/disc.js';
import { calculateDiscScore, getGradeForScore } from '../utils/scoring.js';
import { showToast, confirmDialog, createEmptyState } from '../utils/ui.js';
import { DISC_SETS } from '../config/constants.js';

// ================================
// STATE
// ================================

let filters = {
  search: '',
  setId: 'all',
  slot: 'all',
  equippedStatus: 'all' // 'all', 'equipped', 'unequipped'
};

let comparisonDiscs = []; // Array of disc IDs for comparison
const MAX_COMPARISON_DISCS = 4;

// ================================
// MAIN RENDER FUNCTION
// ================================

export function renderDiscsPage(container, params) {
  const allDiscs = getAllDiscs();
  const filteredDiscs = applyFilters(allDiscs);
  
  container.innerHTML = '';
  
  const page = document.createElement('div');
  
  // Header
  page.appendChild(createHeader(allDiscs.length, filteredDiscs.length));
  
  // Filters
  page.appendChild(createFiltersPanel());
  
  // Comparison Panel (if active)
  if (comparisonDiscs.length > 0) {
    page.appendChild(createComparisonPanel());
  }
  
  // Disc Grid
  page.appendChild(createDiscGrid(filteredDiscs));
  
  container.appendChild(page);
  
  // Attach event listeners
  attachEventListeners();
}

// ================================
// HEADER
// ================================

function createHeader(totalCount, filteredCount) {
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
        Disc Inventory
      </h1>
      <p style="color: var(--color-text-secondary);">
        ${filteredCount} of ${totalCount} disc${totalCount !== 1 ? 's' : ''}
        ${comparisonDiscs.length > 0 ? ` • ${comparisonDiscs.length} in comparison` : ''}
      </p>
    </div>
    
    <div style="display: flex; gap: var(--space-md);">
      ${comparisonDiscs.length > 0 ? `
        <button id="clear-comparison-btn" class="btn-secondary">
          Clear Comparison (${comparisonDiscs.length})
        </button>
      ` : ''}
      <button id="add-disc-btn" class="btn-primary">
        + Add Disc
      </button>
    </div>
  `;
  
  return header;
}

// ================================
// FILTERS PANEL
// ================================

function createFiltersPanel() {
  const panel = document.createElement('div');
  panel.style.cssText = `
    background: var(--color-bg-secondary);
    padding: var(--space-lg);
    border-radius: var(--radius-lg);
    margin-bottom: var(--space-xl);
  `;
  
  panel.innerHTML = `
    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: var(--space-md); align-items: end;">
      
      <!-- Search -->
      <div class="form-group" style="margin: 0;">
        <label class="form-label" style="font-size: 0.9rem;">Search</label>
        <input 
          type="text" 
          id="disc-search" 
          class="form-input" 
          placeholder="Search by set or stats..."
          value="${filters.search}"
          style="margin: 0;"
        >
      </div>
      
      <!-- Set Filter -->
      <div class="form-group" style="margin: 0;">
        <label class="form-label" style="font-size: 0.9rem;">Disc Set</label>
        <select id="filter-set" class="form-select" style="margin: 0;">
          <option value="all">All Sets</option>
          ${Object.values(DISC_SETS).map(set => `
            <option value="${set.id}" ${filters.setId === set.id ? 'selected' : ''}>
              ${set.name}
            </option>
          `).join('')}
        </select>
      </div>
      
      <!-- Slot Filter -->
      <div class="form-group" style="margin: 0;">
        <label class="form-label" style="font-size: 0.9rem;">Slot</label>
        <select id="filter-slot" class="form-select" style="margin: 0;">
          <option value="all">All Slots</option>
          ${[1, 2, 3, 4, 5, 6].map(slot => `
            <option value="${slot}" ${filters.slot === slot.toString() ? 'selected' : ''}>
              Slot ${slot}
            </option>
          `).join('')}
        </select>
      </div>
      
      <!-- Equipped Status Filter -->
      <div class="form-group" style="margin: 0;">
        <label class="form-label" style="font-size: 0.9rem;">Status</label>
        <select id="filter-equipped" class="form-select" style="margin: 0;">
          <option value="all" ${filters.equippedStatus === 'all' ? 'selected' : ''}>All Discs</option>
          <option value="equipped" ${filters.equippedStatus === 'equipped' ? 'selected' : ''}>Equipped</option>
          <option value="unequipped" ${filters.equippedStatus === 'unequipped' ? 'selected' : ''}>Unequipped</option>
        </select>
      </div>
      
      <!-- Clear Filters Button -->
      ${(filters.search || filters.setId !== 'all' || filters.slot !== 'all' || filters.equippedStatus !== 'all') ? `
        <button id="clear-filters-btn" class="btn-secondary">
          Clear Filters
        </button>
      ` : ''}
    </div>
  `;
  
  return panel;
}

// ================================
// APPLY FILTERS
// ================================

function applyFilters(discs) {
  let filtered = [...discs];
  
  // Search filter
  if (filters.search) {
    const query = filters.search.toLowerCase();
    filtered = filtered.filter(disc => {
      const setName = getDiscSetName(disc).toLowerCase();
      const mainStat = disc.mainStat.toLowerCase();
      const subStats = disc.subStats.map(([stat]) => stat.toLowerCase()).join(' ');
      
      return setName.includes(query) || 
             mainStat.includes(query) || 
             subStats.includes(query);
    });
  }
  
  // Set filter
  if (filters.setId !== 'all') {
    filtered = filtered.filter(disc => disc.setId === filters.setId);
  }
  
  // Slot filter
  if (filters.slot !== 'all') {
    filtered = filtered.filter(disc => disc.slot === parseInt(filters.slot));
  }
  
  // Equipped status filter
  if (filters.equippedStatus === 'equipped') {
    filtered = filtered.filter(disc => disc.equippedBy !== null);
  } else if (filters.equippedStatus === 'unequipped') {
    filtered = filtered.filter(disc => disc.equippedBy === null);
  }
  
  return filtered;
}

// ================================
// DISC GRID
// ================================

function createDiscGrid(discs) {
  const container = document.createElement('div');
  
  if (discs.length === 0) {
    container.appendChild(createEmptyState({
      icon: '💿',
      title: 'No Discs Found',
      message: filters.search || filters.setId !== 'all' || filters.slot !== 'all' || filters.equippedStatus !== 'all'
        ? 'No discs match your current filters. Try adjusting your search.'
        : 'Start by adding your first disc to the inventory!',
      actionText: filters.search || filters.setId !== 'all' ? null : '+ Add Disc',
      onAction: () => openDiscForm()
    }));
    return container;
  }
  
  const grid = document.createElement('div');
  grid.style.cssText = `
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
    gap: var(--space-lg);
  `;
  
  discs.forEach(disc => {
    grid.appendChild(createDiscCard(disc));
  });
  
  container.appendChild(grid);
  return container;
}

// ================================
// DISC CARD
// ================================

function createDiscCard(disc) {
  const isEquipped = disc.equippedBy !== null;
  const character = isEquipped ? getCharacterById(disc.equippedBy) : null;
  const isInComparison = comparisonDiscs.includes(disc.id);
  
  // Calculate score if equipped
  let score = 0;
  let grade = null;
  if (character) {
    score = calculateDiscScore(disc, character);
    grade = getGradeForScore(score);
  }
  
  const card = document.createElement('div');
  card.className = 'disc-card';
  card.setAttribute('role', 'article');
  card.setAttribute('aria-label', `${getDiscSetName(disc)} disc, Slot ${disc.slot}, Main stat: ${disc.mainStat}${isEquipped ? `, equipped by ${character.name}` : ''}`);
  card.setAttribute('tabindex', '0');
  card.style.cssText = `
    background: var(--color-bg-secondary);
    border-radius: var(--radius-lg);
    padding: var(--space-lg);
    border-left: 4px solid ${isEquipped ? 'var(--color-success)' : 'var(--color-border)'};
    transition: all var(--transition-normal);
    ${isInComparison ? 'box-shadow: 0 0 0 2px var(--color-accent-purple);' : ''}
  `;
  
  card.innerHTML = `
    <!-- Header -->
    <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: var(--space-md);">
      <div style="flex: 1;">
        <div style="
          display: flex;
          align-items: center;
          gap: var(--space-sm);
          margin-bottom: var(--space-xs);
        ">
          <span style="
            background: var(--color-bg-tertiary);
            color: var(--color-text-primary);
            padding: var(--space-xs) var(--space-sm);
            border-radius: var(--radius-sm);
            font-weight: 700;
            font-size: 0.9rem;
          ">Slot ${disc.slot}</span>
          
          ${isEquipped ? `
            <span style="
              background: var(--color-success);
              color: white;
              padding: var(--space-xs) var(--space-sm);
              border-radius: var(--radius-sm);
              font-size: 0.75rem;
              font-weight: 600;
            " aria-label="This disc is equipped">EQUIPPED</span>
          ` : ''}
        </div>
        
        <div style="
          color: var(--color-text-primary);
          font-weight: 600;
          margin-bottom: var(--space-xs);
        ">${getDiscSetName(disc)}</div>
        
        ${isEquipped && character ? `
          <div style="
            color: var(--color-text-muted);
            font-size: 0.85rem;
          ">
            📌 ${character.name}
          </div>
        ` : ''}
      </div>
      
      ${grade ? `
        <div style="
          background: ${grade.color};
          color: white;
          padding: var(--space-sm) var(--space-md);
          border-radius: var(--radius-md);
          font-weight: 700;
          font-size: 1.2rem;
        " aria-label="Grade ${grade.letter}">${grade.letter}</div>
      ` : ''}
    </div>
    
    <!-- Main Stat -->
    <div style="
      background: var(--color-bg-tertiary);
      padding: var(--space-md);
      border-radius: var(--radius-md);
      margin-bottom: var(--space-md);
      text-align: center;
    ">
      <div style="color: var(--color-text-secondary); font-size: 0.85rem; margin-bottom: var(--space-xs);">
        Main Stat
      </div>
      <div style="
        color: var(--color-accent-cyan);
        font-size: 1.2rem;
        font-weight: 700;
      ">${disc.mainStat}</div>
    </div>
    
    <!-- Sub-stats -->
    <div style="margin-bottom: var(--space-md);">
      <div style="
        color: var(--color-text-secondary);
        font-size: 0.85rem;
        margin-bottom: var(--space-sm);
      ">Sub-stats</div>
      <div style="
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: var(--space-xs);
      " class="substat-grid">
        ${disc.subStats.map(([stat, rolls]) => `
          <div style="
            background: var(--color-bg-tertiary);
            padding: var(--space-sm);
            border-radius: var(--radius-sm);
            color: var(--color-text-primary);
            font-size: 0.9rem;
          ">
            ${stat} <span style="color: var(--color-accent-cyan); font-weight: 700;">+${rolls}</span>
          </div>
        `).join('')}
      </div>
    </div>
    
    ${score > 0 ? `
      <div style="
        text-align: center;
        padding: var(--space-sm);
        background: var(--color-bg-tertiary);
        border-radius: var(--radius-sm);
        margin-bottom: var(--space-md);
      ">
        <span style="color: var(--color-text-secondary); font-size: 0.85rem;">Score: </span>
        <span style="color: ${grade.color}; font-weight: 700;">${score.toFixed(2)}</span>
      </div>
    ` : ''}
    
    <!-- Actions -->
    <div style="display: flex; gap: var(--space-sm); flex-wrap: wrap;">
      <button 
        class="btn-compare-disc ${isInComparison ? 'btn-primary' : 'btn-secondary'} btn-small"
        data-disc-id="${disc.id}"
        aria-label="${isInComparison ? 'Remove from comparison' : 'Add to comparison'}"
        aria-pressed="${isInComparison}"
        style="flex: 1;"
        ${comparisonDiscs.length >= MAX_COMPARISON_DISCS && !isInComparison ? 'disabled' : ''}
      >
        ${isInComparison ? '✓ In Comparison' : '⚖️ Compare'}
      </button>
      
      <button 
        class="btn-edit-disc btn-secondary btn-small"
        data-disc-id="${disc.id}"
        aria-label="Edit disc"
      >✏️</button>
      
      <button 
        class="btn-delete-disc btn-danger btn-small"
        data-disc-id="${disc.id}"
        aria-label="Delete disc"
      >🗑️</button>
    </div>
  `;
  
  // Hover effect
  card.addEventListener('mouseenter', () => {
    if (!isInComparison) {
      card.style.transform = 'translateY(-4px)';
      card.style.boxShadow = 'var(--shadow-lg)';
    }
  });
  
  card.addEventListener('mouseleave', () => {
    if (!isInComparison) {
      card.style.transform = 'translateY(0)';
      card.style.boxShadow = 'none';
    }
  });
  
  return card;
}

// ================================
// COMPARISON PANEL
// ================================

function createComparisonPanel() {
  const panel = document.createElement('div');
  panel.id = 'comparison-panel';
  panel.style.cssText = `
    background: var(--color-bg-secondary);
    border: 2px solid var(--color-accent-purple);
    border-radius: var(--radius-lg);
    padding: var(--space-xl);
    margin-bottom: var(--space-xl);
    position: sticky;
    top: calc(80px + var(--space-lg));
    z-index: 50;
  `;
  
  const comparisonDiscsData = comparisonDiscs
    .map(id => getAllDiscs().find(d => d.id === id))
    .filter(d => d !== undefined);
  
  panel.innerHTML = `
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--space-lg);">
      <h3 style="color: var(--color-accent-purple); margin: 0;">
        Disc Comparison (${comparisonDiscsData.length}/${MAX_COMPARISON_DISCS})
      </h3>
      <button id="close-comparison-btn" class="btn-secondary btn-small">
        Close
      </button>
    </div>
    
    <div style="
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: var(--space-lg);
    ">
      ${comparisonDiscsData.map(disc => renderComparisonDiscCard(disc)).join('')}
    </div>
  `;
  
  return panel;
}

// ================================
// COMPARISON DISC CARD
// ================================

function renderComparisonDiscCard(disc) {
  const isEquipped = disc.equippedBy !== null;
  const character = isEquipped ? getCharacterById(disc.equippedBy) : null;
  
  return `
    <div style="
      background: var(--color-bg-tertiary);
      padding: var(--space-lg);
      border-radius: var(--radius-md);
      border: 2px solid var(--color-border);
      position: relative;
    ">
      <!-- Remove button -->
      <button 
        class="btn-remove-comparison"
        data-disc-id="${disc.id}"
        style="
          position: absolute;
          top: var(--space-sm);
          right: var(--space-sm);
          background: var(--color-error);
          border: none;
          color: white;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          cursor: pointer;
          font-size: 0.9rem;
          display: flex;
          align-items: center;
          justify-content: center;
        "
      >×</button>
      
      <!-- Slot Badge -->
      <div style="
        background: var(--color-accent-purple);
        color: white;
        padding: var(--space-xs) var(--space-sm);
        border-radius: var(--radius-sm);
        display: inline-block;
        font-weight: 700;
        font-size: 0.9rem;
        margin-bottom: var(--space-md);
      ">Slot ${disc.slot}</div>
      
      <!-- Set Name -->
      <div style="
        color: var(--color-text-primary);
        font-weight: 600;
        margin-bottom: var(--space-xs);
        font-size: 0.95rem;
      ">${getDiscSetName(disc)}</div>
      
      ${isEquipped && character ? `
        <div style="
          color: var(--color-success);
          font-size: 0.8rem;
          margin-bottom: var(--space-md);
        ">📌 ${character.name}</div>
      ` : `
        <div style="
          color: var(--color-text-muted);
          font-size: 0.8rem;
          margin-bottom: var(--space-md);
        ">Unequipped</div>
      `}
      
      <!-- Main Stat -->
      <div style="
        background: var(--color-bg-secondary);
        padding: var(--space-md);
        border-radius: var(--radius-sm);
        margin-bottom: var(--space-md);
        text-align: center;
      ">
        <div style="color: var(--color-text-secondary); font-size: 0.75rem; margin-bottom: var(--space-xs);">
          Main Stat
        </div>
        <div style="color: var(--color-accent-cyan); font-weight: 700;">
          ${disc.mainStat}
        </div>
      </div>
      
      <!-- Sub-stats -->
      <div>
        <div style="
          color: var(--color-text-secondary);
          font-size: 0.75rem;
          margin-bottom: var(--space-sm);
        ">Sub-stats</div>
        ${disc.subStats.map(([stat, rolls]) => `
          <div style="
            display: flex;
            justify-content: space-between;
            padding: var(--space-xs);
            background: var(--color-bg-secondary);
            border-radius: var(--radius-sm);
            margin-bottom: var(--space-xs);
            font-size: 0.85rem;
          ">
            <span style="color: var(--color-text-primary);">${stat}</span>
            <span style="color: var(--color-accent-cyan); font-weight: 700;">+${rolls}</span>
          </div>
        `).join('')}
      </div>
      
      <!-- Total Rolls -->
      <div style="
        margin-top: var(--space-md);
        padding-top: var(--space-md);
        border-top: 1px solid var(--color-border);
        color: var(--color-text-secondary);
        font-size: 0.85rem;
        text-align: center;
      ">
        Total Rolls: <span style="color: var(--color-text-primary); font-weight: 700;">
          ${disc.subStats.reduce((sum, [_, rolls]) => sum + rolls, 0)}
        </span>
      </div>
    </div>
  `;
}

// ================================
// DISC FORM
// ================================

function openDiscForm(disc = null) {
  import('../components/discForm.js').then(module => {
    module.openDiscForm(disc);
  });
}

// ================================
// EVENT LISTENERS
// ================================

function attachEventListeners() {
  // Search input
  const searchInput = document.getElementById('disc-search');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      filters.search = e.target.value;
      renderDiscsPage(document.getElementById('app'));
    });
  }
  
  // Set filter
  const setFilter = document.getElementById('filter-set');
  if (setFilter) {
    setFilter.addEventListener('change', (e) => {
      filters.setId = e.target.value;
      renderDiscsPage(document.getElementById('app'));
    });
  }
  
  // Slot filter
  const slotFilter = document.getElementById('filter-slot');
  if (slotFilter) {
    slotFilter.addEventListener('change', (e) => {
      filters.slot = e.target.value;
      renderDiscsPage(document.getElementById('app'));
    });
  }
  
  // Equipped status filter
  const equippedFilter = document.getElementById('filter-equipped');
  if (equippedFilter) {
    equippedFilter.addEventListener('change', (e) => {
      filters.equippedStatus = e.target.value;
      renderDiscsPage(document.getElementById('app'));
    });
  }
  
  // Clear filters button
  const clearFiltersBtn = document.getElementById('clear-filters-btn');
  if (clearFiltersBtn) {
    clearFiltersBtn.addEventListener('click', () => {
      filters = {
        search: '',
        setId: 'all',
        slot: 'all',
        equippedStatus: 'all'
      };
      renderDiscsPage(document.getElementById('app'));
    });
  }
  
  // Add disc button
  const addDiscBtn = document.getElementById('add-disc-btn');
  if (addDiscBtn) {
    addDiscBtn.addEventListener('click', () => openDiscForm());
  }
  
  // Compare disc buttons
  document.querySelectorAll('.btn-compare-disc').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const discId = btn.dataset.discId;
      toggleComparison(discId);
    });
  });
  
  // Edit disc buttons
  document.querySelectorAll('.btn-edit-disc').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const discId = btn.dataset.discId;
      const disc = getAllDiscs().find(d => d.id === discId);
      openDiscForm(disc);
    });
  });
  
  // Delete disc buttons
  document.querySelectorAll('.btn-delete-disc').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      e.stopPropagation();
      const discId = btn.dataset.discId;
      await handleDeleteDisc(discId);
    });
  });
  
  // Clear comparison button
  const clearComparisonBtn = document.getElementById('clear-comparison-btn');
  if (clearComparisonBtn) {
    clearComparisonBtn.addEventListener('click', () => {
      comparisonDiscs = [];
      renderDiscsPage(document.getElementById('app'));
      showToast('Comparison cleared', 'info');
    });
  }
  
  // Close comparison button
  const closeComparisonBtn = document.getElementById('close-comparison-btn');
  if (closeComparisonBtn) {
    closeComparisonBtn.addEventListener('click', () => {
      comparisonDiscs = [];
      renderDiscsPage(document.getElementById('app'));
    });
  }
  
  // Remove from comparison buttons
  document.querySelectorAll('.btn-remove-comparison').forEach(btn => {
    btn.addEventListener('click', () => {
      const discId = btn.dataset.discId;
      comparisonDiscs = comparisonDiscs.filter(id => id !== discId);
      renderDiscsPage(document.getElementById('app'));
    });
  });
}

// ================================
// COMPARISON MANAGEMENT
// ================================

function toggleComparison(discId) {
  const index = comparisonDiscs.indexOf(discId);
  
  if (index >= 0) {
    // Remove from comparison
    comparisonDiscs.splice(index, 1);
    showToast('Removed from comparison', 'info');
  } else {
    // Add to comparison
    if (comparisonDiscs.length >= MAX_COMPARISON_DISCS) {
      showToast(`Maximum ${MAX_COMPARISON_DISCS} discs can be compared`, 'warning');
      return;
    }
    comparisonDiscs.push(discId);
    showToast('Added to comparison', 'success');
  }
  
  renderDiscsPage(document.getElementById('app'));
}

// ================================
// DELETE DISC
// ================================

async function handleDeleteDisc(discId) {
  const disc = getAllDiscs().find(d => d.id === discId);
  if (!disc) return;
  
  const character = disc.equippedBy ? getCharacterById(disc.equippedBy) : null;
  
  const confirmed = await confirmDialog({
    title: 'Delete Disc',
    message: `Are you sure you want to delete this <strong>${getDiscSetName(disc)}</strong> disc?${
      character ? `<br><br>It will be unequipped from <strong>${character.name}</strong>.` : ''
    }`,
    confirmText: 'Delete',
    danger: true
  });
  
  if (confirmed) {
    deleteDisc(discId);
    
    // Remove from comparison if present
    comparisonDiscs = comparisonDiscs.filter(id => id !== discId);
    
    showToast('Disc deleted successfully', 'success');
    renderDiscsPage(document.getElementById('app'));
  }
}

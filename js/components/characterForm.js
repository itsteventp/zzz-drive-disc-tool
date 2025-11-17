// ================================
// CHARACTER FORM COMPONENT
// ================================

import { createCharacter, validateCharacter } from '../models/character.js';
import { saveCharacter } from '../storage/storage.js';
import { createModal, closeModal, showToast } from '../utils/ui.js';
import { get4PieceSets, get2PieceSets, MAIN_STATS_BY_SLOT, SUB_STATS } from '../config/constants.js';

// ================================
// FORM STATE
// ================================

let formData = {
  name: '',
  preferredSet4p: '',
  preferredSet2p: '',
  mainStatPreferences: {
    slot4: [],
    slot5: [],
    slot6: []
  },
  subStatPriority: []
};

let editingCharacter = null;

// ================================
// OPEN FORM
// ================================

export function openCharacterForm(character = null) {
  editingCharacter = character;
  
  if (character) {
    // Edit mode - populate form with existing data
    formData = {
      name: character.name,
      preferredSet4p: character.preferredSet4p || '',
      preferredSet2p: character.preferredSet2p || '',
      mainStatPreferences: { ...character.mainStatPreferences },
      subStatPriority: [...character.subStatPriority]
    };
  } else {
    // Create mode - reset form
    formData = {
      name: '',
      preferredSet4p: '',
      preferredSet2p: '',
      mainStatPreferences: {
        slot4: [],
        slot5: [],
        slot6: []
      },
      subStatPriority: []
    };
  }
  
  renderForm();
}

// ================================
// RENDER FORM
// ================================

function renderForm() {
  const formContent = document.createElement('div');
  
  formContent.innerHTML = `
    <form id="character-form" style="display: flex; flex-direction: column; gap: var(--space-lg);">
      
      <!-- Name -->
      <div class="form-group">
        <label class="form-label form-label-required">Character Name</label>
        <input 
          type="text" 
          id="char-name" 
          class="form-input" 
          placeholder="Enter character name"
          value="${formData.name}"
          maxlength="50"
          required
        >
        <span class="form-help">Max 50 characters</span>
      </div>
      
      <!-- Preferred Sets -->
      <div class="form-group">
        <label class="form-label">Preferred 4-Piece Set</label>
        <select id="char-set-4p" class="form-select">
          <option value="">None</option>
          ${get4PieceSets().map(set => `
            <option value="${set.id}" ${formData.preferredSet4p === set.id ? 'selected' : ''}>
              ${set.name}
            </option>
          `).join('')}
        </select>
        <span class="form-help">Optional: Select preferred 4-piece disc set</span>
      </div>
      
      <div class="form-group">
        <label class="form-label">Preferred 2-Piece Set</label>
        <select id="char-set-2p" class="form-select">
          <option value="">None</option>
          ${get2PieceSets().map(set => `
            <option value="${set.id}" ${formData.preferredSet2p === set.id ? 'selected' : ''}>
              ${set.name}
            </option>
          `).join('')}
        </select>
        <span class="form-help">Optional: Select preferred 2-piece disc set</span>
      </div>
      
      <!-- Main Stat Preferences -->
      <div style="
        background: var(--color-bg-tertiary);
        padding: var(--space-lg);
        border-radius: var(--radius-md);
      ">
        <h3 style="color: var(--color-accent-purple); margin-bottom: var(--space-md);">
          Main Stat Preferences
        </h3>
        <p style="color: var(--color-text-secondary); margin-bottom: var(--space-lg); font-size: 0.9rem;">
          Select which main stats are acceptable for each variable slot (4, 5, 6).
        </p>
        
        ${renderMainStatSection('slot4', 'Slot 4', MAIN_STATS_BY_SLOT[4])}
        ${renderMainStatSection('slot5', 'Slot 5', MAIN_STATS_BY_SLOT[5])}
        ${renderMainStatSection('slot6', 'Slot 6', MAIN_STATS_BY_SLOT[6])}
      </div>
      
      <!-- Sub-stat Priority -->
      <div style="
        background: var(--color-bg-tertiary);
        padding: var(--space-lg);
        border-radius: var(--radius-md);
      ">
        <h3 style="color: var(--color-accent-purple); margin-bottom: var(--space-md);">
          Sub-stat Priority
        </h3>
        <p style="color: var(--color-text-secondary); margin-bottom: var(--space-lg); font-size: 0.9rem;">
          Select exactly 4 sub-stats in priority order. Positions 1-2 are high priority (weight 1.0), positions 3-4 are low priority (weight 0.5).
        </p>
        
        <div id="substat-priority-container">
          ${renderSubStatPrioritySelector()}
        </div>
      </div>
      
    </form>
  `;
  
  // Footer buttons
  const footer = document.createElement('div');
  footer.style.cssText = 'display: flex; gap: var(--space-md); justify-content: flex-end;';
  
  const cancelBtn = document.createElement('button');
  cancelBtn.type = 'button';
  cancelBtn.className = 'btn-secondary';
  cancelBtn.textContent = 'Cancel';
  cancelBtn.addEventListener('click', closeModal);
  
  const saveBtn = document.createElement('button');
  saveBtn.type = 'button';
  saveBtn.className = 'btn-primary';
  saveBtn.textContent = editingCharacter ? 'Save Changes' : 'Create Character';
  saveBtn.addEventListener('click', handleSubmit);
  
  footer.appendChild(cancelBtn);
  footer.appendChild(saveBtn);
  
  createModal({
    title: editingCharacter ? 'Edit Character' : 'Create Character',
    content: formContent,
    footer,
    maxWidth: '700px'
  });
  
  attachFormListeners();
}

// ================================
// RENDER MAIN STAT SECTION
// ================================

function renderMainStatSection(slot, label, availableStats) {
  const selected = formData.mainStatPreferences[slot] || [];
  
  return `
    <div class="form-group">
      <label class="form-label">${label} Main Stats</label>
      <div class="checkbox-group" id="mainstat-${slot}">
        ${availableStats.map(stat => `
          <label class="checkbox-label">
            <input 
              type="checkbox" 
              name="mainstat-${slot}" 
              value="${stat}"
              ${selected.includes(stat) ? 'checked' : ''}
            >
            <span>${stat}</span>
          </label>
        `).join('')}
      </div>
    </div>
  `;
}

// ================================
// RENDER SUB-STAT PRIORITY SELECTOR
// ================================

function renderSubStatPrioritySelector() {
  const selectedStats = formData.subStatPriority;
  const availableStats = SUB_STATS.filter(stat => !selectedStats.includes(stat));
  
  return `
    <div style="display: flex; flex-direction: column; gap: var(--space-md);">
      
      <!-- Priority Slots -->
      ${[0, 1, 2, 3].map(index => {
        const stat = selectedStats[index];
        const isHighPriority = index <= 1;
        
        return `
          <div style="
            display: flex;
            align-items: center;
            gap: var(--space-md);
            padding: var(--space-md);
            background: var(--color-bg-secondary);
            border-radius: var(--radius-md);
            border-left: 4px solid ${isHighPriority ? 'var(--color-accent-cyan)' : 'var(--color-accent-purple)'};
          ">
            <div style="
              min-width: 80px;
              font-weight: 700;
              color: ${isHighPriority ? 'var(--color-accent-cyan)' : 'var(--color-accent-purple)'};
            ">
              Priority ${index + 1}
              <div style="font-size: 0.75rem; font-weight: 400; color: var(--color-text-muted);">
                ${isHighPriority ? 'High (1.0x)' : 'Low (0.5x)'}
              </div>
            </div>
            
            <select 
              class="form-select substat-priority-select" 
              data-index="${index}"
              style="flex: 1;"
            >
              <option value="">Select stat...</option>
              ${stat ? `<option value="${stat}" selected>${stat}</option>` : ''}
              ${availableStats.map(s => `<option value="${s}">${s}</option>`).join('')}
            </select>
            
            ${stat ? `
              <button 
                type="button"
                class="btn-remove-substat"
                data-index="${index}"
                style="
                  background: var(--color-error);
                  border: none;
                  padding: var(--space-sm);
                  border-radius: var(--radius-sm);
                  color: white;
                  cursor: pointer;
                  font-size: 0.9rem;
                "
              >✕</button>
            ` : ''}
            
            ${index > 0 && stat ? `
              <button 
                type="button"
                class="btn-move-up"
                data-index="${index}"
                style="
                  background: var(--color-bg-tertiary);
                  border: 1px solid var(--color-border);
                  padding: var(--space-sm);
                  border-radius: var(--radius-sm);
                  color: var(--color-text-primary);
                  cursor: pointer;
                "
                title="Move up"
              >↑</button>
            ` : ''}
            
            ${index < 3 && stat && selectedStats[index + 1] ? `
              <button 
                type="button"
                class="btn-move-down"
                data-index="${index}"
                style="
                  background: var(--color-bg-tertiary);
                  border: 1px solid var(--color-border);
                  padding: var(--space-sm);
                  border-radius: var(--radius-sm);
                  color: var(--color-text-primary);
                  cursor: pointer;
                "
                title="Move down"
              >↓</button>
            ` : ''}
          </div>
        `;
      }).join('')}
      
      ${selectedStats.length < 4 ? `
        <div style="color: var(--color-warning); font-size: 0.9rem;">
          ⚠️ Please select ${4 - selectedStats.length} more stat${4 - selectedStats.length !== 1 ? 's' : ''}
        </div>
      ` : `
        <div style="color: var(--color-success); font-size: 0.9rem;">
          ✅ All priority stats selected
        </div>
      `}
    </div>
  `;
}

// ================================
// ATTACH FORM LISTENERS
// ================================

function attachFormListeners() {
  // Name input
  const nameInput = document.getElementById('char-name');
  if (nameInput) {
    nameInput.addEventListener('input', (e) => {
      formData.name = e.target.value;
    });
  }
  
  // 4-piece set select
  const set4pSelect = document.getElementById('char-set-4p');
  if (set4pSelect) {
    set4pSelect.addEventListener('change', (e) => {
      formData.preferredSet4p = e.target.value || null;
    });
  }
  
  // 2-piece set select
  const set2pSelect = document.getElementById('char-set-2p');
  if (set2pSelect) {
    set2pSelect.addEventListener('change', (e) => {
      formData.preferredSet2p = e.target.value || null;
    });
  }
  
  // Main stat checkboxes
  ['slot4', 'slot5', 'slot6'].forEach(slot => {
    const checkboxes = document.querySelectorAll(`input[name="mainstat-${slot}"]`);
    checkboxes.forEach(checkbox => {
      checkbox.addEventListener('change', (e) => {
        const stat = e.target.value;
        if (e.target.checked) {
          if (!formData.mainStatPreferences[slot].includes(stat)) {
            formData.mainStatPreferences[slot].push(stat);
          }
        } else {
          formData.mainStatPreferences[slot] = formData.mainStatPreferences[slot].filter(s => s !== stat);
        }
      });
    });
  });
  
  // Sub-stat priority selects
  document.querySelectorAll('.substat-priority-select').forEach(select => {
    select.addEventListener('change', (e) => {
      const index = parseInt(e.target.dataset.index);
      const value = e.target.value;
      
      if (value) {
        // Remove from old position if exists
        const oldIndex = formData.subStatPriority.indexOf(value);
        if (oldIndex !== -1 && oldIndex !== index) {
          formData.subStatPriority.splice(oldIndex, 1);
        }
        
        // Set at new position
        formData.subStatPriority[index] = value;
      } else {
        // Clear this position
        formData.subStatPriority[index] = undefined;
      }
      
      // Clean up array (remove undefined)
      formData.subStatPriority = formData.subStatPriority.filter(s => s !== undefined);
      
      // Re-render sub-stat section
      updateSubStatPriorityUI();
    });
  });
  
  // Remove sub-stat buttons
  document.querySelectorAll('.btn-remove-substat').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const index = parseInt(e.target.dataset.index);
      formData.subStatPriority.splice(index, 1);
      updateSubStatPriorityUI();
    });
  });
  
  // Move up buttons
  document.querySelectorAll('.btn-move-up').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const index = parseInt(e.target.dataset.index);
      if (index > 0) {
        // Swap with previous
        const temp = formData.subStatPriority[index];
        formData.subStatPriority[index] = formData.subStatPriority[index - 1];
        formData.subStatPriority[index - 1] = temp;
        updateSubStatPriorityUI();
      }
    });
  });
  
  // Move down buttons
  document.querySelectorAll('.btn-move-down').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const index = parseInt(e.target.dataset.index);
      if (index < formData.subStatPriority.length - 1) {
        // Swap with next
        const temp = formData.subStatPriority[index];
        formData.subStatPriority[index] = formData.subStatPriority[index + 1];
        formData.subStatPriority[index + 1] = temp;
        updateSubStatPriorityUI();
      }
    });
  });
}

// ================================
// UPDATE SUB-STAT PRIORITY UI
// ================================

function updateSubStatPriorityUI() {
  const container = document.getElementById('substat-priority-container');
  if (container) {
    container.innerHTML = renderSubStatPrioritySelector();
    attachFormListeners(); // Re-attach listeners
  }
}

// ================================
// HANDLE SUBMIT
// ================================

function handleSubmit() {
  // Validate
  const errors = [];
  
  if (!formData.name || formData.name.trim().length === 0) {
    errors.push('Character name is required');
  }
  
  if (formData.subStatPriority.length !== 4) {
    errors.push('Must select exactly 4 sub-stat priorities');
  }
  
  if (errors.length > 0) {
    showToast(errors.join('. '), 'error', 5000);
    return;
  }
  
  // Create or update character
  const characterData = {
    name: formData.name.trim(),
    preferredSet4p: formData.preferredSet4p || null,
    preferredSet2p: formData.preferredSet2p || null,
    mainStatPreferences: formData.mainStatPreferences,
    subStatPriority: formData.subStatPriority
  };
  
  if (editingCharacter) {
    // Update existing
    const updated = {
      ...editingCharacter,
      ...characterData,
      updatedAt: new Date().toISOString()
    };
    
    const validation = validateCharacter(updated);
    if (!validation.isValid) {
      showToast(validation.errors.join('. '), 'error', 5000);
      return;
    }
    
    saveCharacter(updated);
    showToast(`${updated.name} updated successfully`, 'success');
  } else {
    // Create new
    const newCharacter = createCharacter(characterData);
    
    const validation = validateCharacter(newCharacter);
    if (!validation.isValid) {
      showToast(validation.errors.join('. '), 'error', 5000);
      return;
    }
    
    saveCharacter(newCharacter);
    showToast(`${newCharacter.name} created successfully`, 'success');
  }
  
  closeModal();
  
  // Refresh the page
  const container = document.getElementById('app');
  if (container) {
    // Import and call renderCharactersPage
    import('../pages/charactersPage.js').then(module => {
      module.renderCharactersPage(container);
    });
  }
}

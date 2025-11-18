// ================================
// DISC FORM COMPONENT (Multi-Step)
// ================================

import { createDisc, validateDisc } from '../models/disc.js';
import { saveDisc } from '../storage/storage.js';
import { createModal, closeModal, showToast } from '../utils/ui.js';
import { DISC_SETS, MAIN_STATS_BY_SLOT, SUB_STATS } from '../config/constants.js';

// ================================
// FORM STATE
// ================================

let currentStep = 1;
const TOTAL_STEPS = 4;

let formData = {
  setId: '',
  slot: 1,
  mainStat: '',
  subStats: [] // Will be array of [statName, rollCount] pairs
};

let editingDisc = null;

// ================================
// OPEN FORM
// ================================

export function openDiscForm(disc = null) {
  editingDisc = disc;
  currentStep = 1;
  
  if (disc) {
    // Edit mode
    formData = {
      setId: disc.setId,
      slot: disc.slot,
      mainStat: disc.mainStat,
      subStats: [...disc.subStats]
    };
  } else {
    // Create mode
    formData = {
      setId: '',
      slot: 1,
      mainStat: '',
      subStats: []
    };
  }
  
  renderForm();
}

// ================================
// RENDER FORM
// ================================

function renderForm() {
  const content = document.createElement('div');
  
  // Progress indicator
  content.innerHTML = `
    <div style="margin-bottom: var(--space-xl);">
      <div style="
        display: flex;
        justify-content: space-between;
        margin-bottom: var(--space-sm);
      ">
        ${[1, 2, 3, 4].map(step => `
          <div style="
            flex: 1;
            height: 4px;
            background: ${step <= currentStep ? 'var(--color-accent-cyan)' : 'var(--color-border)'};
            margin-right: ${step < 4 ? 'var(--space-xs)' : '0'};
            border-radius: 2px;
            transition: all var(--transition-fast);
          "></div>
        `).join('')}
      </div>
      <div style="
        display: flex;
        justify-content: space-between;
        color: var(--color-text-secondary);
        font-size: 0.85rem;
      ">
        <span style="color: ${currentStep === 1 ? 'var(--color-accent-cyan)' : 'inherit'};">1. Set & Slot</span>
        <span style="color: ${currentStep === 2 ? 'var(--color-accent-cyan)' : 'inherit'};">2. Main Stat</span>
        <span style="color: ${currentStep === 3 ? 'var(--color-accent-cyan)' : 'inherit'};">3. Sub-stats</span>
        <span style="color: ${currentStep === 4 ? 'var(--color-accent-cyan)' : 'inherit'};">4. Rolls</span>
      </div>
    </div>
    
    <div id="form-step-content"></div>
  `;
  
  // Footer
  const footer = document.createElement('div');
  footer.style.cssText = 'display: flex; gap: var(--space-md); justify-content: space-between;';
  
  const leftButtons = document.createElement('div');
  leftButtons.style.cssText = 'display: flex; gap: var(--space-md);';
  
  if (currentStep > 1) {
    const backBtn = document.createElement('button');
    backBtn.className = 'btn-secondary';
    backBtn.textContent = '← Back';
    backBtn.addEventListener('click', previousStep);
    leftButtons.appendChild(backBtn);
  }
  
  const rightButtons = document.createElement('div');
  rightButtons.style.cssText = 'display: flex; gap: var(--space-md);';
  
  const cancelBtn = document.createElement('button');
  cancelBtn.className = 'btn-secondary';
  cancelBtn.textContent = 'Cancel';
  cancelBtn.addEventListener('click', closeModal);
  
  const nextBtn = document.createElement('button');
  nextBtn.className = 'btn-primary';
  nextBtn.textContent = currentStep < TOTAL_STEPS ? 'Next →' : (editingDisc ? 'Save Changes' : 'Create Disc');
  nextBtn.id = 'next-btn';
  nextBtn.addEventListener('click', () => {
    if (currentStep < TOTAL_STEPS) {
      nextStep();
    } else {
      handleSubmit();
    }
  });
  
  rightButtons.appendChild(cancelBtn);
  rightButtons.appendChild(nextBtn);
  
  footer.appendChild(leftButtons);
  footer.appendChild(rightButtons);
  
  createModal({
    title: editingDisc ? 'Edit Disc' : 'Create Disc',
    content,
    footer,
    maxWidth: '600px'
  });
  
  renderCurrentStep();
}

// ================================
// RENDER CURRENT STEP
// ================================

function renderCurrentStep() {
  const container = document.getElementById('form-step-content');
  if (!container) return;
  
  container.innerHTML = '';
  
  switch (currentStep) {
    case 1:
      container.appendChild(renderStep1());
      break;
    case 2:
      container.appendChild(renderStep2());
      break;
    case 3:
      container.appendChild(renderStep3());
      break;
    case 4:
      container.appendChild(renderStep4());
      break;
  }
  
  attachStepListeners();
}

// ================================
// STEP 1: SET & SLOT
// ================================

function renderStep1() {
  const step = document.createElement('div');
  
  step.innerHTML = `
    <h3 style="color: var(--color-accent-cyan); margin-bottom: var(--space-lg);">
      Select Disc Set and Slot
    </h3>
    
    <div class="form-group">
      <label class="form-label form-label-required">Disc Set</label>
      <select id="disc-set" class="form-select" required>
        <option value="">Choose a disc set...</option>
        ${Object.values(DISC_SETS).map(set => `
          <option value="${set.id}" ${formData.setId === set.id ? 'selected' : ''}>
            ${set.name}
          </option>
        `).join('')}
      </select>
    </div>
    
    <div class="form-group">
      <label class="form-label form-label-required">Slot Number</label>
      <div style="
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: var(--space-sm);
      ">
        ${[1, 2, 3, 4, 5, 6].map(slot => `
          <button 
            type="button"
            class="slot-select-btn"
            data-slot="${slot}"
            style="
              padding: var(--space-lg);
              border: 2px solid ${formData.slot === slot ? 'var(--color-accent-cyan)' : 'var(--color-border)'};
              background: ${formData.slot === slot ? 'rgba(0, 217, 255, 0.1)' : 'var(--color-bg-tertiary)'};
              color: var(--color-text-primary);
              border-radius: var(--radius-md);
              font-size: 1.5rem;
              font-weight: 700;
              cursor: pointer;
              transition: all var(--transition-fast);
            "
          >${slot}</button>
        `).join('')}
      </div>
      <span class="form-help">Slots 1-3 have fixed main stats, Slots 4-6 have variable main stats</span>
    </div>
  `;
  
  return step;
}

// ================================
// STEP 2: MAIN STAT
// ================================

function renderStep2() {
  const step = document.createElement('div');
  const availableMainStats = MAIN_STATS_BY_SLOT[formData.slot] || [];
  
  step.innerHTML = `
    <h3 style="color: var(--color-accent-cyan); margin-bottom: var(--space-lg);">
      Select Main Stat for Slot ${formData.slot}
    </h3>
    
    ${formData.slot <= 3 ? `
      <div style="
        background: var(--color-bg-tertiary);
        padding: var(--space-lg);
        border-radius: var(--radius-md);
        margin-bottom: var(--space-lg);
        border-left: 4px solid var(--color-accent-cyan);
      ">
        <p style="color: var(--color-text-primary);">
          <strong>Slot ${formData.slot}</strong> has a fixed main stat: <strong>${availableMainStats[0]}</strong>
        </p>
      </div>
    ` : `
      <div style="
        background: var(--color-bg-tertiary);
        padding: var(--space-md);
        border-radius: var(--radius-md);
        margin-bottom: var(--space-lg);
      ">
        <p style="color: var(--color-text-secondary); font-size: 0.9rem;">
          Choose the main stat for this disc. Available options for Slot ${formData.slot}:
        </p>
      </div>
    `}
    
    <div class="form-group">
      <div style="
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: var(--space-md);
      ">
        ${availableMainStats.map(stat => `
          <button 
            type="button"
            class="mainstat-select-btn"
            data-stat="${stat}"
            style="
              padding: var(--space-lg);
              border: 2px solid ${formData.mainStat === stat ? 'var(--color-accent-cyan)' : 'var(--color-border)'};
              background: ${formData.mainStat === stat ? 'rgba(0, 217, 255, 0.1)' : 'var(--color-bg-tertiary)'};
              color: var(--color-text-primary);
              border-radius: var(--radius-md);
              font-weight: 600;
              cursor: pointer;
              transition: all var(--transition-fast);
              text-align: center;
            "
          >${stat}</button>
        `).join('')}
      </div>
    </div>
  `;
  
  // Auto-select if only one option
  if (availableMainStats.length === 1 && !formData.mainStat) {
    formData.mainStat = availableMainStats[0];
  }
  
  return step;
}

// ================================
// STEP 3: SUB-STATS
// ================================

function renderStep3() {
  const step = document.createElement('div');
  
  // Get available sub-stats (exclude main stat)
  const availableSubStats = SUB_STATS.filter(stat => 
    stat !== formData.mainStat && 
    !formData.subStats.some(([s]) => s === stat)
  );
  
  step.innerHTML = `
    <h3 style="color: var(--color-accent-cyan); margin-bottom: var(--space-lg);">
      Select 4 Sub-stats
    </h3>
    
    <div style="
      background: var(--color-bg-tertiary);
      padding: var(--space-md);
      border-radius: var(--radius-md);
      margin-bottom: var(--space-lg);
    ">
      <p style="color: var(--color-text-secondary); font-size: 0.9rem;">
        Select exactly 4 sub-stats. The main stat (${formData.mainStat}) cannot be a sub-stat.
      </p>
    </div>
    
    <!-- Selected Sub-stats -->
    <div style="margin-bottom: var(--space-lg);">
      <label class="form-label">Selected Sub-stats (${formData.subStats.length}/4)</label>
      <div style="
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: var(--space-sm);
        min-height: 100px;
      ">
        ${formData.subStats.length === 0 ? `
          <div style="
            grid-column: 1 / -1;
            text-align: center;
            color: var(--color-text-muted);
            padding: var(--space-xl);
            border: 2px dashed var(--color-border);
            border-radius: var(--radius-md);
          ">
            No sub-stats selected yet
          </div>
        ` : formData.subStats.map(([stat, rolls]) => `
          <div style="
            background: var(--color-accent-cyan);
            color: white;
            padding: var(--space-md);
            border-radius: var(--radius-md);
            display: flex;
            justify-content: space-between;
            align-items: center;
          ">
            <span style="font-weight: 600;">${stat}</span>
            <button 
              type="button"
              class="btn-remove-substat"
              data-stat="${stat}"
              style="
                background: rgba(255, 255, 255, 0.2);
                border: none;
                color: white;
                width: 24px;
                height: 24px;
                border-radius: 50%;
                cursor: pointer;
                font-weight: 700;
              "
            >×</button>
          </div>
        `).join('')}
      </div>
    </div>
    
    <!-- Available Sub-stats -->
    ${formData.subStats.length < 4 ? `
      <div>
        <label class="form-label">Available Sub-stats</label>
        <div style="
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: var(--space-sm);
        ">
          ${availableSubStats.map(stat => `
            <button 
              type="button"
              class="btn-add-substat"
              data-stat="${stat}"
              style="
                padding: var(--space-md);
                border: 1px solid var(--color-border);
                background: var(--color-bg-tertiary);
                color: var(--color-text-primary);
                border-radius: var(--radius-md);
                cursor: pointer;
                transition: all var(--transition-fast);
                font-weight: 500;
              "
            >${stat}</button>
          `).join('')}
        </div>
      </div>
    ` : `
      <div style="
        background: rgba(6, 255, 165, 0.1);
        border: 2px solid var(--color-success);
        padding: var(--space-lg);
        border-radius: var(--radius-md);
        text-align: center;
        color: var(--color-success);
        font-weight: 600;
      ">
        ✓ All 4 sub-stats selected
      </div>
    `}
  `;
  
  return step;
}

// ================================
// STEP 4: ROLL DISTRIBUTION
// ================================

function renderStep4() {
  const step = document.createElement('div');
  
  // If no rolls assigned yet, initialize with minimum (1 each)
  if (formData.subStats.every(([stat, rolls]) => rolls === undefined || rolls === 0)) {
    formData.subStats = formData.subStats.map(([stat]) => [stat, 1]);
  }
  
  const totalRolls = formData.subStats.reduce((sum, [_, rolls]) => sum + (rolls || 0), 0);
  const minRolls = 4;
  const maxRolls = 9;
  
  step.innerHTML = `
    <h3 style="color: var(--color-accent-cyan); margin-bottom: var(--space-lg);">
      Assign Roll Counts
    </h3>
    
    <div style="
      background: var(--color-bg-tertiary);
      padding: var(--space-lg);
      border-radius: var(--radius-md);
      margin-bottom: var(--space-lg);
    ">
      <p style="color: var(--color-text-secondary); font-size: 0.9rem; margin-bottom: var(--space-md);">
        Assign roll counts to each sub-stat. Total rolls must be between ${minRolls} and ${maxRolls}.
      </p>
      <div style="
        background: ${totalRolls >= minRolls && totalRolls <= maxRolls ? 'rgba(6, 255, 165, 0.1)' : 'rgba(255, 182, 39, 0.1)'};
        border: 2px solid ${totalRolls >= minRolls && totalRolls <= maxRolls ? 'var(--color-success)' : 'var(--color-warning)'};
        padding: var(--space-md);
        border-radius: var(--radius-md);
        text-align: center;
      ">
        <span style="color: var(--color-text-secondary);">Total Rolls: </span>
        <span style="
          color: ${totalRolls >= minRolls && totalRolls <= maxRolls ? 'var(--color-success)' : 'var(--color-warning)'};
          font-weight: 700;
          font-size: 1.5rem;
        ">${totalRolls}</span>
        <span style="color: var(--color-text-secondary);"> / ${maxRolls}</span>
      </div>
    </div>
    
    <!-- Roll Sliders -->
    <div style="display: flex; flex-direction: column; gap: var(--space-lg);">
      ${formData.subStats.map(([stat, rolls], index) => `
        <div>
          <div style="
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: var(--space-sm);
          ">
            <label style="color: var(--color-text-primary); font-weight: 600;">${stat}</label>
            <span style="
              background: var(--color-accent-cyan);
              color: white;
              padding: var(--space-xs) var(--space-md);
              border-radius: var(--radius-sm);
              font-weight: 700;
              min-width: 40px;
              text-align: center;
            ">${rolls || 0}</span>
          </div>
          
          <div style="display: flex; align-items: center; gap: var(--space-md);">
            <button 
              type="button"
              class="btn-decrease-rolls"
              data-index="${index}"
              style="
                background: var(--color-bg-tertiary);
                border: 1px solid var(--color-border);
                color: var(--color-text-primary);
                width: 36px;
                height: 36px;
                border-radius: var(--radius-sm);
                cursor: pointer;
                font-size: 1.2rem;
                font-weight: 700;
              "
              ${(rolls || 0) <= 0 ? 'disabled' : ''}
            >−</button>
            
            <input 
              type="range" 
              class="roll-slider"
              data-index="${index}"
              min="0" 
              max="5" 
              value="${rolls || 0}"
              style="
                flex: 1;
                height: 8px;
                border-radius: 4px;
                background: var(--color-bg-tertiary);
                outline: none;
                -webkit-appearance: none;
              "
            >
            
            <button 
              type="button"
              class="btn-increase-rolls"
              data-index="${index}"
              style="
                background: var(--color-bg-tertiary);
                border: 1px solid var(--color-border);
                color: var(--color-text-primary);
                width: 36px;
                height: 36px;
                border-radius: var(--radius-sm);
                cursor: pointer;
                font-size: 1.2rem;
                font-weight: 700;
              "
              ${(rolls || 0) >= 5 ? 'disabled' : ''}
            >+</button>
          </div>
        </div>
      `).join('')}
    </div>
  `;
  
  return step;
}

// ================================
// ATTACH STEP LISTENERS
// ================================

function attachStepListeners() {
  // Step 1: Set & Slot
  const setSelect = document.getElementById('disc-set');
  if (setSelect) {
    setSelect.addEventListener('change', (e) => {
      formData.setId = e.target.value;
    });
  }
  
  document.querySelectorAll('.slot-select-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      formData.slot = parseInt(btn.dataset.slot);
      formData.mainStat = ''; // Reset main stat when slot changes
      renderCurrentStep();
    });
  });
  
  // Step 2: Main Stat
  document.querySelectorAll('.mainstat-select-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      formData.mainStat = btn.dataset.stat;
      renderCurrentStep();
    });
  });
  
  // Step 3: Sub-stats
  document.querySelectorAll('.btn-add-substat').forEach(btn => {
    btn.addEventListener('click', () => {
      const stat = btn.dataset.stat;
      if (formData.subStats.length < 4) {
        formData.subStats.push([stat, 1]); // Initialize with 1 roll
        renderCurrentStep();
      }
    });
  });
  
  document.querySelectorAll('.btn-remove-substat').forEach(btn => {
    btn.addEventListener('click', () => {
      const stat = btn.dataset.stat;
      formData.subStats = formData.subStats.filter(([s]) => s !== stat);
      renderCurrentStep();
    });
  });
  
  // Step 4: Rolls
  document.querySelectorAll('.roll-slider').forEach(slider => {
    slider.addEventListener('input', (e) => {
      const index = parseInt(slider.dataset.index);
      const value = parseInt(e.target.value);
      formData.subStats[index][1] = value;
      renderCurrentStep();
    });
  });
  
  document.querySelectorAll('.btn-decrease-rolls').forEach(btn => {
    btn.addEventListener('click', () => {
      const index = parseInt(btn.dataset.index);
      if (formData.subStats[index][1] > 0) {
        formData.subStats[index][1]--;
        renderCurrentStep();
      }
    });
  });
  
  document.querySelectorAll('.btn-increase-rolls').forEach(btn => {
    btn.addEventListener('click', () => {
      const index = parseInt(btn.dataset.index);
      if (formData.subStats[index][1] < 5) {
        formData.subStats[index][1]++;
        renderCurrentStep();
      }
    });
  });
}

// ================================
// NAVIGATION
// ================================

function previousStep() {
  if (currentStep > 1) {
    currentStep--;
    renderForm();
  }
}

function nextStep() {
  // Validate current step
  const errors = validateCurrentStep();
  
  if (errors.length > 0) {
    showToast(errors.join('. '), 'error', 5000);
    return;
  }
  
  if (currentStep < TOTAL_STEPS) {
    currentStep++;
    renderForm();
  }
}

function validateCurrentStep() {
  const errors = [];
  
  switch (currentStep) {
    case 1:
      if (!formData.setId) {
        errors.push('Please select a disc set');
      }
      if (!formData.slot) {
        errors.push('Please select a slot');
      }
      break;
      
    case 2:
      if (!formData.mainStat) {
        errors.push('Please select a main stat');
      }
      break;
      
    case 3:
      if (formData.subStats.length !== 4) {
        errors.push('Please select exactly 4 sub-stats');
      }
      break;
      
    case 4:
      const totalRolls = formData.subStats.reduce((sum, [_, rolls]) => sum + (rolls || 0), 0);
      if (totalRolls < 4) {
        errors.push('Total rolls must be at least 4');
      }
      if (totalRolls > 9) {
        errors.push('Total rolls cannot exceed 9');
      }
      break;
  }
  
  return errors;
}

// ================================
// SUBMIT
// ================================

function handleSubmit() {
  // Final validation
  const totalRolls = formData.subStats.reduce((sum, [_, rolls]) => sum + (rolls || 0), 0);
  
  if (totalRolls < 4 || totalRolls > 9) {
    showToast(`Total rolls must be between 4 and 9 (current: ${totalRolls})`, 'error');
    return;
  }
  
  // Create or update disc
  const discData = {
    setId: formData.setId,
    slot: formData.slot,
    mainStat: formData.mainStat,
    subStats: formData.subStats
  };
  
  if (editingDisc) {
    // Update existing
    const updated = {
      ...editingDisc,
      ...discData,
      updatedAt: new Date().toISOString()
    };
    
    const validation = validateDisc(updated);
    if (!validation.isValid) {
      showToast(validation.errors.join('. '), 'error', 5000);
      return;
    }
    
    saveDisc(updated);
    showToast('Disc updated successfully', 'success');
  } else {
    // Create new
    const newDisc = createDisc(discData);
    
    const validation = validateDisc(newDisc);
    if (!validation.isValid) {
      showToast(validation.errors.join('. '), 'error', 5000);
      return;
    }
    
    saveDisc(newDisc);
    showToast('Disc created successfully', 'success');
  }
  
  closeModal();
  
  // Refresh the page
  const container = document.getElementById('app');
  if (container) {
    import('../pages/discsPage.js').then(module => {
      module.renderDiscsPage(container);
    });
  }
}

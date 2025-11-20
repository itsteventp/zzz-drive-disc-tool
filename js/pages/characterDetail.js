// ================================
// CHARACTER DETAIL PAGE
// ================================

import { getCharacterById, saveCharacter } from '../storage/storage.js';
import { getAllDiscs, getDiscById, saveDisc } from '../storage/storage.js';
import { 
  getEquippedDiscCount, 
  getActiveSetBonuses, 
  getPreferredSetsDisplay,
  equipDiscToSlot,
  unequipDiscFromSlot
} from '../models/character.js';
import { getDiscSetName, equipToCharacter, unequipDisc } from '../models/disc.js';
import { calculateBuildScore, calculateDiscScore, getGradeForScore } from '../utils/scoring.js';
import { showToast, confirmDialog, createModal, closeModal } from '../utils/ui.js';
import { navigate } from '../main.js';
import { openCharacterForm } from '../components/characterForm.js';

// ================================
// MAIN RENDER FUNCTION
// ================================

export function renderCharacterDetail(container, params) {
  const characterId = params.id;
  const character = getCharacterById(characterId);
  
  if (!character) {
    container.innerHTML = `
      <div style="text-align: center; padding: 3rem;">
        <h2 style="color: var(--color-error);">Character Not Found</h2>
        <p style="color: var(--color-text-secondary); margin: var(--space-lg) 0;">
          The character you're looking for doesn't exist.
        </p>
        <button onclick="window.location.hash = '/'" class="btn-primary">
          ← Back to Characters
        </button>
      </div>
    `;
    return;
  }
  
  const allDiscs = getAllDiscs();
  const buildScore = calculateBuildScore(character, allDiscs);
  const equippedCount = getEquippedDiscCount(character);
  const activeBonuses = getActiveSetBonuses(character, allDiscs);
  
  container.innerHTML = '';
  
  // Create page layout
  const page = document.createElement('div');
  page.style.cssText = `
    display: grid;
    grid-template-columns: 300px 1fr 300px;
    gap: var(--space-xl);
    align-items: start;
  `;
  
  // Left sidebar - Character info
  const leftSidebar = createCharacterInfoPanel(character, buildScore, equippedCount);
  
  // Center - Equipment slots
  const centerPanel = createEquipmentPanel(character, allDiscs);
  
  // Right sidebar - Build analysis
  const rightSidebar = createBuildAnalysisPanel(character, allDiscs, buildScore, activeBonuses);
  
  page.appendChild(leftSidebar);
  page.appendChild(centerPanel);
  page.appendChild(rightSidebar);
  
  container.appendChild(page);
  
  // Add responsive styles
  addResponsiveStyles(container);
}

// ================================
// CHARACTER INFO PANEL (LEFT)
// ================================

function createCharacterInfoPanel(character, buildScore, equippedCount) {
  const panel = document.createElement('div');
  panel.className = 'character-info-panel';
  panel.style.cssText = `
    position: sticky;
    top: calc(80px + var(--space-lg));
  `;
  
  panel.innerHTML = `
    <button 
      onclick="window.location.hash = '/'"
      class="btn-secondary"
      style="width: 100%; margin-bottom: var(--space-lg);"
    >
      ← Back to Characters
    </button>
    
    <div style="
      background: var(--color-bg-secondary);
      border-radius: var(--radius-lg);
      padding: var(--space-xl);
      border-left: 4px solid ${buildScore.grade.color};
    ">
      <!-- Character Name -->
      <h1 style="
        color: var(--color-text-primary);
        margin-bottom: var(--space-md);
        font-size: 1.8rem;
      ">${character.name}</h1>
      
      <!-- Build Grade -->
      <div style="
        background: ${buildScore.grade.color};
        color: white;
        padding: var(--space-lg);
        border-radius: var(--radius-md);
        text-align: center;
        margin-bottom: var(--space-lg);
      ">
        <div style="font-size: 3rem; font-weight: 700; line-height: 1;">
          ${buildScore.grade.letter}
        </div>
        <div style="font-size: 0.9rem; margin-top: var(--space-xs); opacity: 0.9;">
          ${buildScore.grade.label}
        </div>
      </div>
      
      <!-- Stats -->
      <div style="margin-bottom: var(--space-lg);">
        <div style="
          display: flex;
          justify-content: space-between;
          padding: var(--space-md);
          background: var(--color-bg-tertiary);
          border-radius: var(--radius-md);
          margin-bottom: var(--space-sm);
        ">
          <span style="color: var(--color-text-secondary);">Avg Score:</span>
          <span style="color: var(--color-text-primary); font-weight: 700;">
            ${buildScore.averageScore.toFixed(2)}
          </span>
        </div>
        
        <div style="
          display: flex;
          justify-content: space-between;
          padding: var(--space-md);
          background: var(--color-bg-tertiary);
          border-radius: var(--radius-md);
        ">
          <span style="color: var(--color-text-secondary);">Equipped:</span>
          <span style="color: ${equippedCount === 6 ? 'var(--color-success)' : 'var(--color-text-primary)'}; font-weight: 700;">
            ${equippedCount}/6
          </span>
        </div>
      </div>
      
      <!-- Preferred Sets -->
      <div style="margin-bottom: var(--space-lg);">
        <h3 style="
          color: var(--color-accent-purple);
          font-size: 0.9rem;
          text-transform: uppercase;
          margin-bottom: var(--space-sm);
        ">Preferred Sets</h3>
        <div style="color: var(--color-text-primary);">
          ${getPreferredSetsDisplay(character)}
        </div>
      </div>
      
      <!-- Sub-stat Priority -->
      <div style="margin-bottom: var(--space-lg);">
        <h3 style="
          color: var(--color-accent-purple);
          font-size: 0.9rem;
          text-transform: uppercase;
          margin-bottom: var(--space-sm);
        ">Sub-stat Priority</h3>
        ${character.subStatPriority.map((stat, i) => `
          <div style="
            display: flex;
            align-items: center;
            gap: var(--space-sm);
            padding: var(--space-sm);
            background: ${i <= 1 ? 'rgba(0, 217, 255, 0.1)' : 'rgba(157, 78, 221, 0.1)'};
            border-radius: var(--radius-sm);
            margin-bottom: var(--space-xs);
          ">
            <span style="
              color: ${i <= 1 ? 'var(--color-accent-cyan)' : 'var(--color-accent-purple)'};
              font-weight: 700;
              min-width: 20px;
            ">${i + 1}.</span>
            <span style="color: var(--color-text-primary);">${stat}</span>
            <span style="
              margin-left: auto;
              color: var(--color-text-muted);
              font-size: 0.75rem;
            ">${i <= 1 ? '×1.0' : '×0.5'}</span>
          </div>
        `).join('')}
      </div>
      
      <!-- Actions -->
      <button 
        id="edit-character-btn"
        class="btn-primary"
        style="width: 100%; margin-bottom: var(--space-sm);"
      >
        ✏️ Edit Character
      </button>
      
      <button 
        id="delete-character-btn"
        class="btn-danger"
        style="width: 100%;"
      >
        🗑️ Delete Character
      </button>
    </div>
  `;
  
  // Event listeners
  setTimeout(() => {
    const editBtn = document.getElementById('edit-character-btn');
    if (editBtn) {
      editBtn.addEventListener('click', () => {
        import('../components/characterForm.js').then(module => {
          module.openCharacterForm(character);
        }).then(() => {
          // After form closes, refresh the page
          setTimeout(() => {
            const container = document.getElementById('app');
            if (container) {
              renderCharacterDetail(container, { id: character.id });
            }
          }, 100);
        });
      });
    }

    const deleteBtn = document.getElementById('delete-character-btn');
    if (deleteBtn) {
      deleteBtn.addEventListener('click', async () => {
        const confirmed = await confirmDialog({
          title: 'Delete Character',
          message: `Are you sure you want to delete <strong>${character.name}</strong>? This will unequip all their discs.`,
          confirmText: 'Delete',
          danger: true
        });
        
        if (confirmed) {
          import('../storage/storage.js').then(module => {
            module.deleteCharacter(character.id);
            showToast(`${character.name} deleted`, 'success');
            navigate('/');
          });
        }
      });
    }
  }, 0);
  
  return panel;
}

// ================================
// EQUIPMENT PANEL (CENTER)
// ================================

function createEquipmentPanel(character, allDiscs) {
  const panel = document.createElement('div');
  
  panel.innerHTML = `
    <div style="
      background: var(--color-bg-secondary);
      border-radius: var(--radius-lg);
      padding: var(--space-xl);
    ">
      <h2 style="
        color: var(--color-accent-cyan);
        margin-bottom: var(--space-xl);
      ">Equipment</h2>
      
      <div id="disc-slots-grid" style="
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: var(--space-lg);
      ">
        ${[0, 1, 2, 3, 4, 5].map(slotIndex => 
          renderDiscSlot(character, slotIndex, allDiscs)
        ).join('')}
      </div>
    </div>
  `;
  
  // Attach event listeners inmmediately after DOM is added
  requestAnimationFrame(() => {
  attachEquipmentListeners(character, allDiscs);
  });
  
  return panel;
}

// ================================
// RENDER DISC SLOT
// ================================

function renderDiscSlot(character, slotIndex, allDiscs) {
  const discId = character.equippedDiscs[slotIndex];
  const disc = discId ? getDiscById(discId) : null;
  const slotNumber = slotIndex + 1;
  
  if (!disc) {
    // Empty slot
    return `
      <div class="disc-slot empty" data-slot="${slotIndex}" style="
        background: var(--color-bg-tertiary);
        border: 2px dashed var(--color-border);
        border-radius: var(--radius-lg);
        padding: var(--space-lg);
        text-align: center;
        cursor: pointer;
        transition: all var(--transition-fast);
        min-height: 180px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
      ">
        <div style="font-size: 2rem; margin-bottom: var(--space-md); opacity: 0.5;">
          ${slotNumber}
        </div>
        <div style="color: var(--color-text-muted); margin-bottom: var(--space-md);">
          Slot ${slotNumber} Empty
        </div>
        <button class="btn-equip-disc btn-small btn-primary" data-slot="${slotIndex}">
          + Equip Disc
        </button>
      </div>
    `;
  }
  
  // Equipped disc
  const score = calculateDiscScore(disc, character);
  const grade = getGradeForScore(score);
  
  return `
    <div class="disc-slot equipped" data-slot="${slotIndex}" style="
      background: var(--color-bg-tertiary);
      border: 2px solid ${grade.color};
      border-radius: var(--radius-lg);
      padding: var(--space-lg);
      transition: all var(--transition-fast);
      position: relative;
    ">
      <!-- Slot Number Badge -->
      <div style="
        position: absolute;
        top: var(--space-sm);
        left: var(--space-sm);
        background: ${grade.color};
        color: white;
        width: 32px;
        height: 32px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 700;
        font-size: 1.1rem;
      ">${slotNumber}</div>
      
      <!-- Grade Badge -->
      <div style="
        position: absolute;
        top: var(--space-sm);
        right: var(--space-sm);
        background: ${grade.color};
        color: white;
        padding: var(--space-xs) var(--space-sm);
        border-radius: var(--radius-sm);
        font-weight: 700;
        font-size: 0.9rem;
      ">${grade.letter}</div>
      
      <!-- Disc Info -->
      <div style="margin-top: var(--space-xl);">
        <div style="
          color: var(--color-text-primary);
          font-weight: 600;
          margin-bottom: var(--space-xs);
          font-size: 0.9rem;
        ">${getDiscSetName(disc)}</div>
        
        <div style="
          color: var(--color-accent-cyan);
          font-size: 1.1rem;
          font-weight: 700;
          margin-bottom: var(--space-md);
        ">${disc.mainStat}</div>
        
        <!-- Sub-stats -->
        <div style="
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: var(--space-xs);
          margin-bottom: var(--space-md);
        ">
          ${disc.subStats.map(([stat, rolls]) => {
            const isPriority = character.subStatPriority.includes(stat);
            return `
              <div style="
                color: ${isPriority ? 'var(--color-accent-cyan)' : 'var(--color-text-muted)'};
                font-size: 0.85rem;
              ">
                ${stat} +${rolls}
              </div>
            `;
          }).join('')}
        </div>
        
        <!-- Score -->
        <div style="
          text-align: center;
          padding: var(--space-sm);
          background: var(--color-bg-secondary);
          border-radius: var(--radius-sm);
          margin-bottom: var(--space-md);
        ">
          <span style="color: var(--color-text-secondary); font-size: 0.8rem;">Score: </span>
          <span style="color: ${grade.color}; font-weight: 700;">${score.toFixed(2)}</span>
        </div>
        
        <!-- Actions -->
        <div style="display: flex; gap: var(--space-sm);">
          <button 
            class="btn-change-disc btn-secondary btn-small" 
            data-slot="${slotIndex}"
            style="
              flex: 1;
              cursor: pointer;
              pointer-events: auto;
              position: relative;
              z-index: 10;
            "
          >
            Change
          </button>
          <button 
            class="btn-unequip-disc btn-danger btn-small" 
            data-slot="${slotIndex}"
            style="
              flex: 1;
              cursor: pointer;
              pointer-events: auto;
              position: relative;
              z-index: 10;
            "
          >
            Unequip
          </button>
        </div>
      </div>
    </div>
  `;
}

// ================================
// BUILD ANALYSIS PANEL (RIGHT)
// ================================

function createBuildAnalysisPanel(character, allDiscs, buildScore, activeBonuses) {
  const panel = document.createElement('div');
  panel.className = 'build-analysis-panel';
  panel.style.cssText = `
    position: sticky;
    top: calc(80px + var(--space-lg));
  `;
  
  panel.innerHTML = `
    <div style="
      background: var(--color-bg-secondary);
      border-radius: var(--radius-lg);
      padding: var(--space-xl);
    ">
      <h3 style="
        color: var(--color-accent-purple);
        margin-bottom: var(--space-lg);
      ">Build Analysis</h3>
      
      <!-- Slot Scores -->
      <div style="margin-bottom: var(--space-xl);">
        <h4 style="
          color: var(--color-text-secondary);
          font-size: 0.9rem;
          text-transform: uppercase;
          margin-bottom: var(--space-md);
        ">Score by Slot</h4>
        
        ${buildScore.slotScores.map(slotScore => {
          const grade = getGradeForScore(slotScore.score);
          return `
            <div style="
              display: flex;
              justify-content: space-between;
              align-items: center;
              padding: var(--space-sm);
              background: var(--color-bg-tertiary);
              border-radius: var(--radius-sm);
              margin-bottom: var(--space-xs);
              border-left: 3px solid ${slotScore.disc ? grade.color : 'var(--color-border)'};
            ">
              <span style="color: var(--color-text-primary);">Slot ${slotScore.slot}</span>
              <span style="
                color: ${slotScore.disc ? grade.color : 'var(--color-text-muted)'};
                font-weight: 700;
              ">
                ${slotScore.disc ? slotScore.score.toFixed(2) : '—'}
              </span>
            </div>
          `;
        }).join('')}
      </div>
      
      <!-- Active Set Bonuses -->
      <div>
        <h4 style="
          color: var(--color-text-secondary);
          font-size: 0.9rem;
          text-transform: uppercase;
          margin-bottom: var(--space-md);
        ">Active Set Bonuses</h4>
        
        ${activeBonuses.length === 0 ? `
          <div style="
            color: var(--color-text-muted);
            text-align: center;
            padding: var(--space-lg);
            font-style: italic;
          ">
            No set bonuses active
          </div>
        ` : activeBonuses.map(bonus => `
          <div style="
            background: var(--color-bg-tertiary);
            padding: var(--space-md);
            border-radius: var(--radius-md);
            margin-bottom: var(--space-sm);
            border-left: 3px solid var(--color-success);
          ">
            <div style="
              color: var(--color-text-primary);
              font-weight: 600;
              margin-bottom: var(--space-xs);
            ">
              ${bonus.setName} (${bonus.pieceCount}pc)
            </div>
            <div style="
              color: var(--color-text-secondary);
              font-size: 0.85rem;
            ">
              ${bonus.bonus}
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
  
  return panel;
}

// ================================
// ATTACH EQUIPMENT LISTENERS
// ================================

function attachEquipmentListeners(character, allDiscs) {
  // Equip disc buttons (empty slots)
  const equipButtons = document.querySelectorAll('.btn-equip-disc');
  console.log('Found equip buttons:', equipButtons.length);
  
  equipButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const slotIndex = parseInt(btn.dataset.slot);
      console.log('Equip clicked for slot:', slotIndex);
      openDiscSelectionModal(character, slotIndex, allDiscs);
    });
  });
  
  // Change disc buttons (equipped slots)
  const changeButtons = document.querySelectorAll('.btn-change-disc');
  console.log('Found change buttons:', changeButtons.length);
  
  changeButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const slotIndex = parseInt(btn.dataset.slot);
      console.log('Change clicked for slot:', slotIndex);
      openDiscSelectionModal(character, slotIndex, allDiscs);
    });
  });
  
  // Unequip disc buttons
  const unequipButtons = document.querySelectorAll('.btn-unequip-disc');
  console.log('Found unequip buttons:', unequipButtons.length);
  
  unequipButtons.forEach(btn => {
    // Ensure button is actually clickable
    btn.style.pointerEvents = 'auto';
    btn.style.cursor = 'pointer';
    
    btn.addEventListener('click', async (e) => {
      e.preventDefault();
      e.stopPropagation();
      const slotIndex = parseInt(btn.dataset.slot);
      console.log('Unequip clicked for slot:', slotIndex);
      await handleUnequipDisc(character, slotIndex);
    });
  });
  
  console.log('All event listeners attached');
}

// ================================
// DISC SELECTION MODAL
// ================================

function openDiscSelectionModal(character, slotIndex, allDiscs) {
  const slotNumber = slotIndex + 1;
  const currentDiscId = character.equippedDiscs[slotIndex];
  
  // Filter available discs
  let availableDiscs = allDiscs.filter(disc => {
    // Must be correct slot
    if (disc.slot !== slotNumber) return false;
    
    // Must be unequipped OR equipped by this character
    if (disc.equippedBy && disc.equippedBy !== character.id) return false;
    
    return true;
  });
  
  // Score and sort discs
  const scoredDiscs = availableDiscs.map(disc => ({
    disc,
    score: calculateDiscScore(disc, character),
    grade: getGradeForScore(calculateDiscScore(disc, character))
  })).sort((a, b) => b.score - a.score);
  
  // Check for preferred main stats
  const preferredMainStats = getPreferredMainStatsForSlot(character, slotNumber);
  
  // Create modal content
  const content = document.createElement('div');
  
  if (scoredDiscs.length === 0) {
    content.innerHTML = `
      <div style="text-align: center; padding: var(--space-2xl); color: var(--color-text-secondary);">
        <div style="font-size: 3rem; margin-bottom: var(--space-lg);">📭</div>
        <p>No available discs for Slot ${slotNumber}</p>
        <p style="font-size: 0.9rem; margin-top: var(--space-md); color: var(--color-text-muted);">
          All Slot ${slotNumber} discs are equipped by other characters.
        </p>
      </div>
    `;
  } else {
    content.innerHTML = `
      <div style="margin-bottom: var(--space-lg); padding: var(--space-md); background: var(--color-bg-tertiary); border-radius: var(--radius-md);">
        <div style="color: var(--color-text-secondary); margin-bottom: var(--space-sm);">
          Showing ${scoredDiscs.length} disc${scoredDiscs.length !== 1 ? 's' : ''} for Slot ${slotNumber}
        </div>
        ${preferredMainStats.length > 0 ? `
          <div style="color: var(--color-text-muted); font-size: 0.85rem;">
            💡 Recommended main stats: ${preferredMainStats.join(', ')}
          </div>
        ` : ''}
      </div>
      
      <div id="disc-selection-list" style="
        max-height: 60vh;
        overflow-y: auto;
        display: flex;
        flex-direction: column;
        gap: var(--space-md);
      ">
        ${scoredDiscs.map(({ disc, score, grade }) => `
          <div 
            class="disc-selection-item" 
            data-disc-id="${disc.id}"
            style="
              background: var(--color-bg-tertiary);
              border: 2px solid ${disc.id === currentDiscId ? 'var(--color-accent-cyan)' : 'var(--color-border)'};
              border-left: 4px solid ${grade.color};
              border-radius: var(--radius-md);
              padding: var(--space-lg);
              cursor: pointer;
              transition: all var(--transition-fast);
              ${disc.id === currentDiscId ? 'box-shadow: 0 0 0 2px rgba(0, 217, 255, 0.3);' : ''}
            "
          >
            <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: var(--space-md);">
              <div style="flex: 1;">
                <div style="
                  color: var(--color-text-primary);
                  font-weight: 600;
                  margin-bottom: var(--space-xs);
                ">
                  ${getDiscSetName(disc)}
                  ${disc.id === currentDiscId ? '<span style="color: var(--color-accent-cyan); font-size: 0.85rem; margin-left: var(--space-sm);">(Currently Equipped)</span>' : ''}
                </div>
                <div style="
                  color: var(--color-accent-cyan);
                  font-size: 1.1rem;
                  font-weight: 700;
                ">
                  ${disc.mainStat}
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
                  ${score.toFixed(2)}
                </div>
              </div>
            </div>
            
            <!-- Sub-stats -->
            <div style="
              display: grid;
              grid-template-columns: repeat(2, 1fr);
              gap: var(--space-xs);
            ">
              ${disc.subStats.map(([stat, rolls]) => {
                const isPriority = character.subStatPriority.includes(stat);
                return `
                  <div style="
                    color: ${isPriority ? 'var(--color-accent-cyan)' : 'var(--color-text-muted)'};
                    font-size: 0.9rem;
                  ">
                    ${stat} +${rolls}
                  </div>
                `;
              }).join('')}
            </div>
          </div>
        `).join('')}
      </div>
    `;
  }
  
  const modal = createModal({
    title: `Select Disc for Slot ${slotNumber}`,
    content,
    maxWidth: '600px'
  });
  
  // Add click listeners to disc items
  if (scoredDiscs.length > 0) {
    setTimeout(() => {
      document.querySelectorAll('.disc-selection-item').forEach(item => {
        item.addEventListener('click', () => {
          const discId = item.dataset.discId;
          handleEquipDisc(character, slotIndex, discId);
        });
        
        // Hover effect
        item.addEventListener('mouseenter', () => {
          item.style.transform = 'translateX(4px)';
          item.style.borderColor = 'var(--color-accent-cyan)';
        });
        
        item.addEventListener('mouseleave', () => {
          const discId = item.dataset.discId;
          item.style.transform = 'translateX(0)';
          item.style.borderColor = discId === currentDiscId ? 'var(--color-accent-cyan)' : 'var(--color-border)';
        });
      });
    }, 0);
  }
}

// ================================
// HELPER: GET PREFERRED MAIN STATS FOR SLOT
// ================================

function getPreferredMainStatsForSlot(character, slotNumber) {
  const slotKey = `slot${slotNumber}`;
  return character.mainStatPreferences[slotKey] || [];
}

// ================================
// HANDLE EQUIP DISC
// ================================

async function handleEquipDisc(character, slotIndex, newDiscId) {
  const oldDiscId = character.equippedDiscs[slotIndex];
  const newDisc = getDiscById(newDiscId);
  
  if (!newDisc) {
    showToast('Disc not found', 'error');
    return;
  }
  
  // Check if disc is equipped by another character
  if (newDisc.equippedBy && newDisc.equippedBy !== character.id) {
    const otherCharacter = getCharacterById(newDisc.equippedBy);
    if (otherCharacter) {
      const confirmed = await confirmDialog({
        title: 'Disc Already Equipped',
        message: `This disc is currently equipped by <strong>${otherCharacter.name}</strong>. Do you want to move it to <strong>${character.name}</strong>?`,
        confirmText: 'Move Disc',
        cancelText: 'Cancel'
      });
      
      if (!confirmed) {
        return;
      }
      
      // Unequip from other character
      const otherSlotIndex = otherCharacter.equippedDiscs.findIndex(id => id === newDiscId);
      if (otherSlotIndex !== -1) {
        const updatedOther = unequipDiscFromSlot(otherCharacter, otherSlotIndex);
        saveCharacter(updatedOther);
      }
    }
  }
  
  // Unequip old disc if exists
  if (oldDiscId) {
    const oldDisc = getDiscById(oldDiscId);
    if (oldDisc) {
      const unequippedOldDisc = unequipDisc(oldDisc);
      saveDisc(unequippedOldDisc);
    }
  }
  
  // Equip new disc to character
  const updatedCharacter = equipDiscToSlot(character, slotIndex, newDiscId);
  saveCharacter(updatedCharacter);
  
  // Update disc's equippedBy
  const equippedNewDisc = equipToCharacter(newDisc, character.id);
  saveDisc(equippedNewDisc);
  
  showToast('Disc equipped successfully', 'success');
  closeModal();
  
  // Refresh the page
  const container = document.getElementById('app');
  if (container) {
    renderCharacterDetail(container, { id: character.id });
  }
}

// ================================
// HANDLE UNEQUIP DISC
// ================================

async function handleUnequipDisc(character, slotIndex) {
  const discId = character.equippedDiscs[slotIndex];
  const disc = getDiscById(discId);
  
  if (!disc) return;
  
  const confirmed = await confirmDialog({
    title: 'Unequip Disc',
    message: `Remove <strong>${getDiscSetName(disc)}</strong> from Slot ${slotIndex + 1}?`,
    confirmText: 'Unequip',
    cancelText: 'Cancel'
  });
  
  if (!confirmed) return;
  
  // Unequip from character
  const updatedCharacter = unequipDiscFromSlot(character, slotIndex);
  saveCharacter(updatedCharacter);
  
  // Update disc
  const unequippedDisc = unequipDisc(disc);
  saveDisc(unequippedDisc);
  
  showToast('Disc unequipped', 'success');
  
  // Refresh the page
  const container = document.getElementById('app');
  if (container) {
    renderCharacterDetail(container, { id: character.id });
  }
}

// ================================
// RESPONSIVE STYLES
// ================================

function addResponsiveStyles(container) {
  const style = document.createElement('style');
  style.textContent = `
    @media (max-width: 1024px) {
      .character-info-panel,
      .build-analysis-panel {
        position: static !important;
      }
      
      ${container.querySelector('div').getAttribute('style')}
      grid-template-columns: 1fr !important;
    }
    
    @media (max-width: 768px) {
      #disc-slots-grid {
        grid-template-columns: 1fr !important;
      }
    }
  `;
  
  container.appendChild(style);
}

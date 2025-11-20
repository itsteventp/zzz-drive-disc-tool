// ================================
// SORTING UTILITIES
// ================================

export const SORT_OPTIONS = {
  characters: {
    nameAsc: {
      label: 'Name (A-Z)',
      fn: (a, b) => a.name.localeCompare(b.name)
    },
    nameDesc: {
      label: 'Name (Z-A)',
      fn: (a, b) => b.name.localeCompare(a.name)
    },
    equipmentDesc: {
      label: 'Equipment (Most)',
      fn: (a, b) => {
        const countA = a.equippedDiscs.filter(id => id).length;
        const countB = b.equippedDiscs.filter(id => id).length;
        return countB - countA;
      }
    },
    equipmentAsc: {
      label: 'Equipment (Least)',
      fn: (a, b) => {
        const countA = a.equippedDiscs.filter(id => id).length;
        const countB = b.equippedDiscs.filter(id => id).length;
        return countA - countB;
      }
    }
  },
  
  discs: {
    slotAsc: {
      label: 'Slot (1-6)',
      fn: (a, b) => a.slot - b.slot
    },
    slotDesc: {
      label: 'Slot (6-1)',
      fn: (a, b) => b.slot - a.slot
    },
    setAsc: {
      label: 'Set (A-Z)',
      fn: (a, b) => {
        const setA = a.setId || '';
        const setB = b.setId || '';
        return setA.localeCompare(setB);
      }
    },
    setDesc: {
      label: 'Set (Z-A)',
      fn: (a, b) => {
        const setA = a.setId || '';
        const setB = b.setId || '';
        return setB.localeCompare(setA);
      }
    }
  }
};

/**
 * Sort items using a sort key
 */
export function sortItems(items, sortKey, type = 'characters') {
  const sortOptions = SORT_OPTIONS[type];
  if (!sortOptions || !sortOptions[sortKey]) {
    console.warn(`Unknown sort key: ${sortKey}`);
    return items;
  }
  
  return [...items].sort(sortOptions[sortKey].fn);
}

/**
 * Create sort dropdown HTML
 */
export function createSortDropdown(currentSort, type = 'characters') {
  const options = SORT_OPTIONS[type];
  
  return `
    <select id="sort-select" class="form-select" style="margin: 0; min-width: 180px;">
      ${Object.entries(options).map(([key, { label }]) => `
        <option value="${key}" ${currentSort === key ? 'selected' : ''}>
          ${label}
        </option>
      `).join('')}
    </select>
  `;
}

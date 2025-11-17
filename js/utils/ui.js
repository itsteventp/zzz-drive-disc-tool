// ================================
// UI.JS - Reusable UI Components
// ================================

// ================================
// TOAST NOTIFICATIONS
// ================================

export function showToast(message, type = 'info', duration = 3000) {
  const container = document.getElementById('toast-container');
  if (!container) return;
  
  const toast = document.createElement('div');
  toast.className = 'toast';
  
  const colors = {
    success: 'var(--color-success)',
    error: 'var(--color-error)',
    warning: 'var(--color-warning)',
    info: 'var(--color-accent-cyan)'
  };
  
  const icons = {
    success: '✅',
    error: '❌',
    warning: '⚠️',
    info: 'ℹ️'
  };
  
  toast.style.cssText = `
    background: var(--color-bg-secondary);
    color: var(--color-text-primary);
    padding: var(--space-md) var(--space-lg);
    border-radius: var(--radius-md);
    border-left: 4px solid ${colors[type]};
    box-shadow: var(--shadow-lg);
    display: flex;
    align-items: center;
    gap: var(--space-md);
    min-width: 300px;
    max-width: 500px;
    animation: slideIn 0.3s ease;
    margin-bottom: var(--space-sm);
  `;
  
  toast.innerHTML = `
    <span style="font-size: 1.5rem;">${icons[type]}</span>
    <span style="flex: 1;">${message}</span>
    <button onclick="this.parentElement.remove()" style="
      background: none;
      border: none;
      color: var(--color-text-secondary);
      cursor: pointer;
      font-size: 1.2rem;
      padding: 0;
    ">×</button>
  `;
  
  container.appendChild(toast);
  
  // Auto-remove after duration
  if (duration > 0) {
    setTimeout(() => {
      toast.style.animation = 'slideOut 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, duration);
  }
  
  return toast;
}

// ================================
// MODAL SYSTEM
// ================================

let currentModal = null;

export function createModal({ title, content, footer, onClose, maxWidth = '800px' }) {
  const modalRoot = document.getElementById('modal-root');
  if (!modalRoot) return null;
  
  // Close existing modal
  if (currentModal) {
    closeModal();
  }
  
  const backdrop = document.createElement('div');
  backdrop.className = 'modal-backdrop';
  backdrop.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.8);
    backdrop-filter: blur(4px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    padding: var(--space-lg);
    animation: fadeIn 0.2s ease;
  `;
  
  const modal = document.createElement('div');
  modal.className = 'modal';
  modal.style.cssText = `
    background: var(--color-bg-secondary);
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-lg);
    max-width: ${maxWidth};
    width: 100%;
    max-height: 90vh;
    display: flex;
    flex-direction: column;
    animation: slideUp 0.3s ease;
  `;
  
  // Modal header
  const header = document.createElement('div');
  header.style.cssText = `
    padding: var(--space-lg);
    border-bottom: 1px solid var(--color-border);
    display: flex;
    justify-content: space-between;
    align-items: center;
  `;
  header.innerHTML = `
    <h2 style="color: var(--color-accent-cyan); margin: 0;">${title}</h2>
    <button id="modal-close-btn" style="
      background: none;
      border: none;
      color: var(--color-text-secondary);
      font-size: 2rem;
      cursor: pointer;
      padding: 0;
      width: 32px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: var(--radius-sm);
      transition: all var(--transition-fast);
    ">×</button>
  `;
  
  // Modal body
  const body = document.createElement('div');
  body.className = 'modal-body';
  body.style.cssText = `
    padding: var(--space-lg);
    overflow-y: auto;
    flex: 1;
  `;
  
  if (typeof content === 'string') {
    body.innerHTML = content;
  } else if (content instanceof HTMLElement) {
    body.appendChild(content);
  }
  
  // Modal footer
  const footerEl = document.createElement('div');
  footerEl.style.cssText = `
    padding: var(--space-lg);
    border-top: 1px solid var(--color-border);
    display: flex;
    justify-content: flex-end;
    gap: var(--space-md);
  `;
  
  if (footer) {
    if (typeof footer === 'string') {
      footerEl.innerHTML = footer;
    } else if (footer instanceof HTMLElement) {
      footerEl.appendChild(footer);
    }
  }
  
  modal.appendChild(header);
  modal.appendChild(body);
  if (footer) {
    modal.appendChild(footerEl);
  }
  
  backdrop.appendChild(modal);
  modalRoot.appendChild(backdrop);
  
  // Close handlers
  const closeHandler = () => {
    if (onClose) onClose();
    closeModal();
  };
  
  const closeBtn = header.querySelector('#modal-close-btn');
  closeBtn.addEventListener('click', closeHandler);
  
  backdrop.addEventListener('click', (e) => {
    if (e.target === backdrop) {
      closeHandler();
    }
  });
  
  // ESC key to close
  const escHandler = (e) => {
    if (e.key === 'Escape') {
      closeHandler();
    }
  };
  document.addEventListener('keydown', escHandler);
  
  currentModal = {
    backdrop,
    modal,
    body,
    footer: footerEl,
    close: closeHandler,
    escHandler
  };
  
  return currentModal;
}

export function closeModal() {
  if (!currentModal) return;
  
  document.removeEventListener('keydown', currentModal.escHandler);
  currentModal.backdrop.style.animation = 'fadeOut 0.2s ease';
  
  setTimeout(() => {
    currentModal.backdrop.remove();
    currentModal = null;
  }, 200);
}

export function getModalBody() {
  return currentModal?.body;
}

// ================================
// CONFIRMATION DIALOG
// ================================

export function confirmDialog({ title, message, confirmText = 'Confirm', cancelText = 'Cancel', onConfirm, onCancel, danger = false }) {
  return new Promise((resolve) => {
    const footer = document.createElement('div');
    footer.style.cssText = 'display: flex; gap: var(--space-md);';
    
    const cancelBtn = document.createElement('button');
    cancelBtn.textContent = cancelText;
    cancelBtn.className = 'btn-secondary';
    cancelBtn.style.cssText = `
      padding: var(--space-md) var(--space-lg);
      border-radius: var(--radius-md);
      border: 1px solid var(--color-border);
      background: transparent;
      color: var(--color-text-primary);
      cursor: pointer;
      font-weight: 600;
      transition: all var(--transition-fast);
    `;
    
    const confirmBtn = document.createElement('button');
    confirmBtn.textContent = confirmText;
    confirmBtn.className = 'btn-primary';
    confirmBtn.style.cssText = `
      padding: var(--space-md) var(--space-lg);
      border-radius: var(--radius-md);
      border: none;
      background: ${danger ? 'var(--color-error)' : 'var(--color-accent-cyan)'};
      color: white;
      cursor: pointer;
      font-weight: 600;
      transition: all var(--transition-fast);
    `;
    
    cancelBtn.addEventListener('click', () => {
      if (onCancel) onCancel();
      closeModal();
      resolve(false);
    });
    
    confirmBtn.addEventListener('click', () => {
      if (onConfirm) onConfirm();
      closeModal();
      resolve(true);
    });
    
    footer.appendChild(cancelBtn);
    footer.appendChild(confirmBtn);
    
    createModal({
      title,
      content: `<p style="color: var(--color-text-primary); font-size: 1.1rem; line-height: 1.6;">${message}</p>`,
      footer,
      maxWidth: '500px',
      onClose: () => resolve(false)
    });
  });
}

// ================================
// LOADING SPINNER
// ================================

export function createSpinner() {
  const spinner = document.createElement('div');
  spinner.className = 'spinner';
  spinner.style.cssText = `
    border: 3px solid var(--color-bg-tertiary);
    border-top: 3px solid var(--color-accent-cyan);
    border-radius: 50%;
    width: 40px;
    height: 40px;
    animation: spin 1s linear infinite;
  `;
  return spinner;
}

// ================================
// EMPTY STATE
// ================================

export function createEmptyState({ icon = '📭', title, message, actionText, onAction }) {
  const container = document.createElement('div');
  container.style.cssText = `
    text-align: center;
    padding: var(--space-2xl);
    color: var(--color-text-secondary);
  `;
  
  container.innerHTML = `
    <div style="font-size: 4rem; margin-bottom: var(--space-lg);">${icon}</div>
    <h3 style="color: var(--color-text-primary); margin-bottom: var(--space-md);">${title}</h3>
    <p style="margin-bottom: var(--space-xl);">${message}</p>
  `;
  
  if (actionText && onAction) {
    const btn = document.createElement('button');
    btn.textContent = actionText;
    btn.className = 'btn-primary';
    btn.style.cssText = `
      padding: var(--space-md) var(--space-xl);
      border-radius: var(--radius-md);
      border: none;
      background: var(--color-accent-cyan);
      color: white;
      cursor: pointer;
      font-weight: 600;
      font-size: 1rem;
      transition: all var(--transition-fast);
    `;
    btn.addEventListener('click', onAction);
    container.appendChild(btn);
  }
  
  return container;
}

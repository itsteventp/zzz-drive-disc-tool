// ================================
// CHARACTERS PAGE
// ================================

export function renderCharactersPage(container, params) {
  container.innerHTML = `
    <div>
      <header style="margin-bottom: 2rem;">
        <h1 style="color: var(--color-accent-cyan); margin-bottom: 0.5rem;">
          Characters
        </h1>
        <p style="color: var(--color-text-secondary);">
          Manage your character builds and equipment
        </p>
      </header>
      
      <div style="background: var(--color-bg-secondary); padding: 3rem; border-radius: var(--radius-lg); text-align: center;">
        <p style="color: var(--color-text-secondary); font-size: 1.2rem;">
          🎭 Characters page coming in Phase 3!
        </p>
      </div>
    </div>
  `;
}

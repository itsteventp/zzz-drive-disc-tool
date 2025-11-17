// ================================
// CHARACTER DETAIL PAGE
// ================================

export function renderCharacterDetail(container, params) {
  const characterId = params.id;
  
  container.innerHTML = `
    <div>
      <header style="margin-bottom: 2rem;">
        <a href="#/" style="color: var(--color-accent-cyan); text-decoration: none; display: inline-block; margin-bottom: 1rem;">
          ← Back to Characters
        </a>
        <h1 style="color: var(--color-accent-cyan); margin-bottom: 0.5rem;">
          Character Detail
        </h1>
        <p style="color: var(--color-text-secondary);">
          Character ID: ${characterId}
        </p>
      </header>
      
      <div style="background: var(--color-bg-secondary); padding: 3rem; border-radius: var(--radius-lg); text-align: center;">
        <p style="color: var(--color-text-secondary); font-size: 1.2rem;">
          📋 Character detail page coming in Phase 4!
        </p>
      </div>
    </div>
  `;
}

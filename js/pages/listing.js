import { renderCard, el } from '../render.js';

export function renderListing(data) {
  const categoryId = document.body.dataset.category;
  const grid = document.getElementById('grid');
  const filtersWrap = document.getElementById('filters');
  const meta = document.getElementById('categoryMeta');

  if (!categoryId || !grid) return;

  const category = data.categories.find(c => c.id === categoryId);
  const projects = data.projects
    .filter(p => p.category === categoryId)
    .sort((a, b) => (b.year || 0) - (a.year || 0));

  if (meta) {
    const count = projects.length;
    const tags = (category?.filters || []).join(' • ');
    meta.textContent = `${count} project${count === 1 ? '' : 's'}${tags ? ' — ' + tags : ''}`;
  }

  // Build filter chips from category.filters
  let active = 'all';
  const filters = ['all', ...(category?.filters || [])];

  function apply() {
    const filtered = active === 'all'
      ? projects
      : projects.filter(p => (p.tags || []).includes(active));

    grid.innerHTML = '';
    filtered.forEach(p => grid.append(renderCard(p)));
  }

  if (filtersWrap) {
    filtersWrap.innerHTML = '';
    for (const f of filters) {
      const chip = el('button', {
        class: `chip ${f === active ? 'active' : ''}`,
        onclick: () => {
          active = f;
          [...filtersWrap.querySelectorAll('.chip')].forEach(x => x.classList.remove('active'));
          chip.classList.add('active');
          apply();
        }
      }, [f === 'all' ? 'All' : f]);

      filtersWrap.append(chip);
    }
  }

  apply();
}

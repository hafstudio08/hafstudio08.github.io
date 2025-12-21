import { qs } from './data.js';
import { renderProjectModal } from './render.js';

export function initNav(site) {
  const nav = document.getElementById('nav');
  const brandText = document.getElementById('brandText');
  const navToggle = document.getElementById('navToggle');

  if (brandText && site?.brand?.logoText) brandText.textContent = site.brand.logoText;

  if (nav) {
    nav.innerHTML = '';
    for (const item of site.nav || []) {
      const a = document.createElement('a');
      a.href = item.href;

      // Make category tabs jump straight to grid
      if (item.category && item.href.includes('.html')) {
        a.href = `${item.href}?jump=grid`;
      }

      a.textContent = item.label;

      const here = normalizePath(location.pathname);
      const target = normalizePath(new URL(a.href, location.origin).pathname);
      if (here === target) a.classList.add('active');

      nav.append(a);
    }
  }

  if (navToggle) {
    navToggle.addEventListener('click', () => {
      document.body.classList.toggle('is-nav-open');
    });
  }

  // close nav when clicking a link on mobile
  nav?.addEventListener('click', (e) => {
    if (e.target.closest('a')) document.body.classList.remove('is-nav-open');
  });

  // scroll-jump support (for “no scroll needed”)
  const jump = qs('jump');
  if (jump === 'grid') {
    // allow layout to render first
    requestAnimationFrame(() => {
      const grid = document.getElementById('grid');
      if (grid) grid.scrollIntoView({ behavior: 'instant', block: 'start' });
    });
  }
}

function normalizePath(p) {
  // treat / and /index.html the same
  if (!p) return '/';
  if (p.endsWith('/')) return p;
  if (p.endsWith('/index.html')) return '/';
  return p;
}

export function initFooter(site) {
  const footer = document.getElementById('footer');
  if (!footer) return;

  const left = document.createElement('div');
  left.textContent = `© ${new Date().getFullYear()} ${site?.brand?.name || 'hypeaf.studio'}`;

  const right = document.createElement('div');
  right.style.display = 'flex';
  right.style.gap = '12px';
  right.style.flexWrap = 'wrap';

  for (const s of site.socials || []) {
    const a = document.createElement('a');
    a.href = s.href;
    a.target = '_blank';
    a.rel = 'noreferrer';
    a.textContent = s.label;
    right.append(a);
  }

  footer.innerHTML = '';
  footer.append(left, right);
}

export function initModal(data) {
  const modal = document.getElementById('modal');
  const modalBody = document.getElementById('modalBody');
  if (!modal || !modalBody) return;

  function open(projectId) {
    const project = data.projects.find(p => p.id === projectId);
    if (!project) return;

    modalBody.innerHTML = '';
    modalBody.append(renderProjectModal(project));
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    // update URL (optional)
    const url = new URL(location.href);
    url.searchParams.set('project', projectId);
    history.replaceState({}, '', url.toString());
  }

  function close() {
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    modalBody.innerHTML = '';

    const url = new URL(location.href);
    url.searchParams.delete('project');
    history.replaceState({}, '', url.toString());
  }

  // open via click on any card
  document.addEventListener('click', (e) => {
    const card = e.target.closest('[data-project]');
    if (card) open(card.dataset.project);

    if (e.target.closest('[data-close="1"]')) close();
  });

  // open via Enter key on focused card
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') close();
    if (e.key === 'Enter') {
      const focused = document.activeElement?.closest?.('[data-project]');
      if (focused) open(focused.dataset.project);
    }
  });

  // open if URL has ?project=
  const fromUrl = new URLSearchParams(location.search).get('project');
  if (fromUrl) {
    // wait render first so modal doesn't feel abrupt
    setTimeout(() => open(fromUrl), 80);
  }
}

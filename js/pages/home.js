import { el, renderCard } from '../render.js';

export function renderHome(data) {
  setupHero(data.home?.hero);
  renderFeatured(data);
  renderCategoryTiles(data);
  setupScrollHint();
}

function setupHero(hero) {
  const video = document.getElementById('heroVideo');
  const headline = document.getElementById('heroHeadline');
  const subhead = document.getElementById('heroSubhead');
  const cta = document.getElementById('heroCta');

  if (headline && hero?.headline) headline.textContent = hero.headline;
  if (subhead && hero?.subhead) subhead.textContent = hero.subhead;
  if (cta && hero?.cta?.href) {
    cta.textContent = hero.cta.label || 'Explore';
    cta.href = hero.cta.href;
  }

  if (!video || !hero?.video) return;

  const isMobile = matchMedia('(max-width: 720px)').matches;
  const src = isMobile ? hero.video.mobile : hero.video.desktop;

  video.src = src;
  if (hero.video.poster) video.poster = hero.video.poster;

  // Autoplay best practices: muted + playsinline.
  // Some Safari cases still require user gesture; we attempt play anyway.
  video.addEventListener('loadeddata', () => {
    video.play().catch(() => {});
  });

  // If user taps anywhere, try play again (helps iOS/Safari edge cases)
  document.addEventListener('pointerdown', () => {
    if (video.paused) video.play().catch(() => {});
  }, { once: true });
}

function renderFeatured(data) {
  const wrap = document.getElementById('featuredGrid');
  if (!wrap) return;

  const featuredIds = (data.home?.featured || []).map(x => x.projectId);
  const featured = data.projects.filter(p => featuredIds.includes(p.id));

  wrap.innerHTML = '';
  featured.forEach(p => wrap.append(renderCard(p)));
}

function renderCategoryTiles(data) {
  const row = document.getElementById('categoryRow');
  if (!row) return;

  const tiles = [
    { id: 'design', title: 'Designs', href: 'designs.html?jump=grid' },
    { id: 'photography', title: 'Photography', href: 'photography.html?jump=grid' },
    { id: 'visual-arts', title: 'Visual Arts', href: 'visual-arts.html?jump=grid' }
  ];

  row.innerHTML = '';
  for (const t of tiles) {
    row.append(
      el('a', { class: 'category-tile', href: t.href }, [
        el('div', { class: 'kicker' }, ['Category']),
        el('div', {}, [
          el('div', { class: 'title' }, [t.title]),
          el('div', { class: 'go' }, ['Open →'])
        ])
      ])
    );
  }
}

function setupScrollHint() {
  const btn = document.getElementById('scrollHint');
  const main = document.getElementById('main');
  if (!btn || !main) return;

  btn.addEventListener('click', () => {
    main.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  // hide hint after first scroll
  const onScroll = () => {
    if (window.scrollY > 30) {
      btn.style.opacity = '0';
      btn.style.pointerEvents = 'none';
      window.removeEventListener('scroll', onScroll);
    }
  };
  window.addEventListener('scroll', onScroll, { passive: true });
}

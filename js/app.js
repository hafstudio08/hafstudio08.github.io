import { loadAllData } from './data.js';
import { initNav, initFooter, initModal } from './interactions.js';
import { renderHome } from './pages/home.js';
import { renderListing } from './pages/listing.js';
import { renderAbout } from './pages/about.js';

(async function boot() {
  const data = await loadAllData();

  initNav(data.site);
  initFooter(data.site);
  initModal(data);

  const page = document.body.dataset.page;

  if (page === 'home') renderHome(data);
  if (page === 'listing') renderListing(data);
  if (page === 'about') renderAbout(data);
})();

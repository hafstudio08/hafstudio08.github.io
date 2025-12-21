import { el } from '../render.js';

export function renderAbout(data) {
  const about = document.getElementById('about');
  if (!about) return;

  const email = data.site?.contact?.email || 'hello@hypeaf.studio';

  about.innerHTML = '';
  about.append(
    el('div', { class: 'block-text' }, [
      'hypeaf.studio is a portfolio space for designs, photography, and visual arts.',
      ' ',
      'If you want to collaborate or book a shoot/project, reach out: ',
      email
    ])
  );
}

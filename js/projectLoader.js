const params = new URLSearchParams(window.location.search);
const id = params.get('id');

fetch('data/projects.json')
  .then(res => res.json())
  .then(json => {
    const p = json.projects.find(x => x.id === id);
    if (!p) {
      document.getElementById('projectContent').innerHTML = '<p>Project not found.</p>';
      return;
    }

    let mediaHtml = '';
    if (p.type === 'video') {
      mediaHtml = `<video controls autoplay muted loop playsinline src="${p.media}"></video>`;
    } else if (p.type === 'photo') {
      mediaHtml = p.media.map(src => `<img src="${src}" alt="${p.title}">`).join('');
    }

    document.getElementById('projectContent').innerHTML = `
      <h1>${p.title}</h1>
      <div class="media">${mediaHtml}</div>
      <p>${p.description}</p>
      <p><em>${p.year}</em></p>
      <a href="work.html">← Back to Work</a>
    `;
  });

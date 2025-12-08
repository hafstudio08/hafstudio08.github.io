fetch('data/projects.json')
  .then(res => res.json())
  .then(json => {
    const grid = document.getElementById('projectGrid');
    json.projects.forEach(p => {
      const card = document.createElement('div');
      card.className = 'project-card';
      card.innerHTML = `
        <a href="project.html?id=${p.id}">
          <img src="${p.thumbnail}" alt="${p.title}">
          <div class="overlay"><h3>${p.title}</h3><span>${p.year}</span></div>
        </a>
      `;
      grid.appendChild(card);
    });
  });

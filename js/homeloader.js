fetch("data/homepage.json")
  .then(res => res.json())
  .then(data => {
    document.getElementById("heroTitle").textContent = data.hero.title;
    document.getElementById("heroSubtitle").textContent = data.hero.subtitle;

    const container = document.getElementById("featuredContainer");
    data.featured.forEach(p => {
      container.innerHTML += `
        <a href="project.html?id=${p.id}" class="featured-card">
          <img src="${p.thumbnail}" alt="${p.title}">
          <div class="card-info">
            <h3>${p.title}</h3>
          </div>
        </a>
      `;
    });
  });

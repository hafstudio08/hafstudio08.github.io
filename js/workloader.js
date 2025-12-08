fetch("data/projects.json")
  .then((res) => res.json())
  .then((data) => {
    const container = document.getElementById("workGrid");

    data.projects.forEach((p) => {
      container.innerHTML += `
        <a href="project.html?id=${p.id}" class="work-card fade-in">
          <img src="${p.thumbnail}" alt="${p.title}">
          <div class="work-card-info">
            <h3>${p.title}</h3>
            <span>${p.year}</span>
          </div>
        </a>
      `;
    });
  })
  .catch((err) => console.error("Failed to load projects:", err));

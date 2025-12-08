const params = new URLSearchParams(window.location.search);
const projectId = params.get("id");

fetch("data/projects.json")
  .then((res) => res.json())
  .then((data) => {
    const project = data.projects.find((p) => p.id === projectId);

    if (!project) {
      document.body.innerHTML = "<h2>Project not found.</h2>";
      return;
    }

    // Insert text
    document.getElementById("projectTitle").textContent = project.title;
    document.getElementById("projectYear").textContent = project.year;
    document.getElementById("projectDescription").textContent =
      project.description;

    // Insert media
    const mediaContainer = document.getElementById("projectMedia");

    // For video projects
    if (project.type === "video") {
      mediaContainer.innerHTML = `
        <video controls autoplay muted loop playsinline>
          <source src="${project.media}" type="video/mp4">
        </video>
      `;
    }

    // For photo projects (multiple images)
    if (project.type === "photo") {
      project.media.forEach((img) => {
        mediaContainer.innerHTML += `<img src="${img}" alt="${project.title}">`;
      });
    }
  })
  .catch((err) => console.error("Error loading project:", err));

const cache = new Map();

async function fetchJSON(path) {
  if (cache.has(path)) return cache.get(path);
  const res = await fetch(path, { cache: 'no-store' });
  if (!res.ok) throw new Error(`Failed to load ${path}`);
  const json = await res.json();
  cache.set(path, json);
  return json;
}

export async function loadAllData() {
  const [site, home, categories, projects] = await Promise.all([
    fetchJSON('data/site.json'),
    fetchJSON('data/home.json'),
    fetchJSON('data/categories.json'),
    fetchJSON('data/projects.json')
  ]);

  return { site, home, categories, projects };
}

export function qs(name) {
  return new URLSearchParams(location.search).get(name);
}

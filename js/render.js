export function el(tag, attrs = {}, children = []) {
    const node = document.createElement(tag);
    for (const [k, v] of Object.entries(attrs)) {
      if (k === 'class') node.className = v;
      else if (k.startsWith('on') && typeof v === 'function') node.addEventListener(k.slice(2), v);
      else if (v === true) node.setAttribute(k, '');
      else if (v !== false && v != null) node.setAttribute(k, String(v));
    }
    for (const child of children) {
      node.append(child?.nodeType ? child : document.createTextNode(String(child)));
    }
    return node;
  }
  
  export function renderCard(project) {
    const media = renderPreviewMedia(project);
    media.classList.add('card-media');
  
    const title = el('h3', { class: 'card-title' }, [project.title]);
    const meta = el('div', { class: 'card-meta' }, [`${project.year || ''}`].filter(Boolean));
    const overlay = el('div', { class: 'card-overlay' }, [el('div', {}, [title, meta])]);
  
    const card = el('article', {
      class: 'card',
      'data-project': project.id,
      tabindex: '0',
      role: 'button',
      'aria-label': `Open ${project.title}`
    }, [media, overlay]);
  
    return card;
  }
  
  export function renderPreviewMedia(project) {
    const p = project.preview || { type: 'image', src: project.cover };
  
    if (p.type === 'video') {
      return el('video', {
        src: p.src,
        muted: true,
        loop: true,
        playsinline: true,
        preload: 'metadata',
        poster: p.poster || project.cover
      });
    }
  
    if (p.type === 'gif') {
      return el('img', { src: p.src, alt: project.title, loading: 'lazy' });
    }
  
    return el('img', { src: p.src || project.cover, alt: project.title, loading: 'lazy' });
  }
  
  export function renderProjectModal(project) {
    const head = el('div', { class: 'project-head' }, [
      el('h3', {}, [project.title]),
      project.page?.intro ? el('p', {}, [project.page.intro]) : el('p', {}, [''])
    ]);
  
    const blocksWrap = el('div', { class: 'blocks' });
    for (const block of (project.page?.blocks || [])) {
      blocksWrap.append(renderBlock(block, project.title));
    }
  
    return el('div', {}, [head, blocksWrap]);
  }
  
  function renderBlock(block, title) {
    if (block.type === 'text') {
      return el('div', { class: 'block-text' }, [block.content || '']);
    }
  
    if (block.type === 'image') {
      const img = el('img', { src: block.src, alt: title, loading: 'lazy' });
      return el('div', { class: 'block-media' }, [img]);
    }
  
    if (block.type === 'video') {
      const vid = el('video', {
        src: block.src,
        muted: block.muted !== false,
        loop: block.loop !== false,
        playsinline: true,
        controls: block.controls === true,
        autoplay: block.autoplay === true,
        preload: 'metadata'
      });
      // Best effort: try play (some browsers block without gesture unless muted)
      if (block.muted !== false) vid.addEventListener('loadeddata', () => vid.play().catch(() => {}));
      return el('div', { class: 'block-media' }, [vid]);
    }
  
    return el('div', { class: 'block-text' }, ['Unsupported block']);
  }
  
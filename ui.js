'use strict';

export function getElements() {
  return {
    btnReload: document.getElementById('btnReload'),
    status: document.getElementById('status'),
    error: document.getElementById('error'),
    list: document.getElementById('list'),
    txtSearch: document.getElementById('txtSearch'),
    resultInfo: document.getElementById('resultInfo'),
  };
}

export function setStatus(els, text) {
  els.status.textContent = text ?? '';
}

export function setError(els, message) {
  els.error.textContent = message ?? '';
}

export function setResultInfo(els, text) {
  els.resultInfo.textContent = text ?? '';
}

export function clearList(els) {
  els.list.innerHTML = '';
}

// posts: array
// favoriteIds: Set<number>
// onToggleFavorite: (postId: number) => void
export function renderPosts(els, posts, favoriteIds, onToggleFavorite) {
  clearList(els);

  if (!posts || posts.length === 0) {
    const li = document.createElement('li');
    li.className = 'muted';
    li.textContent = 'Ingen resultater.';
    els.list.appendChild(li);
    return;
  }

  const frag = document.createDocumentFragment();

  for (const p of posts) {
    const li = document.createElement('li');

    const header = document.createElement('div');
    header.style.display = 'flex';
    header.style.gap = '10px';
    header.style.alignItems = 'baseline';

    const favBtn = document.createElement('button');
    favBtn.type = 'button';
    favBtn.setAttribute('aria-label', 'Toggle favorite');
    favBtn.textContent = favoriteIds.has(p.id) ? '⭐' : '☆';
    favBtn.style.border = '1px solid #ddd';
    favBtn.style.background = 'transparent';
    favBtn.style.borderRadius = '8px';
    favBtn.style.padding = '2px 8px';
    favBtn.style.cursor = 'pointer';

    favBtn.addEventListener('click', () => onToggleFavorite(p.id));

    const title = document.createElement('div');
    title.className = 'title';
    title.textContent = `#${p.id}: ${p.title}`;

    header.appendChild(favBtn);
    header.appendChild(title);

    const meta = document.createElement('div');
    meta.className = 'muted';
    meta.textContent = `userId: ${p.userId}`;

    const body = document.createElement('div');
    body.className = 'muted';
    body.textContent = p.body;

    li.appendChild(header);
    li.appendChild(meta);
    li.appendChild(body);
    frag.appendChild(li);
  }

  els.list.appendChild(frag);
}

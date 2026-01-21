'use strict';

import { fetchJson } from './api.js';
import {
  getElements,
  setStatus,
  setError,
  renderPosts,
  setResultInfo,
} from './ui.js';

const LS_KEY = 'content-explorer:favorites';

function loadFavoriteIds() {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return new Set();
    const arr = JSON.parse(raw);
    if (!Array.isArray(arr)) return new Set();
    return new Set(arr.map(Number).filter(Number.isFinite));
  } catch {
    return new Set();
  }
}

function saveFavoriteIds(favoriteIds) {
  const arr = Array.from(favoriteIds.values());
  localStorage.setItem(LS_KEY, JSON.stringify(arr));
}

const API_URL = 'https://jsonplaceholder.typicode.com/posts?_limit=25';

const els = getElements();

let allPosts = [];
let favoriteIds = loadFavoriteIds();

function applyFilter() {
  const q = (els.txtSearch.value ?? '').trim().toLowerCase();

  const filtered =
    q.length === 0
      ? allPosts
      : allPosts.filter(p => (p.title ?? '').toLowerCase().includes(q));

  renderPosts(els, filtered, favoriteIds, toggleFavorite);
  setResultInfo(els, `${filtered.length} / ${allPosts.length} matches`);
}

function debounce(fn, delayMs) {
  let timerId = null;

  return function (...args) {
    if (timerId) {
      clearTimeout(timerId);
    }

    timerId = setTimeout(() => {
      fn.apply(this, args);
    }, delayMs);
  };
}

function toggleFavorite(postId) {
  if (favoriteIds.has(postId)) {
    favoriteIds.delete(postId);
  } else {
    favoriteIds.add(postId);
  }

  saveFavoriteIds(favoriteIds);
  applyFilter(); // re-render så stjernen opdaterer
}

async function load() {
  setError(els, '');
  setStatus(els, 'Loading...');
  setResultInfo(els, '');

  try {
    allPosts = await fetchJson(API_URL);
    setStatus(els, `Loaded ${allPosts.length} posts`);
    applyFilter(); // render med nuværende query
  } catch (err) {
    allPosts = [];
    setStatus(els, '');
    setResultInfo(els, '');
    setError(els, `Kunne ikke hente data: ${err?.message ?? String(err)}`);
    renderPosts(els, []);
  }
}

els.btnReload.addEventListener('click', load);

const debouncedApplyFilter = debounce(applyFilter, 300);
els.txtSearch.addEventListener('input', debouncedApplyFilter);

load();

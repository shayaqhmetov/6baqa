import './style.css';
import type { Work } from './types';
import {
  applyStaticStrings,
  getLang,
  langSwitchHtml,
  t,
  wireLangSwitch,
} from './i18n';

const grid = document.querySelector<HTMLDivElement>('#work-grid');
const countEl = document.querySelector<HTMLParagraphElement>('#work-count');
const langSlot = document.querySelector<HTMLDivElement>('#lang-switch');

const lang = getLang();

/** Minimal HTML escaping for text interpolated into card markup. */
function esc(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function cardMarkup(work: Work, position: number): string {
  // Eager-load the first row (above the fold); lazy-load the rest.
  const loading = position < 3 ? 'eager' : 'lazy';
  const label = `${work.title} — ${work.category}, ${work.year}`;
  return `
    <a class="card" href="./work.html?slug=${encodeURIComponent(work.slug)}" aria-label="${esc(label)}">
      <div class="card-frame">
        <img class="card-poster" src="${esc(work.poster)}" alt="${esc(work.title)}" loading="${loading}" decoding="async">
        <img class="card-preview" src="${esc(work.preview)}" alt="" aria-hidden="true" loading="${loading}" decoding="async">
        <span class="card-index">${esc(work.index)}</span>
      </div>
      <div class="card-head">
        <h2 class="card-title">${esc(work.title)}</h2>
        <span class="card-year">${esc(work.year)}</span>
      </div>
      <p class="card-category">${esc(work.category)}</p>
    </a>`;
}

async function render(): Promise<void> {
  applyStaticStrings(lang);
  if (langSlot) {
    langSlot.innerHTML = langSwitchHtml(lang);
    wireLangSwitch();
  }

  if (!grid) return;
  try {
    const res = await fetch(`/api/works?lang=${lang}`);
    if (!res.ok) throw new Error(`API responded ${res.status}`);
    const works: Work[] = await res.json();

    grid.innerHTML = works.map(cardMarkup).join('');
    grid.removeAttribute('aria-busy');

    if (countEl) {
      countEl.textContent = `${t('meta.count', lang)} — ${String(works.length).padStart(2, '0')}`;
    }
  } catch (err) {
    grid.removeAttribute('aria-busy');
    grid.innerHTML = `<p class="work-error mono">${t('grid.error', lang)}</p>`;
    console.error('[6baqa] failed to load works:', err);
  }
}

void render();

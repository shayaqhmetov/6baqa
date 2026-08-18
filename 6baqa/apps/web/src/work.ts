import './style.css';
import type { Work } from './types';
import {
  applyStaticStrings,
  getLang,
  langSwitchHtml,
  t,
  wireLangSwitch,
} from './i18n';

const root = document.querySelector<HTMLElement>('#work-detail');
const lang = getLang();

function esc(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function detailMarkup(work: Work): string {
  const facts = work.facts
    .map(
      (f) => `
      <div class="fact">
        <p class="fact-label mono">${esc(f.label)}</p>
        <p class="fact-value mono">${esc(f.value)}</p>
      </div>`,
    )
    .join('');

  const socials = work.socials
    .map((s) => `<a class="mono" href="${esc(s.url)}">${esc(s.label)}</a>`)
    .join('');

  const website = work.website
    ? `<a class="wd-site" href="${esc(work.website.url)}">${esc(work.website.label)} →</a>`
    : '';

  const r = work.reel;

  return `
    <aside class="wd-info">
      <div class="wd-info-top">
        <a href="./index.html#top" class="wordmark">6baqa</a>
        <div class="wd-info-top-right">
          ${langSwitchHtml(lang)}
          <a href="./index.html#work" class="wd-back mono">${t('detail.back', lang)}</a>
        </div>
      </div>

      <div class="wd-head">
        <div class="wd-crumbs mono">
          <span>${esc(work.category)}</span><span>·</span><span>${esc(work.year)}</span>
        </div>
        <h1 class="wd-title">${esc(work.title)}</h1>
        <p class="wd-tagline">${esc(work.tagline)}</p>
      </div>

      <div class="wd-facts">${facts}</div>

      <div class="wd-links">
        ${website}
        <div class="wd-socials mono">${socials}</div>
      </div>
    </aside>

    <main class="wd-reel">
      <div class="wd-hero">
        <img src="${esc(r.hero)}" alt="${esc(r.heroLabel)}" decoding="async">
      </div>

      <section class="wd-block wd-text">
        <p class="wd-kicker mono">${t('detail.idea', lang)}</p>
        <p class="wd-lead">${esc(r.idea)}</p>
      </section>

      <div class="wd-block wd-video-wrap">
        <div class="wd-video">
          <img src="${esc(r.video)}" alt="" aria-hidden="true" decoding="async">
          <div class="wd-video-overlay">
            <span class="wd-play">▶</span>
            <span class="mono">${t('detail.addTrailer', lang)}</span>
          </div>
        </div>
        <p class="wd-caption mono">${esc(r.videoCaption)}</p>
      </div>

      <section class="wd-block wd-text">
        <p class="wd-kicker mono">${t('detail.process', lang)}</p>
        <p class="wd-body">${esc(r.process)}</p>
      </section>

      <div class="wd-duo">
        <figure><img src="${esc(r.proc1)}" alt="${esc(r.proc1Label)}" decoding="async"></figure>
        <figure><img src="${esc(r.proc2)}" alt="${esc(r.proc2Label)}" decoding="async"></figure>
      </div>

      <section class="wd-block wd-quote-wrap">
        <p class="wd-quote">“${esc(r.quote)}”</p>
      </section>

      <div class="wd-wide">
        <img src="${esc(r.wide)}" alt="${esc(r.wideLabel)}" decoding="async">
      </div>

      <section class="wd-next">
        <div>
          <p class="wd-kicker mono">${t('detail.next', lang)}</p>
          <a class="wd-next-link" href="./work.html?slug=${encodeURIComponent(work.next.slug)}">${esc(work.next.title)} →</a>
        </div>
        <a class="wd-next-all mono" href="./index.html#work">${t('detail.backAll', lang)}</a>
      </section>
    </main>`;
}

function afterRender(): void {
  applyStaticStrings(lang);
  wireLangSwitch();
}

async function render(): Promise<void> {
  if (!root) return;
  const slug = new URLSearchParams(location.search).get('slug');

  if (!slug) {
    root.removeAttribute('aria-busy');
    root.innerHTML = `<p class="detail-error mono"><a href="./index.html#work">${t('detail.pick', lang)}</a></p>`;
    applyStaticStrings(lang);
    return;
  }

  try {
    const res = await fetch(`/api/works/${encodeURIComponent(slug)}?lang=${lang}`);
    if (res.status === 404) throw new Error('not-found');
    if (!res.ok) throw new Error(`API responded ${res.status}`);
    const work: Work = await res.json();

    document.title = `6baqa — ${work.title}`;
    root.innerHTML = detailMarkup(work);
    root.removeAttribute('aria-busy');
    afterRender();
    window.scrollTo(0, 0);
  } catch (err) {
    root.removeAttribute('aria-busy');
    const msg =
      (err as Error).message === 'not-found'
        ? `${t('detail.notFound', lang)} "${esc(slug)}".`
        : t('detail.error', lang);
    root.innerHTML = `<p class="detail-error mono">${msg} <a href="./index.html#work">${t('detail.back', lang)}</a></p>`;
    applyStaticStrings(lang);
    console.error('[6baqa] failed to load work:', err);
  }
}

void render();

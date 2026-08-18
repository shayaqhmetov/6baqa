export type Lang = 'en' | 'ru';

const KEY = '6baqa.lang';

/** UI strings that live in the frontend (not in the API content). */
const UI: Record<Lang, Record<string, string>> = {
  en: {
    'nav.work': 'Work',
    'nav.info': 'Info',
    'nav.contact': 'Contact',
    'meta.studio': 'Independent game studio — est. 2021',
    'meta.count': 'Selected work',
    'footer.hello': 'Say hello',
    'footer.legal': '© 2026 6baqa — All rights reserved',
    'grid.error': 'Could not load work — is the API running?',
    'detail.back': '← Work',
    'detail.idea': 'Idea',
    'detail.process': 'Process',
    'detail.addTrailer': 'Add gameplay trailer',
    'detail.next': 'Next project',
    'detail.backAll': 'Back to all work',
    'detail.pick': '← Pick a project',
    'detail.error': 'Could not load this project — is the API running?',
    'detail.notFound': 'No project named',
  },
  ru: {
    'nav.work': 'Работы',
    'nav.info': 'Инфо',
    'nav.contact': 'Контакты',
    'meta.studio': 'Независимая игровая студия — с 2021',
    'meta.count': 'Избранные работы',
    'footer.hello': 'Напишите нам',
    'footer.legal': '© 2026 6baqa — Все права защищены',
    'grid.error': 'Не удалось загрузить работы — запущен ли сервер?',
    'detail.back': '← Работы',
    'detail.idea': 'Идея',
    'detail.process': 'Процесс',
    'detail.addTrailer': 'Добавить трейлер',
    'detail.next': 'Следующий проект',
    'detail.backAll': 'Ко всем работам',
    'detail.pick': '← Выберите проект',
    'detail.error': 'Не удалось загрузить проект — запущен ли сервер?',
    'detail.notFound': 'Проект не найден:',
  },
};

export function getLang(): Lang {
  const stored = localStorage.getItem(KEY);
  if (stored === 'ru' || stored === 'en') return stored;
  return (navigator.language || '').toLowerCase().startsWith('ru') ? 'ru' : 'en';
}

export function setLang(lang: Lang): void {
  localStorage.setItem(KEY, lang);
}

export function t(key: string, lang: Lang): string {
  return UI[lang][key] ?? UI.en[key] ?? key;
}

/** Fill every `[data-i18n]` element's text and set <html lang>. */
export function applyStaticStrings(lang: Lang): void {
  document.documentElement.lang = lang;
  document.querySelectorAll<HTMLElement>('[data-i18n]').forEach((el) => {
    const key = el.dataset.i18n;
    if (key) el.textContent = t(key, lang);
  });
}

/** Markup for the EN/RU switch. */
export function langSwitchHtml(current: Lang): string {
  const btn = (l: Lang) =>
    `<button type="button" data-lang="${l}" class="lang-btn${l === current ? ' is-active' : ''}"${
      l === current ? ' aria-current="true"' : ''
    }>${l.toUpperCase()}</button>`;
  return `<div class="lang-switch mono">${btn('en')}<span class="lang-sep">/</span>${btn('ru')}</div>`;
}

/** Wire every `[data-lang]` button to switch language and reload. */
export function wireLangSwitch(): void {
  document.querySelectorAll<HTMLButtonElement>('[data-lang]').forEach((b) => {
    b.addEventListener('click', () => {
      const next = b.dataset.lang as Lang;
      if (next && next !== getLang()) {
        setLang(next);
        location.reload();
      }
    });
  });
}

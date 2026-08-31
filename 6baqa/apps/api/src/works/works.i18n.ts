import { Work, WorkFact, WorkLink, WorkModule, WorkReel } from './work.interface';

export type Lang = 'en' | 'ru';

export function parseLang(value: unknown): Lang {
  return value === 'ru' ? 'ru' : 'en';
}

/** Localizable slice of a Work. Non-text fields (slug, year, images, tags,
 *  website.url, next) are shared across locales and never translated. */
export interface WorkTranslation {
  category: string;
  description: string;
  tagline: string;
  facts: WorkFact[];
  socials: WorkLink[];
  reel: Pick<
    WorkReel,
    | 'heroLabel'
    | 'idea'
    | 'videoCaption'
    | 'process'
    | 'proc1Label'
    | 'proc2Label'
    | 'quote'
    | 'wideLabel'
  >;
  /** Optional. Must mirror the English `modules` order; images are merged
   *  from the English work by position, so translations carry text only. */
  modules?: WorkModule[];
}

/** Russian overrides, keyed by slug. English lives in the catalogue itself. */
const RU: Record<string, WorkTranslation> = {
  '99node': {
    category: 'Конструктор роадмапов',
    description:
      'Личный конструктор роадмапов: создаёте карту и проваливаетесь в любой узел, чтобы построить под-роадмап на любую глубину.',
    tagline:
      'Конструктор роадмапов, где каждый узел раскрывается в собственный роадмап.',
    facts: [
      { label: 'Студия', value: '6baqa' },
      { label: 'Роль', value: 'Дизайн\nFull-stack' },
      { label: 'Платформа', value: 'Веб' },
      { label: 'Стек', value: 'Next.js · PixiJS\nNestJS · Prisma' },
      { label: 'Команда', value: 'Соло' },
      { label: 'Статус', value: 'В разработке' },
    ],
    socials: [
      { label: 'GitHub', url: '#' },
      { label: 'Изменения', url: '#' },
    ],
    reel: {
      heroLabel: 'Обзор карты',
      idea: 'Всё началось с раздражения от плоских линейных роадмапов. Любое настоящее обучение рекурсивно — за каждым шагом прячется свой маленький роадмап. 99node делает это буквальным: вы строите карту, а затем проваливаетесь в любой узел и строите карту внутри него — настолько глубоко, насколько уходит тема.',
      videoCaption: 'Прохождение — провал внутрь узла · 2:10',
      process:
        'Холст — это PixiJS на WebGL в едином фиксированном масштабе: без зума и LOD. Глубина — это навигация, а не увеличение: вы проваливаетесь в собственную плоскость узла и возвращаетесь по хлебным крошкам. ID генерируются на клиенте, поэтому всё дерево работает офлайн.',
      proc1Label: 'Плоскость узла — ранняя',
      proc2Label: 'Плоскость узла — релиз',
      quote:
        'Бесконечного холста нет — каждый узел это отдельный мир, и глубина единственный вход в него.',
      wideLabel: 'Глубокий провал внутрь',
    },
  },
  qurbaqa: {
    category: 'Приложение: финансы и питание',
    description:
      'Личный помощник по финансам и питанию для смартфона под присмотром маленькой пиксельной лягушки.',
    tagline:
      'Деньги и еда в одном месте — под присмотром маленькой пиксельной лягушки.',
    facts: [
      { label: 'Студия', value: '6baqa' },
      { label: 'Роль', value: 'Дизайн\nFull-stack' },
      { label: 'Платформа', value: 'iOS · Android' },
      { label: 'Стек', value: 'React Native\nNestJS · Prisma' },
      { label: 'Команда', value: 'Соло' },
      { label: 'Релиз', value: '2025' },
    ],
    socials: [
      { label: 'App Store', url: '#' },
      { label: 'Google Play', url: '#' },
    ],
    reel: {
      heroLabel: 'Главный экран — сводка дня',
      idea: 'Две привычки, один ритуал. Обычно расходы ведут в одном приложении, а питание в другом — и бросают оба. Qurbaqa сводит их в одну ежедневную отметку, а лягушка-маскот превращает серию дней в игру, а не в повинность.',
      videoCaption: 'Обзор приложения — ежедневная отметка · 1:30',
      process:
        'Монорепозиторий на pnpm: API на NestJS + Prisma поверх PostgreSQL, клиент на React Native (Expo), плюс админка и веб. Авторизация — JWT с bcrypt, мобильные сценарии покрыты end-to-end тестами Maestro.',
      proc1Label: 'Концепт — пиксельная лягушка',
      proc2Label: 'Готовый интерфейс',
      quote: 'Лягушка и есть смысл — трекер, который не страшно открывать.',
      wideLabel: 'Расходы и питание на одной ленте',
    },
    modules: [
      {
        name: 'Финансы',
        tagline:
          'Операции, бюджеты, подписки и аналитика за месяц — все деньги в одном журнале.',
        features: [
          {
            title: 'Умный категоризатор',
            body: 'При импорте Qurbaqa группирует операции по мерчанту и предлагает категорию сразу для всей группы — жмёте 1–9, чтобы назначить, Enter — принять подсказку. Он запоминает выбор: стоит один раз задать категорию мерчанту, и все будущие операции по нему подставляются автоматически, поэтому выписка на сотни строк сжимается до пары решений.',
            imageLabel: 'Импорт — категоризатор предлагает категорию',
          },
        ],
      },
      {
        name: 'Питание',
        tagline:
          'Отмечайте приёмы пищи по дневной норме калорий, следуйте плану питания и держите серию.',
      },
      {
        name: 'Цели',
        tagline:
          'Ставьте цели по накоплениям, пополняйте их с любого баланса и следите за прогрессом по графику.',
      },
      {
        name: 'Здоровье',
        tagline:
          'Синхронизируйте шаги, сон и тренировки с телефона — квесты по активности закрываются сами.',
      },
      {
        name: 'Геймификация',
        tagline:
          'Ежедневные задания дают XP, серии заселяют пруд, а пиксельная лягушка превращает рутину в игру.',
      },
      {
        name: 'Пилар',
        tagline:
          'Встроенный ИИ-помощник читает ваш день и отвечает на вопросы о деньгах, питании и целях.',
      },
    ],
  },
};

/** Return a locale-specific copy of a work. Falls back to English (the
 *  work as authored) when the locale is English or a translation is missing. */
export function localizeWork(work: Work, lang: Lang): Work {
  if (lang === 'en') return work;
  const tr = RU[work.slug];
  if (!tr) return work;
  return {
    ...work,
    category: tr.category,
    description: tr.description,
    tagline: tr.tagline,
    facts: tr.facts,
    socials: tr.socials,
    reel: { ...work.reel, ...tr.reel },
    modules: mergeModules(work.modules, tr.modules),
  };
}

/** Translated module text keeps its own copy but borrows the shared image
 *  paths from the English work, matched by position. */
function mergeModules(
  base: WorkModule[] | undefined,
  tr: WorkModule[] | undefined,
): WorkModule[] | undefined {
  if (!tr) return base;
  return tr.map((m, i) => ({
    ...m,
    features: m.features?.map((f, j) => {
      const src = base?.[i]?.features?.[j];
      return src?.image ? { ...f, image: src.image } : f;
    }),
  }));
}

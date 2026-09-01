import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuthoredWork } from './authored.interface';
import { toWork } from './work.build';
import { Work, WorkReel } from './work.interface';
import { Lang, localizeWork, WorkTranslation } from './works.i18n';

/** Authored reel copy — image URLs are derived from the slug at build time. */
type ReelSeed = Omit<WorkReel, 'hero' | 'video' | 'proc1' | 'proc2' | 'wide'>;

type WorkSeed = Omit<
  Work,
  'index' | 'poster' | 'preview' | 'reel' | 'next'
> & { reel: ReelSeed };

/** Initial catalogue — used only to seed the database on first run
 *  (see prisma/seed.ts). At runtime works are read from Postgres. */
export const CATALOGUE: ReadonlyArray<WorkSeed> = [
  {
    slug: '99node',
    title: '99node',
    category: 'Roadmap Builder',
    year: '2026',
    description:
      'A personal roadmap builder — create a map, then drill into any node to build a sub-roadmap arbitrarily deep.',
    tagline:
      'A roadmap builder where every node opens into a roadmap of its own.',
    tags: ['Next.js 15', 'PixiJS 8', 'NestJS', 'Prisma', 'PostgreSQL', 'Turborepo'],
    facts: [
      { label: 'Studio', value: '6baqa' },
      { label: 'Role', value: 'Design\nFull-stack' },
      { label: 'Platform', value: 'Web' },
      { label: 'Stack', value: 'Next.js · PixiJS\nNestJS · Prisma' },
      { label: 'Team', value: 'Solo' },
      { label: 'Status', value: 'In development' },
    ],
    website: { label: '99node.6baqa.com', url: 'https://99node.6baqa.com' },
    socials: [
      { label: 'GitHub', url: '#' },
      { label: 'Changelog', url: '#' },
    ],
    reel: {
      heroLabel: 'Map overview',
      idea: 'It began as a frustration with flat, linear roadmaps. Learning anything real is recursive — every step hides a smaller roadmap inside it. 99node makes that literal: you build a map, then fall into any node to build the map beneath it, as deep as the topic goes.',
      videoCaption: 'Walkthrough — drilling into a node · 2:10',
      process:
        'The canvas is PixiJS on WebGL at a single fixed scale — no zoom, no level-of-detail. Depth is navigation, not magnification: you drill into a node’s own plane and climb back out by breadcrumb. Client-generated IDs keep the whole tree offline-first.',
      proc1Label: 'Node plane — early',
      proc2Label: 'Node plane — shipped',
      quote:
        'There is no infinite canvas — each node is its own world, and depth is the only way in.',
      wideLabel: 'A deep drill-down',
    },
  },
  {
    slug: 'qurbaqa',
    title: 'Qurbaqa',
    category: 'Finance & Nutrition App',
    year: '2025',
    description:
      'A personal finance and nutrition companion for mobile, watched over by a small pixel frog.',
    tagline: 'Money and meals in one place, kept by a small pixel frog.',
    tags: ['React Native', 'Expo', 'NestJS', 'Prisma', 'PostgreSQL', 'JWT'],
    facts: [
      { label: 'Studio', value: '6baqa' },
      { label: 'Role', value: 'Design\nFull-stack' },
      { label: 'Platform', value: 'iOS · Android' },
      { label: 'Stack', value: 'React Native\nNestJS · Prisma' },
      { label: 'Team', value: 'Solo' },
      { label: 'Released', value: '2025' },
    ],
    website: { label: 'qurbaqa.6baqa.com', url: 'https://qurbaqa.6baqa.com' },
    socials: [
      { label: 'App Store', url: '#' },
      { label: 'Google Play', url: '#' },
    ],
    reel: {
      heroLabel: 'Home — daily overview',
      idea: 'Two habits, one ritual. Most people track spending in one app and eating in another, then quit both. Qurbaqa folds them into a single daily check-in — with a frog mascot that makes the streak feel less like homework.',
      videoCaption: 'App tour — the daily check-in · 1:30',
      process:
        'A pnpm monorepo: a NestJS + Prisma API on PostgreSQL, a React Native (Expo) client, plus admin and web surfaces. Auth is JWT with bcrypt, and the mobile flows are covered end-to-end with Maestro.',
      proc1Label: 'Concept — pixel frog',
      proc2Label: 'Shipped UI',
      quote: 'The frog is the point — a tracker you don’t dread opening.',
      wideLabel: 'Spending and nutrition, one timeline',
    },
    modules: [
      {
        name: 'Finance',
        tagline:
          'Transactions, budgets, subscriptions and monthly analytics — everything money in one ledger.',
        features: [
          {
            title: 'Smart categorizer',
            body: 'On import, Qurbaqa groups raw bank operations by merchant and suggests a category for the whole group — press 1–9 to assign, Enter to accept the hint. It learns as you go: once you categorise a merchant, every future operation from it is pre-filled, so a statement of hundreds of rows collapses into a handful of decisions.',
            image: '/assets/qurbaqa-finance-categorizer.png',
            imageLabel: 'Import — the categorizer suggesting a category',
          },
        ],
      },
      {
        name: 'Nutrition',
        tagline:
          'Log meals against a daily calorie target, follow a meal plan, and keep the streak alive.',
      },
      {
        name: 'Goals',
        tagline:
          'Set savings goals, top them up from any balance, and watch progress track on schedule.',
      },
      {
        name: 'Health',
        tagline:
          'Sync steps, sleep and workouts from the phone so activity quests close themselves.',
      },
      {
        name: 'Gamification',
        tagline:
          'Daily quests award XP, streaks stock the pond, and a pixel frog turns the routine into a game.',
      },
      {
        name: 'Pilar',
        tagline:
          'An in-app AI companion that reads the day and answers questions about your money, meals and goals.',
      },
    ],
  },
];

/** A DB row as stored — the authored content plus row metadata. Prisma types
 *  the JSON columns as `unknown`, so we assert the authored shape here. */
type WorkRow = {
  slug: string;
  order: number;
  title: string;
  category: string;
  year: string;
  description: string;
  tagline: string;
  tags: unknown;
  facts: unknown;
  website: unknown;
  socials: unknown;
  reel: unknown;
  modules: unknown;
  poster: string | null;
  preview: string | null;
  ru: unknown;
};

/** Cast a persisted row into the authored shape the builder expects. */
function rowToAuthored(row: WorkRow): AuthoredWork {
  return {
    slug: row.slug,
    title: row.title,
    category: row.category,
    year: row.year,
    description: row.description,
    tagline: row.tagline,
    tags: (row.tags ?? []) as AuthoredWork['tags'],
    facts: (row.facts ?? []) as AuthoredWork['facts'],
    website: (row.website ?? null) as AuthoredWork['website'],
    socials: (row.socials ?? []) as AuthoredWork['socials'],
    reel: row.reel as AuthoredWork['reel'],
    modules: (row.modules ?? null) as AuthoredWork['modules'],
    poster: row.poster,
    preview: row.preview,
    ru: (row.ru ?? null) as AuthoredWork['ru'],
  };
}

@Injectable()
export class WorksService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(lang: Lang = 'en'): Promise<Work[]> {
    const rows = (await this.prisma.work.findMany({
      orderBy: { order: 'asc' },
    })) as WorkRow[];
    return rows.map((row, i) => this.build(rows, row, i, lang));
  }

  async findOne(slug: string, lang: Lang = 'en'): Promise<Work> {
    const rows = (await this.prisma.work.findMany({
      orderBy: { order: 'asc' },
    })) as WorkRow[];
    const i = rows.findIndex((r) => r.slug === slug);
    if (i === -1) {
      throw new NotFoundException(`No work with slug "${slug}"`);
    }
    return this.build(rows, rows[i], i, lang);
  }

  /** Build + localize a single row within the ordered set (for the "next" link). */
  private build(rows: WorkRow[], row: WorkRow, i: number, lang: Lang): Work {
    const authored = rowToAuthored(row);
    const nextRow = rows[(i + 1) % rows.length];
    const work = toWork(authored, i, {
      slug: nextRow.slug,
      title: nextRow.title,
    });
    return localizeWork(work, authored.ru as WorkTranslation | null, lang);
  }
}

import { Injectable, NotFoundException } from '@nestjs/common';
import { Work, WorkReel } from './work.interface';
import { Lang, localizeWork } from './works.i18n';

/** Authored reel copy — image URLs are derived from the slug at build time. */
type ReelSeed = Omit<WorkReel, 'hero' | 'video' | 'proc1' | 'proc2' | 'wide'>;

type WorkSeed = Omit<
  Work,
  'index' | 'poster' | 'preview' | 'reel' | 'next'
> & { reel: ReelSeed };

/** Source catalogue — order here is the display order on the site. */
const CATALOGUE: ReadonlyArray<WorkSeed> = [
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
    website: { label: 'brainmap.io', url: '#' },
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
    website: { label: 'qurbaqa.app', url: '#' },
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
  },
  {
    slug: 'lumen-drift',
    title: 'Lumen Drift',
    category: 'Atmospheric Platformer',
    year: '2025',
    description:
      'A hand-lit platformer about carrying the last light through a world that forgot the sun.',
    tagline:
      'A hand-painted platformer about carrying the last light through a world that forgot the sun.',
    tags: ['Godot 4', 'Custom lighting', 'Original score'],
    facts: [
      { label: 'Studio', value: '6baqa' },
      { label: 'Role', value: 'Design\nProgramming\nOriginal Score' },
      { label: 'Platforms', value: 'PC · Mac · Switch' },
      { label: 'Engine', value: 'Godot 4' },
      { label: 'Team', value: '3 people' },
      { label: 'Released', value: 'March 2025' },
    ],
    website: { label: 'lumendrift.game', url: '#' },
    socials: [
      { label: 'Steam', url: '#' },
      { label: 'Itch.io', url: '#' },
      { label: 'Press kit', url: '#' },
    ],
    reel: {
      heroLabel: 'Hero key art',
      idea: 'We wanted a game you could finish in a weekend but feel for a year. Lumen Drift started as a jam prototype — one button, one light, a long dark tunnel — and grew into a full studio project without losing that first quiet idea.',
      videoCaption: 'Announce trailer — 1:42',
      process:
        'Players don’t remember mechanics — they remember moments. Every system bends toward a single feeling: the relief of light returning to a room. Movement, sound, and colour all serve that beat; everything else got cut.',
      proc1Label: 'Early sketch',
      proc2Label: 'Final in-game',
      quote:
        'The whole world reacts to your lantern — walk into a dark grove and it wakes.',
      wideLabel: 'Wide screenshot',
    },
  },
  {
    slug: 'paper-kingdoms',
    title: 'Paper Kingdoms',
    category: 'Turn-based Strategy',
    year: '2024',
    description: 'A pop-up-book war for tiny thrones.',
    tagline: 'A pop-up-book war for tiny thrones, folded one province at a time.',
    tags: ['Unity', 'Procedural maps', 'Cross-platform'],
    facts: [
      { label: 'Studio', value: '6baqa' },
      { label: 'Role', value: 'Design\nProgramming' },
      { label: 'Platforms', value: 'PC · Mobile' },
      { label: 'Engine', value: 'Unity' },
      { label: 'Team', value: '4 people' },
      { label: 'Released', value: '2024' },
    ],
    website: { label: 'paperkingdoms.game', url: '#' },
    socials: [
      { label: 'Steam', url: '#' },
      { label: 'Itch.io', url: '#' },
    ],
    reel: {
      heroLabel: 'Hero key art',
      idea: 'Grand strategy is intimidating. We asked what a 4X would feel like if the whole world were made of folded paper — light, tactile, and small enough to hold in your hands.',
      videoCaption: 'Campaign overview · 2:05',
      process:
        'Every province is a paper cut-out that unfolds as you take it. The season system re-shuffles the board four times a year, so no two campaigns fold the same way.',
      proc1Label: 'Paper prototype',
      proc2Label: 'Final in-game',
      quote: 'Fold the terrain, out-think the seasons, take the map.',
      wideLabel: 'The unfolding map',
    },
  },
  {
    slug: 'nocturne',
    title: 'Nocturne',
    category: 'Narrative Horror',
    year: '2024',
    description: 'A single night in a house that remembers.',
    tagline: 'A single night in a house that remembers everything you touch.',
    tags: ['Narrative', 'Branching', 'Voice-acted'],
    facts: [
      { label: 'Studio', value: '6baqa' },
      { label: 'Role', value: 'Design\nWriting' },
      { label: 'Platforms', value: 'PC · Mac' },
      { label: 'Engine', value: 'Godot 4' },
      { label: 'Team', value: '3 people' },
      { label: 'Released', value: '2024' },
    ],
    website: { label: 'nocturne.game', url: '#' },
    socials: [
      { label: 'Steam', url: '#' },
      { label: 'Press kit', url: '#' },
    ],
    reel: {
      heroLabel: 'Hero key art',
      idea: 'Horror leans on jump scares; we wanted dread that accrues. One house, one night, and a memory that keeps score of every light you leave burning.',
      videoCaption: 'Story teaser · 1:18',
      process:
        'The house tracks state room by room. Branches don’t just change dialogue — they change what is waiting for you when you come back through a door you already opened.',
      proc1Label: 'Mood board',
      proc2Label: 'Final in-game',
      quote: 'Every light you leave on costs you something.',
      wideLabel: 'The upstairs hall',
    },
  },
  {
    slug: 'tidewalker',
    title: 'Tidewalker',
    category: 'Exploration / Adventure',
    year: '2023',
    description: 'Chart a drowned archipelago that reshapes itself with the tide.',
    tagline: 'Chart a drowned archipelago that reshapes itself with the tide.',
    tags: ['Open world', 'Dynamic tides', 'Exploration'],
    facts: [
      { label: 'Studio', value: '6baqa' },
      { label: 'Role', value: 'Design\nProgramming' },
      { label: 'Platforms', value: 'PC · Console' },
      { label: 'Engine', value: 'Unity' },
      { label: 'Team', value: '5 people' },
      { label: 'Released', value: '2023' },
    ],
    website: { label: 'tidewalker.game', url: '#' },
    socials: [
      { label: 'Steam', url: '#' },
      { label: 'Itch.io', url: '#' },
    ],
    reel: {
      heroLabel: 'Hero key art',
      idea: 'We loved maps you have to earn. The tide became the whole game: routes open and close twice a day, and the best places only surface when the water pulls back.',
      videoCaption: 'Exploration reel · 2:30',
      process:
        'A single global tide clock drives terrain, currents, and wildlife. Learning to read the water — not the minimap — is the real progression curve.',
      proc1Label: 'Tide study',
      proc2Label: 'Final in-game',
      quote: 'Read the water to find what surfaces only twice a day.',
      wideLabel: 'Low tide over the reef',
    },
  },
  {
    slug: 'signal-lost',
    title: 'Signal Lost',
    category: 'Sci-fi Puzzle',
    year: '2022',
    description: 'Reboot a derelict station one dead circuit at a time.',
    tagline: 'Reboot a derelict station one dead circuit at a time.',
    tags: ['Logic puzzles', 'Sci-fi', 'Atmospheric'],
    facts: [
      { label: 'Studio', value: '6baqa' },
      { label: 'Role', value: 'Design\nProgramming' },
      { label: 'Platforms', value: 'PC · Mobile' },
      { label: 'Engine', value: 'Godot 3' },
      { label: 'Team', value: '2 people' },
      { label: 'Released', value: '2022' },
    ],
    website: { label: 'signallost.game', url: '#' },
    socials: [
      { label: 'Steam', url: '#' },
      { label: 'Itch.io', url: '#' },
    ],
    reel: {
      heroLabel: 'Hero key art',
      idea: 'A puzzle game about listening. The station is dead; the puzzles are the act of bringing its systems back one signal at a time, deciding whose voice you want to hear again.',
      videoCaption: 'Puzzle showcase · 1:55',
      process:
        'Each circuit is a self-contained logic puzzle, but rerouting power to one system starves another — so the whole station is a puzzle stacked on top of the small ones.',
      proc1Label: 'Circuit sketch',
      proc2Label: 'Final in-game',
      quote: 'Reroute the power, decode the static, choose who wakes up.',
      wideLabel: 'The reactor core',
    },
  },
  {
    slug: 'featherfall',
    title: 'Featherfall',
    category: 'Roguelike',
    year: '2021',
    description: 'Fall upward through a collapsing sky.',
    tagline: 'A fast, feather-light roguelike about falling upward through a collapsing sky.',
    tags: ['Roguelike', 'Permadeath', 'Pixel art'],
    facts: [
      { label: 'Studio', value: '6baqa' },
      { label: 'Role', value: 'Design\nProgramming\nPixel art' },
      { label: 'Platforms', value: 'PC' },
      { label: 'Engine', value: 'Godot 3' },
      { label: 'Team', value: 'Solo' },
      { label: 'Released', value: '2021' },
    ],
    website: { label: 'featherfall.game', url: '#' },
    socials: [
      { label: 'Steam', url: '#' },
      { label: 'Itch.io', url: '#' },
    ],
    reel: {
      heroLabel: 'Hero key art',
      idea: 'Our first shipped game, and the studio’s origin. A run-based climb where death is the loop — every fall rebuilds your wings from what the last run broke.',
      videoCaption: 'Launch trailer · 1:12',
      process:
        'Tight, readable pixel art and a two-button moveset. The whole design brief was “a run should fit in a coffee break, and losing should feel like your idea.”',
      proc1Label: 'First sprites',
      proc2Label: 'Final in-game',
      quote: 'Every run rebuilds your wings from what the last one broke.',
      wideLabel: 'The upper spires',
    },
  },
];

function buildReel(slug: string, seed: ReelSeed): WorkReel {
  return {
    ...seed,
    hero: `/assets/${slug}-hero.png`,
    video: `/assets/${slug}-video.png`,
    proc1: `/assets/${slug}-proc1.png`,
    proc2: `/assets/${slug}-proc2.png`,
    wide: `/assets/${slug}-wide.png`,
  };
}

@Injectable()
export class WorksService {
  private readonly works: Work[] = CATALOGUE.map((w, i) => {
    const next = CATALOGUE[(i + 1) % CATALOGUE.length];
    return {
      ...w,
      index: String(i + 1).padStart(2, '0'),
      poster: `/assets/${w.slug}.png`,
      preview: `/assets/${w.slug}-hover.png`,
      reel: buildReel(w.slug, w.reel),
      next: { slug: next.slug, title: next.title },
    };
  });

  findAll(lang: Lang = 'en'): Work[] {
    return this.works.map((w) => localizeWork(w, lang));
  }

  findOne(slug: string, lang: Lang = 'en'): Work {
    const work = this.works.find((w) => w.slug === slug);
    if (!work) {
      throw new NotFoundException(`No work with slug "${slug}"`);
    }
    return localizeWork(work, lang);
  }
}

import { AuthoredWork } from './authored.interface';
import { Work, WorkNext, WorkReel } from './work.interface';

/** Fill the derived, non-authored fields of a Work from its authored content:
 *  the two-digit index, default image paths (when no explicit override is set),
 *  and the "next project" pointer. */
export function toWork(
  authored: AuthoredWork,
  position: number,
  next: WorkNext,
): Work {
  const slug = authored.slug;
  const r = authored.reel;

  const reel: WorkReel = {
    heroLabel: r.heroLabel,
    idea: r.idea,
    videoCaption: r.videoCaption,
    process: r.process,
    proc1Label: r.proc1Label,
    proc2Label: r.proc2Label,
    quote: r.quote,
    wideLabel: r.wideLabel,
    hero: r.hero || `/assets/${slug}-hero.png`,
    video: r.video || `/assets/${slug}-video.png`,
    proc1: r.proc1 || `/assets/${slug}-proc1.png`,
    proc2: r.proc2 || `/assets/${slug}-proc2.png`,
    wide: r.wide || `/assets/${slug}-wide.png`,
  };

  return {
    slug,
    title: authored.title,
    category: authored.category,
    year: authored.year,
    index: String(position + 1).padStart(2, '0'),
    poster: authored.poster || `/assets/${slug}.png`,
    preview: authored.preview || `/assets/${slug}-hover.png`,
    description: authored.description,
    tagline: authored.tagline,
    tags: authored.tags,
    facts: authored.facts,
    website: authored.website ?? undefined,
    socials: authored.socials,
    reel,
    modules: authored.modules ?? undefined,
    next,
  };
}

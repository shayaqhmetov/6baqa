export interface WorkFact {
  label: string;
  /** May contain newlines (rendered as multiple lines). */
  value: string;
}

export interface WorkLink {
  label: string;
  url: string;
}

/** The scrollable, per-project "reel" on the detail page. */
export interface WorkReel {
  hero: string;
  heroLabel: string;
  idea: string;
  video: string;
  videoCaption: string;
  process: string;
  proc1: string;
  proc1Label: string;
  proc2: string;
  proc2Label: string;
  quote: string;
  wide: string;
  wideLabel: string;
}

export interface WorkNext {
  slug: string;
  title: string;
}

export interface Work {
  /** Stable identifier, also the asset filename stem. */
  slug: string;
  title: string;
  category: string;
  year: string;
  /** Two-digit display index, e.g. "01". */
  index: string;
  /** Grid still shown at rest. */
  poster: string;
  /** Grid loop/hover preview. */
  preview: string;
  /** One-line description used on the grid card and detail intro. */
  description: string;
  /** Longer positioning line under the detail title. */
  tagline: string;
  /** Tech / craft tags shown on the grid detail. */
  tags: string[];
  /** Sidebar facts (Studio, Role, Platforms, …). */
  facts: WorkFact[];
  /** Primary outbound link (repo, store, site). */
  website?: WorkLink;
  /** Secondary links (Steam, Itch, App Store, …). */
  socials: WorkLink[];
  /** The scrollable detail reel. */
  reel: WorkReel;
  /** The "next project" link target. */
  next: WorkNext;
}

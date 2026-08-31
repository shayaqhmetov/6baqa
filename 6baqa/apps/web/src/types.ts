/** Shapes returned by the NestJS `/api/works` endpoints. */
export interface WorkFact {
  label: string;
  value: string;
}

export interface WorkLink {
  label: string;
  url: string;
}

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

export interface WorkModuleFeature {
  title: string;
  body: string;
  image?: string;
  imageLabel?: string;
}

export interface WorkModule {
  name: string;
  tagline: string;
  features?: WorkModuleFeature[];
}

export interface WorkNext {
  slug: string;
  title: string;
}

export interface Work {
  slug: string;
  title: string;
  category: string;
  year: string;
  index: string;
  poster: string;
  preview: string;
  description: string;
  tagline: string;
  tags: string[];
  facts: WorkFact[];
  website?: WorkLink;
  socials: WorkLink[];
  reel: WorkReel;
  modules?: WorkModule[];
  next: WorkNext;
}

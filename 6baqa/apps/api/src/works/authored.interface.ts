import {
  WorkFact,
  WorkLink,
  WorkModule,
  WorkReel,
} from './work.interface';
import { WorkTranslation } from './works.i18n';

/** Reel copy as authored/stored. Image URLs are optional overrides — when
 *  omitted they default to `/assets/<slug>-<slot>.png` at build time. */
export type AuthoredReel = Pick<
  WorkReel,
  | 'heroLabel'
  | 'idea'
  | 'videoCaption'
  | 'process'
  | 'proc1Label'
  | 'proc2Label'
  | 'quote'
  | 'wideLabel'
> &
  Partial<Pick<WorkReel, 'hero' | 'video' | 'proc1' | 'proc2' | 'wide'>>;

/** The editable shape of a work — exactly what is stored in the DB and what
 *  the admin panel reads and writes. Derived fields (index, next, default
 *  image paths) are computed at read time and are NOT part of this type. */
export interface AuthoredWork {
  slug: string;
  title: string;
  category: string;
  year: string;
  description: string;
  tagline: string;
  tags: string[];
  facts: WorkFact[];
  website?: WorkLink | null;
  socials: WorkLink[];
  reel: AuthoredReel;
  modules?: WorkModule[] | null;
  /** Optional explicit poster/preview overrides. */
  poster?: string | null;
  preview?: string | null;
  /** Russian overrides. */
  ru?: WorkTranslation | null;
}

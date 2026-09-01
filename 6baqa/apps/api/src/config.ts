import { join } from 'node:path';

/** Directory where uploaded images are stored. On Railway, mount a persistent
 *  volume here (set UPLOADS_DIR to the mount path). */
export const UPLOADS_DIR = process.env.UPLOADS_DIR ?? join(process.cwd(), 'uploads');

/** Public route prefix under which uploads are served. Kept under `/api` so the
 *  web service's nginx `/api/` proxy reaches it too. */
export const UPLOADS_ROUTE = '/api/uploads';

/** Directory containing the static admin UI (served at /admin). */
export const ADMIN_UI_DIR = join(__dirname, '..', 'public', 'admin');

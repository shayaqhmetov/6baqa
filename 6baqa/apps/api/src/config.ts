import { join } from 'node:path';

const env = process.env;

/** Directory where uploads are written in local/disk mode (the fallback when
 *  no S3 bucket is configured). On Railway, prefer a bucket (see S3 below). */
export const UPLOADS_DIR = env.UPLOADS_DIR ?? join(process.cwd(), 'uploads');

/** Public route prefix under which uploads are served (proxied from the bucket
 *  or streamed from disk). Kept under `/api` so the web nginx `/api/` proxy
 *  reaches it too. */
export const UPLOADS_ROUTE = '/api/uploads';

/** Directory containing the static admin UI (served at /admin). */
export const ADMIN_UI_DIR = join(__dirname, '..', 'public', 'admin');

/** First defined (non-empty) value among the given env var names. */
const pick = (...names: string[]): string | undefined => {
  for (const n of names) {
    const v = env[n];
    if (v != null && v !== '') return v;
  }
  return undefined;
};

/** S3-compatible object storage (Railway Bucket, MinIO, R2, AWS, …). Reads the
 *  AWS_* names first (what the bucket provides), then generic S3_* overrides,
 *  then the bare names — so it works whatever the bucket happens to inject. */
export const S3 = {
  endpoint: pick(
    'AWS_ENDPOINT_URL_S3',
    'AWS_ENDPOINT_URL',
    'AWS_S3_ENDPOINT',
    'AWS_ENDPOINT',
    'S3_ENDPOINT',
    'ENDPOINT',
  ),
  region:
    pick(
      'AWS_REGION',
      'AWS_DEFAULT_REGION',
      'S3_REGION',
      'REGION',
    ) ?? 'auto',
  accessKeyId: pick('AWS_ACCESS_KEY_ID', 'S3_ACCESS_KEY_ID', 'ACCESS_KEY_ID'),
  secretAccessKey: pick(
    'AWS_SECRET_ACCESS_KEY',
    'S3_SECRET_ACCESS_KEY',
    'SECRET_ACCESS_KEY',
  ),
  bucket: pick(
    'AWS_S3_BUCKET_NAME',
    'AWS_BUCKET_NAME',
    'AWS_S3_BUCKET',
    'AWS_BUCKET',
    'S3_BUCKET',
    'BUCKET',
  ),
  /** Railway Buckets use virtual-hosted addressing by default. Force path-style
   *  (bucket in the path — e.g. MinIO, older buckets) with *_URL_STYLE=path. */
  forcePathStyle:
    (
      pick('AWS_S3_URL_STYLE', 'S3_URL_STYLE', 'URL_STYLE') ?? 'virtual'
    ).toLowerCase() === 'path',
  /** Optional public base URL. Set only if the bucket serves objects publicly;
   *  otherwise downloads are proxied through the API (Railway buckets are
   *  private, so proxying is the default). */
  publicUrl: pick('AWS_S3_URL', 'S3_PUBLIC_URL'),
} as const;

/** True when enough S3 config is present to use the bucket backend. */
export const S3_ENABLED = Boolean(
  S3.endpoint && S3.accessKeyId && S3.secretAccessKey && S3.bucket,
);

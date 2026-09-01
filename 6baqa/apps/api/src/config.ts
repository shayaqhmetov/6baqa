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

/** S3-compatible object storage (Railway Bucket, MinIO, R2, AWS, …). Reads
 *  Railway Bucket's variables (ENDPOINT / ACCESS_KEY_ID / SECRET_ACCESS_KEY /
 *  BUCKET / REGION), with generic S3_* (and AWS_*) overrides that win. */
export const S3 = {
  endpoint: env.S3_ENDPOINT ?? env.AWS_ENDPOINT_URL ?? env.ENDPOINT,
  region:
    env.S3_REGION ?? env.AWS_DEFAULT_REGION ?? env.REGION ?? 'auto',
  accessKeyId:
    env.S3_ACCESS_KEY_ID ?? env.AWS_ACCESS_KEY_ID ?? env.ACCESS_KEY_ID,
  secretAccessKey:
    env.S3_SECRET_ACCESS_KEY ??
    env.AWS_SECRET_ACCESS_KEY ??
    env.SECRET_ACCESS_KEY,
  bucket: env.S3_BUCKET ?? env.AWS_S3_BUCKET_NAME ?? env.BUCKET,
  /** Railway Buckets use virtual-hosted addressing by default. Force path-style
   *  (bucket in the path — e.g. MinIO, older buckets) with *_URL_STYLE=path. */
  forcePathStyle:
    (env.S3_URL_STYLE ?? env.AWS_S3_URL_STYLE ?? 'virtual').toLowerCase() ===
    'path',
  /** Optional public base URL. Set only if the bucket serves objects publicly;
   *  otherwise downloads are proxied through the API (Railway buckets are
   *  private, so proxying is the default). */
  publicUrl: env.S3_PUBLIC_URL,
} as const;

/** True when enough S3 config is present to use the bucket backend. */
export const S3_ENABLED = Boolean(
  S3.endpoint && S3.accessKeyId && S3.secretAccessKey && S3.bucket,
);

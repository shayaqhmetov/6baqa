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
 *  Railway's injected AWS_* variables, with generic S3_* overrides. */
export const S3 = {
  endpoint: env.S3_ENDPOINT ?? env.AWS_ENDPOINT_URL,
  region: env.S3_REGION ?? env.AWS_DEFAULT_REGION ?? 'auto',
  accessKeyId: env.S3_ACCESS_KEY_ID ?? env.AWS_ACCESS_KEY_ID,
  secretAccessKey: env.S3_SECRET_ACCESS_KEY ?? env.AWS_SECRET_ACCESS_KEY,
  bucket: env.S3_BUCKET ?? env.AWS_S3_BUCKET_NAME,
  /** Path-style addressing (bucket in the path) — the default for Railway/MinIO. */
  forcePathStyle:
    (env.S3_URL_STYLE ?? env.AWS_S3_URL_STYLE ?? 'path').toLowerCase() ===
    'path',
  /** Optional public base URL. Set it only if the bucket serves objects
   *  publicly; otherwise downloads are proxied through the API. */
  publicUrl: env.S3_PUBLIC_URL ?? env.AWS_S3_URL,
} as const;

/** True when enough S3 config is present to use the bucket backend. */
export const S3_ENABLED = Boolean(
  S3.endpoint && S3.accessKeyId && S3.secretAccessKey && S3.bucket,
);

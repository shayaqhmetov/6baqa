import {
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { Injectable, Logger } from '@nestjs/common';
import { createReadStream, existsSync, mkdirSync } from 'node:fs';
import { writeFile } from 'node:fs/promises';
import { basename, extname, join } from 'node:path';
import { Readable } from 'node:stream';
import { S3, S3_ENABLED, UPLOADS_DIR, UPLOADS_ROUTE } from '../config';

export interface StoredObject {
  body: Readable;
  contentType: string;
  contentLength?: number;
}

/** Stores uploaded images in an S3-compatible bucket (Railway Bucket, MinIO,
 *  R2, AWS…) when configured, otherwise on local disk. Downloads are proxied
 *  through the API unless a public bucket URL is set. */
@Injectable()
export class StorageService {
  private readonly log = new Logger('Storage');
  private readonly s3?: S3Client;

  constructor() {
    if (S3_ENABLED) {
      this.s3 = new S3Client({
        endpoint: S3.endpoint,
        region: S3.region,
        forcePathStyle: S3.forcePathStyle,
        credentials: {
          accessKeyId: S3.accessKeyId as string,
          secretAccessKey: S3.secretAccessKey as string,
        },
      });
      this.log.log(`uploads → S3 bucket "${S3.bucket}"`);
    } else {
      if (!existsSync(UPLOADS_DIR)) mkdirSync(UPLOADS_DIR, { recursive: true });
      this.log.log(`uploads → local disk (${UPLOADS_DIR})`);
    }
  }

  get usingS3(): boolean {
    return Boolean(this.s3);
  }

  /** Store bytes under a generated key and return the URL to reference it by. */
  async save(
    originalName: string,
    buffer: Buffer,
    contentType: string,
  ): Promise<{ url: string; key: string }> {
    const key = makeKey(originalName);
    if (this.s3) {
      await this.s3.send(
        new PutObjectCommand({
          Bucket: S3.bucket,
          Key: key,
          Body: buffer,
          ContentType: contentType,
        }),
      );
      const url = S3.publicUrl
        ? `${S3.publicUrl.replace(/\/$/, '')}/${key}`
        : `${UPLOADS_ROUTE}/${key}`;
      return { url, key };
    }
    await writeFile(join(UPLOADS_DIR, key), buffer);
    return { url: `${UPLOADS_ROUTE}/${key}`, key };
  }

  /** Fetch an object for proxying to the client. Returns null if missing. */
  async get(key: string): Promise<StoredObject | null> {
    const safe = basename(key); // strip any path components (no traversal)
    if (this.s3) {
      try {
        const out = await this.s3.send(
          new GetObjectCommand({ Bucket: S3.bucket, Key: safe }),
        );
        return {
          body: out.Body as Readable,
          contentType: out.ContentType ?? guessType(safe),
          contentLength: out.ContentLength,
        };
      } catch {
        return null;
      }
    }
    const path = join(UPLOADS_DIR, safe);
    if (!existsSync(path)) return null;
    return { body: createReadStream(path), contentType: guessType(safe) };
  }
}

const TYPES: Record<string, string> = {
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.avif': 'image/avif',
  '.svg': 'image/svg+xml',
};

function guessType(name: string): string {
  return TYPES[extname(name).toLowerCase()] ?? 'application/octet-stream';
}

/** A filesystem-safe, collision-resistant object key from the original name. */
function makeKey(originalName: string): string {
  const ext = extname(originalName).toLowerCase();
  const base =
    basename(originalName, ext)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 40) || 'image';
  const stamp = Date.now().toString(36) + Math.floor(Math.random() * 1e6).toString(36);
  return `${base}-${stamp}${ext}`;
}

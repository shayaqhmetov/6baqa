import {
  Controller,
  Get,
  NotFoundException,
  Param,
  Res,
  StreamableFile,
} from '@nestjs/common';
import { Response } from 'express';
import { StorageService } from './storage.service';

/** Public, read-only delivery of uploaded images — streams from the bucket
 *  (or disk) so URLs work regardless of bucket public-access settings. */
@Controller('uploads')
export class UploadsController {
  constructor(private readonly storage: StorageService) {}

  @Get(':key')
  async get(
    @Param('key') key: string,
    @Res({ passthrough: true }) res: Response,
  ): Promise<StreamableFile> {
    const obj = await this.storage.get(key);
    if (!obj) throw new NotFoundException('Not found');
    res.set({
      'Content-Type': obj.contentType,
      'Cache-Control': 'public, max-age=31536000, immutable',
    });
    if (obj.contentLength) {
      res.set({ 'Content-Length': String(obj.contentLength) });
    }
    return new StreamableFile(obj.body);
  }
}

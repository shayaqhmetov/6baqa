import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { StorageService } from '../storage/storage.service';
import { AdminService, WorkInput } from './admin.service';

const IMAGE_EXT = /\.(png|jpe?g|webp|gif|avif|svg)$/i;

@Controller('admin')
@UseGuards(JwtAuthGuard)
export class AdminController {
  constructor(
    private readonly admin: AdminService,
    private readonly storage: StorageService,
  ) {}

  @Get('works')
  list() {
    return this.admin.list();
  }

  @Get('works/:id')
  get(@Param('id') id: string) {
    return this.admin.get(id);
  }

  @Post('works')
  create(@Body() body: WorkInput) {
    return this.admin.create(body);
  }

  @Put('works/reorder')
  reorder(@Body() body: { ids: string[] }) {
    return this.admin.reorder(body?.ids ?? []);
  }

  @Put('works/:id')
  update(@Param('id') id: string, @Body() body: WorkInput) {
    return this.admin.update(id, body);
  }

  @Delete('works/:id')
  remove(@Param('id') id: string) {
    return this.admin.remove(id);
  }

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(),
      limits: { fileSize: 12 * 1024 * 1024 },
      fileFilter: (_req, file, cb) => {
        if (!IMAGE_EXT.test(file.originalname)) {
          cb(new BadRequestException('Only image files are allowed'), false);
          return;
        }
        cb(null, true);
      },
    }),
  )
  async upload(
    @UploadedFile() file?: Express.Multer.File,
  ): Promise<{ url: string }> {
    if (!file) throw new BadRequestException('No file uploaded');
    const { url } = await this.storage.save(
      file.originalname,
      file.buffer,
      file.mimetype,
    );
    return { url };
  }
}

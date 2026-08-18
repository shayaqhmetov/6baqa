import { Controller, Get, Param, Query } from '@nestjs/common';
import { WorksService } from './works.service';
import { Work } from './work.interface';
import { parseLang } from './works.i18n';

@Controller('works')
export class WorksController {
  constructor(private readonly worksService: WorksService) {}

  @Get()
  findAll(@Query('lang') lang?: string): Work[] {
    return this.worksService.findAll(parseLang(lang));
  }

  @Get(':slug')
  findOne(@Param('slug') slug: string, @Query('lang') lang?: string): Work {
    return this.worksService.findOne(slug, parseLang(lang));
  }
}

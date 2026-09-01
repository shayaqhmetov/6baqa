import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { AuthoredWork } from '../works/authored.interface';

/** The editable payload the admin panel sends. All content fields, plus order. */
export type WorkInput = AuthoredWork & { order?: number };

@Injectable()
export class AdminService {
  constructor(private readonly prisma: PrismaService) {}

  /** All works with every field, ordered — for the admin list/editor. */
  list() {
    return this.prisma.work.findMany({ orderBy: { order: 'asc' } });
  }

  async get(id: string) {
    const work = await this.prisma.work.findUnique({ where: { id } });
    if (!work) throw new NotFoundException(`No work with id "${id}"`);
    return work;
  }

  async create(input: WorkInput) {
    this.validate(input);
    const existing = await this.prisma.work.findUnique({
      where: { slug: input.slug },
    });
    if (existing) {
      throw new BadRequestException(`Slug "${input.slug}" already exists`);
    }
    // New works go to the end unless an order is given.
    const order =
      input.order ??
      ((await this.prisma.work.aggregate({ _max: { order: true } }))._max
        .order ?? -1) + 1;
    return this.prisma.work.create({ data: this.toData(input, order) });
  }

  async update(id: string, input: WorkInput) {
    this.validate(input);
    await this.get(id);
    const clash = await this.prisma.work.findUnique({
      where: { slug: input.slug },
    });
    if (clash && clash.id !== id) {
      throw new BadRequestException(`Slug "${input.slug}" already exists`);
    }
    const order = input.order ?? 0;
    return this.prisma.work.update({
      where: { id },
      data: this.toData(input, order),
    });
  }

  async remove(id: string) {
    await this.get(id);
    await this.prisma.work.delete({ where: { id } });
    return { ok: true };
  }

  /** Persist a new display order from an ordered list of ids. */
  async reorder(ids: string[]) {
    await this.prisma.$transaction(
      ids.map((id, i) =>
        this.prisma.work.update({ where: { id }, data: { order: i } }),
      ),
    );
    return { ok: true };
  }

  private validate(input: WorkInput): void {
    if (!input?.slug || !/^[a-z0-9-]+$/.test(input.slug)) {
      throw new BadRequestException(
        'slug is required and must be lowercase letters, numbers and dashes',
      );
    }
    if (!input.title) throw new BadRequestException('title is required');
    if (!input.reel) throw new BadRequestException('reel is required');
  }

  /** Map the authored input onto Prisma create/update data, handling the
   *  nullable JSON columns explicitly (Prisma distinguishes JSON null). */
  private toData(input: WorkInput, order: number): Prisma.WorkUncheckedCreateInput {
    const json = (v: unknown): Prisma.InputJsonValue =>
      (v ?? null) as Prisma.InputJsonValue;
    const nullableJson = (v: unknown) =>
      v == null ? Prisma.JsonNull : (v as Prisma.InputJsonValue);

    return {
      slug: input.slug,
      order,
      title: input.title,
      category: input.category ?? '',
      year: input.year ?? '',
      description: input.description ?? '',
      tagline: input.tagline ?? '',
      tags: json(input.tags ?? []),
      facts: json(input.facts ?? []),
      socials: json(input.socials ?? []),
      reel: json(input.reel),
      website: nullableJson(input.website),
      modules: nullableJson(input.modules),
      ru: nullableJson(input.ru),
      poster: input.poster ?? null,
      preview: input.preview ?? null,
    };
  }
}

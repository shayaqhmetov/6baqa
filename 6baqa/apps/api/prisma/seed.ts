import 'reflect-metadata';
import { Prisma, PrismaClient } from '@prisma/client';
import { RU } from '../src/works/works.i18n';
import { CATALOGUE } from '../src/works/works.service';

const prisma = new PrismaClient();

/** Seed / re-sync the initial two works from the in-code catalogue. Idempotent:
 *  upserts by slug, so running it repeatedly is safe. It does NOT touch works
 *  created later through the admin panel. */
async function main() {
  const nullableJson = (v: unknown) =>
    v == null ? Prisma.JsonNull : (v as Prisma.InputJsonValue);
  const json = (v: unknown) => (v ?? null) as Prisma.InputJsonValue;

  for (let i = 0; i < CATALOGUE.length; i++) {
    const w = CATALOGUE[i];
    const ru = RU[w.slug] ?? null;

    const data: Prisma.WorkUncheckedCreateInput = {
      slug: w.slug,
      order: i,
      title: w.title,
      category: w.category,
      year: w.year,
      description: w.description,
      tagline: w.tagline,
      tags: json(w.tags),
      facts: json(w.facts),
      socials: json(w.socials),
      reel: json(w.reel),
      website: nullableJson(w.website),
      modules: nullableJson(w.modules),
      ru: nullableJson(ru),
      poster: null,
      preview: null,
    };

    await prisma.work.upsert({
      where: { slug: w.slug },
      update: data,
      create: data,
    });
    // eslint-disable-next-line no-console
    console.log(`seeded ${w.slug}`);
  }
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (err) => {
    // eslint-disable-next-line no-console
    console.error(err);
    await prisma.$disconnect();
    process.exit(1);
  });

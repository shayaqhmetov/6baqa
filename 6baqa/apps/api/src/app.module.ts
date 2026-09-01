import { Module } from '@nestjs/common';
import { AdminModule } from './admin/admin.module';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { StorageModule } from './storage/storage.module';
import { WorksModule } from './works/works.module';

@Module({
  imports: [PrismaModule, StorageModule, WorksModule, AuthModule, AdminModule],
})
export class AppModule {}

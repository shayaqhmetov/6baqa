import { Module } from '@nestjs/common';
import { WorksModule } from './works/works.module';

@Module({
  imports: [WorksModule],
})
export class AppModule {}

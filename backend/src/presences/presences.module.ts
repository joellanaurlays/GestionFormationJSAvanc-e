import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Presence } from './entities/presence.entity';
import { PresencesService } from './presences.service';
import { PresencesController } from './presences.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Presence])],
  providers: [PresencesService],
  controllers: [PresencesController],
  exports: [PresencesService],
})
export class PresencesModule {}
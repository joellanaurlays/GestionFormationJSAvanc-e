import { Module } from '@nestjs/common';
import { ResultatsController } from './resultats.controller';
import { ResultatsService } from './resultats.service';

@Module({
  controllers: [ResultatsController],
  providers: [ResultatsService]
})
export class ResultatsModule {}

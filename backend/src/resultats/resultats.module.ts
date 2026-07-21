import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Resultat } from './entities/resultat.entity';
import { ResultatsService } from './resultats.service';
import { ResultatsController } from './resultats.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Resultat])],
  providers: [ResultatsService],
  controllers: [ResultatsController],
  exports: [ResultatsService],
})
export class ResultatsModule {}
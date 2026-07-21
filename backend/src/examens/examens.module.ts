import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Examen } from './entities/examen.entity';
import { ExamensService } from './examens.service';
import { ExamensController } from './examens.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Examen])],
  providers: [ExamensService],
  controllers: [ExamensController],
  exports: [ExamensService],
})
export class ExamensModule {}
import { Module } from '@nestjs/common';
import { ExamensController } from './examens.controller';
import { ExamensService } from './examens.service';

@Module({
  controllers: [ExamensController],
  providers: [ExamensService]
})
export class ExamensModule {}

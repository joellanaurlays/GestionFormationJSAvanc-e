import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Formation } from './entities/formation.entity';
import { FormationsService } from './formations.service';
import { FormationsController } from './formations.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Formation])],
  providers: [FormationsService],
  controllers: [FormationsController],
  exports: [FormationsService],
})
export class FormationsModule {}

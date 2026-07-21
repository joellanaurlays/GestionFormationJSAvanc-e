import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Inscription } from './entities/inscription.entity';
import { InscriptionsService } from './inscriptions.service';
import { InscriptionsController } from './inscriptions.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Inscription])],
  providers: [InscriptionsService],
  controllers: [InscriptionsController],
  exports: [InscriptionsService],
})
export class InscriptionsModule {}